#!/usr/bin/env python3
"""ETL dos novos doces (SweetsCover).

Fonte: capturas em src/assets/sweets/_source/*.png (matte escuro opaco).
Saída: transparentes sem fundo em src/assets/sweets/<slug>.png, preservando
cores e silhueta (sem recolorir; só alpha). Determinístico (mesma entrada,
mesma saída).

Uso: python3 scripts/etl-sweets.py  (roda a partir da raiz do projeto)
"""
import os
import struct
import zlib
from statistics import median

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC_DIR = os.path.join(ROOT, "src", "assets", "sweets", "_source")
OUT_DIR = os.path.join(ROOT, "src", "assets", "sweets")
SOURCES = [
    ("image.png", "doce-1"),
    ("image copy.png", "doce-2"),
    ("Captura de Tela 2026-09-20 às 18.21.16.png", "doce-3"),
    ("Captura de Tela 2026-09-20 às 18.25.52.png", "doce-4"),
]
TOL = 48  # tolerância de cor vs fundo (por canal somada)
FEATHER = 96  # alpha da borda interna (camada única de antialias)


def read_png(path: str):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    pos = 8
    idat = b""
    w = h = color_type = None
    while pos < len(data):
        ln, typ = struct.unpack(">I4s", data[pos : pos + 8])
        chunk = data[pos + 8 : pos + 8 + ln]
        if typ == b"IHDR":
            w, h, _bd, color_type, *_ = struct.unpack(">IIBBBBB", chunk)
        elif typ == b"IDAT":
            idat += chunk
        elif typ == b"IEND":
            break
        pos += 12 + ln
    raw = zlib.decompress(idat)
    bpp = 4 if color_type == 6 else 3
    stride = w * bpp
    out = bytearray(w * h * bpp)
    prev = bytearray(stride)
    i = 0
    for y in range(h):
        f = raw[i]
        i += 1
        line = bytearray(raw[i : i + stride])
        i += stride
        if f == 1:
            for x in range(bpp, stride):
                line[x] = (line[x] + line[x - bpp]) & 255
        elif f == 2:
            for x in range(stride):
                line[x] = (line[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                a = line[x - bpp] if x >= bpp else 0
                line[x] = (line[x] + ((a + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = line[x - bpp] if x >= bpp else 0
                b = prev[x]
                c = prev[x - bpp] if x >= bpp else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out[y * stride : (y + 1) * stride] = line
        prev = line
    return w, h, bytes(out)


def write_png(path: str, w: int, h: int, px: bytes):
    def chunk(tag: bytes, payload: bytes):
        return (
            struct.pack(">I", len(payload))
            + tag
            + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
        )

    raw = bytearray()
    stride = w * 4
    for y in range(h):
        raw.append(0)
        raw += px[y * stride : (y + 1) * stride]
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    out = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(out)


def bg_color(px: bytes, w: int, h: int):
    stride = w * 4
    sample = []
    for x in range(0, w, 6):
        for y in (2, h - 3):
            o = y * stride + x * 4
            sample.append(px[o : o + 3])
    for y in range(0, h, 6):
        for x in (2, w - 3):
            o = y * stride + x * 4
            sample.append(px[o : o + 3])
    return [int(median(s[c] for s in sample)) for c in range(3)]


def near(a, b, tol):
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2]) <= tol


def main():
    os.makedirs(SRC_DIR, exist_ok=True)
    for src, slug in SOURCES:
        src_path = os.path.join(SRC_DIR, src)
        if not os.path.exists(src_path):
            print(f"!! fonte ausente: {src}")
            continue
        w, h, px = read_png(src_path)
        stride = w * 4
        bg = bg_color(px, w, h)
        is_bg = bytearray(w * h)
        q = []
        for x in range(w):
            for y in (0, h - 1):
                o = y * stride + x * 4
                if near(px[o : o + 3], bg, TOL):
                    idx = y * w + x
                    is_bg[idx] = 1
                    q.append(idx)
        for x in (0, w - 1):
            for y in range(1, h - 1):
                o = y * stride + x * 4
                if near(px[o : o + 3], bg, TOL):
                    idx = y * w + x
                    is_bg[idx] = 1
                    q.append(idx)
        while q:
            i = q.pop()
            x, y = i % w, i // w
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    ni = ny * w + nx
                    if not is_bg[ni]:
                        o = ny * stride + nx * 4
                        if near(px[o : o + 3], bg, TOL):
                            is_bg[ni] = 1
                            q.append(ni)
        # pra cada pixel opaco com vizinho de fundo → alpha parcial (sem polir cores)
        alpha = bytearray([0 if b else 255 for b in is_bg])
        for i in range(w * h):
            if not is_bg[i]:
                x, y = i % w, i // w
                touches = False
                for nx in (x - 1, x, x + 1):
                    for ny in (y - 1, y, y + 1):
                        if 0 <= nx < w and 0 <= ny < h and is_bg[ny * w + nx]:
                            touches = True
                            break
                    if touches:
                        break
                if touches:
                    alpha[i] = FEATHER
        # trim ao conteúdo
        xs = [x for x in range(w) for y in range(h) if not is_bg[y * w + x]]
        if not xs:
            print(f"!! {src}: sem conteúdo após remoção de fundo")
            continue
        min_x, max_x = min(xs), max(xs)
        ys = [y for y in range(h) for x in range(w) if not is_bg[y * w + x]]
        min_y, max_y = min(ys), max(ys)
        tw, th = max_x - min_x + 1, max_y - min_y + 1
        out = bytearray(tw * th * 4)
        for yy in range(th):
            sy = min_y + yy
            for xx in range(tw):
                sx = min_x + xx
                o = sy * stride + sx * 4
                do = (yy * tw + xx) * 4
                out[do : do + 3] = px[o : o + 3]
                out[do + 3] = alpha[sy * w + sx]
        out_path = os.path.join(OUT_DIR, f"{slug}.png")
        write_png(out_path, tw, th, bytes(out))
        opaque = sum(1 for a in alpha if a >= 255)
        print(f"✓ {src} → {slug}.png ({tw}x{th}) · bg=#{bg[0]:02X}{bg[1]:02X}{bg[2]:02X} · opacos={opaque}")


if __name__ == "__main__":
    main()