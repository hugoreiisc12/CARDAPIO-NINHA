import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  ChevronRight,
  Instagram,
  MapPin,
  Clock,
  Cake,
  CakeSlice,
  IceCreamBowl,
  UtensilsCrossed,
  CupSoda,
  ShoppingBag,
  User,
  Ticket,
  LogIn,
} from "lucide-react";
import { categories as staticCategories, featuredProducts as staticFeatured } from "@/lib/catalog";
import { useMenu } from "@/hooks/use-menu";
import { buildWhatsappLink, formatPrice, STORE_ADDRESS, type Product } from "@/lib/menu-data";
import { ProductSheet } from "@/components/ProductSheet";
import { CartSheet } from "@/components/CartSheet";
import { ProfileSheet } from "@/components/ProfileSheet";
import { useCart } from "@/lib/cart-context";
import { BrandLogo } from "@/components/BrandLogo";
import mascotUrl from "@/assets/mascot/mascot-ninha-alpha.png";
import crunchyCakeUrl from "@/assets/products/crunchy-cake.jpg";
import { useReveal } from "@/hooks/use-reveal";
import { useGsapScroll } from "@/hooks/use-gsap-scroll";
import { useHandwriting } from "@/hooks/use-handwriting";
import Dock, { type DockItem } from "@/components/ui/dock";
import { riveLazy } from "@/components/Rive/riveLazy";
import type { RiveOrcamentoBannerProps } from "@/components/Rive/RiveOrcamentoBanner";
import type { RiveShowcaseProps } from "@/components/Rive/RiveShowcase";
const LazyRiveOrcamentoBanner = riveLazy<RiveOrcamentoBannerProps>(
  () =>
    import("@/components/Rive/RiveOrcamentoBanner").then((m) => ({
      default: m.RiveOrcamentoBanner,
    })),
  null,
);
const LazyRiveShowcase = riveLazy<RiveShowcaseProps>(
  () =>
    import("@/components/Rive/RiveShowcase").then((m) => ({
      default: m.RiveShowcase,
    })),
  null,
);

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  sobremesas: <Cake className="h-full w-full" />,
  "mini-bolo-vulcao": <CakeSlice className="h-full w-full" />,
  "geladinho-gourmet": <IceCreamBowl className="h-full w-full" />,
  salgados: <UtensilsCrossed className="h-full w-full" />,
  bebidas: <CupSoda className="h-full w-full" />,
};

export const Route = createFileRoute("/")({
  component: Menu,
});

const quoteImage =
  "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80";

