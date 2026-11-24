import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  position?: number;
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

const SIZE_GUIDES: Record<
  string,
  {
    title: string;
    specs: string;
    headers: string[];
    rows: { size: string; values: string[] }[];
    note: string;
  }
> = {
  "HMF-RNT": {
    title: "Classic Round-Neck Tee",
    specs: "100% bio-washed cotton · 180 GSM · Regular, round neck",
    headers: ["Size", "Chest (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      { size: "S", values: ["38", "26", "8"] },
      { size: "M", values: ["40", "27", "8.5"] },
      { size: "L", values: ["42", "28", "9"] },
      { size: "XL", values: ["44", "29", "9.5"] },
      { size: "XXL", values: ["46", "30", "10.5"] },
    ],
    note: "Garment laid flat. ±0.5–1 in tolerance. Includes GST & free shipping across India.",
  },
  "HMF-OST": {
    title: "Oversized Tee",
    specs: "100% bio-washed cotton · 180 GSM · Oversized, drop shoulder",
    headers: ["Size", "Chest (in)", "Length (in)", "Sleeve (in)"],
    rows: [
      { size: "S", values: ["42", "27.5", "8.5"] },
      { size: "M", values: ["44", "28", "9"] },
      { size: "L", values: ["46", "28.5", "9.5"] },
      { size: "XL", values: ["48", "29", "10"] },
      { size: "XXL", values: ["50", "29.5", "10.5"] },
    ],
    note: "Drop-shoulder, boxy and roomy streetwear cut for the big back print. Garment laid flat. ±0.5–1 in tolerance.",
  },
  "HMF-HD320": {
    title: "Pullover Hoodie",
    specs: "Poly-cotton 3-thread fleece · 320 GSM · Kangaroo pocket",
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)", "Sleeve (in)"],
    rows: [
      { size: "S", values: ["38", "27", "16.5", "23.5"] },
      { size: "M", values: ["40", "28", "17.5", "24"] },
      { size: "L", values: ["42", "29", "18.5", "24.5"] },
      { size: "XL", values: ["44", "30", "19.5", "25"] },
      { size: "XXL", values: ["46", "31", "20.5", "25.5"] },
    ],
    note: "Warm 320 GSM fleece for cold Kisama evenings. Garment laid flat. ±0.5–1 in tolerance.",
  },
  "HMF-SWT": {
    title: "Crew Sweatshirt",
    specs: "Cotton 3-thread fleece · 320 GSM · Ribbed cuffs & hem",
    headers: ["Size", "Chest (in)", "Length (in)", "Shoulder (in)", "Sleeve (in)"],
    rows: [
      { size: "S", values: ["38", "27", "16.5", "23.5"] },
      { size: "M", values: ["40", "28", "17.5", "24"] },
      { size: "L", values: ["42", "29", "18.5", "24.5"] },
      { size: "XL", values: ["44", "30", "19.5", "25"] },
      { size: "XXL", values: ["46", "31", "20.5", "25.5"] },
    ],
    note: "Soft brushed fleece. Garment laid flat. ±0.5–1 in tolerance.",
  },
};

const isCombinationUnavailable = (productCode?: string, designName?: string, colourName?: string) => {
  if (!productCode || !designName || !colourName) return false;
  const d = designName.toLowerCase().trim();
  const c = colourName.toLowerCase().trim();
  const code = productCode.toUpperCase();

  if (code.includes("RNT")) {
    if ((d.includes("kisama") || d.includes("headliner")) && (c === "black" || c === "navy")) {
      return true;
    }
  }
  if (code.includes("OST")) {
    if ((d.includes("kisama") || d.includes("headliner")) && c === "black") {
      return true;
    }
  }
  if (code.includes("HD320") || code.includes("SWT")) {
    if (d.includes("headliner") && c === "black") {
      return true;
    }
  }
  return false;
};

