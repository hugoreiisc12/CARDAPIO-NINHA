import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapCheckpoint {
  label: string;
  status: string;
  created_at: string;
}

type Props = {
  checkpoints: MapCheckpoint[];
};

/** Mapa do rastreio: OpenStreetMap + linha do tempo das etapas. Sem GPS real (D7). */
export function TrackMap({ checkpoints }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Centro de Teresópolis; sem coordenada por etapa na v1, o mapa ancora a loja.
    const map = L.map(ref.current, { scrollWheelZoom: false }).setView([-22.4125, -42.9658], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    // circleMarker em vez de marker: o ícone padrão do Leaflet quebra no bundle (404 no PNG).
    L.circleMarker([-22.4125, -42.9658], { radius: 9 })
      .addTo(map)
      .bindPopup("Ninha Cakes")
      .openPopup();
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-[20px] border border-cream-200">
      <div ref={ref} className="h-56 w-full" />
      <ol className="flex flex-col gap-3 bg-cream-50 px-5 py-4">
        {checkpoints.map((c) => (
          <li
            key={`${c.status}-${c.created_at}`}
            className="flex items-baseline justify-between gap-3"
          >
            <span className="text-sm font-semibold text-ink">{c.label}</span>
            <span className="shrink-0 text-[12px] text-ink-soft">
              {new Date(c.created_at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
        {checkpoints.length === 0 && (
          <li className="text-sm text-ink-soft">Etapas aparecem aqui conforme o pedido avança.</li>
        )}
      </ol>
    </div>
  );
}
