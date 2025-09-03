
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
      className={`py-16 bg-gradient-to-b from-gray-900/30 to-gray-800/50 transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-righteous festival-title mb-4">
            Our Partners & Sponsors
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Supporting the preservation and celebration of Nagaland's musical heritage
          </p>
        </div>

        <div 
          ref={logosRef}
          className={`transition-all duration-1000 ${
            logosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {sponsors.map((sponsor, index) => (
              <div 
                key={sponsor.name}
                className="group flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 mb-3 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-16 h-16 object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{sponsor.name}</h3>
                <p className="text-xs text-muted-foreground">{sponsor.tier}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in becoming a sponsor?
          </p>
          <a 
            href="mailto:sponsors@tafma.org" 
            className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Partner with Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
