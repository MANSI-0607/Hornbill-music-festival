import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
  X,
  Trash2,
  Phone,
  Plus,
  Minus,
  Check,
  Ruler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type DesignOption = { name: string; code: string };
export type ColourOption = { name: string; hex: string };

export type VariantImage = {
  design: string;
  colour: string;
  imageUrl: string;
  images?: string[];
};

export type CategoryShowcase = {
  category: "T-Shirts" | "Winterwear" | "Accessories" | "General";
  title?: string;
  description?: string;
  images: string[];
};

export type MerchItem = {
  _id: string;
  name: string;
  productCode?: string;
  category?: "T-Shirts" | "Winterwear" | "Accessories" | "General";
  description?: string;
  fabric?: string;
  weight?: string;
  fit?: string;
  price: number;
  hasPackOption?: boolean;
  packPrice?: number;
  packLabel?: string;
  imageUrl?: string;
  images?: string[];
  designs?: DesignOption[];
  colours?: ColourOption[];
  sizes?: string[];
  sizeChartUrl?: string;
  variantImages?: VariantImage[];
  stock: number;
  isActive: boolean;
};

type CartOptions = {
  design?: string;
  colour?: string;
  size?: string;
  packOption?: string;
  unitPrice: number;
  sku: string;
  image?: string;
};

type CartEntry = {
  item: MerchItem;
  selectedDesign?: string;
  selectedColour?: string;
  selectedSize?: string;
  selectedPackOption?: string;
  unitPrice: number;
  sku: string;
  qty: number;
  image?: string;
};

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
const AHIBI_BASE_URL = import.meta.env.VITE_AHIBI_CLIENT_BASE_URL || "";
const CATEGORIES = ["All", "T-Shirts", "Winterwear", "Accessories"];

/*
  Palette
  page   #13201a  deep forest
  panel  #1b2c23  raised surfaces (drawer, modal, image wells)
  ink    #ebe6d9  text
  accent festival-orange (only for the one primary action + current selection)
*/
const line = "border-[#ebe6d9]/15";
const muted = "text-[#ebe6d9]/60";

