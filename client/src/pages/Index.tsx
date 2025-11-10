
import React from 'react';
import { Navigation } from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedSection from '@/components/FeaturedSection';
import AboutTaFMA from '@/components/AboutTaFMA';
//import Sponsors from '@/components/Sponsors';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// import FestivalExperience from '@/components/FestivalExperience';
// import FestivalThemeSong from '@/components/FestivalThemeSong';
// import FestivalGallery from '@/components/FestivalGallery';
import MediaPanel from '@/components/Media';

const Index = () => {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLElement>();
  const { elementRef: featuredRef, isVisible: featuredVisible } = useScrollAnimation<HTMLElement>();
  const { elementRef: aboutRef, isVisible: aboutVisible } = useScrollAnimation<HTMLElement>();
  const { elementRef: sponsorsRef, isVisible: sponsorsVisible } = useScrollAnimation<HTMLElement>();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section 
          ref={heroRef}
          className={`transition-all duration-1000 ${
            heroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <HeroSection />
        </section>
        
        <section 
          ref={featuredRef}
          className={`transition-all duration-1000 ${
            featuredVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <FeaturedSection />
          {/* <FestivalExperience />
          <FestivalThemeSong />
          <FestivalGallery /> */}
        </section>

        <section 
          ref={aboutRef}
          className={`transition-all duration-1000 ${
            aboutVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
           <MediaPanel
      youtubeId="Uzt5_n0vchU"
      articles={[
        { title: "TaFMA announces 26th Toyota Hornbill Music Festival 2025", url: "https://www.easternmirrornagaland.com/tafma-announces-26th-toyota-hornbill-music-festival-2025-to-feature-several-new-initiatives" },
        { title: "Toyota Hornbill Music Festival 2025 set to showcase collaborations", url: "https://nagalandtribune.in/toyota-hornbill-music-festival-2025-set-to-showcase-international-collaborations-local-talent-and-inclusivity/" },
        { title: "Nagaland: TaFMA announces Toyota Hornbill Music Fest 2025", url: "https://nagalandpost.com/nagaland-tafma-announces-toyota-hornbill-music-fest-2025/" },
      ]}
    />
          <AboutTaFMA />
        </section>

        {/* <section 
          ref={sponsorsRef}
          className={`transition-all duration-1000 ${
            sponsorsVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <Sponsors />
        </section> */}
      </main>
    </div>
  );
};

export default Index;