function Menu() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { itemCount } = useCart();
  // Cardápio via API com fallback estático (B11); o estático garante primeira dobra imediata.
  const { categories } = useMenu();
  const featuredProducts =
    categories === staticCategories
      ? staticFeatured
      : categories.flatMap((c) => c.products).filter((p) => p.featured);
  const [activeCat, setActiveCat] = useState<string>(categories[0].id);
  const dockItems: DockItem[] = useMemo(
    () =>
      categories.map((c) => ({
        id: c.id,
        label: c.label,
        icon: CATEGORY_ICONS[c.id] ?? <Cake className="h-full w-full" />,
      })),
    [categories],
  );

  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  useEffect(() => {
    setIsOpen(isBusinessOpen());
    const id = setInterval(() => setIsOpen(isBusinessOpen()), 60_000);
    return () => clearInterval(id);
  }, []);
  useReveal();
  useGsapScroll();
  useHandwriting();

  const openProduct = (p: Product) => {
    if (p.soldOut) return;
    setSelected(p);
    setSheetOpen(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveCat(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  const scrollToCat = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Altura real do header: cresce com a safe-area (notch/Dynamic Island) e muda na rotação.
    const offset = (document.querySelector("header")?.offsetHeight ?? 64) + 24;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-cream-100 text-ink relative">
      {/* Header — gruda no topo (sem margem negativa) */}
      <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] bg-plum-900/95 backdrop-blur-md text-cream-50 border-b border-plum-700/50">
        <div className="mx-auto max-w-3xl px-5 py-3 flex items-center justify-between gap-3">
          <BrandLogo />
          <div className="flex items-center gap-2">
            {/* Carrinho e cupom aparecem somente no desktop (md+) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Abrir carrinho"
                className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-plum-700/50 bg-plum-950/60 text-cream-50 transition-colors hover:bg-plum-700/70"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-brand text-plum-950 text-[11px] font-bold grid place-items-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                aria-label="Ver cupons"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-plum-700/50 bg-plum-950/60 text-cream-50 transition-colors hover:bg-plum-700/70"
              >
                <Ticket className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              aria-label="Meu cadastro"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-plum-700/50 bg-plum-950/60 text-cream-50 transition-colors hover:bg-plum-700/70"
            >
              <User className="h-5 w-5" />
            </button>
            <StatusBadge open={isOpen ?? true} mounted={isOpen !== null} />
          </div>
        </div>
      </header>

      {/* Hero — layered with 3D particles backdrop + floating image + clear primary CTA */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden bg-plum-900 text-cream-50"
      >
        <SwashDecor />

        {/* radial brand glows (fluid, no fixed overflow outside the section) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-18vw] h-[85vw] w-[85vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--rose)_22%,transparent),transparent)] blur-3xl md:h-[640px] md:w-[640px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-8vw] right-[-18vw] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--amber)_15%,transparent),transparent)] blur-2xl md:h-[480px] md:w-[480px]"
        />

        {/* huge outlined word behind (fluid clamp, no sm jump) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-16 flex justify-center select-none"
        >
          <span className="doce-word font-display italic text-outline-cream text-[clamp(96px,26vw,220px)] leading-none opacity-25 tracking-tight block relative">
            <span className="doce-char">d</span>
            <span className="doce-char">o</span>
            <span className="doce-char">c</span>
            <span className="doce-char">e</span>
            <span className="doce-char">s</span>
            <span className="doce-pen" aria-hidden="true" />
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-5 pt-8 pb-14 md:px-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-x-12 lg:pt-14">
          <div className="reveal text-center sm:text-left">
            <h1
              id="hero-title"
              className="hero-text-slide mt-3 font-display italic text-[clamp(42px,12vw,64px)] leading-[0.92] text-cream-50"
              style={{ animationDelay: "40ms" }}
            >
              Doces que <br />
              <span className="text-gradient-brand">abraçam</span>
            </h1>
            <p
              className="hero-text-slide mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-cream-50/85 sm:mx-0"
              style={{ animationDelay: "140ms" }}
            >
              Bolos, tortas e docinhos preparados com carinho pela Ninha, para transformar momentos
              comuns em memórias inesquecíveis.
            </p>

            {/* Primary & Secondary Call to Action */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <button
                onClick={() => scrollToCat(categories[0].id)}
                className="group relative inline-flex cursor-pointer items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-[15px] font-bold text-plum-950 shadow-warm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <span>Ver Cardápio Completo</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href={buildWhatsappLink("Olá! Gostaria de consultar sobre encomendas de doces.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream-50/20 bg-plum-950/60 px-5 py-3.5 text-[14px] font-semibold text-cream-50 backdrop-blur-sm transition-all hover:bg-plum-950/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <MessageCircle className="h-4 w-4 text-rose" />
                <span>Contato / Encomendas</span>
              </a>
            </div>
          </div>

          {/* Floating maskot */}
          <div className="reveal relative mt-10 lg:mt-0" data-delay="120ms">
            <div className="relative mx-auto aspect-square w-[78%] max-w-[300px] sm:max-w-[340px] lg:w-full lg:max-w-[420px]">
              <img
                src={mascotUrl}
                alt="Mascote Ninha Cakes"
                width={600}
                height={773}
                fetchPriority="high"
                decoding="async"
                className="soft-float h-full w-full scale-105 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              />
            </div>
            {/* Logo Ninha Cakes sob o mascote */}
            <div className="mt-4 flex justify-center">
              <BrandLogo size="lg" center />
            </div>
          </div>

          {/* trust strip */}
          <div
            className="reveal mt-12 grid grid-cols-3 gap-2 text-center sm:gap-3 lg:col-span-2"
            data-delay="200ms"
          >
            {[
              { k: "Ingredientes", v: "Selecionados" },
              { k: "Entrega", v: "Toda Teresópolis -RJ" },
              { k: "Encomendas", v: "Personalizadas" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-plum-700/60 bg-plum-950/50 px-1.5 py-3 backdrop-blur-sm transition-colors hover:border-plum-500 sm:px-3 sm:py-3.5"
              >
                <p className="text-[clamp(8px,2.6vw,10px)] font-medium uppercase tracking-[0.18em] text-cream-50/60">
                  {s.k}
                </p>
                <p className="mt-1 font-display text-[14px] font-semibold text-cream-50 sm:text-[15px] md:text-[16px]">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* wave divider */}
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block h-14 w-full text-cream-100 md:h-16"
        >
          <path
            fill="currentColor"
            d="M0,32 C240,60 480,60 720,40 C960,20 1200,20 1440,40 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* Marquee ribbon */}
      <div className="bg-cream-100 border-y border-cream-200 overflow-hidden">
        <div className="flex w-max marquee-track py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 pr-8">
              {featuredProducts.map((p) => (
                <span
                  key={p.id + i}
                  className="flex items-center gap-3 font-display italic text-[18px] text-plum-900/80"
                >
                  {p.name}
                  <span className="h-1.5 w-1.5 rounded-full gradient-brand" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Category dock rendered at bottom (see <Dock /> below) */}

      {/* Featured — magazine style */}
      <section className="mx-auto max-w-3xl px-5 pt-8 reveal">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-gradient-brand">Os queridinhos da ninha</p>
            <h2 className="mt-2 font-display italic text-[clamp(24px,6.5vw,30px)] text-ink">
              Favoritos da casa
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-ink-soft">
            arraste <ChevronRight className="h-3 w-3" />
          </span>
        </div>
        <div className="mt-4 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 pb-3 w-max">
            {featuredProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => openProduct(p)}
                className="w-[70vw] max-w-[290px] shrink-0 text-left bg-cream-50 rounded-[24px] overflow-hidden shadow-warm card-hover active:scale-[0.99]"
              >
                <div className="relative aspect-[4/5] bg-cream-200 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full gradient-brand text-plum-950">
                    ★ Top {i + 1}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 text-cream-50">
                    <h3 className="font-display text-[20px] leading-tight drop-shadow">{p.name}</h3>
                    <p className="mt-1 font-display text-[16px] text-cream-50/90">
                      {p.priceLabel ?? formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rive showcase — vitrine de destaque com overlay animado */}
      <LazyRiveShowcase
        className="pt-8"
        image={crunchyCakeUrl}
        eyebrow="Doce do mês"
        title="Crunchy Cake, o queridinho da Ninha"
        description="Massa de chocolate molhadinha, brigadeiro gourmet e uma camada crocante de Pailleté Feuilletine. Peça e surpreenda-se."
        cta="Fazer pedido"
        href={buildWhatsappLink("Olá! Quero pedir o Crunchy Cake (doce do mês).")}
      />

      {/* Categories */}
      <main className="mx-auto max-w-3xl px-5 pb-32">
        {categories.map((cat, idx) => (
          <section
            key={cat.id}
            id={cat.id}
            className="pt-14 scroll-mt-[calc(8rem+env(safe-area-inset-top))]"
          >
            {/* Header with big outlined display word */}
            <div className="relative reveal gsap-cat-title">
              <span
                aria-hidden
                className="absolute -top-6 -left-1 font-display italic text-outline-plum text-[64px] sm:text-[84px] leading-none pointer-events-none select-none"
              >
                0{idx + 1}
              </span>
              <div className="relative pl-14">
                <p className="eyebrow text-gradient-brand">{cat.eyebrow}</p>
                <h2 className="mt-2 font-display text-[clamp(26px,7vw,34px)] text-ink italic">
                  {cat.label}
                </h2>
                <div className="mt-3 h-[2px] w-16 gradient-brand rounded-full" />
              </div>
            </div>

            {cat.products.length > 0 ? (
              <div className="gsap-card-group mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.products.map((p) => (
                  <div key={p.id} className="gsap-card">
                    <ProductCard product={p} onOpen={() => openProduct(p)} />
                  </div>
                ))}
              </div>
            ) : (
              <ComingSoon label={cat.label} />
            )}
          </section>
        ))}

        {/* Promo band — "Solicite seu Orçamento"; independente do número de categorias */}
        <LazyRiveOrcamentoBanner
          photo={quoteImage}
          href={buildWhatsappLink("Olá! Gostaria de um orçamento personalizado.")}
        />
      </main>

      {/* Footer */}
      <footer className="bg-plum-950 text-cream-50/80 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -bottom-16 -right-10 font-display italic text-cream-50/[0.04] text-[180px] leading-none select-none pointer-events-none"
        >
          Ninha
        </div>
        <div className="mx-auto max-w-3xl px-5 py-12 relative">
          <BrandLogo size="md" />
          <div className="mt-8 grid gap-5 sm:grid-cols-3 text-sm">
            <div className="flex gap-3">
              <MapPin className="h-4 w-4 text-amber shrink-0 mt-0.5" />
              <div>
                <p className="eyebrow text-amber">Endereço</p>
                <p className="mt-1.5">{STORE_ADDRESS}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-4 w-4 text-amber shrink-0 mt-0.5" />
              <div>
                <p className="eyebrow text-amber">Horário</p>
                <p className="mt-1.5">Ter a Dom · 10h às 20h</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Instagram className="h-4 w-4 text-amber shrink-0 mt-0.5" />
              <div>
                <p className="eyebrow text-amber">Instagram</p>
                <a
                  href="https://www.instagram.com/ninha__cakes"
                  className="mt-1.5 inline-block underline underline-offset-4"
                >
                  @ninha__cakes
                </a>
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-cream-50/50">
            © {new Date().getFullYear()} Ninha Cakes. Feito com carinho.
          </p>
        </div>
      </footer>

      {/* Floating cart */}
      {!sheetOpen && !cartOpen && itemCount > 0 && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Ver carrinho"
          className="fixed z-40 right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(9.5rem+env(safe-area-inset-bottom))] h-14 w-14 rounded-full bg-plum-900 text-cream-50 grid place-items-center shadow-warm"
          style={{ boxShadow: "0 8px 24px rgba(46,15,31,0.35)" }}
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-brand text-plum-950 text-[11px] font-bold grid place-items-center">
            {itemCount}
          </span>
        </button>
      )}

      {/* Floating WhatsApp */}
      {!sheetOpen && !cartOpen && (
        <a
          href={buildWhatsappLink("Olá! Vim pelo cardápio e gostaria de fazer um pedido.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed z-40 right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(5.5rem+env(safe-area-inset-bottom))] h-14 w-14 rounded-full bg-plum-900 text-cream-50 grid place-items-center shadow-warm"
          style={{ boxShadow: "0 8px 24px rgba(46,15,31,0.35)" }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full gradient-brand opacity-70"
            style={{ animation: "pulse-ring 1.8s cubic-bezier(.2,.7,.2,1) infinite" }}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full p-[2px] gradient-brand"
            style={{
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <MessageCircle className="h-6 w-6 relative" />
        </a>
      )}

      {!sheetOpen && !cartOpen && (
        <Dock items={dockItems} activeId={activeCat} onSelect={scrollToCat} />
      )}

      <ProductSheet product={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      disabled={product.soldOut}
      className={`group text-left bg-cream-50 rounded-[24px] overflow-hidden shadow-warm card-hover w-full ${
        product.soldOut ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-[4/5] bg-cream-200 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/45 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        {product.tags && product.tags[0] && (
          <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cream-50/95 text-ink backdrop-blur">
            {product.tags[0]}
          </span>
        )}
        {product.soldOut && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-plum-950 text-cream-50">
            Esgotado
          </span>
        )}
        <span className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-cream-50 text-plum-900 grid place-items-center shadow-warm translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-[18px] text-ink leading-tight">{product.name}</h3>
        <p className="mt-1 text-ink-soft text-[13px] line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="font-display text-[18px] text-ink">
            {product.priceLabel ?? formatPrice(product.price)}
          </span>
          {product.minOrderNote && <span className="text-[11px] text-ink-soft">mín. 25 un.</span>}
        </div>
      </div>
    </button>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="reveal mt-6 rounded-[24px] border border-dashed border-cream-200 bg-cream-50 px-6 py-8 text-center">
      <span className="inline-block rounded-full gradient-brand px-3 py-1 text-[11px] font-semibold text-plum-950">
        Em breve
      </span>
      <p className="mt-3 font-display italic text-[20px] text-ink">{label} saindo do forno</p>
      <p className="mt-1 text-sm text-ink-soft">
        Estamos preparando essa seção. Quer encomendar? Chama a Ninha no WhatsApp.
      </p>
    </div>
  );
}

function StatusBadge({ open, mounted = true }: { open: boolean; mounted?: boolean }) {
  return (
    <div
      className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity ${
        mounted ? "opacity-100" : "opacity-0"
      } ${open ? "bg-plum-700 text-cream-50" : "bg-plum-950 text-cream-50/80"}`}
      suppressHydrationWarning
    >
      <span
        className={`h-2 w-2 rounded-full ${open ? "bg-[color:var(--success)]" : "bg-[color:var(--error)]"}`}
        style={{
          boxShadow: open ? "0 0 0 3px rgba(47,125,91,0.25)" : "none",
        }}
      />
      {open ? "Aberto agora" : "Fechado · abre às 14h"}
    </div>
  );
}

function SwashDecor() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 200"
      className="absolute -right-10 -top-6 w-[280px] opacity-30 pointer-events-none"
      fill="none"
    >
      <path
        d="M20 160 C 90 40, 220 40, 300 120 S 380 180, 390 100"
        stroke="url(#g)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E58AA0" />
          <stop offset="0.5" stopColor="#E2795B" />
          <stop offset="1" stopColor="#E9A25C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function isBusinessOpen() {
  const d = new Date();
  const h = d.getHours();
  return h >= 14;
}
