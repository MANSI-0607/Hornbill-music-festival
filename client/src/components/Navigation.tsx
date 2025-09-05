import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Music,
  Ticket,
  Mountain,
  Compass,
  Info,
  HelpCircle,
} from "lucide-react";
import logo from "@/assets/logo/hmf-logo.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Music, shortName: "Home" },
    {
      name: "Auditions",
      href: "/auditions",
      icon: Ticket,
      shortName: "Tickets",
    },
    {
      name: "Festive Hub",
      href: "/festive",
      icon: Mountain,
      shortName: "Festive",
    },
    { name: "Explore", href: "/explore", icon: Compass, shortName: "Explore" },
    { name: "About", href: "/about", icon: Info, shortName: "About" },
    { name: "FAQ", href: "/faq", icon: HelpCircle, shortName: "FAQ" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="fixed top-0 w-full z-50 h-20 
  bg-gradient-to-r from-festival-gold via-festival-pink to-[#E91E63] 
  backdrop-blur-md shadow-lg animate-gradient-shift"
  
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-2 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo + Title */}
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Hornbill Logo"
                className="w-16 h-16 rounded-full festival-pulse"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-funky text-white drop-shadow-lg whitespace-nowrap">
                  Hornbill Music Festival
                </span>
                <span className="text-sm text-yellow-200 font-semibold uppercase">
                  Managed by TaFMA
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-base font-groovy tracking-wide transition-all duration-200 ${
                      isActive
                        ? "text-yellow-300 bg-blue-900/30 shadow-lg scale-105"
                        : "text-white hover:text-yellow-200 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-yellow-200 p-2 rounded-md transition"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 top-24 z-40 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute top-0 left-0 right-0 bg-gradient-to-br from-festival-blue via-festival-pink to-festival-cyan 
            text-white shadow-2xl border-b border-yellow-400/50
            transition-transform duration-300 ease-out ${
              isOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="px-6 py-6 space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-righteous tracking-wide transition-all duration-200 ${
                      location.pathname === item.href
                        ? "bg-yellow-300/20 text-yellow-200 shadow-lg"
                        : "hover:bg-white/10 hover:text-yellow-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-festival-gold via-festival-pink to-festival-cyan border-t border-white/30 shadow-md z-50">
        <div className="flex justify-around items-center py-2 px-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-2 px-2 min-w-[60px] transition-all duration-200 ${
                  isActive
                    ? "text-yellow-200 scale-110 font-semibold"
                    : "text-white hover:text-yellow-200"
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-groovy">{item.shortName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
