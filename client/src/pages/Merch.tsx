import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Loader2,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComingSoon from "@/components/ComingSoon";

type MerchItem = {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  description?: string;
  stock: number;
  isActive: boolean;
};

type CartEntry = {
  item: MerchItem;
  qty: number;
};

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
const AHIBI_BASE_URL = import.meta.env.VITE_AHIBI_CLIENT_BASE_URL || "";


export default function Merch() {

  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchMerch = async () => {
      try {
         
        const res = await fetch(`${API_BASE_URL}/merch`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMerchItems(data.filter((item: MerchItem) => item.isActive));
      } catch (e) {
        console.error("Failed to load merchandise:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMerch();
  }, []);

  const addToCart = (product: MerchItem) => {
    if (product.stock === 0) return;

    setCart((prev) => {
      const found = prev.find((c) => c.item._id === product._id);
      if (found) {
        return prev.map((c) =>
          c.item._id === product._id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { item: product, qty: 1 }];
    });

    setCartOpen(true);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item._id === productId ? { ...c, qty: c.qty + delta } : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.item._id !== productId));
  };

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce(
    (sum, c) => sum + c.qty * c.item.price,
    0
  );

  const checkout = async () => {
    if (cart.length === 0 || checkoutLoading) return;

    try {
      setCheckoutLoading(true);

      const body = {
        items: cart.map((c) => ({
          productId: c.item._id,
          quantity: c.qty,
        })),
      };

      const res = await fetch(`${API_BASE_URL}/merch/cart/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Cart session creation failed");
        alert("Unable to start checkout. Please try again.");
        return;
      }

      const data = await res.json();
      if (!data.sessionId) {
        alert("Checkout session missing. Please try again.");
        return;
      }

      window.location.href = `${AHIBI_BASE_URL}/HornbillFestival2025/merch?session=${data.sessionId}`;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#0a0a0f] text-white py-16 px-4 md:px-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-festival-blue" />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#0a0a0f] text-white">
      {/* Banner Section */}
      <div className="w-full overflow-hidden">
        {/* Desktop Banner - 16:9 */}
        <div className="hidden md:block w-full">
          <img
            src="/merchbanner.jpg"
            alt="Merch Banner"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
       
        {/* Mobile Banner - 9:16 */}
        <div className="md:hidden w-full">
          <img
            src="/mob_merch.jpeg"
            alt="Merch Banner"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="font-righteous text-4xl md:text-6xl mb-2 text-festival-blue">
              Hornbill Music Festival Store
            </h1>
            <p className="text-gray-400 text-lg">
              Official Hornbill 2025 merchandise — wear the vibe 🎶
            </p>
          </div>

          {/* Merch Grid */}
          {merchItems.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No merchandise available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {merchItems
                .slice()
                .reverse()
                .map((item) => (
                  <MerchCard
                    key={item._id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-festival-blue text-white px-5 py-3 rounded-full shadow-xl font-semibold flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          <span>Cart ({cartCount})</span>
        </button>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="w-80 sm:w-96 bg-[#0d0d14] h-full p-6 flex flex-col border-l border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🛒 Your Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Your cart is empty. Add some Hornbill drip ✨
                  </p>
                ) : (
                  cart.map((c) => (
                    <div
                      key={c.item._id}
                      className="flex items-center justify-between gap-2 border-b border-white/10 pb-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {c.item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{c.item.price.toFixed(2)} × {c.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(c.item._id, -1)}
                          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm">
                          {c.qty}
                        </span>
                        <button
                          onClick={() => updateQty(c.item._id, 1)}
                          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(c.item._id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Summary + Checkout */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-semibold">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  disabled={cart.length === 0 || checkoutLoading}
                  onClick={checkout}
                  className="w-full bg-gradient-to-r from-festival-blue to-festival-orange hover:from-festival-blue-light hover:to-festival-orange text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Checkout
                      <span className="text-xs">↗</span>
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------ MerchCard Component ------------------ */
function MerchCard({
  item,
  onAddToCart,
}: {
  item: MerchItem;
  onAddToCart: (item: MerchItem) => void;
}) {
  const [index, setIndex] = useState(0);

  const imgs =
    item.images && item.images.length
      ? item.images
      : item.imageUrl
      ? [item.imageUrl]
      : [];

  const next = () => {
    if (imgs.length === 0) return;
    setIndex((prev) => (prev + 1) % imgs.length);
  };

  const prev = () => {
    if (imgs.length === 0) return;
    setIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  // Detect swipe direction
  const handleSwipe = (offsetX: number) => {
    if (Math.abs(offsetX) < 50) return; // ignore small drags
    if (offsetX < 0) next(); // swipe left → next image
    else prev();            // swipe right → previous image
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0d0d14]/70 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-festival-orange/40 hover:shadow-[0_0_30px_rgba(240,93,41,0.2)] transition-all duration-500 flex flex-col"
    >

      {/* Image Carousel */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">

        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={imgs[index]}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-contain"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => handleSwipe(info.offset.x)}
          />
        </AnimatePresence>

        {/* Arrows (only if > 1 image) */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-festival-blue/70 rounded-full p-2"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-festival-blue/70 rounded-full p-2"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow justify-between p-5">
        <div>
          <h3 className="text-xl font-semibold mb-1 text-festival-orange">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 text-sm mb-2">{item.description}</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            ₹{item.price.toFixed(2)}
          </span>
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-festival-blue to-festival-orange text-white rounded-full px-4 py-2"
            disabled={item.stock === 0}
            onClick={() => onAddToCart(item)}
          >
            <ShoppingBag size={16} />
            {item.stock === 0 ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
