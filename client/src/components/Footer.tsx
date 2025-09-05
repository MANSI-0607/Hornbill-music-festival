import React, { useEffect } from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo/hmf-logo.png";
import tafmalogo from "@/assets/logo/tafmalogo.png";


const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
  <footer className="bg-[#00ff7f] border-t border-green-700 text-white">



      <div className="max-w-7xl mx-auto px-2 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Festival Info */}
          <div>
            <div className="flex items-center space-x-3 mb-2"> {/* Adjusted margin-bottom */}
              <img
                src={logo}
                alt="Hornbill Music Festival"
                className="w-16 h-16 rounded-full"
              />
              <img
                src={tafmalogo}
                alt="Hornbill Music Festival"
                className="w-16 h-16 rounded-full"
              />
            </div>
            {/* Hornbill Music Festival and Managed by TaFMA are now below the logos */}
             <span className="text-2xl font-funky text-white drop-shadow-lg whitespace-nowrap">
                  Hornbill Music Festival
                </span>
                <br></br>
                <span className="text-sm text-yellow-200 font-semibold uppercase">
                  Managed by TaFMA
                </span>

            <p className="text-base text-[#003300] mb-4"> {/* Increased font size for description */}
              Celebrating Nagaland’s vibrant culture & music.
            </p>
            <p className="text-base font-semibold text-white mb-3"> {/* Increased font size for follow us */}
              Follow us:
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ffea00] text-white hover:bg-[#ffea00] hover:text-[#003300] transition" // Funky borders and hover
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ffea00] text-white hover:bg-[#ffea00] hover:text-[#003300] transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@TaFMANagaland"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ffea00] text-white hover:bg-[#ffea00] hover:text-[#003300] transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#ffea00] text-white hover:bg-[#ffea00] hover:text-[#003300] transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Get in Touch</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Have questions about the festival or want to collaborate with
              TaFMA? We'd love to hear from you.
            </p>

            {/* Email */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#ffea00]" />
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
                <Phone className="h-4 w-4 text-[#ffea00]" />
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
                <MapPin className="h-4 w-4 text-[#ffea00]" />
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
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
              <Link to="/festive" className="hover:text-yellow-600">
                Gallery
              </Link>
              <Link to="/explore" className="hover:text-yellow-600">
                Terms & Conditions
              </Link>
              <Link to="/festive" className="hover:text-yellow-600">
                Schedule
              </Link>
              <Link to="/explore" className="hover:text-yellow-600">
                Privacy Policy
              </Link>
              <Link to="/festive" className="hover:text-yellow-600">
                Artists
              </Link>
              <Link to="/sponsors" className="hover:text-yellow-600">
                Sponsors
              </Link>
              <Link to="/audition" className="hover:text-yellow-600">
                Audition
              </Link>
              <Link to="/explore" className="hover:text-yellow-600">
                Visitors Guide
              </Link>
              <Link to="/about" className="hover:text-yellow-600">
                About
              </Link>
              <Link to="/faq" className="hover:text-yellow-600">
                FAQ
              </Link>
            </div>
            <div className="mt-5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.6764849333663!2d94.1144034!3d25.6164264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3746215b6f4ab711%3A0x202995c7ce5b7e31!2sNaga%20Heritage%20Village%2C%20Kisama%2C%20Nagaland%20797001%2C%20India!5e0!3m2!1sen!2sin!4v1693520881234!5m2!1sen!2sin"
               
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white-900 pt-6 mt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-yellow-600" /> by KAKI TECH
          </p>
          <p>
            © {new Date().getFullYear()} Hornbill Music Festival. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
