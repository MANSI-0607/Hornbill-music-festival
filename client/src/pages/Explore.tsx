
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Camera, Coffee, Mountain, Utensils, Clock } from "lucide-react";

const Explore = () => {
  const aboutNagaland = {
    title: "Discover Nagaland",
    subtitle: "Land of Festivals",
    description: "Nagaland, known as the 'Land of Festivals', is a mountainous state in Northeast India. Home to 16 major tribes, each with unique customs, languages, and traditions. The state celebrates over 40 festivals throughout the year, making it a vibrant cultural destination.",
    highlights: [
      "16 Major Tribes with unique cultures",
      "40+ Festivals celebrated annually",
      "Rich traditional arts and crafts",
      "Pristine natural landscapes"
    ]
  };

  const places = [
    {
      name: "Kisama Heritage Village",
      description: "Festival venue showcasing Naga tribal architecture and culture",
      icon: "🏘️",
      category: "Cultural Site",
      distance: "12 km from Kohima"
    },
    {
      name: "Kohima War Cemetery",
      description: "Historical memorial commemorating WWII battle",
      icon: "🌹",
      category: "Historical",
      distance: "2 km from city center"
    },
    {
      name: "Dzükou Valley",
      description: "Beautiful valley known for seasonal flowers and trekking",
      icon: "🌸",
      category: "Nature",
      distance: "30 km from Kohima"
    },
    {
      name: "State Museum",
      description: "Rich collection of Naga tribal artifacts and history",
      icon: "🏛️",
      category: "Museum",
      distance: "City Center"
    },
    {
      name: "Kohima Cathedral",
      description: "Largest cathedral in Northeast India",
      icon: "⛪",
      category: "Religious",
      distance: "1 km from city center"
    },
    {
      name: "Local Markets",
      description: "Traditional markets selling handicrafts and local produce",
      icon: "🛍️",
      category: "Shopping",
      distance: "Various locations"
    }
  ];

  const cafes = [
    {
      name: "Dream Café",
      specialty: "Local Naga cuisine & Coffee",
      ambiance: "Traditional with modern touch",
      icon: "☕",
      rating: 4.8,
      price: "₹₹",
      highlight: "Must-try: Naga King Chili dishes"
    },
    {
      name: "Bamboo Lounge",
      specialty: "Continental & Asian Fusion",
      ambiance: "Cozy bamboo interiors",
      icon: "🎋",
      rating: 4.6,
      price: "₹₹₹",
      highlight: "Great for groups"
    },
    {
      name: "Mountain View Café",
      specialty: "Fresh brews & Pastries",
      ambiance: "Scenic mountain views",
      icon: "🏔️",
      rating: 4.9,
      price: "₹₹",
      highlight: "Best sunset views"
    },
    {
      name: "Heritage Tea House",
      specialty: "Traditional teas & Snacks",
      ambiance: "Cultural décor",
      icon: "🍵",
      rating: 4.7,
      price: "₹",
      highlight: "Authentic Naga tea experience"
    },
    {
      name: "Festival Food Court",
      specialty: "Street food & Local delicacies",
      ambiance: "Vibrant festival atmosphere",
      icon: "🍽️",
      rating: 4.5,
      price: "₹",
      highlight: "Try local favorites"
    },
    {
      name: "Rooftop Bistro",
      specialty: "International cuisine",
      ambiance: "Modern rooftop dining",
      icon: "🌃",
      rating: 4.4,
      price: "₹₹₹",
      highlight: "City skyline views"
    }
  ];

  return (
    <div className="min-h-screen">
   
      <main className="pt-8">
        {/* Hero Section */}
        <section className="festival-section bg-gradient-accent">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-festival text-white mb-4">
              Explore Nagaland
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover the rich culture, stunning landscapes, and warm hospitality of Northeast India's gem
            </p>
          </div>
        </section>

        {/* About Nagaland */}
        <section className="festival-section">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-gradient-primary text-white mb-4">
                  {aboutNagaland.subtitle}
                </Badge>
                <h2 className="text-4xl font-festival festival-gradient-text mb-6">
                  {aboutNagaland.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {aboutNagaland.description}
                </p>
                <div className="space-y-3">
                  {aboutNagaland.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="festival-card bg-gradient-card p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl">🏔️</div>
                  <h3 className="text-2xl font-festival">Cultural Paradise</h3>
                  <p className="text-muted-foreground">
                    Experience the confluence of tradition and modernity in the pristine hills of Nagaland
                  </p>
                  <Button className="festival-button bg-gradient-secondary text-secondary-foreground">
                    Plan Your Visit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Places to Visit */}
        <section className="festival-section bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-festival festival-gradient-text mb-4">
                Places to Visit in Kohima
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover the beauty and history of Nagaland's capital
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place, index) => (
                <Card key={index} className="festival-card group">
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {place.icon}
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground mb-2">
                      {place.category}
                    </Badge>
                    <CardTitle className="font-festival">{place.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-center">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-primary">
                      <MapPin className="h-4 w-4" />
                      <span>{place.distance}</span>
                    </div>
                    <Button className="w-full festival-button bg-gradient-accent text-accent-foreground">
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="festival-section">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-festival festival-gradient-text mb-4">
                Interactive Map
              </h2>
              <p className="text-lg text-muted-foreground">
                Navigate Kohima and find festival venues easily
              </p>
            </div>

            <Card className="festival-card">
              <CardContent className="p-8">
                <div className="bg-gradient-secondary rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-festival mb-2">Map Integration</h3>
                    <p className="text-white/80 mb-6">
                      Interactive map will be integrated here showing all festival venues and local attractions
                    </p>
                    <Button className="festival-button bg-white text-secondary hover:bg-white/90">
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cafes Section */}
        <section id="cafes" className="festival-section bg-gradient-hero">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-festival text-white mb-4">
                Cafes to Explore
              </h2>
              <p className="text-xl text-white/90">
                Discover amazing local flavors and cozy spots to relax
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafes.map((cafe, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-4">
                      {cafe.icon}
                    </div>
                    <CardTitle className="font-festival text-white">{cafe.name}</CardTitle>
                    <CardDescription className="text-white/80">
                      {cafe.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-white/80">
                        <Coffee className="h-4 w-4" />
                        <span className="text-sm">{cafe.ambiance}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <Badge className="bg-warning text-warning-foreground">
                          ⭐ {cafe.rating}
                        </Badge>
                        <Badge variant="outline" className="border-white/40 text-white">
                          {cafe.price}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/70 mb-4">
                        💡 {cafe.highlight}
                      </p>
                      <Button className="festival-button bg-white text-primary hover:bg-white/90 w-full">
                        Visit Cafe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;