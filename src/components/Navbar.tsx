'use client';

import { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves, Calendar } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale } from '@/lib/get-dictionary';
import db from '../data/db.json';

interface NavbarProps {
  locale: Locale;
  dict: {
    nav: {
      home: string;
      rent: string;
      shop: string;
      services: string;
      blog: string;
      about: string;
      cta: string;
    };
  };
  onBookNow: () => void;
}

export default function Navbar({ locale, dict, onBookNow }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.shop, href: `/${locale}/shop` },
    { name: dict.nav.services, href: `/${locale}/services` },
    { name: dict.nav.blog, href: `/${locale}/blog` },
    { name: dict.nav.about, href: `/${locale}/about` },
  ];

  const isActive = (href: string) => {
    // If we're at home, exact match. Otherwise prefix match.
    if (href === `/${locale}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ocean-slate/10 bg-white/70 backdrop-blur-md shadow-sm transition-all-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link
              to={`/${locale}`}
              className="flex items-center group transition-all"
              id="nav-logo"
            >
              {db?.logo ? (
                <div className="h-12 sm:h-16 w-auto group-hover:scale-[1.05] transition-transform flex items-center justify-center p-0">
                  <img src={db.logo} alt="supsurf.ge" className="h-full w-auto object-contain" />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-tr from-ocean-navy to-ocean-teal p-2.5 text-white shadow-md shadow-ocean-teal/20 group-hover:scale-105 transition-transform flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 2C10.5 4.5 9.5 8.5 9.5 12C9.5 15.5 10.5 19.5 12 22C13.5 19.5 14.5 15.5 14.5 12C14.5 8.5 13.5 4.5 12 2Z" fill="currentColor" fillOpacity="0.25" />
                    <path d="M16 4L8 20" strokeWidth="1.5" />
                    <path d="M7.5 19L6.5 21.5L8.5 22L9 19.5L7.5 19Z" fill="currentColor" />
                    <path d="M16.5 5L15.5 3L17.5 2L18 4L16.5 5Z" fill="currentColor" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="font-display text-xl font-extrabold tracking-tight text-ocean-dark leading-none">supsurf.ge</span>
                    <span className="font-sans text-[10px] font-bold tracking-widest text-ocean-teal uppercase">Georgia</span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-sans text-base font-semibold transition-colors duration-200 relative py-1.5 ${isActive(link.href)
                    ? 'text-ocean-teal'
                    : 'text-ocean-slate hover:text-ocean-dark'
                  }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-ocean-teal animate-fade-in-up" />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA & Language Switcher */}
          <div className="hidden md:flex items-center gap-x-4">
            <Suspense fallback={<div className="w-12 h-10 bg-ocean-light animate-pulse rounded-lg" />}>
              <LanguageSwitcher currentLocale={locale} />
            </Suspense>
            <button
              type="button"
              onClick={onBookNow}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-ocean-coral/25 hover:shadow-xl hover:shadow-ocean-coral/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-display cursor-pointer"
              id="nav-book-now"
            >
              <Calendar className="h-4 w-4" />
              {dict.nav.cta}
            </button>
          </div>

          {/* Mobile Actions: Language Switcher + Toggle Button */}
          <div className="flex items-center gap-x-2 md:hidden">
            <Suspense fallback={<div className="w-12 h-10 bg-ocean-light animate-pulse rounded-lg" />}>
              <LanguageSwitcher currentLocale={locale} />
            </Suspense>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-ocean-slate hover:bg-ocean-light hover:text-ocean-dark focus:outline-none transition-colors border border-ocean-slate/10"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle Main Menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-ocean-slate/10 bg-white/95 backdrop-blur-lg animate-fade-in-up">
          <div className="space-y-1.5 px-4 pb-6 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${isActive(link.href)
                    ? 'bg-ocean-teal/10 text-ocean-teal'
                    : 'text-ocean-slate hover:bg-ocean-light hover:text-ocean-dark'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-ocean-light pt-4 mt-4 px-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookNow();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-coral px-4 py-3 text-center text-base font-bold text-white shadow-md hover:bg-ocean-coral/95 transition-all font-display cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
                {dict.nav.cta}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
