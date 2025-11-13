import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import GalleryModal from "@/components/GalleryModal";

// Image imports
import hornbillMusic0 from "@/assets/music/hornbill (1).png";
import hornbillMusic01 from "@/assets/music/hornbill (2).png";
import hornbillMusic02 from "@/assets/music/hornbill (3).png";
import hornbillMusic03 from "@/assets/music/hornbill (4).png";
import hornbillMusic04 from "@/assets/music/hornbill (5).png";

import hornbillMusic1 from "@/assets/music/hornbill (1).jpg";
import hornbillMusic2 from "@/assets/music/hornbill (2).jpg";
import hornbillMusic3 from "@/assets/music/hornbill (3).jpg";
import hornbillMusic4 from "@/assets/music/hornbill (4).jpg";
import hornbillMusic5 from "@/assets/music/hornbill (5).jpg";
import hornbillMusic6 from "@/assets/music/hornbill (6).jpg";
import hornbillMusic7 from "@/assets/music/hornbill (7).jpg";
import hornbillMusic8 from "@/assets/music/hornbill (8).jpg";
import hornbillMusic9 from "@/assets/music/hornbill (9).jpg";
import hornbillMusic10 from "@/assets/music/hornbill (10).jpg";
import hornbillMusic11 from "@/assets/music/hornbill (11).jpg";
import hornbillMusic12 from "@/assets/music/hornbill (12).jpg";
import hornbillMusic13 from "@/assets/music/hornbill (13).jpg";
import hornbillMusic14 from "@/assets/music/hornbill (14).jpg";
import hornbillMusic15 from "@/assets/music/hornbill (15).jpg";
import hornbillMusic16 from "@/assets/music/hornbill (16).png";
import hornbillMusic17 from "@/assets/music/hornbill (17).png";
import hornbillMusic18 from "@/assets/music/hornbill (18).png";
import hornbillMusic19 from "@/assets/music/hornbill (19).png";
import hornbillMusic20 from "@/assets/music/hornbill (20).png";
import hornbillMusic21 from "@/assets/music/hornbill (21).png";
import hornbillMusic22 from "@/assets/music/hornbill (22).png";
import hornbillMusic23 from "@/assets/music/hornbill (23).png";
import hornbillMusic24 from "@/assets/music/hornbill (24).png";
import hornbillMusic25 from "@/assets/music/hornbill (25).png";
import hornbillMusic26 from "@/assets/music/hornbill (26).png";
import hornbillMusic27 from "@/assets/music/hornbill (27).png";
import hornbillMusic28 from "@/assets/music/hornbill (28).png";
import hornbillMusic29 from "@/assets/music/hornbill (29).png";
import hornbillMusic30 from "@/assets/music/hornbill (30).png";
import hornbillMusic31 from "@/assets/music/hornbill (31).png";
import hornbillMusic32 from "@/assets/music/hornbill (32).png";
import hornbillMusic33 from "@/assets/music/hornbill (33).png";
import hornbillMusic34 from "@/assets/music/hornbill (34).png";
import hornbillMusic35 from "@/assets/music/hornbill (35).png";
import hornbillMusic36 from "@/assets/music/hornbill (36).png";
import hornbillMusic37 from "@/assets/music/hornbill (37).png";
import hornbillMusic38 from "@/assets/music/hornbill (38).png";
import hornbillMusic39 from "@/assets/music/hornbill (39).png";
import hornbillMusic40 from "@/assets/music/hornbill (40).png";
import hornbillMusic41 from "@/assets/music/hornbill (41).png";
import hornbillMusic42 from "@/assets/music/hornbill (42).png";
import hornbillMusic43 from "@/assets/music/hornbill (43).png";
import hornbillMusic44 from "@/assets/music/hornbill (44).png";
import hornbillMusic45 from "@/assets/music/hornbill (45).jpg";
import hornbillCulture1 from "@/assets/culture/hornbill (1).jpg";
import hornbillCulture2 from "@/assets/culture/hornbill (2).jpg";
import hornbillCulture3 from "@/assets/culture/hornbill (3).jpg";
import hornbillCulture4 from "@/assets/culture/hornbill (4).jpg";
import hornbillCulture5 from "@/assets/culture/hornbill (5).jpg";
import hornbillCulture6 from "@/assets/culture/hornbill (6).jpg";
import hornbillCulture7 from "@/assets/culture/hornbill (7).jpg";
import hornbillCulture8 from "@/assets/culture/hornbill (8).jpg";
import hornbillCulture9 from "@/assets/culture/hornbill (9).jpg";
import hornbillCulture10 from "@/assets/culture/hornbill (10).jpg";
import hornbillCulture11 from "@/assets/culture/hornbill (11).jpg";
import hornbillCulture12 from "@/assets/culture/hornbill (12).jpg";
import hornbillCulture13 from "@/assets/culture/hornbill (13).jpg";
import hornbillCulture14 from "@/assets/culture/hornbill (14).jpg";
import hornbillCulture15 from "@/assets/culture/hornbill (15).jpg";
import hornbillCulture16 from "@/assets/culture/hornbill (16).jpg";
import hornbillCulture17 from "@/assets/culture/hornbill (17).jpg";
import hornbillCulture18 from "@/assets/culture/hornbill (18).jpg";
import hornbillCulture19 from "@/assets/culture/hornbill (19).jpg";
import hornbillCulture20 from "@/assets/culture/hornbill (20).jpg";
import hornbillCulture21 from "@/assets/culture/hornbill (21).jpg";
import hornbillCulture22 from "@/assets/culture/hornbill (22).jpg";
import hornbillCulture23 from "@/assets/culture/hornbill (23).jpg";
import hornbillCulture24 from "@/assets/culture/hornbill (24).png";

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
  { id: 1, title: "Music", category: "Music", imageUrl: hornbillMusic0 },
  { id: 2, title: "Culture", category: "Culture", imageUrl: hornbillCulture1 },
  { id: 3, title: "Music", category: "Music", imageUrl: hornbillMusic01 },
  { id: 4, title: "Culture", category: "Culture", imageUrl: hornbillCulture2 },
  { id: 5, title: "Music", category: "Music", imageUrl: hornbillMusic02 },
  { id: 6, title: "Culture", category: "Culture", imageUrl: hornbillCulture3 },
  { id: 7, title: "Music", category: "Music", imageUrl: hornbillMusic03 },
  { id: 8, title: "Culture", category: "Culture", imageUrl: hornbillCulture4 },
  { id: 9, title: "Music", category: "Music", imageUrl: hornbillMusic04 },
  { id: 10, title: "Culture", category: "Culture", imageUrl: hornbillCulture5 },

  // MUSIC JPG (1–45)
  { id: 11, title: "Music", category: "Music", imageUrl: hornbillMusic1 },
  { id: 12, title: "Culture", category: "Culture", imageUrl: hornbillCulture6 },
  { id: 13, title: "Music", category: "Music", imageUrl: hornbillMusic2 },
  { id: 14, title: "Culture", category: "Culture", imageUrl: hornbillCulture7 },
  { id: 15, title: "Music", category: "Music", imageUrl: hornbillMusic3 },
  { id: 16, title: "Culture", category: "Culture", imageUrl: hornbillCulture8 },
  { id: 17, title: "Music", category: "Music", imageUrl: hornbillMusic4 },
  { id: 18, title: "Culture", category: "Culture", imageUrl: hornbillCulture9 },
  { id: 19, title: "Music", category: "Music", imageUrl: hornbillMusic5 },
  { id: 20, title: "Culture", category: "Culture", imageUrl: hornbillCulture10 },

  { id: 21, title: "Music", category: "Music", imageUrl: hornbillMusic6 },
  { id: 22, title: "Culture", category: "Culture", imageUrl: hornbillCulture11 },
  { id: 23, title: "Music", category: "Music", imageUrl: hornbillMusic7 },
  { id: 24, title: "Culture", category: "Culture", imageUrl: hornbillCulture12 },
  { id: 25, title: "Music", category: "Music", imageUrl: hornbillMusic8 },
  { id: 26, title: "Culture", category: "Culture", imageUrl: hornbillCulture13 },
  { id: 27, title: "Music", category: "Music", imageUrl: hornbillMusic9 },
  { id: 28, title: "Culture", category: "Culture", imageUrl: hornbillCulture14 },
  { id: 29, title: "Music", category: "Music", imageUrl: hornbillMusic10 },
  { id: 30, title: "Culture", category: "Culture", imageUrl: hornbillCulture15 },

  { id: 31, title: "Music", category: "Music", imageUrl: hornbillMusic11 },
  { id: 32, title: "Culture", category: "Culture", imageUrl: hornbillCulture16 },
  { id: 33, title: "Music", category: "Music", imageUrl: hornbillMusic12 },
  { id: 34, title: "Culture", category: "Culture", imageUrl: hornbillCulture17 },
  { id: 35, title: "Music", category: "Music", imageUrl: hornbillMusic13 },
  { id: 36, title: "Culture", category: "Culture", imageUrl: hornbillCulture18 },
  { id: 37, title: "Music", category: "Music", imageUrl: hornbillMusic14 },
  { id: 38, title: "Culture", category: "Culture", imageUrl: hornbillCulture19 },
  { id: 39, title: "Music", category: "Music", imageUrl: hornbillMusic15 },
  { id: 40, title: "Culture", category: "Culture", imageUrl: hornbillCulture20 },

  { id: 41, title: "Music", category: "Music", imageUrl: hornbillMusic16 },
  { id: 42, title: "Culture", category: "Culture", imageUrl: hornbillCulture21 },
  { id: 43, title: "Music", category: "Music", imageUrl: hornbillMusic17 },
  { id: 44, title: "Culture", category: "Culture", imageUrl: hornbillCulture22 },
  { id: 45, title: "Music", category: "Music", imageUrl: hornbillMusic18 },
  { id: 46, title: "Culture", category: "Culture", imageUrl: hornbillCulture23 },
  { id: 47, title: "Music", category: "Music", imageUrl: hornbillMusic19 },
  { id: 48, title: "Culture", category: "Culture", imageUrl: hornbillCulture24 },
  { id: 49, title: "Music", category: "Music", imageUrl: hornbillMusic20 },
  { id: 50, title: "Culture", category: "Culture", imageUrl: hornbillCulture1 },

  { id: 51, title: "Music", category: "Music", imageUrl: hornbillMusic21 },
  { id: 52, title: "Culture", category: "Culture", imageUrl: hornbillCulture2 },
  { id: 53, title: "Music", category: "Music", imageUrl: hornbillMusic22 },
  { id: 54, title: "Culture", category: "Culture", imageUrl: hornbillCulture3 },
  { id: 55, title: "Music", category: "Music", imageUrl: hornbillMusic23 },
  { id: 56, title: "Culture", category: "Culture", imageUrl: hornbillCulture4 },
  { id: 57, title: "Music", category: "Music", imageUrl: hornbillMusic24 },
  { id: 58, title: "Culture", category: "Culture", imageUrl: hornbillCulture5 },
  { id: 59, title: "Music", category: "Music", imageUrl: hornbillMusic25 },
  { id: 60, title: "Culture", category: "Culture", imageUrl: hornbillCulture6 },

  { id: 61, title: "Music", category: "Music", imageUrl: hornbillMusic26 },
  { id: 62, title: "Culture", category: "Culture", imageUrl: hornbillCulture7 },
  { id: 63, title: "Music", category: "Music", imageUrl: hornbillMusic27 },
  { id: 64, title: "Culture", category: "Culture", imageUrl: hornbillCulture8 },
  { id: 65, title: "Music", category: "Music", imageUrl: hornbillMusic28 },
  { id: 66, title: "Culture", category: "Culture", imageUrl: hornbillCulture9 },
  { id: 67, title: "Music", category: "Music", imageUrl: hornbillMusic29 },
  { id: 68, title: "Culture", category: "Culture", imageUrl: hornbillCulture10 },
  { id: 69, title: "Music", category: "Music", imageUrl: hornbillMusic30 },
  { id: 70, title: "Culture", category: "Culture", imageUrl: hornbillCulture11 },

  { id: 71, title: "Music", category: "Music", imageUrl: hornbillMusic31 },
  { id: 72, title: "Culture", category: "Culture", imageUrl: hornbillCulture12 },
  { id: 73, title: "Music", category: "Music", imageUrl: hornbillMusic32 },
  { id: 74, title: "Culture", category: "Culture", imageUrl: hornbillCulture13 },
  { id: 75, title: "Music", category: "Music", imageUrl: hornbillMusic33 },
  { id: 76, title: "Music", category: "Music", imageUrl: hornbillMusic34 },
  { id: 77, title: "Music", category: "Music", imageUrl: hornbillMusic35 },
  { id: 78, title: "Music", category: "Music", imageUrl: hornbillMusic36 },
  { id: 79, title: "Music", category: "Music", imageUrl: hornbillMusic37 },
  { id: 80, title: "Music", category: "Music", imageUrl: hornbillMusic38 },
  { id: 81, title: "Music", category: "Music", imageUrl: hornbillMusic39 },
  { id: 82, title: "Music", category: "Music", imageUrl: hornbillMusic40 },
  { id: 83, title: "Music", category: "Music", imageUrl: hornbillMusic41 },
  { id: 84, title: "Music", category: "Music", imageUrl: hornbillMusic42 },
  { id: 85, title: "Music", category: "Music", imageUrl: hornbillMusic43 },
  { id: 86, title: "Music", category: "Music", imageUrl: hornbillMusic44 },
  { id: 87, title: "Music", category: "Music", imageUrl: hornbillMusic45 },
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
