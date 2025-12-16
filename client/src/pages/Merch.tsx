import React from "react";
import { Phone, Lock } from "lucide-react";

export default function Merch() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#05040a] to-[#0a0a0f] text-white">
      {/* Banner Section */}
      <div className="w-full overflow-hidden">
        {/* Desktop Banner */}
        <div className="hidden md:block w-full">
          <img
            src="/merchbanner.jpg"
            alt="Merch Banner"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>

        {/* Mobile Banner */}
        <div className="md:hidden w-full">
          <img
            src="/mob_merch.jpeg"
            alt="Merch Banner"
            className="w-full h-auto object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Content */}
      <div className="py-20 px-4 md:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-festival-orange/20 p-5 rounded-full">
              <Lock className="w-10 h-10 text-festival-orange" />
            </div>
          </div>

          <h1 className="font-righteous text-4xl md:text-5xl text-festival-blue mb-4">
            Merch Orders Closed
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Thank you for the overwhelming love ❤️  
            <br />
            Hornbill Music Festival 2025 merchandise orders are now officially closed.
          </p>

          <p className="text-gray-400 text-sm mb-10">
            Stay tuned — fresh drops and new designs will be back next season 
          </p>

          <div className="border border-white/10 rounded-2xl p-6 bg-[#0d0d14]/70">
            <p className="text-festival-orange font-semibold mb-2">
              Need help or have a query?
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Phone size={18} />
              <span>+91 87946 96995</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