export default function Merch() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [categoryShowcases, setCategoryShowcases] = useState<CategoryShowcase[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSizeChart, setActiveSizeChart] = useState<{ itemName: string; chartUrl: string } | null>(null);

  const [cart, setCart] = useState<CartEntry[]>(() => {
    try {
      const saved = localStorage.getItem("hmf_merch_cart_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("hmf_merch_cart_v2", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const fetchMerch = async () => {
    try {
      setLoading(true);
      setError(null);
      const [merchRes, showcaseRes] = await Promise.all([
        fetch(`${API_BASE_URL}/merch`),
        fetch(`${API_BASE_URL}/merch/categories/showcase`).catch(() => null),
      ]);
      if (!merchRes.ok) throw new Error("Failed to fetch merchandise");
      const data = await merchRes.json();
      setMerchItems(data.filter((item: MerchItem) => item.isActive));
      if (showcaseRes && showcaseRes.ok) {
        const showcases = await showcaseRes.json();
        if (Array.isArray(showcases)) setCategoryShowcases(showcases);
      }
    } catch (e) {
      console.error("Failed to load merchandise:", e);
      setError("We couldn't load the merchandise. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const addToCart = (product: MerchItem, options: CartOptions) => {
    if (product.stock === 0) return;

    setCart((prev) => {
      const entryKey = `${product._id}-${options.sku}`;
      const found = prev.find((c) => `${c.item._id}-${c.sku}` === entryKey);
      if (found) {
        const maxStock = product.stock > 0 ? product.stock : 99;
        return prev.map((c) =>
          `${c.item._id}-${c.sku}` === entryKey ? { ...c, qty: Math.min(found.qty + 1, maxStock) } : c
        );
      }
      return [
        ...prev,
        {
          item: product,
          selectedDesign: options.design,
          selectedColour: options.colour,
          selectedSize: options.size,
          selectedPackOption: options.packOption,
          unitPrice: options.unitPrice,
          sku: options.sku,
          qty: 1,
          image: options.image,
        },
      ];
    });

    toast.success(`${product.name} added to your bag`, {
      description: [options.design, options.colour, options.size ? `Size ${options.size}` : "", options.packOption]
        .filter(Boolean)
        .join(", "),
      action: { label: "View bag", onClick: () => setCartOpen(true) },
    });
    setCartOpen(true);
  };

  const updateQty = (skuKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (`${c.item._id}-${c.sku}` !== skuKey) return c;
          const maxStock = c.item.stock > 0 ? c.item.stock : 99;
          return { ...c, qty: Math.min(Math.max(0, c.qty + delta), maxStock) };
        })
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (skuKey: string) =>
    setCart((prev) => prev.filter((c) => `${c.item._id}-${c.sku}` !== skuKey));

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.qty * c.unitPrice, 0);

  const checkout = async () => {
    if (cart.length === 0 || checkoutLoading) return;
    try {
      setCheckoutLoading(true);
      const body = {
        items: cart.map((c) => ({
          productId: c.item._id,
          productCode: c.item.productCode || "",
          sku: c.sku,
          name: c.item.name,
          design: c.selectedDesign || "",
          colour: c.selectedColour || "",
          size: c.selectedSize || "",
          packOption: c.selectedPackOption || "",
          quantity: c.qty,
          price: c.unitPrice,
          image: c.image || c.item.images?.[0] || c.item.imageUrl || "",
        })),
      };

      const res = await fetch(`${API_BASE_URL}/merch/cart/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Cart session creation failed");
      const data = await res.json();
      if (!data.sessionId) throw new Error("Checkout session missing");

      if (AHIBI_BASE_URL) {
        window.location.href = `${AHIBI_BASE_URL}/HornbillFestival2025/merch?session=${data.sessionId}`;
      } else {
        const orderSummary = cart
          .map(
            (c) =>
              `• ${c.item.name} (${c.sku})\n  ${[
                c.selectedDesign ? `Design: ${c.selectedDesign}` : "",
                c.selectedColour ? `Colour: ${c.selectedColour}` : "",
                c.selectedSize ? `Size: ${c.selectedSize}` : "",
                c.selectedPackOption ? `Option: ${c.selectedPackOption}` : "",
              ]
                .filter(Boolean)
                .join(" | ")}\n  Qty: ${c.qty} × ₹${c.unitPrice.toFixed(2)} = ₹${(c.qty * c.unitPrice).toFixed(2)}`
          )
          .join("\n\n");
        const msg = encodeURIComponent(
          `Hi! I would like to order Hornbill Festival Merchandise:\n\n${orderSummary}\n\nTotal Amount: ₹${cartTotal.toFixed(2)}\nSession ID: ${data.sessionId}`
        );
        window.open(`https://wa.me/918794696995?text=${msg}`, "_blank");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const orderSummary = cart
        .map((c) => `• ${c.item.name} (${c.sku})\n  Qty: ${c.qty} × ₹${c.unitPrice.toFixed(2)}`)
        .join("\n");
      const msg = encodeURIComponent(
        `Hi! I would like to order Hornbill Merchandise:\n\n${orderSummary}\n\nTotal: ₹${cartTotal.toFixed(2)}`
      );
      window.open(`https://wa.me/918794696995?text=${msg}`, "_blank");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredItems = useMemo(
    () => (activeCategory === "All" ? merchItems : merchItems.filter((i) => i.category === activeCategory)),
    [merchItems, activeCategory]
  );

  const countFor = (cat: string) =>
    cat === "All" ? merchItems.length : merchItems.filter((i) => i.category === cat).length;

  const currentShowcase =
    activeCategory !== "All" ? categoryShowcases.find((c) => c.category === activeCategory) : null;
  const showcaseImgs = currentShowcase?.images?.filter(Boolean).slice(0, 3) || [];

  return (
    <section className="min-h-screen bg-[#13201a] text-[#ebe6d9] pb-28">
      {/* Banner */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/merchbanner.png" />
        <img
          src="/mob_merch.png"
          alt="Hornbill Music Festival merchandise"
          className="w-full h-auto object-cover max-h-[380px] md:max-h-[480px]"
          loading="eager"
        />
      </picture>

      <div className="px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <header className={`py-12 md:py-16 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end border-b ${line}`}>
            <h1 className="font-righteous text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              Hornbill Festival merchandise
            </h1>
            <div className={`text-sm leading-relaxed ${muted} max-w-md`}>
              <p>
                Official TaFMA drops, printed on bio-washed cotton. Prices include GST and shipping anywhere in
                India. If the size is wrong, we'll exchange it.
              </p>
            </div>
          </header>

          {/* Categories */}
          <nav className={`flex gap-6 sm:gap-8 overflow-x-auto border-b ${line}`} aria-label="Categories">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-current={active}
                  className={`relative py-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:text-white ${active ? "text-white" : `${muted} hover:text-white`
                    }`}
                >
                  {cat === "All" ? "Everything" : cat}
                  <span className="ml-1.5 text-xs opacity-60">{countFor(cat)}</span>
                  {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-festival-orange" />}
                </button>
              );
            })}
          </nav>

          {/* Category showcase */}
          {showcaseImgs.length > 0 && (
            <div className="pt-10">
              {(currentShowcase?.title || currentShowcase?.description) && (
                <div className="mb-4 max-w-xl">
                  <h2 className="font-righteous text-2xl">{currentShowcase?.title}</h2>
                  {currentShowcase?.description && (
                    <p className={`text-sm mt-1 ${muted}`}>{currentShowcase.description}</p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {showcaseImgs.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${activeCategory} look ${idx + 1}`}
                    className="w-full aspect-[4/3] object-cover rounded-sm bg-[#1b2c23]"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* States */}
          {loading && (
            <div className="py-24 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-festival-orange" />
              <p className={`text-sm ${muted}`}>Loading the collection</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-20 max-w-md">
              <p className="mb-4">{error}</p>
              <Button onClick={fetchMerch} variant="outline" className="text-white border-white/30 bg-transparent rounded-sm">
                Try again
              </Button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && (
            <div className="pt-10">
              {filteredItems.length === 0 ? (
                <div className="py-20 max-w-md">
                  <h3 className="text-lg font-semibold mb-1">Nothing in {activeCategory} yet</h3>
                  <p className={`text-sm ${muted}`}>
                    New items are added as they're ready. Try another category, or call us below.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((item) => (
                    <MerchCard
                      key={item._id}
                      item={item}
                      onAddToCart={addToCart}
                      onOpenSizeChart={(chartUrl, itemName) => setActiveSizeChart({ chartUrl, itemName })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Help */}
          <div className={`mt-20 pt-8 border-t ${line} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
            <div>
              <h4 className="font-semibold">Bulk orders or sizing questions?</h4>
              <p className={`text-sm ${muted}`}>Call the merchandise team and we'll help you pick.</p>
            </div>
            <a
              href="tel:+917003195644"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-festival-orange hover:text-white"
            >
              <Phone size={16} />
              +91 70031 95644
            </a>
          </div>
        </div>
      </div>

      {/* Floating bag button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-6 z-40 bg-festival-orange text-white pl-4 pr-5 py-3 rounded-sm shadow-lg font-semibold flex items-center gap-2 hover:brightness-110 active:translate-y-px transition"
          aria-label={`Open bag, ${cartCount} items`}
        >
          <ShoppingBag size={18} />
          Bag ({cartCount})
        </button>
      )}

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="w-full max-w-md bg-[#1b2c23] h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
              aria-label="Your bag"
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${line}`}>
                <h2 className="font-righteous text-xl">
                  Your bag <span className={`text-sm font-sans ${muted}`}>({cartCount})</span>
                </h2>
                <button onClick={() => setCartOpen(false)} className={`${muted} hover:text-white`} aria-label="Close bag">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="font-medium">Your bag is empty</p>
                    <p className={`text-sm mt-1 ${muted}`}>Pick a design, colour and size to get started.</p>
                  </div>
                ) : (
                  <ul className={`divide-y divide-[#ebe6d9]/15`}>
                    {cart.map((c) => {
                      const skuKey = `${c.item._id}-${c.sku}`;
                      const itemImg = c.image || c.item.images?.[0] || c.item.imageUrl || "";
                      const details = [c.selectedDesign, c.selectedColour, c.selectedSize && `Size ${c.selectedSize}`, c.selectedPackOption]
                        .filter(Boolean)
                        .join(", ");
                      return (
                        <li key={skuKey} className="flex gap-4 py-5">
                          {itemImg ? (
                            <img src={itemImg} alt={c.item.name} className="w-20 h-24 object-cover rounded-sm bg-black/30 shrink-0" />
                          ) : (
                            <div className="w-20 h-24 rounded-sm bg-black/30 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex justify-between gap-3">
                              <h4 className="font-semibold text-sm leading-snug">{c.item.name}</h4>
                              <span className="text-sm font-semibold shrink-0">₹{(c.unitPrice * c.qty).toFixed(2)}</span>
                            </div>
                            {details && <p className={`text-xs mt-1 ${muted}`}>{details}</p>}
                            <p className={`text-[11px] mt-0.5 ${muted} opacity-70`}>{c.sku}</p>
                            <div className="mt-auto pt-3 flex items-center justify-between">
                              <div className={`inline-flex items-center border ${line} rounded-sm`}>
                                <button onClick={() => updateQty(skuKey, -1)} className="px-2 py-1.5 hover:bg-white/10" aria-label="Decrease quantity">
                                  <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-xs font-semibold">{c.qty}</span>
                                <button onClick={() => updateQty(skuKey, 1)} className="px-2 py-1.5 hover:bg-white/10" aria-label="Increase quantity">
                                  <Plus size={12} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(skuKey)}
                                className={`${muted} hover:text-white`}
                                aria-label={`Remove ${c.item.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className={`px-6 py-5 border-t ${line} space-y-4`}>
                <dl className="text-sm space-y-1.5">
                  <div className="flex justify-between">
                    <dt className={muted}>Subtotal</dt>
                    <dd>₹{cartTotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className={muted}>Shipping</dt>
                    <dd>Free</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className={muted}>GST</dt>
                    <dd>Included</dd>
                  </div>
                  <div className={`flex justify-between items-baseline pt-3 mt-2 border-t ${line}`}>
                    <dt className="font-semibold">Total</dt>
                    <dd className="text-2xl font-bold">₹{cartTotal.toFixed(2)}</dd>
                  </div>
                </dl>

                <Button
                  disabled={cart.length === 0 || checkoutLoading}
                  onClick={checkout}
                  className="w-full bg-festival-orange hover:bg-festival-orange/90 text-white rounded-sm py-6 font-semibold"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Taking you to checkout
                    </>
                  ) : (
                    `Check out · ₹${cartTotal.toFixed(2)}`
                  )}
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size chart modal */}
      <AnimatePresence>
        {activeSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveSizeChart(null)}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl w-full bg-[#1b2c23] rounded-sm p-5"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={`Size guide for ${activeSizeChart.itemName}`}
            >
              <div className={`flex items-center justify-between pb-3 mb-4 border-b ${line}`}>
                <h3 className="font-semibold">Size guide, {activeSizeChart.itemName}</h3>
                <button onClick={() => setActiveSizeChart(null)} className={`${muted} hover:text-white`} aria-label="Close size guide">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[68vh] overflow-auto flex items-center justify-center bg-black/30 rounded-sm p-2">
                <img
                  src={activeSizeChart.chartUrl}
                  alt={`Size chart for ${activeSizeChart.itemName}`}
                  className="max-w-full max-h-[64vh] object-contain"
                />
              </div>

              <div className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${muted}`}>
                <p>
                  Measurements are of the garment laid flat, in inches. For a looser, boxy fit, go one size up.
                </p>
                <button
                  onClick={() => window.open(activeSizeChart.chartUrl, "_blank")}
                  className="text-festival-orange hover:underline shrink-0"
                >
                  Open full size
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------ MerchCard ------------------ */
function MerchCard({
  item,
  onAddToCart,
  onOpenSizeChart,
}: {
  item: MerchItem;
  onAddToCart: (item: MerchItem, options: CartOptions) => void;
  onOpenSizeChart: (chartUrl: string, itemName: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const hasDesigns = Array.isArray(item.designs) && item.designs.length > 0;
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(hasDesigns ? item.designs![0] : null);

  const hasColours = Array.isArray(item.colours) && item.colours.length > 0;
  const [selectedColour, setSelectedColour] = useState<ColourOption | null>(hasColours ? item.colours![0] : null);

  const hasSizes = Array.isArray(item.sizes) && item.sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? item.sizes![0] : "");

  const [isPack, setIsPack] = useState(false);

  useEffect(() => {
    if (hasDesigns && !selectedDesign) setSelectedDesign(item.designs![0]);
    if (hasColours && !selectedColour) setSelectedColour(item.colours![0]);
    if (hasSizes && !selectedSize) setSelectedSize(item.sizes![0]);
  }, [item, hasDesigns, hasColours, hasSizes]);

  const matchedVariant = useMemo(() => {
    if (!item.variantImages || !item.variantImages.length) return null;
    return item.variantImages.find(
      (v) =>
        v.design?.toLowerCase().trim() === selectedDesign?.name?.toLowerCase().trim() &&
        v.colour?.toLowerCase().trim() === selectedColour?.name?.toLowerCase().trim()
    );
  }, [item.variantImages, selectedDesign, selectedColour]);

  // Matching variant mockup first, then its extra images, then general photos
  const imgs = useMemo(() => {
    const list: string[] = [];
    if (matchedVariant?.imageUrl) {
      list.push(matchedVariant.imageUrl);
      matchedVariant.images?.forEach((url) => url && !list.includes(url) && list.push(url));
    }
    item.images?.forEach((url) => url && !list.includes(url) && list.push(url));
    if (item.imageUrl && !list.includes(item.imageUrl)) list.push(item.imageUrl);
    return list;
  }, [matchedVariant, item.images, item.imageUrl]);

  useEffect(() => {
    setIndex(0);
  }, [selectedDesign?.name, selectedColour?.name]);

  const next = () => imgs.length > 1 && setIndex((p) => (p + 1) % imgs.length);
  const prev = () => imgs.length > 1 && setIndex((p) => (p - 1 + imgs.length) % imgs.length);

  const isSoldOut = item.stock === 0;
  const showPack = !!item.hasPackOption && !!item.packPrice && item.packPrice > 0;
  const currentPrice = showPack && isPack ? item.packPrice! : item.price;

  const dynamicSku = useMemo(() => {
    const parts = [item.productCode || "HBF"];
    if (selectedDesign?.code) parts.push(selectedDesign.code);
    else if (selectedDesign?.name) parts.push(selectedDesign.name.replace(/\s+/g, "").toUpperCase().slice(0, 5));
    if (selectedColour?.name) parts.push(selectedColour.name.replace(/\s+/g, "").toUpperCase().slice(0, 4));
    if (selectedSize) parts.push(selectedSize.replace(/\s+/g, "").toUpperCase());
    if (item.hasPackOption && isPack) parts.push("PACK10");
    return parts.join("-");
  }, [item.productCode, selectedDesign, selectedColour, selectedSize, isPack, item.hasPackOption]);

  const handleAdd = () => {
    if (isSoldOut) return;
    onAddToCart(item, {
      design: selectedDesign?.name,
      colour: selectedColour?.name,
      size: hasSizes ? selectedSize : undefined,
      packOption: item.hasPackOption ? (isPack ? item.packLabel || "Pack of 10" : "Single") : undefined,
      unitPrice: currentPrice,
      sku: dynamicSku,
      image: imgs[index] || imgs[0] || item.imageUrl || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const specs = [item.weight, item.fabric, item.fit].filter(Boolean).join(", ");
  const optionLabel = "text-xs text-[#ebe6d9]/60";

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[#ebe6d9]/15 bg-[#1b2c23]/70 transition-colors hover:border-[#ebe6d9]/35">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-black/30">
        {imgs.length > 0 ? (
          <img key={imgs[index]} src={imgs[index]} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-xs ${muted}`}>No photo yet</div>
        )}

        {isSoldOut && (
          <span className="absolute top-3 left-3 bg-[#13201a] text-xs font-semibold px-2.5 py-1 rounded-sm">Sold out</span>
        )}

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#13201a]/80 hover:bg-[#13201a] rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#13201a]/80 hover:bg-[#13201a] rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-3 right-3 bg-[#13201a]/80 text-[11px] px-2 py-0.5 rounded-sm">
              {index + 1} / {imgs.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className={`flex gap-2 px-4 sm:px-5 py-3 overflow-x-auto border-b ${line} bg-black/20`}>
          {imgs.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-12 h-12 rounded-md overflow-hidden shrink-0 transition ${i === index ? "ring-2 ring-festival-orange" : "opacity-50 hover:opacity-100"
                }`}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === index}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        {/* Title */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
            <p className="text-lg font-semibold shrink-0">₹{currentPrice.toFixed(2)}</p>
          </div>
          <p className={`text-xs mt-1 ${muted}`}>{[item.category, specs].filter(Boolean).join(", ")}</p>
          {item.description && <p className={`text-sm mt-2 line-clamp-2 ${muted}`}>{item.description}</p>}
        </div>

        {/* Options */}
        <div className={`mt-4 pt-4 border-t ${line} space-y-4`}>
          {showPack && (
            <div className="space-y-2">
              <p className={optionLabel}>Buy as</p>
              <div className={`grid grid-cols-2 rounded-md border ${line} p-0.5 text-sm`}>
                {[
                  { label: "Single", sub: `₹${item.price}`, value: false },
                  { label: item.packLabel || "Pack of 10", sub: `₹${item.packPrice}`, value: true },
                ].map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => setIsPack(o.value)}
                    aria-pressed={isPack === o.value}
                    className={`py-2 rounded-[5px] transition-colors leading-tight ${isPack === o.value ? "bg-[#ebe6d9] text-[#13201a] font-semibold" : "text-[#ebe6d9]/70 hover:text-white"
                      }`}
                  >
                    {o.label}
                    <span className="block text-[11px] font-normal opacity-70">{o.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasDesigns && (
            <div className="space-y-2">
              <p className={optionLabel}>
                Design <span className="text-[#ebe6d9] font-medium ml-1">{selectedDesign?.name}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {item.designs!.map((d) => {
                  const current = selectedDesign?.name === d.name;
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setSelectedDesign(d)}
                      aria-pressed={current}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-colors flex items-center gap-1.5 ${current
                        ? "border-festival-orange bg-festival-orange/10 text-white"
                        : `${line} text-[#ebe6d9]/70 hover:border-[#ebe6d9]/50`
                        }`}
                    >
                      {current && <Check size={13} className="text-festival-orange" />}
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasColours && (
            <div className="space-y-2">
              <p className={optionLabel}>
                Colour <span className="text-[#ebe6d9] font-medium ml-1">{selectedColour?.name}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {item.colours!.map((col) => {
                  const current = selectedColour?.name === col.name;
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColour(col)}
                      title={col.name}
                      aria-label={col.name}
                      aria-pressed={current}
                      className={`w-9 h-9 rounded-full p-1 border-2 transition-colors ${current ? "border-festival-orange" : "border-[#ebe6d9]/20 hover:border-[#ebe6d9]/50"
                        }`}
                    >
                      <span className="block w-full h-full rounded-full ring-1 ring-black/30" style={{ backgroundColor: col.hex }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className={optionLabel}>
                  Size <span className="text-[#ebe6d9] font-medium ml-1">{selectedSize}</span>
                </p>
                {item.sizeChartUrl && (
                  <button
                    type="button"
                    onClick={() => onOpenSizeChart(item.sizeChartUrl!, item.name)}
                    className="text-xs inline-flex items-center gap-1 underline underline-offset-2 text-festival-orange hover:brightness-110"
                  >
                    <Ruler size={12} /> Size guide
                  </button>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {item.sizes!.map((size) => {
                  const current = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={current}
                      className={`py-2 text-sm rounded-md border transition-colors ${current
                        ? "border-[#ebe6d9] bg-[#ebe6d9] text-[#13201a] font-semibold"
                        : `${line} text-[#ebe6d9]/80 hover:border-[#ebe6d9]/50`
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Buy */}
        <div className={`mt-auto pt-5`}>
          <div className={`pt-4 border-t ${line}`}>
            <Button
              onClick={handleAdd}
              disabled={isSoldOut}
              className={`w-full rounded-md py-6 text-base font-semibold transition-colors ${isSoldOut
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : added
                  ? "bg-[#ebe6d9] text-[#13201a] hover:bg-[#ebe6d9]"
                  : "bg-festival-orange hover:bg-festival-orange/90 text-white"
                }`}
            >
              {isSoldOut ? "Sold out" : added ? "Added to bag" : `Add to bag · ₹${currentPrice.toFixed(2)}`}
            </Button>
            <p className="text-[11px] text-[#ebe6d9]/45 mt-2.5 text-center">
              {isSoldOut ? "Out of stock" : "Includes GST, ships in 24 hours"} · {dynamicSku}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}