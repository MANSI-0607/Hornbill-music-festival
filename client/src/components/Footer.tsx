import React, { useEffect } from "react";
import {
  Heart,
  Music,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Globe,

} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";


const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer
      className="bg-background/95 backdrop-blur-md border-t border-border/50 mt-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mobile-container py-8 pb-24 md:pb-12 px-6 md:px-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-12 mb-12 space-y-8 lg:space-y-0">
          {/* Festival Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-neon-pink" />
              <h3 className="text-lg font-semibold">Hornbill Music Festival</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Celebrating Nagaland's rich musical heritage and empowering local
              artists since the grand Hornbill Festival.
            </p>

            {/* Festival Dates */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-neon-pink" />
                Festival Dates
              </h4>
              <p className="text-sm text-muted-foreground">
                December 1-10, 2025
              </p>
              <p className="text-xs text-muted-foreground">
                Music events: 6:00 PM - 9:00 PM
              </p>
            </div>

            {/* Book Tickets */}
            <div className="bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 p-4 rounded-lg border border-neon-pink/20">
              <h4 className="font-semibold mb-2">
                Ready to Experience the Festival?
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Book your tickets now and secure your spot at Nagaland's premier
                music celebration.
              </p>
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
           {/* Contact Information */}
           <div className="space-y-6">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <p className="text-muted-foreground text-sm">
              Have questions about the festival or want to collaborate with
              TaFMA? We'd love to hear from you.
            </p>

            {/* Email */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-neon-pink" />
                Email
              </h4>
              <p className="text-sm text-muted-foreground">
                <a href="mailto:info@hornbillmusicfestival.com" className="text-primary hover:text-primary/80 transition-colors">
                  info@hornbillmusicfestival.com
                </a>
              </p>
            </div>

            {/* Phone */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-neon-pink" />
                Phone
              </h4>
              <p className="text-sm text-muted-foreground">+91 8787 624 630</p>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-neon-pink" />
                Follow us</h4>
              <div className="flex items-center gap-5">
                <a
                  href="https://www.instagram.com/hornbill_music/"
                  aria-label="Follow on Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-neon-pink transition-colors"
                  title="Instagram"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.youtube.com/@TaFMANagaland"
                  aria-label="Subscribe on YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-neon-pink transition-colors"
                  title="YouTube"
                >
                  <FaYoutube className="h-6 w-6" />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VaXpbDb2UPBLdc6l1c43"
                  aria-label="Chat on WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-neon-pink transition-colors"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="h-6 w-6" />
                </a>
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <Link
              to="/schedule"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Schedule
            </Link>
             <Link
              to="/media"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Media
            </Link>
            {/* <Link
              to="/artists"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Artists
            </Link> */}
            <Link
              to="/about"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              About
            </Link>
            {/* <Link
              to="/hornbill-music-festival"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Hornbill Music Festival
            </Link> */}
            <Link
              to="/gallery"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Gallery
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 pt-6 mt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-neon-pink" />
              <span>by <a 
  href="https://kakihelpsbrands.com/"   
  target="_blank" 
  rel="noopener noreferrer"
  className="text-primary/90 hover:text-primary underline underline-offset-2"
>KAKI TECH</a></span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hornbill Music Festival. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Safe Area Spacer */}
      <div className="md:hidden" style={{ height: 'env(safe-area-inset-bottom)' }}></div>
    </footer>
  );
};

export default Footer;
