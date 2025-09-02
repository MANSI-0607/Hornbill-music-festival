
import React from 'react';
import { Heart, Music, Mail, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-background/95 backdrop-blur-md border-t border-border/50 mt-auto">
      <div className="mobile-container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Festival Info */}
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-6 w-6 text-neon-pink" />
              <h3 className="text-lg font-semibold">Hornbill Music Festival</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Celebrating Nagaland's rich musical heritage and empowering local artists since the grand Hornbill Festival.
            </p>
            
            {/* Festival Dates */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neon-pink" />
                Festival Dates
              </h4>
              <p className="text-sm text-muted-foreground">December 3-8, 2024</p>
              <p className="text-xs text-muted-foreground">Daily events: 2:00 PM - 11:00 PM</p>
            </div>

            {/* Book Tickets */}
            <div className="bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 p-4 rounded-lg border border-neon-pink/20">
              <h4 className="font-semibold mb-2">Ready to Experience the Festival?</h4>
              <p className="text-sm text-muted-foreground mb-3">Book your tickets now and secure your spot at Nagaland's premier music celebration.</p>
              <a 
                href="https://ahibi.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neon-pink hover:text-neon-purple transition-colors text-sm font-medium"
              >
                Book Tickets <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Have questions about the festival or want to collaborate with TaFMA? We'd love to hear from you.
            </p>

            {/* Email */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-neon-pink" />
                Email
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>info@hornbillmusicfestival.com</p>
                <p>press@tafma.org</p>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-neon-pink" />
                Phone
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>+91 9876 543 210</p>
                <p>+91 8765 432 109</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neon-pink" />
                Location
              </h4>
              <div className="text-sm text-muted-foreground">
                <p>Naga Heritage Village</p>
                <p>Kisama, Nagaland 797001</p>
                <p>India</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
  <Link to="/events" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
    Events
  </Link>
  <Link to="/artists" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
    Artists
  </Link>
  <Link to="/auditions" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
    Auditions
  </Link>
  <Link to="/about" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
    About
  </Link>
  <Link to="/schedule" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
    Schedule
  </Link>
</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-neon-pink" />
              <span>by KAKI TECH</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hornbill Music Festival. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Safe Area */}
      <div className="h-safe-area-inset-bottom md:hidden"></div>
    </footer>
  );
};

export default Footer;
