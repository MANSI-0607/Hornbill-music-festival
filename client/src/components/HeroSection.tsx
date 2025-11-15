// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Ticket } from 'lucide-react';
// import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// import { Link } from 'react-router-dom';

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";

// const HeroSection = () => {
//   const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation<HTMLDivElement>();

//   const carouselSlides = [
//     {
//       id: 1,
//       title: "INDIA'S BIGGEST",
//       subtitle: "MUSIC FESTIVAL",
//       description: "TICKETS ARE LIVE NOW",
//       backgroundImage: "https://res.cloudinary.com/dwznqrjgg/image/upload/v1762756812/HMF_25_lc_l6qjf4.jpg",
//       primaryAction: { text: "Book Tickets", icon: Ticket, link: "https://www.ahibi.in" }
//     },
//   ];

//   return (
//   <section className="relative min-h-[65vh] md:min-h-screen overflow-hidden -mt-4 md:-mt-6">

//       <Carousel
//         className="w-full min-h-[65vh] md:min-h-screen"
//         plugins={[
//           Autoplay({
//             delay: 4000,
//             stopOnInteraction: true,
//           }),
//         ]}
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//       >
//         <CarouselContent>
//           {carouselSlides.map((slide) => (
//             <CarouselItem key={slide.id}>
//               <div className="relative min-h-[65vh] md:min-h-screen flex items-center justify-center">
//                 {/* Background Image */}
//                 <div className="absolute inset-0 w-full h-full">
//                   <div
//                     className="w-full h-full bg-cover bg-center bg-no-repeat"
//                     style={{
//                       backgroundImage: `url("${slide.backgroundImage.replace('/upload/', '/upload/f_auto,q_auto:best,dpr_auto/')}")`
//                     }}
//                   />
//                 </div>

//                 {/* Animated Background Overlay */}
//                 <div className="absolute inset-0 festival-bg opacity-60"></div>

//                 {/* Dark Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80">
//                   <div
//                     className="absolute inset-0 opacity-30"
//                     style={{
//                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//                     }}
//                   />
//                 </div>

//                 {/* Content */}
//                 <div
//                   className="relative z-10 text-center px-4 max-w-6xl mx-auto w-full
//                              mt-24 sm:mt-0 transform sm:translate-y-[-10%] md:translate-y-[-15%]
//                              pb-32 sm:pb-0"
//                 >
//                   <div className="animate-fade-in">
//                   <h1 className="font-righteous text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight">
//                       <span className="block festival-title neon-text">{slide.title}</span>
//                       <span className="block text-white">{slide.subtitle}</span>
//                     </h1>

//   {/* <div className="relative inline-block">
//   <p className="absolute inset-0 text-2xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider pointer-events-none"
//      style={{
//        color: '#ffffff',
//        filter: 'blur(1px)', 
//        WebkitTextStroke: '0', 
//        textShadow:
//          '-1px 0 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, 0 1px 0 #fff, -0.5px -0.5px 0 #fff, 0.5px 0.5px 0 #fff'
//      }}>
//     {slide.description}
//   </p>

//   <p className="relative text-2xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wider"
//      style={{ color: '#6b21a8' }}>
//     {slide.description}
//   </p>
// </div> */}



//                     <div className="flex justify-center items-center mt-8 mb-8 md:mb-12">
//                       {slide.primaryAction.link.startsWith('http') ? (
//                         <a
//                           href={slide.primaryAction.link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-full sm:w-auto"
//                         >
//                           <Button className="btn-festival text-base sm:text-lg px-8 py-4 w-full sm:w-auto">
//                             {slide.primaryAction.icon && <slide.primaryAction.icon className="mr-2" size={18} />}
//                             {slide.primaryAction.text}
//                           </Button>
//                         </a>
//                       ) : (
//                         <Link to={slide.primaryAction.link} className="w-full sm:w-auto">
//                           <Button className="btn-festival text-base sm:text-lg px-8 py-4 w-full sm:w-auto">
//                             {slide.primaryAction.icon && <slide.primaryAction.icon className="mr-2" size={18} />}
//                             {slide.primaryAction.text}
//                           </Button>
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//       </Carousel>
//         {/* Festival Stats */}
//       <div className="absolute bottom-4 md:bottom-8 left-0 right-0 z-20 px-4 ">
//         <div
//           ref={statsRef}
//           className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-6xl mx-auto transition-all duration-1000 ${
//             statsVisible
//               ? 'opacity-100 translate-y-0'
//               : 'opacity-0 translate-y-12'
//           }`}
//         >
//           {/* Legacy */}
//           <div
//             className={`festival-card text-center transition-all duration-700 py-2 px-1 sm:py-3 md:py-4 ${
//               statsVisible ? 'animate-scale-in' : ''
//             }`}
//             style={{ animationDelay: statsVisible ? '0ms' : '0ms' }}
//           >
//             <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neon-pink mb-1">25</div>
//             <div className="text-gray-400 text-xs sm:text-sm md:text-base">Years of Festival Legacy</div>
//           </div>

