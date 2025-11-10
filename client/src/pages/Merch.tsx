import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

type MerchItem = {
  id: number;
  name: string;
  price: string;
  images: string[];
  description: string;
};

const merchItems: MerchItem[] = [
  {
    id: 1,
    name: "Hornbill Official T-Shirt",
    price: "₹899",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_tshirt1.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_tshirt2.png",
    ],
    description: "Premium cotton festival T-shirt featuring the official Hornbill 2025 emblem.",
  },
  {
    id: 2,
    name: "Hornbill Tote Bag",
    price: "₹499",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_tote1.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_tote2.png",
    ],
    description: "Eco-friendly tote bag for everyday use, designed for Hornbill Music lovers.",
  },
  {
    id: 3,
    name: "Hornbill Hoodie",
    price: "₹1499",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_hoodie1.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_hoodie2.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_hoodie3.png",
    ],
    description: "Stay warm with this limited-edition Hornbill 2025 hoodie in black & pink tones.",
  },
  {
    id: 4,
    name: "Hornbill Cap",
    price: "₹599",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_cap1.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_cap2.png",
    ],
    description: "Stylish snapback cap with embroidered Hornbill logo.",
  },
  {
    id: 5,
    name: "Hornbill Wristband Set",
    price: "₹299",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_band1.png",
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_band2.png",
    ],
    description: "Set of 3 silicone wristbands — show your festival spirit anywhere you go!",
  },
  {
    id: 6,
    name: "Hornbill Poster",
    price: "₹399",
    images: [
      "https://res.cloudinary.com/dwznqrjgg/image/upload/v1734560001/merch_poster1.png",
    ],
    description: "High-quality A2 poster print celebrating Hornbill Music Festival 2025.",
  },
];

export default function Merch() {
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {merchItems.map((item) => (
            <MerchCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------ MerchCard Component ------------------ */
function MerchCard({ item }: { item: MerchItem }) {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % item.images.length);
  };
  const prevImage = () => {
    setIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0d0d14]/70 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-pink-500/40 hover:shadow-[0_0_30px_#ff2dd433] transition-all duration-500 flex flex-col"
    >
      {/* Carousel */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={item.images[index]}
            alt={item.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        </AnimatePresence>

        {item.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 backdrop-blur-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 rounded-full p-2 backdrop-blur-md"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow justify-between p-5">
        <div>
          <h3 className="text-xl font-semibold mb-1 text-pink-400">
            {item.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2">{item.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-white">{item.price}</span>
          <Button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2">
            <ShoppingBag size={16} />
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
