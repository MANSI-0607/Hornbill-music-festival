
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, Mic, Info, Mountain, Calendar, Image, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

//import logo from '@/assets/logo/hmf-logo.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Desktop navigation items (original)
  const navigation = [
    { name: 'Home', href: '/', icon: Music, shortName: 'Home' },
    // { name: 'Schedule', href: '/schedule', icon: Calendar, shortName: 'Schedule' },
    // { name: 'Artists', href: '/artists', icon: Users, shortName: 'Artists' },
    { name: 'About', href: '/about', icon: Info, shortName: 'About' },
  ];

  // Mobile navigation items (includes additional items)
  const mobileNavigation = [
    { name: 'Home', href: '/', icon: Music, shortName: 'Home' },
    // { name: 'Schedule', href: '/schedule', icon: Calendar, shortName: 'Schedule' },
    // { name: 'Artists', href: '/artists', icon: Users, shortName: 'Artists' },
    { name: 'Gallery', href: '/gallery', icon: Image, shortName: 'Gallery' },
    { name: 'About', href: '/about', icon: Info, shortName: 'About' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop and Mobile Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-gray-700/50 md:bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-50 relative">
              {/* <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center"> */}
               <img 
  src="/hmf-logo.png" 
  alt="HMF Logo" 
  className="w-12 h-12" 
  loading="lazy" 
  decoding="async"
/>

              {/* </div> */}
              <span className="text-xl font-righteous text-white">Hornbill Music Festival</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-primary/20 text-primary'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <a href="https://ahibi.in/" target="_blank" rel="noopener noreferrer">
                <Button className="btn-festival ml-4">
                  Book Tickets
                </Button>
              </a>
             
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden z-50 relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}>
          {/* Dark backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modern menu panel */}
          <div className={`absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-700/50 transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="px-6 py-6">
              {/* Navigation items in rows */}
              <div className="space-y-2 mb-6">
                {mobileNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${
                        location.pathname === item.href
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-800/80 border border-gray-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Call to action button */}
               
                <a href="https://ahibi.in/" target="_blank" rel="noopener noreferrer">
                 <Button 
                   className="btn-festival w-full py-3 text-base font-semibold rounded-xl"
                   onClick={() => setIsOpen(false)}
                 >
                   Book Tickets
                 </Button>
                </a>
              
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-700/50 z-50">
        <div className="flex justify-around items-center py-2 px-1 safe-area-inset-bottom">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg min-w-[60px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-400 hover:text-white active:bg-gray-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                  {item.shortName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