//           {/* Days of Music */}
//           <div
//             className={`festival-card text-center transition-all duration-700 py-2 px-1 sm:py-3 md:py-4 ${
//               statsVisible ? 'animate-scale-in' : ''
//             }`}
//             style={{ animationDelay: statsVisible ? '150ms' : '0ms' }}
//           >
//             <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neon-purple mb-1">10</div>
//             <div className="text-gray-400 text-xs sm:text-sm md:text-base">Days of Music & Culture</div>
//           </div>

//           {/* Artistes */}
//           <div
//             className={`festival-card text-center transition-all duration-700 py-2 px-1 sm:py-3 md:py-4 ${
//               statsVisible ? 'animate-scale-in' : ''
//             }`}
//             style={{ animationDelay: statsVisible ? '300ms' : '0ms' }}
//           >
//             <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-electric-orange mb-1">800+</div>
//             <div className="text-gray-400 text-xs sm:text-sm md:text-base">Artists</div>
//           </div>

//           {/* Attendance */}
//           <div
//             className={`festival-card text-center transition-all duration-700 py-2 px-1 sm:py-3 md:py-4 ${
//               statsVisible ? 'animate-scale-in' : ''
//             }`}
//             style={{ animationDelay: statsVisible ? '450ms' : '0ms' }}
//           >
//             <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-cyber-teal mb-1">3,00,000+</div>
//             <div className="text-gray-400 text-xs sm:text-sm md:text-base">Attendance</div>
//           </div>
//         </div>
//       </div>
     
//     </section>
//   );
// };

// export default HeroSection;
// import React, { useState, useEffect } from "react";
// import hero from "/hero.jpg"
// import hero1 from "/hero1.jpg"

// const HeroSection = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [statsVisible, setStatsVisible] = useState(false);

//   // Hero images array - add more images here
//   const heroImages = [
//     {
//       desktop: "hero",
//       mobile: "https://res.cloudinary.com/dwznqrjgg/image/upload/v1762779683/HMF_25_Reel_on2m1n.jpg",
//       alt: "Hornbill Music Festival 2025"
//     },
   
//     {
//       desktop: "hero1",
//       mobile: "hero1",
//       alt: "Image description"
//     },
//   ];

//   // Auto-advance carousel every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroImages.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [heroImages.length]);

//   // Stats scroll animation observer
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setStatsVisible(true);
//           }
//         });
//       },
//       { threshold: 0.2 }
//     );

//     const statsElement = document.getElementById("stats-section");
//     if (statsElement) {
//       observer.observe(statsElement);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section className="w-full bg-black">
//       {/* HERO CAROUSEL SECTION */}
//       <div className="relative w-full flex items-center justify-center overflow-hidden bg-black">
//         {/* Carousel Images */}
//         {heroImages.map((image, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//             style={{ pointerEvents: index === currentSlide ? "auto" : "none" }}
//           >
//             <picture className="block w-full h-auto">
//               {/* Desktop (≥1024px) */}
//               <source media="(min-width:1024px)" srcSet={image.desktop} />
//               {/* Mobile (≤720px) */}
//               <source media="(max-width:720px)" srcSet={image.mobile} />

//               {/* Responsive Image */}
//               <img
//                 src={image.desktop}
//                 alt={image.alt}
//                 className="w-full h-auto block object-contain md:object-scale-down max-w-none"
//                 style={{
//                   width: "100vw",
//                   height: "auto",
//                   display: "block",
//                 }}
//               />
//             </picture>
//           </div>
//         ))}

