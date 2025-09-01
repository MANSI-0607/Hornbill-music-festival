import React, { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Star, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: filtersRef, isVisible: filtersVisible } = useScrollAnimation<HTMLDivElement>();
  const { elementRef: scheduleRef, isVisible: scheduleVisible } = useScrollAnimation<HTMLDivElement>();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to active tab when selectedDay changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(`[data-day="${selectedDay}"]`) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });
      }
    }
  }, [selectedDay]);

  const days = [
    { id: 1, date: 'Dec 1, 2024', day: 'Day 1' },
    { id: 2, date: 'Dec 2, 2024', day: 'Day 2' },
    { id: 3, date: 'Dec 3, 2024', day: 'Day 3' },
    { id: 4, date: 'Dec 4, 2024', day: 'Day 4' },
    { id: 5, date: 'Dec 5, 2024', day: 'Day 5' },
    { id: 6, date: 'Dec 6, 2024', day: 'Day 6' },
    { id: 7, date: 'Dec 7, 2024', day: 'Day 7' },
    { id: 8, date: 'Dec 8, 2024', day: 'Day 8' },
    { id: 9, date: 'Dec 9, 2024', day: 'Day 9' },
    { id: 10, date: 'Dec 10, 2024', day: 'Day 10' }
  ];

  const scheduleData = {
    1: [
      { id: 1, time: '12:00 Noon - 01:00 pm', title: 'Traditional Shot Put', venue: 'Amphitheatre, Kisama', agency: 'Youth Resources & Sports', type: 'sports', status: 'completed' },
      { id: 2, time: '03:00 pm - 08:00 pm', title: 'Hornbill Family Fun Fair', venue: 'Reempa Jotsoma (Science College Junction)', agency: 'Tourism Department', type: 'culture', status: 'completed', featured: true },
      { id: 3, time: '05:00 pm - 09:00 pm', title: 'Night Market', venue: 'BOC', agency: 'TYO', type: 'food', status: 'live' },
      { id: 4, time: '05:00 pm - 09:00 pm', title: 'Night Market', venue: 'Kezieke - New Secretariat Junction', agency: 'LYO', type: 'food', status: 'upcoming' },
      { id: 5, time: '05:00 pm - 09:00 pm', title: 'Night Carnival', venue: 'Kohima Town', agency: 'KCCI', type: 'entertainment', status: 'upcoming', featured: true }
    ],
    2: [
      { id: 6, time: '10:00 am - 12:00 pm', title: 'Morning Cultural Parade', venue: 'Main Road, Kisama', agency: 'Cultural Affairs', type: 'culture', status: 'upcoming' },
      { id: 7, time: '02:00 pm - 04:00 pm', title: 'Rock Fusion Concert', venue: 'Rock Arena', agency: 'Music Association', type: 'music', status: 'upcoming', featured: true },
      { id: 8, time: '03:30 pm - 05:30 pm', title: 'Traditional Instrument Workshop', venue: 'Workshop Hall', agency: 'Heritage Foundation', type: 'workshop', status: 'upcoming' },
      { id: 9, time: '06:00 pm - 09:00 pm', title: 'International Artist Showcase', venue: 'Main Stage', agency: 'Festival Committee', type: 'music', status: 'upcoming', featured: true },
      { id: 10, time: '06:00 pm onwards', title: 'Hornbill Busking', venue: 'Kohima Night Bazaar', agency: 'Street Artists Collective', type: 'music', status: 'upcoming' }
    ],
    3: [
      { id: 11, time: '10:30 am - 12:30 pm', title: 'Youth Band Competition', venue: 'Youth Stage', agency: 'Youth Development', type: 'competition', status: 'upcoming' },
      { id: 12, time: '02:00 pm - 04:00 pm', title: 'Folk Fusion Collaborative Session', venue: 'Folk Stage', agency: 'Folk Music Society', type: 'music', status: 'upcoming', featured: true },
      { id: 13, time: '04:30 pm - 06:00 pm', title: 'Storytelling Circle', venue: 'Cultural Tent', agency: 'Oral Tradition Society', type: 'culture', status: 'upcoming' },
      { id: 14, time: '07:00 pm - 10:00 pm', title: 'Headliner Concert Night', venue: 'Main Stage', agency: 'Festival Committee', type: 'music', status: 'upcoming', featured: true },
      { id: 15, time: '10:00 pm onwards', title: 'Acoustic Campfire Sessions', venue: 'Campfire Area', agency: 'Independent Artists', type: 'music', status: 'upcoming' }
    ],
    4: [
      { id: 16, time: '12:00 pm - 02:00 pm', title: 'Cultural Documentary Screening', venue: 'Cinema Tent', agency: 'Film Society', type: 'film', status: 'upcoming' },
      { id: 17, time: '02:30 pm - 05:00 pm', title: 'Battle of the Bands', venue: 'Competition Stage', agency: 'Music Promoters', type: 'competition', status: 'upcoming', featured: true },
      { id: 18, time: '05:00 pm - 07:00 pm', title: 'Traditional Cuisine Masterclass', venue: 'Culinary Stage', agency: 'Chef Association', type: 'workshop', status: 'upcoming' },
      { id: 19, time: '07:30 pm - 10:00 pm', title: 'Gospel & Spiritual Music Night', venue: 'Main Stage', agency: 'Church Music Ministry', type: 'music', status: 'upcoming', featured: true },
      { id: 20, time: '09:30 pm onwards', title: 'Silent Disco Under the Stars', venue: 'Open Field', agency: 'Event Organizers', type: 'music', status: 'upcoming' }
    ],
    5: [
      { id: 21, time: '11:00 am - 01:00 pm', title: 'Poetry & Spoken Word', venue: 'Literary Stage', agency: 'Writers Guild', type: 'culture', status: 'upcoming' },
      { id: 22, time: '03:00 pm - 06:00 pm', title: 'Electronic Music Showcase', venue: 'Electronic Stage', agency: 'DJ Collective', type: 'music', status: 'upcoming', featured: true },
      { id: 23, time: '06:00 pm - 08:00 pm', title: 'Traditional Craft Workshop', venue: 'Craft Hall', agency: 'Artisan Society', type: 'workshop', status: 'upcoming' },
      { id: 24, time: '08:00 pm - 11:00 pm', title: 'Jazz & Blues Night', venue: 'Jazz Lounge', agency: 'Jazz Association', type: 'music', status: 'upcoming', featured: true },
      { id: 25, time: '10:30 pm onwards', title: 'Midnight Jam Session', venue: 'Open Mic Stage', agency: 'Independent Musicians', type: 'music', status: 'upcoming' }
    ],
    6: [
      { id: 26, time: '09:00 am - 10:30 am', title: 'Sunrise Yoga Session', venue: 'Wellness Area', agency: 'Yoga Alliance', type: 'wellness', status: 'upcoming' },
      { id: 27, time: '01:00 pm - 04:00 pm', title: 'Hip Hop & Urban Music', venue: 'Urban Stage', agency: 'Hip Hop Collective', type: 'music', status: 'upcoming', featured: true },
      { id: 28, time: '04:00 pm - 06:00 pm', title: 'Children\'s Cultural Program', venue: 'Kids Zone', agency: 'Child Welfare Committee', type: 'culture', status: 'upcoming' },
      { id: 29, time: '07:00 pm - 10:00 pm', title: 'International Dance Festival', venue: 'Main Stage', agency: 'Dance Federation', type: 'culture', status: 'upcoming', featured: true },
      { id: 30, time: '09:45 pm onwards', title: 'Late Night Comedy Show', venue: 'Comedy Tent', agency: 'Comedy Club', type: 'entertainment', status: 'upcoming' }
    ],
    7: [
      { id: 31, time: '10:00 am - 12:00 pm', title: 'Photography Workshop', venue: 'Media Center', agency: 'Photography Society', type: 'workshop', status: 'upcoming' },
      { id: 32, time: '02:30 pm - 05:00 pm', title: 'Classical Music Concert', venue: 'Concert Hall', agency: 'Classical Music Society', type: 'music', status: 'upcoming', featured: true },
      { id: 33, time: '05:30 pm - 07:30 pm', title: 'Fashion & Cultural Dress Show', venue: 'Fashion Stage', agency: 'Fashion Council', type: 'culture', status: 'upcoming' },
      { id: 34, time: '08:00 pm - 11:00 pm', title: 'Rock Legends Tribute Night', venue: 'Main Stage', agency: 'Rock Music Society', type: 'music', status: 'upcoming', featured: true },
      { id: 35, time: '11:00 pm onwards', title: 'Bonfire Stories & Songs', venue: 'Bonfire Area', agency: 'Storytellers Guild', type: 'culture', status: 'upcoming' }
    ],
    8: [
      { id: 36, time: '11:30 am - 01:00 pm', title: 'Wellness & Meditation Workshop', venue: 'Zen Garden', agency: 'Wellness Foundation', type: 'wellness', status: 'upcoming' },
      { id: 37, time: '03:00 pm - 06:00 pm', title: 'Folk Music Marathon', venue: 'Folk Stage', agency: 'Folk Heritage Society', type: 'music', status: 'upcoming', featured: true },
      { id: 38, time: '06:30 pm - 08:30 pm', title: 'Cultural Exchange Program', venue: 'Cultural Center', agency: 'International Relations', type: 'culture', status: 'upcoming' },
      { id: 39, time: '08:30 pm - 11:30 pm', title: 'World Music Fusion Night', venue: 'Main Stage', agency: 'World Music Council', type: 'music', status: 'upcoming', featured: true },
      { id: 40, time: '10:15 pm onwards', title: 'Acoustic Singer-Songwriter Circle', venue: 'Intimate Stage', agency: 'Songwriters Association', type: 'music', status: 'upcoming' }
    ],
    9: [
      { id: 41, time: '12:00 pm - 03:00 pm', title: 'Art & Craft Exhibition Opening', venue: 'Art Gallery', agency: 'Arts Council', type: 'culture', status: 'upcoming' },
      { id: 42, time: '03:30 pm - 06:00 pm', title: 'Battle of Genres Music Competition', venue: 'Competition Stage', agency: 'Music Battle League', type: 'competition', status: 'upcoming', featured: true },
      { id: 43, time: '06:00 pm - 08:00 pm', title: 'Community Feast Preparation', venue: 'Community Kitchen', agency: 'Local Community', type: 'food', status: 'upcoming' },
      { id: 44, time: '08:00 pm - 11:00 pm', title: 'Grand Musical Collaboration', venue: 'Main Stage', agency: 'Festival Orchestra', type: 'music', status: 'upcoming', featured: true },
      { id: 45, time: '10:30 pm onwards', title: 'Night Market Extended Hours', venue: 'Market Area', agency: 'Vendors Association', type: 'food', status: 'upcoming' }
    ],
    10: [
      { id: 46, time: '11:00 am - 02:00 pm', title: 'Final Rehearsals', venue: 'All Stages', agency: 'Festival Coordination', type: 'info', status: 'upcoming' },
      { id: 47, time: '03:00 pm - 05:00 pm', title: 'Unity Concert - All Tribes Together', venue: 'Main Stage', agency: 'Tribal Unity Council', type: 'music', status: 'upcoming', featured: true },
      { id: 48, time: '06:00 pm - 07:00 pm', title: 'Award Ceremony', venue: 'Main Stage', agency: 'Festival Committee', type: 'ceremony', status: 'upcoming' },
      { id: 49, time: '08:00 pm - 10:00 pm', title: 'Grand Finale Celebration', venue: 'Main Stage', agency: 'Festival Organizers', type: 'music', status: 'upcoming', featured: true },
      { id: 50, time: '10:30 pm onwards', title: 'Closing Ceremony & Fireworks', venue: 'Main Stage', agency: 'Festival Committee', type: 'ceremony', status: 'upcoming', featured: true }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'upcoming': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'music': return 'bg-pink-500/20 text-pink-400';
      case 'culture': return 'bg-purple-500/20 text-purple-400';
      case 'workshop': return 'bg-orange-500/20 text-orange-400';
      case 'competition': return 'bg-yellow-500/20 text-yellow-400';
      case 'food': return 'bg-green-500/20 text-green-400';
      case 'wellness': return 'bg-teal-500/20 text-teal-400';
      case 'film': return 'bg-indigo-500/20 text-indigo-400';
      case 'ceremony': return 'bg-red-500/20 text-red-400';
      case 'entertainment': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div 
            ref={heroRef}
            className={`festival-bg rounded-3xl p-8 md:p-16 text-center mb-12 tribal-pattern transition-all duration-700 ${
              heroVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <h1 className="font-righteous text-4xl md:text-6xl mb-4">
              <span className="festival-title neon-text">Festival Schedule</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Complete festival program and event timeline
            </p>
            <div className="text-lg text-neon-purple font-medium">
              📅 10 Days of Music, Culture & Celebration
            </div>
          </div>

          {/* Mobile-Optimized Day Filter */}
          <div 
            ref={filtersRef}
            className={`mb-12 transition-all duration-700 ${
              filtersVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Mobile: Horizontal scroll with simplified buttons */}
            <div className="md:hidden">
              <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-4 px-1 hide-scrollbar">
                {days.map((day, index) => (
                  <button
                    key={day.id}
                    data-day={day.id}
                    onClick={() => setSelectedDay(day.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 min-w-[70px] touch-target text-sm ${
                      selectedDay === day.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white neon-glow-pink'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    } ${filtersVisible ? 'animate-fade-in' : ''}`}
                    style={{
                      animationDelay: filtersVisible ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Single row with flex wrap */}
            <div className="hidden md:flex md:flex-wrap md:gap-4 md:justify-center">
              {days.map((day, index) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedDay === day.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white neon-glow-pink'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  } ${filtersVisible ? 'animate-fade-in' : ''}`}
                  style={{
                    animationDelay: filtersVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  <div className="text-sm font-semibold">{day.day}</div>
                  <div className="text-xs opacity-75">{day.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Grid */}
          <div 
            ref={scheduleRef}
            className={`space-y-6 transition-all duration-1000 ${
              scheduleVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-16'
            }`}
          >
            {scheduleData[selectedDay as keyof typeof scheduleData]?.map((event, index) => (
              <Card 
                key={event.id} 
                className={`festival-card overflow-hidden transition-all duration-700 ${
                  event.featured ? 'ring-2 ring-pink-500/30' : ''
                } ${event.status === 'live' ? 'neon-glow-pink' : ''} ${
                  scheduleVisible ? 'animate-scale-in' : 'opacity-0 scale-75'
                }`}
                style={{
                  animationDelay: scheduleVisible ? `${index * 100}ms` : '0ms'
                }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-3">
                        <div className="flex items-center text-gray-400">
                          <Clock size={16} className="mr-2 text-pink-400" />
                          <span className="font-medium text-base">{event.time}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} flex-shrink-0`}>
                            {event.status === 'live' && <span className="animate-pulse mr-1">🔴</span>}
                            {event.status.toUpperCase()}
                          </span>
                          {event.featured && (
                            <span className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex-shrink-0">
                              <Star size={10} className="mr-1 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-righteous text-lg md:text-2xl mb-3 text-white group-hover:text-pink-400 transition-colors">
                        {event.title}
                      </h3>
                      
                      <div className="flex flex-col gap-2 text-sm text-gray-400">
                        <div className="flex items-center min-w-0">
                          <MapPin size={14} className="mr-2 text-pink-400 flex-shrink-0" />
                          <span className="truncate font-medium">{event.venue}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <Users size={14} className="mr-2 text-purple-400 flex-shrink-0" />
                          <span className="truncate">{event.agency}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 w-fit ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
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

export default Schedule;
