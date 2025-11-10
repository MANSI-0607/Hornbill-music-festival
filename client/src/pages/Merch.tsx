import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

export default function Merch() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#0a0a0f] text-white py-16 px-4 md:px-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#0a0a0f] text-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="font-righteous text-4xl md:text-6xl mb-2 text-white">
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
            {merchItems.map((item) => (
              <MerchCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------ MerchCard Component ------------------ */
function MerchCard({ item }: { item: MerchItem }) {
  const [index, setIndex] = useState(0);
  const imgs = (item.images && item.images.length ? item.images : (item.imageUrl ? [item.imageUrl] : []));

  const next = () => setIndex((prev) => (prev + 1) % imgs.length);
  const prev = () => setIndex((prev) => (prev - 1 + imgs.length) % imgs.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0d0d14]/70 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-pink-500/40 hover:shadow-[0_0_30px_#ff2dd433] transition-all duration-500 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
        {imgs.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={imgs[index]}
                alt={item.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </AnimatePresence>
            {imgs.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 backdrop-blur-md"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 backdrop-blur-md"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No Image</div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow justify-between p-5">
        <div>
          <h3 className="text-xl font-semibold mb-1 text-pink-400">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-gray-400 text-sm mb-2">{item.description}</p>
          )}
          {item.stock > 0 ? (
            <p className="text-xs text-gray-500">In stock: {item.stock}</p>
          ) : (
            <p className="text-xs text-red-400">Out of stock</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            ₹{item.price.toFixed(2)}
          </span>
          <Button
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2"
            disabled={item.stock === 0}
          >
            <ShoppingBag size={16} />
            {item.stock === 0 ? "Sold Out" : "Buy Now"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}