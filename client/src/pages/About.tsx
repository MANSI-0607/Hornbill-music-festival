
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Users, Award, Heart, Mountain, Mic } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import hero4 from '@/assets/hornbillMusic (4).jpg';
import tafma from '@/assets/tafma.jpg';
//import hornbill from '@/assets/music/hornbill (18).png';

const About = () => {
  // Animation refs
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: festivalSectionRef, isVisible: festivalSectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: tafmaSectionRef, isVisible: tafmaSectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: missionRef, isVisible: missionVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: initiativesRef, isVisible: initiativesVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { elementRef: culminationRef, isVisible: culminationVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.3 });

  return (
    <div className="min-h-screen bg-background pb-8 md:pb-16">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`relative py-12 md:py-20 overflow-hidden transition-all duration-1000 ${
          heroVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
        }`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 md:opacity-30"
          style={{
            backgroundImage: `url("${hero4}")`
          }}
        />
        <div className="absolute inset-0 festival-bg opacity-30 md:opacity-40"></div>
        <div className="relative mobile-container text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-righteous festival-title mb-4 md:mb-6">
            About Us
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Celebrating the rich musical heritage of Nagaland and empowering local artists
          </p>
        </div>
      </section>

      {/* About Hornbill Music Festival */}
      <section 
        ref={festivalSectionRef}
        className={`py-12 md:py-16 transition-all duration-1000 ${
          festivalSectionVisible ? 'scroll-slide-left visible' : 'scroll-slide-left'
        }`}
      >
        <div className="mobile-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-righteous festival-title mb-4 md:mb-6">
                About the Hornbill Music Festival
              </h2>
              <div className="space-y-4 md:space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  The Hornbill Music Festival emerged from the heart of Nagaland's cultural landscape, born during the grand celebration of the Hornbill Festival. Named after the revered hornbill bird that holds deep significance in Naga folklore, this festival represents the soaring spirit of musical expression that defines our tribal heritage.
                </p>
                <p>
                  Set against the breathtaking backdrop of Nagaland's rolling hills and heritage village, the festival serves as a bridge between generations—honoring the ancient melodies passed down through oral tradition while embracing contemporary sounds that reflect our evolving identity.
                </p>
                <p className="hidden md:block">
                  The festival celebrates not just music, but the stories, struggles, and triumphs of the Naga tribes, showcasing how cultural preservation and artistic innovation can coexist harmoniously. It's where the hills truly sing, echoing with voices that have shaped our musical landscape for centuries.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden neon-glow-purple">
                <img 
                  src="https://res.cloudinary.com/dwznqrjgg/image/upload/v1757341209/hornbill-bands/1757341187701-hornbill%20%2818%29.png.png"
                  alt="Hornbill Music Festival"
                  className="w-full h-full object-cover"
                />
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* About TaFMA */}
      <section 
        ref={tafmaSectionRef}
        className={`py-12 md:py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 transition-all duration-1000 ${
          tafmaSectionVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
        }`}
      >
        <div className="mobile-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-righteous festival-title mb-4 md:mb-6">
              About TaFMA
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Task Force for Music & Arts
            </p>
          </div>

          {/* Mission */}
          <div 
            ref={missionRef}
            className={`mb-12 md:mb-16 transition-all duration-800 ${
              missionVisible ? 'scroll-scale visible' : 'scroll-scale'
            }`}
          >
            <Card className="festival-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                  <Heart className="text-pink-500" size={24} />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  The Task Force for Music & Arts (TaFMA) is dedicated to nurturing and promoting the rich musical traditions of Nagaland while supporting contemporary artists in their creative journey.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Stats */}
          <div 
            ref={statsRef}
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 transition-all duration-1000 ${
              statsVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
            }`}
          >
            <Card className={`festival-card text-center transition-all duration-700 ${
              statsVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6 md:pt-8">
                <Users className="mx-auto text-pink-500 mb-3 md:mb-4" size={32} />
                <h3 className="text-2xl md:text-3xl font-righteous text-white mb-2">200+</h3>
                <p className="text-gray-300 text-sm md:text-base">Local Musicians Empowered</p>
              </CardContent>
            </Card>
            <Card className={`festival-card text-center transition-all duration-700 ${
              statsVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6 md:pt-8">
                <Music className="mx-auto text-purple-500 mb-3 md:mb-4" size={32} />
                <h3 className="text-2xl md:text-3xl font-righteous text-white mb-2">17</h3>
                <p className="text-gray-300 text-sm md:text-base">Naga Tribes Documented</p>
              </CardContent>
            </Card>
            <Card className={`festival-card text-center transition-all duration-700 ${
              statsVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.3s' }}>
              <CardContent className="pt-6 md:pt-8">
                <Award className="mx-auto text-orange-500 mb-3 md:mb-4" size={32} />
                <h3 className="text-2xl md:text-3xl font-righteous text-white mb-2">∞</h3>
                <p className="text-gray-300 text-sm md:text-base">Cultural Exchange Platforms</p>
              </CardContent>
            </Card>
          </div>

          {/* About TaFMA Description */}
          <div 
            ref={descriptionRef}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 transition-all duration-1000 ${
              descriptionVisible ? 'scroll-slide-right visible' : 'scroll-slide-right'
            }`}
          >
            <div className="order-2 lg:order-1">
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 md:mb-6">
                TaFMA was established with the vision of creating a sustainable ecosystem for music and arts in Nagaland. We work closely with tribal elders to document and preserve traditional songs, while also providing modern recording facilities and training for young artists.
              </p>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Through partnerships with institutions and festivals across India and internationally, we've helped Naga musicians share their unique sound with the world.
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-video rounded-2xl overflow-hidden neon-glow-orange">
                <img 
                  src={tafma}
                  alt="TaFMA Recording Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Our Initiatives */}
          <div 
            ref={initiativesRef}
            className={`transition-all duration-1000 ${
              initiativesVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-righteous festival-title mb-6 md:mb-8 text-center">
              Our Initiatives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className={`festival-card transition-all duration-700 ${
                initiativesVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.1s' }}>
                <CardContent className="pt-4 md:pt-6">
                  <Mic className="text-pink-500 mb-3 md:mb-4" size={28} />
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2">Artist Residency Programs</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Providing space and resources for artists to create and collaborate</p>
                </CardContent>
              </Card>
              <Card className={`festival-card transition-all duration-700 ${
                initiativesVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.2s' }}>
                <CardContent className="pt-4 md:pt-6">
                  <Music className="text-purple-500 mb-3 md:mb-4" size={28} />
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2">Cultural Documentation</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Preserving traditional songs and musical heritage for future generations</p>
                </CardContent>
              </Card>
              <Card className={`festival-card transition-all duration-700 ${
                initiativesVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.3s' }}>
                <CardContent className="pt-4 md:pt-6">
                  <Award className="text-orange-500 mb-3 md:mb-4" size={28} />
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2">Production Workshops</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Modern music production training and state-of-the-art facilities</p>
                </CardContent>
              </Card>
              <Card className={`festival-card transition-all duration-700 ${
                initiativesVisible ? 'animate-stagger-fade-in' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.4s' }}>
                <CardContent className="pt-4 md:pt-6">
                  <Heart className="text-teal-500 mb-3 md:mb-4" size={28} />
                  <h4 className="text-base md:text-lg font-semibold text-white mb-2">Community Outreach</h4>
                  <p className="text-gray-400 text-xs md:text-sm">Bringing music education to remote villages across Nagaland</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Festival Culmination */}
      <section 
        ref={culminationRef}
        className={`py-12 md:py-16 transition-all duration-1000 ${
          culminationVisible ? 'scroll-scale visible' : 'scroll-scale'
        }`}
      >
        <div className="mobile-container text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-3xl md:text-4xl font-righteous festival-title mb-6 md:mb-8">
              The Hornbill Music Festival
            </h3>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              The Hornbill Music Festival represents the culmination of our year-round efforts—a celebration where traditional and contemporary artists come together to showcase the incredible diversity and depth of Nagaland's musical heritage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
