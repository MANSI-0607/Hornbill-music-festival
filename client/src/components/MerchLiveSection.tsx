import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MerchLiveSection() {
  const highlights = [
    { icon: Truck, label: 'Free Shipping', desc: 'Across India with tracking' },
    { icon: Sparkles, label: 'Premium Quality', desc: '180 GSM bio-cotton & 320 GSM fleece' },
    { icon: ShieldCheck, label: 'Official Drop', desc: 'Official festival merchandise' },
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-black via-[#13201a]/70 to-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-festival-orange/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Banner Card */}
        <div className="rounded-2xl border border-festival-orange/30 bg-[#1b2c23]/60 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300 hover:border-festival-orange/50">
          <div className="grid lg:grid-cols-12 items-center">
            {/* Visual Image / Banner */}
            <div className="lg:col-span-7 relative group overflow-hidden bg-black/40">
              <Link to="/merch" className="block relative">
                <picture>
                  <source media="(min-width: 768px)" srcSet="/merchbanner.png" />
                  <img
                    src="/mob_merch.png"
                    alt="Hornbill Festival Official Merchandise"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
              </Link>
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-festival-orange text-white shadow-lg">
                  <Flame size={14} className="fill-white" />
                  Now Live
                </span>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">


              <h2 className="font-righteous text-3xl sm:text-4xl text-white mb-4 leading-tight">
                Wear the Spirit of <span className="text-festival-orange">Hornbill</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                The exclusive 2026 drop is now live. Oversized streetwear tees, classic crew necks,
                fleece hoodies, sweatshirts, pins, and die-cut vinyl sticker packs.
              </p>

              {/* Highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex sm:flex-col items-center sm:items-start gap-2.5 p-3 rounded-lg bg-black/30 border border-white/10">
                    <h.icon size={18} className="text-festival-orange shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">{h.label}</p>

                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/merch" className="flex-1">
                  <Button className="w-full bg-festival-orange hover:bg-festival-orange/90 text-white font-semibold py-6 text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-festival-orange/20">
                    <ShoppingBag size={18} />
                    <span>Shop Merch Now</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
