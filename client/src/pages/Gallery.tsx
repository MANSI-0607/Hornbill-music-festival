import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import GalleryModal from "@/components/GalleryModal";

// Image imports
import hornbillMusic1 from "@/assets/music/hornbill (1).jpg";
import hornbillMusic2 from "@/assets/music/hornbill (2).jpg";
import hornbillMusic3 from "@/assets/music/hornbill (3).jpg";
import hornbillMusic4 from "@/assets/music/hornbill (4).jpg";
import hornbillMusic5 from "@/assets/music/hornbill (5).jpg";
import hornbillMusic6 from "@/assets/music/hornbill (6).jpg";
import hornbillCulture1 from "@/assets/culture/hornbill (1).jpg";
import hornbillCulture2 from "@/assets/culture/hornbill (2).jpg";
import hornbillCulture3 from "@/assets/culture/hornbill (3).jpg";
import hornbillCulture4 from "@/assets/culture/hornbill (4).jpg";
import hornbillCulture5 from "@/assets/culture/hornbill (5).jpg";
import hornbillCulture6 from "@/assets/culture/hornbill (6).jpg";

const Gallery = () => {
  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation<HTMLDivElement>();
  const { elementRef: galleryRef, isVisible: galleryVisible } =
    useScrollAnimation<HTMLDivElement>();

  // Gallery modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Pagination state
  const [visibleCount, setVisibleCount] = React.useState(8);
  const IMAGES_PER_LOAD = 8;

  const allGalleryImages = [
    { id: 1, title: "Music", category: "Music", imageUrl: hornbillMusic1 },
    { id: 2, title: "Culture", category: "Culture", imageUrl: hornbillCulture1 },
    { id: 3, title: "Music", category: "Music", imageUrl: hornbillMusic2 },
    { id: 4, title: "Music", category: "Music", imageUrl: hornbillMusic3 },
    { id: 5, title: "Music", category: "Music", imageUrl: hornbillMusic4 },
    { id: 6, title: "Culture", category: "Culture", imageUrl: hornbillCulture2 },
    { id: 7, title: "Culture", category: "Culture", imageUrl: hornbillCulture3 },
    { id: 8, title: "Culture", category: "Culture", imageUrl: hornbillCulture4 },
    { id: 9, title: "Music", category: "Music", imageUrl: hornbillMusic5 },
    { id: 10, title: "Culture", category: "Culture", imageUrl: hornbillCulture5 },
    { id: 11, title: "Music", category: "Music", imageUrl: hornbillMusic6 },
    { id: 12, title: "Culture", category: "Culture", imageUrl: hornbillCulture6 },
  ];

  const categories = ["All", "Culture", "Music"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredImages =
    selectedCategory === "All"
      ? allGalleryImages
      : allGalleryImages.filter((image) => image.category === selectedCategory);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMoreImages = visibleCount < filteredImages.length;

  React.useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory]);

  const loadMoreImages = () => {
    setVisibleCount((prev) =>
      Math.min(prev + IMAGES_PER_LOAD, filteredImages.length)
    );
  };

  const openModal = (visibleIndex: number) => {
    const clickedImage = visibleImages[visibleIndex];
    const actualIndex = allGalleryImages.findIndex(
      (img) => img.id === clickedImage.id
    );
    setSelectedImageIndex(actualIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-800 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="mr-4">
              <Button
                variant="outline"
                size="sm"
                className="border-festival-blue text-festival-blue hover:bg-festival-blue/10"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Festival
              </Button>
            </Link>
          </div>

          <h1 className="font-righteous text-4xl md:text-6xl mb-4 bg-gradient-to-r from-festival-blue to-festival-orange bg-clip-text text-transparent">
            Festival Gallery
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Relive the magical moments from Hornbill Music Festival through our
            comprehensive photo gallery.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-festival-orange hover:bg-festival-orange-dark text-white border-none"
                  : "border-festival-blue/50 text-gray-300 hover:border-festival-orange hover:text-festival-orange"
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
            galleryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleImages.map((image, index) => (
              <Card
                key={image.id}
                className={`festival-card group cursor-pointer transition-all duration-500 hover:scale-105 overflow-hidden ${
                  galleryVisible ? "animate-scale-in" : "opacity-0 scale-75"
                }`}
                style={{
                  animationDelay: galleryVisible ? `${index * 100}ms` : "0ms",
                }}
                onClick={() => openModal(index)}
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Title overlay */}
                    <div className="absolute inset-0 flex items-end p-4">
                      <h3 className="font-righteous text-lg text-white group-hover:text-festival-orange-light transition-colors duration-300">
                        {image.title}
                      </h3>
                    </div>

                    {/* Border hover accent */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-festival-blue/50 rounded-lg transition-all duration-300" />
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
              className="px-6 py-3 rounded-full bg-festival-orange hover:bg-festival-orange-dark text-white font-semibold transition-all duration-300"
              onClick={loadMoreImages}
            >
              <Camera className="mr-2" size={20} />
              Load More Images
            </Button>
          </div>
        )}
      </div>

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
