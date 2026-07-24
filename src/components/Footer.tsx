import { Link } from 'react-router-dom';
import { Waves, Phone, Mail, MapPin, Anchor } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import db from '../data/db.json';

interface FooterProps {
  locale: Locale;
  dict: {
    nav: {
      home: string;
      rent: string;
      shop: string;
      services: string;
      blog: string;
      about: string;
    };
    footer: {
      slogan: string;
      quick_links: string;
      contact_info: string;
      address: string;
      rights: string;
    };
  };
}

export default function Footer({ locale, dict }: FooterProps) {
  // Localized keywords for crawler optimization
  const keywordsByLocale = {
    en: [
      { text: 'SUP Board Rental Tbilisi', href: `/${locale}/rent` },
      { text: 'Paddleboard Rental Batumi', href: `/${locale}/rent` },
      { text: 'SUP Rent Lisi Lake', href: `/${locale}/rent` },
      { text: 'Buy SUP Board Georgia', href: `/${locale}/shop` },
      { text: 'Guided SUP Tours Georgia', href: `/${locale}/services` },
      { text: 'Inflatable Paddle Board Sales', href: `/${locale}/shop` },
      { text: 'Water Sports Equipment Rental', href: `/${locale}/services` },
      { text: 'Surfboard Rentals Batumi', href: `/${locale}/services` },
    ],
    ge: [
      { text: 'საპ ბორდების გაქირავება', href: `/${locale}/rent` },
      { text: 'საპ ბორდი ლისის ტბაზე', href: `/${locale}/rent` },
      { text: 'საპების იჯარა ბათუმში', href: `/${locale}/rent` },
      { text: 'გასაბერი საპ დაფის ყიდვა', href: `/${locale}/shop` },
      { text: 'საპ ტურები საქართველოში', href: `/${locale}/services` },
      { text: 'წყლის დაფის გაქირავება', href: `/${locale}/rent` },
      { text: 'სერფინგის გაკვეთილები ბათუმი', href: `/${locale}/services` },
      { text: 'საპ ბორდი ფასი', href: `/${locale}/shop` },
      { text: 'კორპორატიული ტურები წყალზე', href: `/${locale}/services` },
    ],
    ru: [
      { text: 'аренда сап бордов Тбилиси', href: `/${locale}/rent` },
      { text: 'прокат сапов Батуми', href: `/${locale}/rent` },
      { text: 'сапборд Лисье озеро', href: `/${locale}/rent` },
      { text: 'купить сапборд в Грузии', href: `/${locale}/shop` },
      { text: 'сап туры и прогулки', href: `/${locale}/services` },
      { text: 'аренда сапдоски', href: `/${locale}/rent` },
      { text: 'уроки серфинга Батуми', href: `/${locale}/services` },
      { text: 'надувные сап доски', href: `/${locale}/shop` },
    ],
  };

  const activeKeywords = keywordsByLocale[locale] || keywordsByLocale.en;

  const quickLinks = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.rent, href: `/${locale}/rent` },
    { name: dict.nav.shop, href: `/${locale}/shop` },
    { name: dict.nav.services, href: `/${locale}/services` },
    { name: dict.nav.blog, href: `/${locale}/blog` },
    { name: dict.nav.about, href: `/${locale}/about` },
  ];

  return (
    <footer className="bg-ocean-dark text-white border-t border-ocean-navy pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand & Slogan */}
          <div className="space-y-6">
            <Link to={`/${locale}`} className="flex items-center gap-2 group">
              {db?.logo ? (
                <div className="h-8 w-auto group-hover:scale-105 transition-transform flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
                  <img src={db.logo} alt="supsurf.ge" className="h-full object-contain max-h-[32px]" />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-tr from-ocean-teal to-ocean-cyan p-2 text-ocean-dark shadow-lg shadow-ocean-teal/15">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 2C10.5 4.5 9.5 8.5 9.5 12C9.5 15.5 10.5 19.5 12 22C13.5 19.5 14.5 15.5 14.5 12C14.5 8.5 13.5 4.5 12 2Z" fill="currentColor" fillOpacity="0.25" />
                    <path d="M16 4L8 20" strokeWidth="1.5" />
                    <path d="M7.5 19L6.5 21.5L8.5 22L9 19.5L7.5 19Z" fill="currentColor" />
                    <path d="M16.5 5L15.5 3L17.5 2L18 4L16.5 5Z" fill="currentColor" />
                  </svg>
                </div>
              )}
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                supsurf.ge <span className="text-ocean-teal text-xs tracking-widest uppercase block">Georgia</span>
              </span>
            </Link>
            <p className="font-sans text-sm text-ocean-cyan/60 leading-relaxed">
              {dict.footer.slogan}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {/* Facebook Link */}
              <a
                href="https://www.facebook.com/SUNSETPSUP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/sun_set_paddle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* X / Twitter Link */}
              <a
                href="https://x.com/supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube Link */}
              <a
                href="https://www.youtube.com/@supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/company/supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-base font-bold text-white mb-6 uppercase tracking-wider">
              {dict.footer.quick_links}
            </h3>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-sm text-ocean-cyan/70 hover:text-ocean-teal hover:translate-x-1 inline-block transition-transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-display text-base font-bold text-white mb-6 uppercase tracking-wider">
              {dict.footer.contact_info}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ocean-teal shrink-0 mt-0.5" />
                <span className="font-sans text-sm text-ocean-cyan/70 leading-relaxed">
                  {dict.footer.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ocean-teal shrink-0" />
                <a
                  href="tel:+995555123456"
                  className="font-sans text-sm text-ocean-cyan/70 hover:text-ocean-teal transition-colors"
                >
                  +995 555 123 456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-ocean-teal shrink-0" />
                <a
                  href="mailto:info@watersports.ge"
                  className="font-sans text-sm text-ocean-cyan/70 hover:text-ocean-teal transition-colors"
                >
                  info@watersports.ge
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Localized Keywords (SEO Enhancer) */}
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-white mb-4 uppercase tracking-wider">
              {locale === 'ge' ? 'პოპულარული ძიებები' : locale === 'ru' ? 'Популярные запросы' : 'Popular Search Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeKeywords.map((kw, i) => (
                <Link
                  key={i}
                  to={kw.href}
                  className="font-sans text-xs bg-ocean-navy/60 text-ocean-cyan/70 hover:text-ocean-dark hover:bg-ocean-teal px-3 py-1.5 rounded-lg border border-ocean-slate/40 transition-all duration-200"
                >
                  {kw.text}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-ocean-navy/55 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-ocean-cyan/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} supsurf.ge. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-4 text-xs text-ocean-cyan/30">
            <span>Tbilisi</span>
            <span>&bull;</span>
            <span>Batumi</span>
            <span>&bull;</span>
            <span>Anaklia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}