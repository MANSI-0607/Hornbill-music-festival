
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Events = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: filtersRef, isVisible: filtersVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: eventsGridRef, isVisible: eventsGridVisible } = useScrollAnimation<HTMLDivElement>();
  
  const filters = ['All', 'Music', 'Workshops', 'Culture', 'Talks'];
  
  const events = [
    {
      id: 1,
      title: 'Opening Ceremony',
      category: 'Culture',
      date: 'Dec 1, 2024',
      time: '6:00 PM',
      venue: 'Main Stage',
      description: 'Grand opening with traditional Naga performances and international artists',
      image: '🎭',
      lineup: ['Traditional Dancers', 'International Artists'],
    },
    {
      id: 2,
      title: 'Rock Night',
      category: 'Music',
      date: 'Dec 2, 2024',
      time: '8:00 PM',
      venue: 'Rock Arena',
      description: 'High-energy rock performances from local and international bands',
      image: '🎸',
      lineup: ['Local Rock Bands', 'International Headliners'],
    },
    {
      id: 3,
      title: 'Traditional Music Workshop',
      category: 'Workshops',
      date: 'Dec 3, 2024',
      time: '2:00 PM',
      venue: 'Workshop Hall',
      description: 'Learn traditional Naga instruments and singing techniques',
      image: '🥁',
      lineup: ['Master Musicians', 'Cultural Experts'],
    },
    {
      id: 4,
      title: 'Folk Fusion Concert',
      category: 'Music',
      date: 'Dec 4, 2024',
      time: '7:00 PM',
      venue: 'Folk Stage',
      description: 'Modern interpretations of traditional Naga folk songs',
      image: '🎵',
      lineup: ['Folk Artists', 'Modern Musicians'],
    },
    {
      id: 5,
      title: 'Music Industry Talk',
      category: 'Talks',
      date: 'Dec 5, 2024',
      time: '11:00 AM',
      venue: 'Conference Hall',
      description: 'Panel discussion on the future of music in Northeast India',
      image: '🎤',
      lineup: ['Industry Experts', 'Successful Artists'],
    },
    {
      id: 6,
      title: 'Grand Finale',
      category: 'Music',
      date: 'Dec 5, 2024',
      time: '8:00 PM',
      venue: 'Main Stage',
      description: 'Epic closing ceremony with all featured artists',
      image: '🎆',
      lineup: ['All Festival Artists', 'Special Guests'],
    }
  ];

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Banner */}
          <div 
            ref={heroRef}
            className={`festival-bg rounded-3xl p-8 md:p-16 text-center mb-12 tribal-pattern transition-all duration-800 ${
              heroVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <h1 className="font-righteous text-4xl md:text-6xl mb-4">
              <span className="festival-title neon-text">Festival Events</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              5 Days of Music, Culture, and Celebration
            </p>
            <Button className="btn-festival text-lg px-8 py-4">
              🎟️ Book Event Tickets
            </Button>
          </div>

          {/* Filters */}
          <div 
            ref={filtersRef}
            className={`flex flex-wrap gap-4 justify-center mb-12 transition-all duration-800 ${
              filtersVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            {filters.map((filter, index) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white neon-glow-pink'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                } ${filtersVisible ? 'animate-fade-in' : ''}`}
                style={{
                  animationDelay: filtersVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div 
            ref={eventsGridRef}
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${
              eventsGridVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-16'
            }`}
          >
            {filteredEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className={`artist-card overflow-hidden group transition-all duration-700 ${
                  eventsGridVisible ? 'animate-scale-in' : 'opacity-0 scale-75'
                }`}
                style={{
                  animationDelay: eventsGridVisible ? `${index * 150}ms` : '0ms'
                }}
              >
                <CardContent className="p-0">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                    {event.image}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.category === 'Music' ? 'bg-pink-500/20 text-pink-400' :
                        event.category === 'Culture' ? 'bg-purple-500/20 text-purple-400' :
                        event.category === 'Workshops' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-teal-500/20 text-teal-400'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <h3 className="font-righteous text-xl mb-3 text-white group-hover:text-pink-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar size={16} className="mr-2 text-pink-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock size={16} className="mr-2 text-pink-400" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin size={16} className="mr-2 text-pink-400" />
                        {event.venue}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Users size={16} className="mr-2 text-pink-400" />
                        Lineup:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.lineup.map((artist, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="btn-festival w-full">
                      Book Now → ahibi.in
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;
