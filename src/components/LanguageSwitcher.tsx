'use client';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ge', name: 'ქართული', flag: '🇬🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
] as const;

type Locale = typeof languages[number]['code'];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    if (!pathname) return;

    // Pathname splits like: ["", "en", "rent"]
    const segments = pathname.split('/');
    
    // Replace locale prefix
    segments[1] = newLocale;
    
    const newPath = segments.join('/');
    const query = searchParams?.toString();
    const href = query ? `${newPath}?${query}` : newPath;
    
    navigate(href);
  };

  const currentLanguageInfo = languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative text-left z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-x-2 px-3 py-2 border border-ocean-slate/20 rounded-lg bg-white/70 backdrop-blur-md text-sm font-medium text-ocean-dark hover:bg-ocean-light hover:border-ocean-teal/40 focus:outline-none transition-all-300 shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="text-base select-none">{currentLanguageInfo.flag}</span>
          <span className="hidden sm:inline font-sans">{currentLanguageInfo.name}</span>
          <span className="sm:hidden font-sans uppercase">{currentLanguageInfo.code}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-ocean-slate transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white/95 border border-ocean-slate/10 shadow-xl focus:outline-none ring-1 ring-black/5 animate-fade-in-up">
          <div className="py-1.5" role="menu" aria-orientation="vertical">
            <div className="px-3 py-1.5 text-xs font-semibold text-ocean-slate border-b border-ocean-light font-display">
              Change Language
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-ocean-light text-left transition-colors font-sans ${
                  currentLocale === lang.code ? 'text-ocean-teal font-semibold bg-ocean-light/50' : 'text-ocean-dark'
                }`}
                role="menuitem"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base select-none">{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {currentLocale === lang.code && (
                  <Check className="w-4 h-4 text-ocean-teal" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
