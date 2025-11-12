import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  category: string;
  gradient: string;
  tags?: string[];
  imageUrl: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  initialIndex?: number;
}

const GalleryModal = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: GalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const minSwipeDistance = 50;

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "Escape") onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  // Touch event handlers
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

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 bg-black/95 border-gray-800 [&>button]:hidden">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
          <h2 className="font-righteous text-lg md:text-xl text-white flex-1 pr-4">
            {currentImage.title}
          </h2>
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-sm text-gray-300 whitespace-nowrap">
              {currentIndex + 1} / {images.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 flex-shrink-0"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Navigation Buttons - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-festival-blue/10 w-10 h-10 md:w-12 md:h-12 z-30 bg-black/20 backdrop-blur-sm border border-festival-blue/20"
              onClick={goToPrevious}
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-festival-blue/10 w-10 h-10 md:w-12 md:h-12 z-30 bg-black/20 backdrop-blur-sm border border-festival-blue/20"
              onClick={goToNext}
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </Button>
          </>
        )}

        {/* Main Image with Touch Support */}
        <div
          className="relative w-full h-full flex items-center justify-center p-0 md:p-16"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
              isZoomed
                ? "w-full h-full"
                : "w-full h-[400px] md:w-4/5 md:h-[390px] max-w-4xl"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* Actual Image */}
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 md:px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm font-medium border border-festival-blue/30 text-white/90">
                  {currentImage.category}
                </span>
                <div className="flex gap-1 md:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(!isZoomed);
                    }}
                    className="text-white hover:bg-white/10 p-1 md:p-2"
                  >
                    {isZoomed ? (
                      <ZoomOut size={14} className="md:w-4 md:h-4" />
                    ) : (
                      <ZoomIn size={14} className="md:w-4 md:h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-gray-200 text-xs md:text-sm leading-relaxed">
                {currentImage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip - Hidden on mobile to save space */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl hidden md:block z-20">
            <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all duration-200 ${
                    index === currentIndex
                      ? "ring-2 ring-festival-orange opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
