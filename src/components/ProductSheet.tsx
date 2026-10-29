import { Minus, Plus, ShoppingBag, MessageCircle, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  buildWhatsappLink,
  computeVariationDelta,
  formatPrice,
  type Product,
} from "@/lib/menu-data";
import { useCart } from "@/lib/cart-context";
import { BottomSheet, SheetClose } from "@/components/ui/bottom-sheet";
import { CrossSell } from "@/components/CrossSell";
import { categories } from "@/lib/catalog";
import { suggestProducts } from "@/lib/cross-sell";

type Props = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductSheet({ product, open, onOpenChange }: Props) {
  const { addLine, lines } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<ReadonlySet<string>>(new Set());

  const suggestions = useMemo(
    () =>
      product
        ? suggestProducts(categories, new Set([product.id, ...lines.map((l) => l.productId)]))
        : [],
    [product, lines],
  );

  useEffect(() => {
    if (product?.variations) {
      const initial: Record<string, string> = {};
      product.variations.forEach((v) => {
        initial[v.label] = v.options[0].label;
      });
      setSelections(initial);
    } else {
      setSelections({});
    }
    setQuantity(1);
    setExtras(new Set());
  }, [product]);

  if (!product) return null;

  const priceDelta = computeVariationDelta(product, selections);
  const finalPrice = product.price + priceDelta;
  const pickedExtras = suggestions.filter((s) => extras.has(s.id));
  const extrasTotal = pickedExtras.reduce((sum, s) => sum + s.price, 0);

  const toggleExtra = (extra: Product) =>
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(extra.id)) next.delete(extra.id);
      else next.add(extra.id);
      return next;
    });

  const handleAddToCart = () => {
    addLine({ product, selections, quantity });
    pickedExtras.forEach((extra) => addLine({ product: extra, selections: {}, quantity: 1 }));
    toast.success(
      pickedExtras.length > 0
        ? `${product.name} + ${pickedExtras.length} ${pickedExtras.length === 1 ? "item" : "itens"} no carrinho`
        : `${product.name} adicionado ao carrinho`,
    );
    onOpenChange(false);
  };

  const consultMessage = `Olá! Vi o cardápio e gostaria de pedir: ${product.name}`;

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
      description={product.description}
      footer={
        product.priceLabel ? (
          <>
            <a
              href={buildWhatsappLink(consultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[56px] rounded-full bg-plum-900 text-cream-50 font-semibold text-base flex items-center justify-center gap-2.5 active:bg-plum-950 transition-colors shadow-warm"
            >
              <MessageCircle className="h-5 w-5" />
              Pedir pelo WhatsApp
            </a>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full mt-2 text-ink-soft text-sm py-2 min-h-[44px]"
            >
              Voltar ao cardápio
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 mb-3">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-11 rounded-full bg-cream-100 border border-cream-200 grid place-items-center text-ink"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-display text-[20px] text-ink w-8 text-center">{quantity}</span>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-11 w-11 rounded-full bg-cream-100 border border-cream-200 grid place-items-center text-ink"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full min-h-[56px] rounded-full bg-plum-900 text-cream-50 font-semibold text-base flex items-center justify-center gap-2.5 active:bg-plum-950 transition-colors shadow-warm"
            >
              <ShoppingBag className="h-5 w-5" />
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full mt-2 text-ink-soft text-sm py-2 min-h-[44px]"
            >
              Voltar ao cardápio
            </button>
          </>
        )
      }
    >
      <div className="relative bg-plum-900 p-4 pt-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[4/5] max-h-[42dvh] object-cover rounded-[20px]"
          loading="eager"
        />
        <SheetClose
          aria-label="Fechar"
          className="absolute right-6 top-4 h-11 w-11 rounded-full bg-plum-950/70 text-cream-50 grid place-items-center backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </SheetClose>
      </div>

      <div className="px-5 pt-5 pb-6">
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full gradient-brand text-plum-950"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <h2 className="text-[clamp(24px,6vw,30px)] text-ink">{product.name}</h2>
        <p className="mt-2 text-ink-soft text-[15px] leading-relaxed">{product.description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-[clamp(22px,5.5vw,28px)] text-ink">
            {product.priceLabel ?? formatPrice(finalPrice)}
          </span>
          {!product.priceLabel && product.id.startsWith("brigadeiro") && (
            <span className="text-ink-soft text-sm">/ unidade</span>
          )}
        </div>

        {product.minOrderNote && (
          <p className="mt-2 text-sm text-plum-700 font-medium">{product.minOrderNote}</p>
        )}

        <div className="mt-4 rounded-[20px] bg-cream-100 border border-cream-200 px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-ink-soft">Seu pedido</p>
            <p className="mt-0.5 text-ink text-sm truncate">
              {quantity} × {product.name}
            </p>
            {pickedExtras.length > 0 && (
              <p className="text-ink-soft text-[12px] truncate">
                + {pickedExtras.map((x) => x.name).join(", ")}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-[18px] leading-none text-ink">
              {formatPrice(finalPrice * quantity + extrasTotal)}
            </p>
            <p className="mt-1 text-ink-soft text-[12px]">{formatPrice(finalPrice)} / un</p>
          </div>
        </div>

        {product.variations?.map((v) => (
          <div key={v.label} className="mt-6">
            <p className="eyebrow text-ink-soft mb-3">{v.label}</p>
            <div className="flex flex-wrap gap-2">
              {v.options.map((o) => {
                const active = selections[v.label] === o.label;
                return (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, [v.label]: o.label }))}
                    className={`min-h-[48px] px-4 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? "bg-plum-900 text-cream-50"
                        : "bg-cream-100 text-ink border border-cream-200 hover:border-plum-500"
                    }`}
                  >
                    {o.label}
                    {o.priceDelta ? ` +${formatPrice(o.priceDelta)}` : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {!product.priceLabel && (
          <CrossSell
            title="Combina com"
            products={suggestions}
            selected={extras}
            onPick={toggleExtra}
          />
        )}
      </div>
    </BottomSheet>
  );
}
