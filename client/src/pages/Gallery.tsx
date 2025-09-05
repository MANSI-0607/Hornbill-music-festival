import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, ArrowLeft } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import GalleryModal from '@/components/GalleryModal';

// 🎵 Assets
import hornbillMusic1 from '@/assets/music/hornbill (1).jpg';
import hornbillMusic2 from '@/assets/music/hornbill (2).jpg';
import hornbillMusic3 from '@/assets/music/hornbill (3).jpg';
import hornbillMusic4 from '@/assets/music/hornbill (4).jpg';
import hornbillMusic5 from '@/assets/music/hornbill (5).jpg';
import hornbillMusic6 from '@/assets/music/hornbill (6).jpg';
import hornbillCulture1 from '@/assets/culture/hornbill (1).jpg';
import hornbillCulture2 from '@/assets/culture/hornbill (2).jpg';
import hornbillCulture3 from '@/assets/culture/hornbill (3).jpg';
import hornbillCulture4 from '@/assets/culture/hornbill (4).jpg';
import hornbillCulture5 from '@/assets/culture/hornbill (5).jpg';
import hornbillCulture6 from '@/assets/culture/hornbill (6).jpg';

const Gallery = () => {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: galleryRef, isVisible: galleryVisible } = useScrollAnimation<HTMLDivElement>();

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Pagination State
  const [visibleCount, setVisibleCount] = React.useState(8);
  const IMAGES_PER_LOAD = 8;

  const allGalleryImages = [
    { id: 1, title: 'Music', category: 'Music', imageUrl: hornbillMusic1 },
    { id: 2, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture1 },
    { id: 3, title: 'Music', category: 'Music', imageUrl: hornbillMusic2 },
    { id: 4, title: 'Music', category: 'Music', imageUrl: hornbillMusic3 },
    { id: 5, title: 'Music', category: 'Music', imageUrl: hornbillMusic4 },
    { id: 6, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture2 },
    { id: 7, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture3 },
    { id: 8, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture4 },
    { id: 9, title: 'Music', category: 'Music', imageUrl: hornbillMusic5 },
    { id: 10, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture5 },
    { id: 11, title: 'Music', category: 'Music', imageUrl: hornbillMusic6 },
    { id: 12, title: 'Culture', category: 'Culture', imageUrl: hornbillCulture6 }
  ];

  const categories = ['All', 'Culture', 'Music'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredImages =
    selectedCategory === 'All'
      ? allGalleryImages
      : allGalleryImages.filter((image) => image.category === selectedCategory);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMoreImages = visibleCount < filteredImages.length;

  React.useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory]);

  const loadMoreImages = () => {
    setVisibleCount((prev) => Math.min(prev + IMAGES_PER_LOAD, filteredImages.length));
  };

  const openModal = (visibleIndex: number) => {
    const clickedImage = visibleImages[visibleIndex];
    const actualIndex = allGalleryImages.findIndex((img) => img.id === clickedImage.id);
    setSelectedImageIndex(actualIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1931] via-[#102A43] to-[#0A1931] text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-800 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4">
              <Button
                variant="outline"
                size="sm"
                className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Festival
              </Button>
            </Link>
          </div>

          <h1 className="font-righteous text-4xl md:text-6xl mb-4 text-[#FFD700] drop-shadow-lg">
            Festival <span className="text-[#77B5FE]">Gallery</span>
          </h1>
          <p className="text-lg text-[#DBEAFE] max-w-3xl mx-auto">
            Relive the magical moments from Hornbill Music Festival through our golden-blue themed
            gallery ✨
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-300 rounded-full px-6 py-2 font-semibold ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#FACC15] text-black shadow-lg'
                  : 'border border-[#FFD700]/40 text-[#4169e1] hover:bg-[#FFD700]/20'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div
          ref={galleryRef}
          className={`transition-all duration-800 ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleImages.map((image, index) => (
              <Card
                key={image.id}
                className={`relative group cursor-pointer overflow-hidden bg-[#102A43] border border-[#FFD700]/30 shadow-md hover:shadow-2xl hover:border-[#FFD700] transition-all duration-500 ${
                  galleryVisible ? 'animate-scale-in' : 'opacity-0 scale-75'
                }`}
                style={{
                  animationDelay: galleryVisible ? `${index * 100}ms` : '0ms'
                }}
                onClick={() => openModal(index)}
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Blue-Golden Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1931]/80 via-transparent to-transparent group-hover:from-[#FFD700]/20 transition-all duration-500" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                      <h3 className="font-righteous text-lg text-[#FFD700] drop-shadow-md group-hover:text-white transition-colors duration-300">
                        {image.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {hasMoreImages && (
          <div className="text-center mt-12">
            <Button
              className="bg-gradient-to-r from-[#FFD700] to-[#FACC15] text-black font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              onClick={loadMoreImages}
            >
              <Camera className="mr-2" size={20} />
              Load More Images
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allGalleryImages}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
};

export default Gallery;
