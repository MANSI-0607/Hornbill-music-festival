import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Music, Camera, Users, ChevronLeft, ChevronRight, Eye, ExternalLink, Ticket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link, useNavigate } from 'react-router-dom';
import GalleryModal from './GalleryModal';

import hornbillMusic1 from '@/assets/music/hornbill (1).jpg';
import hornbillMusic2 from '@/assets/music/hornbill (2).jpg';
import hornbillMusic3 from '@/assets/music/hornbill (3).jpg';
import hornbillMusic4 from '@/assets/music/hornbill (4).jpg';
import hornbillMusic5 from '@/assets/music/hornbill (5).jpg';
import hornbillMusic6 from '@/assets/music/hornbill (6).jpg';
import hornbillMusic7 from '@/assets/music/hornbill (7).jpg';
import hornbillMusic8 from '@/assets/music/hornbill (8).jpg';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: documentaryRef, isVisible: documentaryVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollAnimation<HTMLDivElement>();

  // Gallery modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const featuredCards = [
    {
      title: 'Book Tickets',
      description: 'Tickets will be available soon at Ahibi.in',
      cta: 'Coming Soon',
      variant: 'festival',
      icon: Ticket,
      gradient: 'from-pink-500/20 to-purple-600/20',
      border: 'border-pink-500/30',
      link: 'https://www.ahibi.in'
    },
    {
      title: 'Hornbill Music Festival',
      description: 'Explore event highlights, stages, and experiences waiting for you this December.',
      cta: 'Explore Festival →',
      variant: 'stage',
      icon: Users,
      gradient: 'from-orange-500/20 to-teal-500/20',
      border: 'border-orange-500/30',
      link: '/hornbill-music-festival'
    },
    {
      title: 'Live Schedule',
      description: 'Check out the complete festival lineup and plan your experience',
      cta: 'View Schedule',
      variant: 'tribal',
      icon: Camera,
      gradient: 'from-purple-600/20 to-yellow-500/20',
      border: 'border-purple-500/30',
      link: '/schedule'
    }
  ];

  const galleryImages = [
    {
      id: 1,
      title: 'Hornbill Music 1',
      description: 'Live performance highlight from the Hornbill stage.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic1
    },
    {
      id: 2,
      title: 'Hornbill Music 2',
      description: 'Crowd and artist energy captured during the show.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic2
    },
    {
      id: 3,
      title: 'Hornbill Music 3',
      description: 'Stage lights and sound in perfect harmony.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic3
    },
    {
      id: 4,
      title: 'Hornbill Music 4',
      description: 'Guitar solo moment under the spotlight.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic4
    },
    {
      id: 5,
      title: 'Hornbill Music 5',
      description: 'Rhythm and beats that move the crowd.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic5
    },
    {
      id: 6,
      title: 'Hornbill Music 6',
      description: 'Vocal performance that lifts the soul.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic6
    },
    {
      id: 7,
      title: 'Hornbill Music 7',
      description: 'Bass lines driving the groove forward.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic7
    },
    {
      id: 8,
      title: 'Hornbill Music 8',
      description: 'Encore moment with the crowd singing along.',
      category: 'Music',
      gradient: 'from-pink-500/20 to-purple-600/20',
      imageUrl: hornbillMusic8
    }
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

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      scrollGallery('right');
    }
    if (isRightSwipe) {
      scrollGallery('left');
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <section className="py-4 px-4">
      <div className="container mx-auto max-w-6xl">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-800 ${
            headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-righteous text-4xl md:text-5xl mb-4">
            <span className="festival-title">Festival Experience</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Immerse yourself in the sounds, culture, and spirit of Nagaland
          </p>
        </div>

        <div 
          ref={cardsRef}
          className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 ${
            cardsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          {featuredCards.map((card, index) => (
            <Card 
              key={index} 
              className={`festival-card ${card.gradient} ${card.border} group cursor-pointer transition-all duration-500 ${
                cardsVisible ? 'animate-fade-in' : ''
              }`}
              style={{
                animationDelay: cardsVisible ? `${index * 200}ms` : '0ms'
              }}
              onClick={() => {
                if (card.link.startsWith('http')) {
                  window.open(card.link, '_blank'); // opens in new tab
                } else {
                  navigate(card.link); // internal navigation
                }
              }}
              
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <card.icon className="text-4xl text-pink-400" size={48} />
                  <ArrowRight className="text-gray-400 group-hover:text-pink-400 group-hover:translate-x-2 transition-all duration-300" size={24} />
                </div>
                
                <h3 className="font-righteous text-2xl mb-4 text-white">
                  {card.title}
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {card.description}
                </p>
                
                <Button className={`btn-${card.variant} w-full`}>
                  {card.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div 
          ref={documentaryRef}
          className={`festival-card transition-all duration-800 ${
            documentaryVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-12 scale-95'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`transition-all duration-1000 delay-200 ${
              documentaryVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}>
              <h3 className="font-righteous text-3xl mb-4">
                <span className="festival-title">Hornbill Festival Official Theme Song</span>
              </h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                Experience the spirit of unity and celebration with “Come Together”, 
                the official song of the Hornbill Festival. Created by Trance Effect, 
                this anthem captures the energy, culture, and heartbeat of Nagaland’s 
                biggest celebration.
              </p>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                🎵 25 Years of Hornbill – One Song, One Spirit.
              </p>  
              <a href="https://youtu.be/8-1GZQ2w8kE?si=fJpAyHI2cRjLiF0L" target="_blank" rel="noopener noreferrer">
                <Button className="btn-festival">
                  <Camera className="mr-2" size={20} />
                  Watch Official Music Video
                </Button>
              </a>
            </div>
            
            <div className={`relative transition-all duration-1000 delay-400 ${
              documentaryVisible 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-8 scale-95'
            }`}>
              <div className="aspect-video rounded-2xl overflow-hidden neon-glow-purple">
                <img
                  src="https://res.cloudinary.com/dwznqrjgg/image/upload/v1757235432/hornbill-bands/1757235406541-comeTogether-min.png.png"
                  alt="Hornbill"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={galleryRef}
          className={`mt-16 transition-all duration-800 ${
            galleryVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-righteous text-2xl md:text-3xl transition-all duration-1000 delay-200 ${
              galleryVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              <span className="festival-title">Live from the Festival</span>
            </h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => scrollGallery('left')}
                className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-gray-700/50 hover:border-pink-500/50 transition-all duration-300"
              >
                <ChevronLeft className="text-gray-400 hover:text-pink-400" size={20} />
              </button>
              <button
                onClick={() => scrollGallery('right')}
                className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-full hover:bg-gray-700/50 hover:border-pink-500/50 transition-all duration-300"
              >
                <ChevronRight className="text-gray-400 hover:text-pink-400" size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden -mx-4 px-4">
            <div 
              id="festival-gallery"
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory touch-pan-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {galleryImages.map((image, index) => (
                <div 
                  key={image.id}
                  className={`flex-shrink-0 w-72 sm:w-80 h-64 relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-105 snap-start select-none ${
                    galleryVisible ? 'animate-scale-in' : 'opacity-0 scale-75'
                  }`}
                  style={{
                    animationDelay: galleryVisible ? `${index * 100}ms` : '0ms'
                  }}
                  onClick={() => openModal(index)}
                >
                 {/* Background Image */}
<img 
  src={image.imageUrl} 
  // alt={image.title}
  className="absolute inset-0 w-full h-full object-cover"
  loading="lazy"
  decoding="async"
/>

                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                        {image.category}
                      </span>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-pink-500/50 transition-all duration-300">
                        <Eye className="text-white" size={16} />
                      </div>
                    </div>
                  {/*                     
                    <div>
                      <h4 className="font-righteous text-lg md:text-xl text-white mb-2 group-hover:text-pink-200 transition-colors duration-300">
                        {image.title}
                      </h4>
                      <p className="text-gray-200 text-sm opacity-90 line-clamp-2">
                        {image.description}
                      </p>
                    </div> */}
                  </div>
                  
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-400/50 rounded-2xl transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-8">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="btn-festival w-full sm:w-auto"
            >
              <Camera className="mr-2" size={20} />
              Quick View Gallery
            </Button>
            
            <Link to="/gallery" className="w-full sm:w-auto">
              <Button className="btn-festival w-full">
                <ExternalLink className="mr-2" size={20} />
                Full Gallery Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={galleryImages}
        initialIndex={selectedImageIndex}
      />
{/* Drum Tao Section */}
<div className="mt-12 text-center">
  {/* Centered Heading */}
  <h3 className="font-righteous text-4xl md:text-5xl mb-3">
    <span className="festival-title">Drum Tao Comes to Hornbill!</span>
   

  </h3>
    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-3">
        Prepare to be mesmerized by <strong>DRUM TAO</strong> — the world-famous 
        Japanese drumming ensemble known for their breathtaking blend of rhythm, 
        movement, and martial artistry. 
      </p>

  {/* YouTube Video (slightly smaller, with sound) */}
  <div className="mx-auto w-full md:w-4/5 lg:w-3/4 aspect-video rounded-2xl overflow-hidden neon-glow-purple shadow-lg">
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/C7InxbCEJtE?autoplay=1&controls=1&rel=0&modestbranding=1"
      title="Drum Tao at Hornbill Festival"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    ></iframe>
  </div>
</div>

    </section>
    
  );
};

export default FeaturedSection;