//         {/* Carousel Indicators (only show if more than 1 image) */}
//         {heroImages.length > 1 && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
//             {heroImages.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                   index === currentSlide
//                     ? "bg-white w-8"
//                     : "bg-white/50 hover:bg-white/75"
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* STATS SECTION */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div
//           id="stats-section"
//           className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${
//             statsVisible
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 translate-y-6"
//           }`}
//         >
//           {/* Stat 1 */}
//           <div
//             className="text-center transition-all duration-700 py-3 bg-gray-900/50 rounded-lg"
//             style={{
//               transitionDelay: statsVisible ? "0ms" : "0ms",
//               transform: statsVisible ? "scale(1)" : "scale(0.9)",
//             }}
//           >
//             <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">
//               25
//             </div>
//             <div className="text-gray-400 text-sm md:text-base">
//               Years of Festival Legacy
//             </div>
//           </div>

//           {/* Stat 2 */}
//           <div
//             className="text-center transition-all duration-700 py-3 bg-gray-900/50 rounded-lg"
//             style={{
//               transitionDelay: statsVisible ? "150ms" : "0ms",
//               transform: statsVisible ? "scale(1)" : "scale(0.9)",
//             }}
//           >
//             <div className="text-3xl md:text-4xl font-bold text-pink-500 mb-1">
//               10
//             </div>
//             <div className="text-gray-400 text-sm md:text-base">
//               Days of Music &amp; Culture
//             </div>
//           </div>

//           {/* Stat 3 */}
//           <div
//             className="text-center transition-all duration-700 py-3 bg-gray-900/50 rounded-lg"
//             style={{
//               transitionDelay: statsVisible ? "300ms" : "0ms",
//               transform: statsVisible ? "scale(1)" : "scale(0.9)",
//             }}
//           >
//             <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
//               800+
//             </div>
//             <div className="text-gray-400 text-sm md:text-base">Artists</div>
//           </div>

//           {/* Stat 4 */}
//           <div
//             className="text-center transition-all duration-700 py-3 bg-gray-900/50 rounded-lg"
//             style={{
//               transitionDelay: statsVisible ? "450ms" : "0ms",
//               transform: statsVisible ? "scale(1)" : "scale(0.9)",
//             }}
//           >
//             <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-1">
//               3,00,000+
//             </div>
//             <div className="text-gray-400 text-sm md:text-base">Attendance</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection: React.FC = () => {
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images array - add more images here
  const heroImages = [
    {
      desktop: "/hero.jpg",
      mobile: "https://res.cloudinary.com/dwznqrjgg/image/upload/v1762779683/HMF_25_Reel_on2m1n.jpg",
      alt: "Hornbill Music Festival 2025"
    },
   
    {
      desktop: "/hero1.png",
      mobile: "hero1.png",
      alt: "Image description"
    },
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return; // Don't auto-advance if only 1 image
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="w-full bg-black">
      {/* HERO CAROUSEL SECTION */}
      <div className="relative w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`w-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            <picture className="block w-full h-auto">
              {/* Desktop (≥1024px) */}
              <source media="(min-width:1024px)" srcSet={image.desktop} />
              {/* Mobile (≤720px) */}
              <source media="(max-width:720px)" srcSet={image.mobile} />

              {/* Responsive Image */}
              <img
                src={image.desktop}
                alt={image.alt}
                className="
                  w-full
                  h-auto
                  block
                  object-contain
                  md:object-scale-down
                  max-w-none
                "
                style={{
                  width: "100vw",
                  height: "auto",
                  display: "block",
                }}
              />
            </picture>
          </div>
        ))}

        {/* Carousel Indicators (only show if more than 1 image) */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* STATS SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 ${
            statsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Stat 1 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "0ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-[#1e90ff] mb-1">
              25
            </div>
            <div className="text-gray-400 text-sm md:text-base">
              Years of Festival Legacy
            </div>
          </div>

          {/* Stat 2 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "150ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-pink mb-1">
              10
            </div>
            <div className="text-gray-400 text-sm md:text-base">
              Days of Music &amp; Culture
            </div>
          </div>

          {/* Stat 3 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "300ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-electric-orange mb-1">
              800+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Artists</div>
          </div>

          {/* Stat 4 */}
          <div
            className={`festival-card text-center transition-all duration-700 py-3 ${
              statsVisible ? "animate-scale-in" : ""
            }`}
            style={{ animationDelay: statsVisible ? "450ms" : "0ms" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-neon-purple mb-1">
              3,00,000+
            </div>
            <div className="text-gray-400 text-sm md:text-base">Attendance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;