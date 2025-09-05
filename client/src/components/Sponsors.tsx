import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronRight } from 'lucide-react';

const Sponsors = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: logosRef, isVisible: logosVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  const sponsors = [
    {
      name: "Nagaland Government",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Title Sponsor"
    },
    {
      name: "Tourism Nagaland",
      logo: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Presenting Partner"
    },
    {
      name: "Nagaland University",
      logo: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Education Partner"
    },
    {
      name: "Local Arts Council",
      logo: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Cultural Partner"
    },
    {
      name: "Hornbill Radio",
      logo: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Media Partner"
    },
    {
      name: "Northeast Today",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      tier: "Media Partner"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className={`py-16 bg-gradient-to-br from-[#1E3A8A] to-[#0A2342] text-white transition-all duration-1000 ${
        sectionVisible ? 'animate-fade-in-up visible' : 'animate-fade-in-up'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-righteous text-[#FFD700] mb-4">
            Our Partners & Sponsors
          </h2>
          <p className="text-lg md:text-xl text-[#B9E6FF] max-w-3xl mx-auto">
            Supporting the preservation and celebration of Nagaland's musical heritage
          </p>
        </div>

        <div 
          ref={logosRef}
          className={`transition-all duration-1000 ${
            logosVisible ? 'animate-fade-in-up visible' : 'animate-fade-in-up'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {sponsors.map((sponsor, index) => (
              <div 
                key={sponsor.name}
                className={`group flex flex-col items-center text-center transform transition-all duration-700 ${
                  logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-24 h-24 p-2 mb-3 rounded-full bg-[#1E40AF] border-2 border-[#1E3A8A] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 transform-gpu">
                  <img 
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-lg">{sponsor.name}</h3>
                <p className="text-sm text-[#00B8D9] font-medium">{sponsor.tier}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#B9E6FF] mb-4">
            Interested in becoming a sponsor?
          </p>
          <a 
            href="mailto:sponsors@tafma.org" 
            className="inline-flex items-center bg-[#FFD700] hover:bg-[#E0B900] text-[#1E3A8A] font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Partner with Us
            <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;