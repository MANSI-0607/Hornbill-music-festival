// src/components/FeaturedSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import GalleryModal from './GalleryModal';
import comeTogetherThumbnail from '@/assets/comeTogether.png';
import hornbillMusic1 from '@/assets/music/hornbill (1).jpg';
import hornbillMusic2 from '@/assets/music/hornbill (2).jpg';
import hornbillMusic3 from '@/assets/music/hornbill (3).jpg';
import hornbillMusic4 from '@/assets/music/hornbill (4).jpg';
import hornbillMusic5 from '@/assets/music/hornbill (5).jpg';
import hornbillMusic6 from '@/assets/music/hornbill (6).jpg';
import hornbillMusic7 from '@/assets/music/hornbill (7).jpg';
import hornbillMusic8 from '@/assets/music/hornbill (8).jpg';

const FeaturedSection = () => {
  const { elementRef: documentaryRef, isVisible: documentaryVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollAnimation<HTMLDivElement>();

  // Gallery modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const galleryImages = [
    { id: 1, category: 'Music', imageUrl: hornbillMusic1 },
    { id: 2, category: 'Music', imageUrl: hornbillMusic2 },
    { id: 3, category: 'Music', imageUrl: hornbillMusic3 },
    { id: 4, category: 'Music', imageUrl: hornbillMusic4 },
    { id: 5, category: 'Music', imageUrl: hornbillMusic5 },
    { id: 6, category: 'Music', imageUrl: hornbillMusic6 },
    { id: 7, category: 'Music', imageUrl: hornbillMusic7 },
    { id: 8, category: 'Music', imageUrl: hornbillMusic8 }
  ];

  const scrollGallery = (direction: 'left' | 'right') => {
    const gallery = document.getElementById('festival-gallery');
    if (gallery) {
      const scrollAmount = window.innerWidth < 768 ? 280 : 320;
      gallery.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-16 px-2 bg-gradient-to-r from-[#FFD700]/15 via-pink-200/20 to-[#DBEAFE]/25">
      <div className="container mx-auto max-w-8xl">
        {/* OFFICIAL SONG SECTION */}
        <div
          ref={documentaryRef}
          className={`grid md:grid-cols-2 gap-10 items-center mb-20 transition-all duration-700 rounded-2xl p-6 md:p-8 bg-white/70 backdrop-blur-md border border-white/40 shadow-xl ${
            documentaryVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Left: Video thumbnail */}
          <div
            className={`rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000 ${
              documentaryVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src={comeTogetherThumbnail}
              alt="Hornbill Festival Theme Song"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Description */}
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#0A2342]">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 text-transparent bg-clip-text">
                Hornbill Festival Official Theme Song
              </span>
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Experience the spirit of unity and celebration with{' '}
              <span className="font-semibold text-[#1E3A8A]">“Come Together”</span>, 
              the official song of the Hornbill Festival. Created by{' '}
              <span className="font-semibold">Trance Effect</span>, this anthem 
              captures the energy, culture, and heartbeat of Nagaland’s biggest celebration.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              🎵 25 Years of Hornbill – One Song, One Spirit.
            </p>
            <a
              href="https://youtu.be/8-1GZQ2w8kE?si=fJpAyHI2cRjLiF0L"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="group relative overflow-hidden text-lg font-extrabold rounded-full px-8 py-4 text-[#0A2342]
                bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_10px_24px_rgba(234,179,8,0.45)]
                hover:shadow-[0_12px_28px_rgba(234,179,8,0.6)] transition-transform duration-200 hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-[#FDE68A]">
                <Camera className="mr-2" size={20} />
                Watch Official Music Video
              </Button>
            </a>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div
          ref={galleryRef}
          className={`transition-all duration-800 ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0A2342]">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-600 text-transparent bg-clip-text">
                Live from the Festival
              </span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollGallery('left')}
                className="p-2 bg-white border border-gray-300 rounded-full hover:bg-yellow-100 transition"
              >
                <ChevronLeft className="text-[#0A2342]" size={20} />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="p-2 bg-white border border-gray-300 rounded-full hover:bg-yellow-100 transition"
              >
                <ChevronRight className="text-[#0A2342]" size={20} />
              </button>
            </div>
          </div>

          {/* Horizontal gallery */}
          <div className="relative overflow-hidden -mx-4 px-4">
            <div
              id="festival-gallery"
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="flex-shrink-0 w-72 sm:w-80 h-64 relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-105 snap-start select-none"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt="Festival"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex justify-between items-start p-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                      {image.category}
                    </span>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-yellow-400/50 transition-all duration-300">
                      <Eye className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-2xl transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Gallery actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden text-lg font-extrabold rounded-full px-8 py-4 text-[#0A2342] w-full sm:w-auto
                bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_10px_24px_rgba(234,179,8,0.45)]
                hover:shadow-[0_12px_28px_rgba(234,179,8,0.6)] transition-transform duration-200 hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-[#FDE68A]"
            >
              <Camera className="mr-2" size={20} />
              Quick View Gallery
            </Button>
            <Link to="/gallery" className="w-full sm:w-auto">
              <Button className="group relative overflow-hidden text-lg font-extrabold rounded-full px-8 py-4 text-[#0A2342] w-full
                bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_10px_24px_rgba(234,179,8,0.45)]
                hover:shadow-[0_12px_28px_rgba(234,179,8,0.6)] transition-transform duration-200 hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-[#FDE68A]"
              >
                <ExternalLink className="mr-2" size={20} />
                Full Gallery Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={galleryImages}
        initialIndex={selectedImageIndex}
      />
    </section>
  );
};

export default FeaturedSection;
