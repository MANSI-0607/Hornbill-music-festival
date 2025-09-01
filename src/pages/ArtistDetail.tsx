
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, Instagram, Youtube, MapPin, Music, Calendar } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Animation refs
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { elementRef: bioRef, isVisible: bioVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
  const { elementRef: songsRef, isVisible: songsVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  
  // Artist data - in a real app this would come from an API
  const artists = [
    {
      id: 1,
      name: 'The Hornbill Collective',
      genre: 'Folk',
      district: 'Kohima',
      language: 'Angami',
      bio: 'Blending traditional Angami folk with modern arrangements',
      image: '🎵',
      socials: { instagram: '@hornbillcollective', youtube: 'HornbillMusic' },
      description: 'The Hornbill Collective is a groundbreaking folk ensemble that bridges the gap between traditional Angami music and contemporary soundscapes. Founded in 2018, the group has become synonymous with cultural preservation through innovation. Their music tells the stories of the Angami people, weaving ancient melodies with modern instruments to create a sound that resonates across generations.',
      achievements: [
        'Winner - Best Folk Album 2023, Northeast Music Awards',
        'Featured at Hornbill Festival 2022 & 2023',
        'Cultural Ambassador for Nagaland Tourism'
      ],
      upcomingShows: [
        { date: '2024-12-01', venue: 'Hornbill Festival Main Stage', location: 'Kisama Heritage Village' },
        { date: '2024-12-15', venue: 'Cultural Center', location: 'Kohima' }
      ],
      popularSongs: [
        { title: 'Terhü Pfelie', duration: '4:23', plays: '125K' },
        { title: 'Mountain Echoes', duration: '3:45', plays: '98K' },
        { title: 'Heritage Song', duration: '5:12', plays: '87K' }
      ]
    },
    {
      id: 2,
      name: 'Naga Thunder',
      genre: 'Rock',
      district: 'Dimapur',
      language: 'English',
      bio: 'High-energy rock band representing the spirit of modern Nagaland',
      image: '⚡',
      socials: { instagram: '@nagathunder', youtube: 'NagaThunderBand' },
      description: 'Naga Thunder emerged from the bustling streets of Dimapur with a mission to put Nagaland on the global rock map. Their electrifying performances and powerful lyrics about youth, identity, and modern Northeast India have earned them a devoted following across the region.',
      achievements: [
        'Headlined Great Indian Rock Festival 2023',
        'Over 1M streams on Spotify',
        'Best Rock Band - Northeast India Music Awards 2022'
      ],
      upcomingShows: [
        { date: '2024-11-30', venue: 'Rock Arena', location: 'Dimapur' },
        { date: '2024-12-10', venue: 'Youth Festival', location: 'Mokokchung' }
      ],
      popularSongs: [
        { title: 'Thunder Rising', duration: '3:55', plays: '245K' },
        { title: 'Naga Pride', duration: '4:18', plays: '189K' },
        { title: 'Electric Dreams', duration: '3:32', plays: '156K' }
      ]
    },
    {
      id: 3,
      name: 'Bamboo Beats',
      genre: 'Traditional',
      district: 'Wokha',
      language: 'Lotha',
      bio: 'Masters of traditional Lotha percussion and bamboo instruments',
      image: '🎋',
      socials: { instagram: '@bamboobeats', youtube: 'BambooBeatsOfficial' },
      description: 'Bamboo Beats is dedicated to preserving and promoting the rich percussion traditions of the Lotha tribe. Using traditional bamboo instruments and ancient rhythmic patterns, they create mesmerizing performances that transport audiences to the heart of Nagaland\'s cultural heritage.',
      achievements: [
        'UNESCO Cultural Heritage Recognition',
        'Master Performers at International Folk Festival',
        'Cultural Preservation Award 2023'
      ],
      upcomingShows: [
        { date: '2024-12-05', venue: 'Heritage Museum', location: 'Wokha' },
        { date: '2024-12-20', venue: 'Traditional Arts Center', location: 'Kohima' }
      ],
      popularSongs: [
        { title: 'Bamboo Symphony', duration: '6:45', plays: '75K' },
        { title: 'Lotha Rhythms', duration: '5:30', plays: '62K' },
        { title: 'Ancient Echoes', duration: '7:12', plays: '58K' }
      ]
    },
    {
      id: 4,
      name: 'Digital Dao',
      genre: 'Electronic',
      district: 'Mon',
      language: 'Konyak',
      bio: 'Electronic music infused with Konyak tribal chants and rhythms',
      image: '🎛️',
      socials: { instagram: '@digitaldao', youtube: 'DigitalDaoMusic' },
      description: 'Digital Dao represents the future of traditional music, seamlessly blending Konyak tribal elements with cutting-edge electronic production. Their innovative approach has created a new genre that honors the past while embracing technological possibilities.',
      achievements: [
        'Featured at Sunburn Festival 2023',
        'Best Electronic Act - India Music Awards',
        'Viral TikTok sensation with 10M+ views'
      ],
      upcomingShows: [
        { date: '2024-12-08', venue: 'Electronic Music Festival', location: 'Guwahati' },
        { date: '2024-12-25', venue: 'New Year Celebration', location: 'Mon' }
      ],
      popularSongs: [
        { title: 'Digital Warrior', duration: '4:12', plays: '312K' },
        { title: 'Konyak Bass', duration: '3:48', plays: '278K' },
        { title: 'Tribal Techno', duration: '5:25', plays: '245K' }
      ]
    },
    {
      id: 5,
      name: 'Mountain Echo',
      genre: 'Fusion',
      district: 'Zunheboto',
      language: 'Sumi',
      bio: 'Contemporary fusion of Sumi folk melodies with jazz influences',
      image: '🏔️',
      socials: { instagram: '@mountainecho', youtube: 'MountainEchoMusic' },
      description: 'Mountain Echo crafts sophisticated musical landscapes that blend the soulful melodies of Sumi folk tradition with the improvisational spirit of jazz. Their unique sound has garnered critical acclaim and a growing international following.',
      achievements: [
        'Jazz Fusion Album of the Year 2023',
        'Featured at Mahindra Blues Festival',
        'International World Music Showcase'
      ],
      upcomingShows: [
        { date: '2024-12-12', venue: 'Jazz Club', location: 'Delhi' },
        { date: '2024-12-28', venue: 'Mountain Music Festival', location: 'Zunheboto' }
      ],
      popularSongs: [
        { title: 'Mountain Breeze', duration: '5:45', plays: '145K' },
        { title: 'Sumi Jazz', duration: '4:32', plays: '128K' },
        { title: 'Echo Valley', duration: '6:18', plays: '112K' }
      ]
    },
    {
      id: 6,
      name: 'Tribal Harmony',
      genre: 'Traditional',
      district: 'Tuensang',
      language: 'Chang',
      bio: 'Preserving and performing ancient Chang tribe songs and dances',
      image: '🎭',
      socials: { instagram: '@tribalharmony', youtube: 'TribalHarmonyNL' },
      description: 'Tribal Harmony is committed to keeping the ancient musical traditions of the Chang tribe alive. Through their performances, they share stories, legends, and cultural practices that have been passed down through generations.',
      achievements: [
        'Cultural Heritage Preservation Award',
        'Featured in National Geographic Documentary',
        'Traditional Arts Excellence Recognition'
      ],
      upcomingShows: [
        { date: '2024-12-18', venue: 'Cultural Heritage Center', location: 'Tuensang' },
        { date: '2024-12-30', venue: 'Traditional Festival', location: 'Kohima' }
      ],
      popularSongs: [
        { title: 'Chang Ceremonial', duration: '8:30', plays: '45K' },
        { title: 'Ancestral Voices', duration: '7:15', plays: '38K' },
        { title: 'Traditional Dance', duration: '6:45', plays: '35K' }
      ]
    }
  ];

  const artist = artists.find(a => a.id === parseInt(id || ''));

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-righteous mb-4">Artist Not Found</h1>
            <p className="text-gray-400 mb-8">The artist you're looking for doesn't exist.</p>
            <Link to="/artists">
              <Button className="btn-festival">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Artists
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link to="/artists" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artists
          </Link>

          {/* Hero Section */}
          <div 
            ref={heroRef}
            className={`festival-bg rounded-3xl p-8 md:p-16 mb-12 tribal-pattern transition-all duration-1000 ${
              heroVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
            }`}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="font-righteous text-4xl md:text-6xl mb-4">
                  <span className="festival-title neon-text">{artist.name}</span>
                </h1>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full font-medium ${
                    artist.genre === 'Rock' ? 'bg-pink-500/20 text-pink-400' :
                    artist.genre === 'Folk' ? 'bg-purple-500/20 text-purple-400' :
                    artist.genre === 'Electronic' ? 'bg-orange-500/20 text-orange-400' :
                    artist.genre === 'Traditional' ? 'bg-teal-500/20 text-teal-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {artist.genre}
                  </span>
                  <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {artist.district}
                  </span>
                  <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">
                    {artist.language}
                  </span>
                </div>
                <p className="text-xl text-gray-300 mb-8">{artist.bio}</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="btn-festival">
                    <Play className="w-4 h-4 mr-2" fill="currentColor" />
                    Play Music
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="icon" className="border-gray-600 hover:border-pink-400">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="border-gray-600 hover:border-red-400">
                      <Youtube className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-8xl">
                  {artist.image}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div 
                ref={bioRef}
                className={`festival-card transition-all duration-1000 ${
                  bioVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
                }`}
              >
                <h2 className="font-righteous text-2xl mb-4">About {artist.name}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{artist.description}</p>
                
                <h3 className="font-righteous text-xl mb-4">Achievements</h3>
                <ul className="space-y-2">
                  {artist.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-400 flex items-start">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Songs */}
              <div 
                ref={songsRef}
                className={`festival-card transition-all duration-1000 ${
                  songsVisible ? 'scroll-fade-in visible' : 'scroll-fade-in'
                }`}
              >
                <h2 className="font-righteous text-2xl mb-6 flex items-center">
                  <Music className="w-6 h-6 mr-2" />
                  Popular Songs
                </h2>
                <div className="space-y-4">
                  {artist.popularSongs.map((song, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors group cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white group-hover:text-pink-400 transition-colors">{song.title}</h4>
                          <p className="text-sm text-gray-400">{song.duration} • {song.plays} plays</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Shows */}
              <Card className="festival-card">
                <CardContent className="p-6">
                  <h3 className="font-righteous text-xl mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Shows
                  </h3>
                  <div className="space-y-4">
                    {artist.upcomingShows.map((show, index) => (
                      <div key={index} className="border-l-2 border-pink-500 pl-4">
                        <div className="text-sm text-pink-400 font-medium">{show.date}</div>
                        <div className="font-medium text-white">{show.venue}</div>
                        <div className="text-sm text-gray-400">{show.location}</div>
                      </div>
                    ))}
                  </div>
                  <a href="https://ahibi.in/" target="_blank" rel="noopener noreferrer">
                    <Button className="btn-festival w-full mt-6">
                      Book Tickets
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="festival-card">
                <CardContent className="p-6">
                  <h3 className="font-righteous text-xl mb-4">Follow {artist.name}</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                      <Instagram className="w-5 h-5 text-pink-400" />
                      <span className="text-white">{artist.socials.instagram}</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors">
                      <Youtube className="w-5 h-5 text-red-400" />
                      <span className="text-white">{artist.socials.youtube}</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDetail;
