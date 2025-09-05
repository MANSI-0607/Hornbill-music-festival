import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Award, Heart, Mountain, Mic } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import hero4 from "@/assets/hornbillMusic (4).jpg";
import tafma from "@/assets/tafma.jpg";
import hornbill from "@/assets/music/hornbill (18).png";
import aboutTafmaBanner from "@/assets/banners/aboutTafmaBanner.png";

const About = () => {
  // Animation refs
  const { elementRef: heroRef, isVisible: heroVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: festivalSectionRef, isVisible: festivalSectionVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: tafmaSectionRef, isVisible: tafmaSectionVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: missionRef, isVisible: missionVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: statsRef, isVisible: statsVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: descriptionRef, isVisible: descriptionVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: initiativesRef, isVisible: initiativesVisible } =
    useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { elementRef: culminationRef, isVisible: culminationVisible } =
    useScrollAnimation<HTMLElement>({ threshold: 0.3 });

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8 md:pb-16 text-[#1E293B]">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative pt-32 pb-20 overflow-hidden bg-[#0A2342] text-white transition-all duration-1000 ${
          heroVisible ? "scroll-fade-in visible" : "scroll-fade-in"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url("${hero4}")`,
          }}
        />
        <div className="relative mobile-container text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-righteous text-[#FFD700] mb-4 md:mb-6">
            About Us
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed px-2">
            Celebrating the rich musical heritage of Nagaland and empowering
            local artists
          </p>
        </div>
      </section>

      {/* About Hornbill Music Festival */}
      <section
        ref={festivalSectionRef}
        className={`py-12 md:py-16 transition-all duration-1000 ${
          festivalSectionVisible ? "scroll-slide-left visible" : "scroll-slide-left"
        }`}
        style={{
          background: "radial-gradient(circle, rgba(255, 92, 205, 0.98) 21%, rgba(255, 20, 147, 1) 82%)",
        }}
      >
        <div className="mobile-container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-righteous text-[#FFD700] mb-4 md:mb-6">
                About the Hornbill Music Festival
              </h2>
              <div className="space-y-4 md:space-y-6 text-[#1E293B] text-base md:text-lg leading-relaxed">
                <p>
                  The Hornbill Music Festival emerged from the heart of
                  Nagaland's cultural landscape, born during the grand
                  celebration of the Hornbill Festival. Named after the revered
                  hornbill bird that holds deep significance in Naga folklore,
                  this festival represents the soaring spirit of musical
                  expression that defines our tribal heritage.
                </p>
                <p>
                  Set against the breathtaking backdrop of Nagaland's rolling
                  hills and heritage village, the festival serves as a bridge
                  between generations—honoring the ancient melodies passed down
                  through oral tradition while embracing contemporary sounds
                  that reflect our evolving identity.
                </p>
                <p className="hidden md:block">
                  The festival celebrates not just music, but the stories,
                  struggles, and triumphs of the Naga tribes, showcasing how
                  cultural preservation and artistic innovation can coexist
                  harmoniously. It's where the hills truly sing, echoing with
                  voices that have shaped our musical landscape for centuries.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-[#FFD700]">
                <img
                  src={hornbill}
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
  className={`relative overflow-hidden py-12 md:py-16 text-white transition-all duration-1000 ${
    tafmaSectionVisible ? "scroll-fade-in visible" : "scroll-fade-in"
  }`}
>
  {/* Section-wide background banner and overlay */}
  <div
    className="absolute inset-0 -z-10 bg-cover bg-center opacity-80"
    style={{ backgroundImage: `url("${aboutTafmaBanner}")` }}
  />
  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0A2342]/60 via-[#0A2342]/40 to-transparent" />

  <div className="mobile-container">
    {/* Title */}
    <div className="text-center mb-12 md:mb-16">
      <h2 className="text-4xl md:text-5xl font-righteous text-[#FFD700] mb-4 md:mb-6 drop-shadow-lg">
        About TaFMA
      </h2>
      <p className="text-xl md:text-2xl text-[#f8f8ff] max-w-3xl mx-auto px-2">
        Task Force for Music & Arts
      </p>
    </div>

    {/* Mission */}
    <div
      ref={missionRef}
      className={`mb-8 md:mb-12 transition-all duration-800 ${
        missionVisible ? "animate-fade-in-up visible" : "animate-fade-in-up"
      }`}
    >
      <Card className="bg-white/10 backdrop-blur-md border border-white/30 shadow-xl text-white rounded-2xl">
        <CardHeader className="py-4 md:py-5">
          <CardTitle className="flex items-center gap-3 text-lg md:text-xl text-[#FFD700]">
            <Heart className="text-[#E91E63]" size={22} />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-5 md:pb-6">
          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            The Task Force for Music & Arts (TaFMA) is dedicated to nurturing
            and promoting the rich musical traditions of Nagaland while
            supporting contemporary artists in their creative journey.
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Impact Stats */}
    <div
      ref={statsRef}
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14 transition-all duration-1000 ${
        statsVisible ? "scroll-fade-in visible" : "scroll-fade-in"
      }`}
    >
      <Card
        className={`bg-white/10 backdrop-blur-md border border-white/30 text-center transition-all duration-700 shadow-xl text-white rounded-2xl ${
          statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        <CardContent className="pt-5 md:pt-6 pb-5">
          <Users className="mx-auto text-[#E91E63] mb-3 md:mb-4" size={32} />
          <h3 className="text-xl md:text-2xl font-righteous text-white mb-1">
            200+
          </h3>
          <p className="text-white/90 text-xs md:text-sm">
            Local Musicians Empowered
          </p>
        </CardContent>
      </Card>
      <Card
        className={`bg-white/10 backdrop-blur-md border border-white/30 text-center transition-all duration-700 shadow-xl text-white rounded-2xl ${
          statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <CardContent className="pt-5 md:pt-6 pb-5">
          <Music className="mx-auto text-[#00B8D9] mb-3 md:mb-4" size={32} />
          <h3 className="text-xl md:text-2xl font-righteous text-white mb-1">
            17
          </h3>
          <p className="text-white/90 text-xs md:text-sm">
            Naga Tribes Documented
          </p>
        </CardContent>
      </Card>
      <Card
        className={`bg-white/10 backdrop-blur-md border border-white/30 text-center transition-all duration-700 shadow-xl text-white rounded-2xl ${
          statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ animationDelay: "0.3s" }}
      >
        <CardContent className="pt-5 md:pt-6 pb-5">
          <Award className="mx-auto text-[#FFD700] mb-3 md:mb-4" size={32} />
          <h3 className="text-xl md:text-2xl font-righteous text-white mb-1">
            ∞
          </h3>
          <p className="text-white/90 text-xs md:text-sm">
            Cultural Exchange Platforms
          </p>
        </CardContent>
      </Card>
    </div>

    {/* About TaFMA Description */}
    <div
      ref={descriptionRef}
      className={`relative rounded-2xl overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md p-6 md:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16 transition-all duration-1000 ${
        descriptionVisible ? "animate-fade-in-up visible" : "animate-fade-in-up"
      }`}
    >

      <div className="order-2 lg:order-1">
        <p className="text-white/90 text-base md:text-lg leading-relaxed mb-4 md:mb-6 drop-shadow-sm">
          TaFMA was established with the vision of creating a sustainable
          ecosystem for music and arts in Nagaland. We work closely with tribal
          elders to document and preserve traditional songs, while also providing
          modern recording facilities and training for young artists.
        </p>
        <p className="text-white/90 text-base md:text-lg leading-relaxed drop-shadow-sm">
          Through partnerships with institutions and festivals across India and
          internationally, we've helped Naga musicians share their unique sound
          with the world.
        </p>
      </div>
      <div className="relative order-1 lg:order-2">
        <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white/60">
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
        initiativesVisible ? "scroll-fade-in visible" : "scroll-fade-in"
      }`}
    >
      <h3 className="text-2xl md:text-3xl font-righteous text-[#FFD700] mb-5 md:mb-6 text-center drop-shadow-lg">
        Our Initiatives
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        <Card
          className={`bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] text-white rounded-2xl ${
            initiativesVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5 text-center">
            <Mic className="text-[#E91E63] mb-3 md:mb-4 mx-auto" size={28} />
            <h4 className="text-sm md:text-base font-semibold text-white mb-1">
              Artist Residency Programs
            </h4>
            <p className="text-white/90 text-xs">
              Providing space and resources for artists to create and collaborate
            </p>
          </CardContent>
        </Card>
        <Card
          className={`bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] text-white rounded-2xl ${
            initiativesVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5 text-center">
            <Music className="text-[#00B8D9] mb-3 md:mb-4 mx-auto" size={28} />
            <h4 className="text-sm md:text-base font-semibold text-white mb-1">
              Cultural Documentation
            </h4>
            <p className="text-white/90 text-xs">
              Preserving traditional songs and musical heritage for future
              generations
            </p>
          </CardContent>
        </Card>
        <Card
          className={`bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] text-white rounded-2xl ${
            initiativesVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5 text-center">
            <Award className="text-[#FFD700] mb-3 md:mb-4 mx-auto" size={28} />
            <h4 className="text-sm md:text-base font-semibold text-white mb-1">
              Production Workshops
            </h4>
            <p className="text-white/90 text-xs">
              Modern music production training and state-of-the-art facilities
            </p>
          </CardContent>
        </Card>
        <Card
          className={`bg-white/10 backdrop-blur-md border border-white/30 transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] text-white rounded-2xl ${
            initiativesVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ animationDelay: "0.4s" }}
        >
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5 text-center">
            <Heart className="text-[#f2003c] mb-3 md:mb-4 mx-auto" size={28} />
            <h4 className="text-sm md:text-base font-semibold text-white mb-1">
              Community Outreach
            </h4>
            <p className="text-white/90 text-xs">
              Bringing music education to remote villages across Nagaland
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</section>


      {/* Festival Culmination */}
      <section
        ref={culminationRef}
        className={`py-12 md:py-16 transition-all duration-1000  ${
          culminationVisible ? "scroll-scale visible" : "scroll-scale"
        }`}
      >
        <div className="mobile-container text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-3xl md:text-4xl font-righteous text-[#FFD700] mb-6 md:mb-8">
              The Hornbill Music Festival
            </h3>
            <p className="text-lg md:text-xl text-[#1E293B] leading-relaxed">
              The Hornbill Music Festival represents the culmination of our
              year-round efforts—a celebration where traditional and
              contemporary artists come together to showcase the incredible
              diversity and depth of Nagaland's musical heritage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
