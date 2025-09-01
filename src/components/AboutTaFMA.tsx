import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Users, Award, Heart, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Link } from 'react-router-dom';
import tafma from '@/assets/tafma.jpg';

const AboutTaFMA = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });
  const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section 
      ref={sectionRef}
      className={`py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-righteous festival-title mb-4">
            About TaFMA
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Task Force for Music & Arts - Nurturing Nagaland's musical heritage
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              The Task Force for Music & Arts (TaFMA) is dedicated to preserving and promoting the rich musical traditions of Nagaland while supporting contemporary artists in their creative journey.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Through partnerships with institutions and festivals, we help Naga musicians share their unique sound with the world while documenting traditional songs for future generations.
            </p>
            <Link to="/about">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Learn More about TaFMA
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-700/50">
              <img 
                src={tafma}
                alt="TaFMA Recording Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div 
          ref={cardsRef}
          className={`grid md:grid-cols-4 gap-6 transition-all duration-1000 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="bg-card/50 backdrop-blur-md border border-gray-700/50 text-center">
            <CardContent className="pt-6">
              <Users className="mx-auto text-pink-500 mb-4" size={32} />
              <h4 className="text-2xl font-righteous text-white mb-2">200+</h4>
              <p className="text-muted-foreground text-sm">Local Musicians Empowered</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-md border border-gray-700/50 text-center">
            <CardContent className="pt-6">
              <Music className="mx-auto text-purple-500 mb-4" size={32} />
              <h4 className="text-2xl font-righteous text-white mb-2">17</h4>
              <p className="text-muted-foreground text-sm">Naga Tribes Documented</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-md border border-gray-700/50 text-center">
            <CardContent className="pt-6">
              <Award className="mx-auto text-orange-500 mb-4" size={32} />
              <h4 className="text-2xl font-righteous text-white mb-2">∞</h4>
              <p className="text-muted-foreground text-sm">Cultural Exchange Platforms</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-md border border-gray-700/50 text-center">
            <CardContent className="pt-6">
              <Heart className="mx-auto text-teal-500 mb-4" size={32} />
              <h4 className="text-2xl font-righteous text-white mb-2">Year-round</h4>
              <p className="text-muted-foreground text-sm">Community Programs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutTaFMA;