export default function Merch() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [categoryShowcases, setCategoryShowcases] = useState<CategoryShowcase[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSizeChart, setActiveSizeChart] = useState<{ itemName: string; chartUrl?: string; productCode?: string } | null>(null);

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
        window.location.href = `${AHIBI_BASE_URL}/HornbillFestival2026/merch?session=${data.sessionId}`;
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

  const filteredItems = useMemo(() => {
    const list = activeCategory === "All" ? merchItems : merchItems.filter((i) => i.category === activeCategory);
    return [...list].sort((a, b) => (a.position ?? 999) - (b.position ?? 999));
  }, [merchItems, activeCategory]);

  const countFor = (cat: string) =>
    cat === "All" ? merchItems.length : merchItems.filter((i) => i.category === cat).length;

  const currentShowcase =
    activeCategory !== "All" ? categoryShowcases.find((c) => c.category === activeCategory) : null;
  const showcaseImgs = currentShowcase?.images?.filter(Boolean).slice(0, 3) || [];

  return (
    <section className="min-h-screen bg-[#13201a] text-[#ebe6d9] pb-28 pt-16">
      {/* Banner */}
      <picture className="block w-full">
        <source media="(min-width: 768px)" srcSet="/merchbanner.jpg" />
        <img
          src="/mob_merch.jpg"
          alt="Hornbill Music Festival merchandise"
          className="w-full h-auto block"
          loading="eager"
        />
      </picture>

      <div className="px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Categories */}
          <nav className={`flex gap-6 sm:gap-8 overflow-x-auto border-b ${line} pt-4`} aria-label="Categories">
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
                      onOpenSizeChart={(chartUrl, itemName, productCode) =>
                        setActiveSizeChart({ chartUrl, itemName, productCode })
                      }
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
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-6 right-4 sm:right-6 md:bottom-8 md:right-8 z-40 bg-festival-orange text-white pl-4 pr-5 py-3 rounded-full shadow-2xl ring-2 ring-black/40 font-semibold flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all"
            aria-label={`Open bag, ${cartCount} items`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag size={19} className="stroke-[2.2]" />
              <span className="absolute -top-1.5 -right-2 bg-[#13201a] text-festival-orange text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-festival-orange/40">
                {cartCount}
              </span>
            </div>
            <span className="text-sm font-bold">Bag</span>
            <span className="text-xs bg-black/25 px-2 py-0.5 rounded-full font-medium">₹{cartTotal.toFixed(0)}</span>
          </motion.button>
        )}
      </AnimatePresence>

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
        {activeSizeChart && (() => {
          const code = activeSizeChart.productCode?.toUpperCase() || "";
          const guideKey = Object.keys(SIZE_GUIDES).find((k) => code.includes(k.replace("HMF-", "")) || code === k) || (code.includes("RNT") ? "HMF-RNT" : "");
          const guide = guideKey ? SIZE_GUIDES[guideKey] : null;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
              onClick={() => setActiveSizeChart(null)}
            >
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl w-full bg-[#1b2c23] rounded-lg border border-[#ebe6d9]/20 p-5 sm:p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label={`Size guide for ${activeSizeChart.itemName}`}
              >
                <div className={`flex items-start justify-between pb-3 mb-4 border-b ${line}`}>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Size guide · {activeSizeChart.itemName}</h3>
                    {guide && <p className={`text-xs mt-0.5 ${muted}`}>{guide.specs}</p>}
                  </div>
                  <button
                    onClick={() => setActiveSizeChart(null)}
                    className={`${muted} hover:text-white p-1 rounded-sm`}
                    aria-label="Close size guide"
                  >
                    <X size={20} />
                  </button>
                </div>

                {guide && (
                  <div className="overflow-x-auto rounded border border-[#ebe6d9]/15 bg-black/25 my-3">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-[#13201a]/90 text-[#ebe6d9] border-b border-[#ebe6d9]/15">
                        <tr>
                          {guide.headers.map((h, i) => (
                            <th key={i} className="py-2.5 px-3 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ebe6d9]/10">
                        {guide.rows.map((r, ri) => (
                          <tr key={ri} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-festival-orange">{r.size}</td>
                            {r.values.map((v, vi) => (
                              <td key={vi} className="py-2.5 px-3 text-[#ebe6d9]/85">{v}″</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeSizeChart.chartUrl && (
                  <div className="max-h-[46vh] overflow-auto flex items-center justify-center bg-black/30 rounded-sm p-2 my-3">
                    <img
                      src={activeSizeChart.chartUrl}
                      alt={`Size chart for ${activeSizeChart.itemName}`}
                      className="max-w-full max-h-[42vh] object-contain"
                    />
                  </div>
                )}

                <div className={`mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${muted}`}>
                  <p>
                    {guide?.note || "Measurements are of the garment laid flat in inches. Tolerance ±0.5–1 in."}
                  </p>
                  {activeSizeChart.chartUrl && (
                    <button
                      onClick={() => window.open(activeSizeChart.chartUrl, "_blank")}
                      className="text-festival-orange hover:underline shrink-0"
                    >
                      Open full image ↗
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
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
  onOpenSizeChart: (chartUrl: string, itemName: string, productCode?: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbRef.current) {
      const activeBtn = thumbRef.current.children[index] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [index]);

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
    const parts = [item.productCode || "HMF"];
    if (selectedDesign?.code) parts.push(selectedDesign.code);
    else if (selectedDesign?.name) parts.push(selectedDesign.name.replace(/\s+/g, "").toUpperCase().slice(0, 5));
    if (selectedColour?.name) parts.push(selectedColour.name.replace(/\s+/g, "").toUpperCase().slice(0, 4));
    if (selectedSize) parts.push(selectedSize.replace(/\s+/g, "").toUpperCase());
    if (item.hasPackOption && isPack) parts.push("PACK10");
    return parts.join("-");
  }, [item.productCode, selectedDesign, selectedColour, selectedSize, isPack, item.hasPackOption]);

  const handleSelectDesign = (d: DesignOption) => {
    setSelectedDesign(d);
    if (selectedColour && isCombinationUnavailable(item.productCode, d.name, selectedColour.name)) {
      const firstAvail = item.colours?.find(
        (c) => !isCombinationUnavailable(item.productCode, d.name, c.name)
      );
      if (firstAvail) {
        setSelectedColour(firstAvail);
        toast.info(`"${d.name}" is not available in ${selectedColour.name}. Switched to ${firstAvail.name}.`);
      }
    }
  };

  const handleSelectColour = (col: ColourOption) => {
    if (isCombinationUnavailable(item.productCode, selectedDesign?.name, col.name)) {
      toast.error(`"${selectedDesign?.name}" is not available in ${col.name} per official festival catalog.`);
      return;
    }
    setSelectedColour(col);
  };

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
        <div className={`relative border-b ${line} bg-black/20`}>
          <div
            ref={thumbRef}
            tabIndex={0}
            role="region"
            aria-label={`${item.name} image thumbnails`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex gap-2 px-4 sm:px-5 py-2.5 overflow-x-auto no-scrollbar scroll-smooth focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
          >
            {imgs.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`w-12 h-12 rounded-md overflow-hidden shrink-0 transition-all ${i === index
                  ? "ring-2 ring-festival-orange scale-105 opacity-100 shadow-md"
                  : "opacity-45 hover:opacity-85 hover:scale-100"
                  }`}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === index}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {/* Discreet indicator dots when there are many items (e.g. 10 badges/stickers) */}
          {imgs.length > 5 && (
            <div className="flex justify-center pb-2 pt-0.5 gap-1.5">
              {imgs.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setIndex(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none ${dotIdx === index ? "w-4 bg-festival-orange" : "w-1.5 bg-[#ebe6d9]/25 hover:bg-[#ebe6d9]/50"
                    }`}
                  aria-label={`Go to photo ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">
        {/* Title & Mobile Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
              <p className={`text-xs mt-1 ${muted}`}>{[item.category, specs].filter(Boolean).join(", ")}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold">₹{currentPrice.toFixed(2)}</p>
              {/* Dropdown toggle button on mobile */}
              <button
                type="button"
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                className="md:hidden mt-1 text-xs text-festival-orange hover:text-festival-orange/80 inline-flex items-center gap-1 font-medium bg-festival-orange/10 px-2.5 py-1 rounded-md border border-festival-orange/25 transition-all"
                aria-label={isMobileExpanded ? "Hide options" : "Show options"}
              >
                <span>{isMobileExpanded ? "Less" : "Options"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
          {item.description && (
            <p className={`text-sm mt-2 line-clamp-2 ${muted} ${!isMobileExpanded ? "hidden sm:block" : ""}`}>
              {item.description}
            </p>
          )}
        </div>

        {/* Collapsed Mobile CTA Button */}
        {!isMobileExpanded && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#ebe6d9]/15">
            <Button
              type="button"
              onClick={() => setIsMobileExpanded(true)}
              disabled={isSoldOut}
              className={`w-full py-4 text-sm font-semibold rounded-md flex items-center justify-center gap-2 ${isSoldOut
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-festival-orange text-white hover:bg-festival-orange/90 shadow-sm"
                }`}
            >
              <span>{isSoldOut ? "Sold out" : `Select Options & Buy · ₹${currentPrice.toFixed(2)}`}</span>
              {!isSoldOut && <ChevronDown size={15} />}
            </Button>
            <p className="text-[11px] text-[#ebe6d9]/50 mt-1.5 text-center truncate">
              {[selectedDesign?.name, selectedColour?.name, hasSizes ? `Size ${selectedSize}` : ""].filter(Boolean).join(" · ")}
            </p>
          </div>
        )}

        {/* Options & Full Buy (always open on desktop, expandable on mobile) */}
        <div className={`flex-col flex-grow ${isMobileExpanded ? "flex" : "hidden md:flex"}`}>
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
                        onClick={() => handleSelectDesign(d)}
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
                    const unavailable = isCombinationUnavailable(item.productCode, selectedDesign?.name, col.name);

                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleSelectColour(col)}
                        title={unavailable ? `${col.name} (Not available for ${selectedDesign?.name})` : col.name}
                        aria-label={col.name}
                        aria-pressed={current}
                        className={`w-9 h-9 rounded-full p-1 border-2 transition-all relative ${unavailable
                          ? "opacity-30 border-red-500/30 cursor-not-allowed"
                          : current
                            ? "border-festival-orange scale-105"
                            : "border-[#ebe6d9]/20 hover:border-[#ebe6d9]/50"
                          }`}
                      >
                        <span className="block w-full h-full rounded-full ring-1 ring-black/30" style={{ backgroundColor: col.hex }} />
                        {unavailable && (
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] text-red-400 font-bold">✕</span>
                        )}
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
                  <button
                    type="button"
                    onClick={() => onOpenSizeChart(item.sizeChartUrl || "", item.name, item.productCode)}
                    className="text-xs inline-flex items-center gap-1 underline underline-offset-2 text-festival-orange hover:brightness-110"
                  >
                    <Ruler size={12} /> Size guide
                  </button>
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
                {isSoldOut ? "Out of stock" : "Includes GST, ships in 24 hours"}
              </p>

              {/* Mobile Collapse Button */}
              {isMobileExpanded && (
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(false)}
                  className="md:hidden w-full py-2.5 text-xs text-[#ebe6d9]/60 hover:text-white flex items-center justify-center gap-1 mt-2 border-t border-[#ebe6d9]/10 transition-colors"
                >
                  <span>Hide options</span>
                  <ChevronUp size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}