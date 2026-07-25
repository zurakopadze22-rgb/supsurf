import { Link } from 'react-router-dom';
import { Waves, Phone, Mail, MapPin } from 'lucide-react';
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
      { text: 'SUP Rent Lisi Lake', href: `/${locale}/rent` },
      { text: 'SUP Shekvetili Coast', href: `/${locale}/rent` },
      { text: 'Buy SUP Board Georgia', href: `/${locale}/shop` },
      { text: 'Guided SUP Tours Georgia', href: `/${locale}/services` },
      { text: 'Water Sports Equipment Rental', href: `/${locale}/services` },
    ],
    ge: [
      { text: 'საპ ბორდების გაქირავება', href: `/${locale}/rent` },
      { text: 'საპ ბორდი ლისის ტბაზე', href: `/${locale}/rent` },
      { text: 'საპის გაქირავება შეკვეთილში', href: `/${locale}/rent` },
      { text: 'გასაბერი საპ დაფის ყიდვა', href: `/${locale}/shop` },
      { text: 'საპ ტურები საქართველოში', href: `/${locale}/services` },
      { text: 'კორპორატიული ტურები წყალზე', href: `/${locale}/services` },
    ],
    ru: [
      { text: 'аренда сапбордов Тбилиси', href: `/${locale}/rent` },
      { text: 'сапборд Лисье озеро', href: `/${locale}/rent` },
      { text: 'сапборд Шекветили', href: `/${locale}/rent` },
      { text: 'купить сапборд в Грузии', href: `/${locale}/shop` },
      { text: 'сап туры и уроки', href: `/${locale}/services` },
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
    <footer className="bg-ocean-dark text-white border-t border-ocean-navy pt-8 sm:pt-14 pb-6 sm:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">

          {/* Column 1: Brand & Slogan */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-5">
            <Link to={`/${locale}`} className="flex items-center gap-2 group">
              {db?.logo ? (
                <div className="h-7 w-auto group-hover:scale-105 transition-transform flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
                  <img src={db.logo} alt="supsurf.ge" className="h-full object-contain max-h-[28px]" />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-tr from-ocean-teal to-ocean-cyan p-1.5 text-ocean-dark shadow-md">
                  <Waves className="h-4 w-4" />
                </div>
              )}
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                supsurf.ge <span className="text-ocean-teal text-[10px] sm:text-xs tracking-widest uppercase block font-sans">Georgia</span>
              </span>
            </Link>

            <p className="font-sans text-xs text-ocean-cyan/70 leading-relaxed max-w-sm">
              {dict.footer.slogan}
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.facebook.com/SUNSETPSUP/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/sun_set_paddle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://x.com/supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/supsurfge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-ocean-navy flex items-center justify-center text-ocean-cyan hover:text-white hover:bg-ocean-teal/20 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display text-xs sm:text-sm font-bold text-white mb-3 uppercase tracking-wider">
              {dict.footer.quick_links}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-sans text-xs text-ocean-cyan/70 hover:text-ocean-teal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-span-1">
            <h3 className="font-display text-xs sm:text-sm font-bold text-white mb-3 uppercase tracking-wider">
              {dict.footer.contact_info}
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ocean-teal shrink-0 mt-0.5" />
                <span className="font-sans text-ocean-cyan/70 leading-tight">
                  Lisi Lake / Shekvetili
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ocean-teal shrink-0" />
                <a
                  href="tel:+995592055017"
                  className="font-sans text-ocean-cyan/70 hover:text-ocean-teal transition-colors"
                >
                  +995 592 05 50 17
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ocean-teal shrink-0" />
                <a
                  href="mailto:info@watersports.ge"
                  className="font-sans text-ocean-cyan/70 hover:text-ocean-teal transition-colors truncate"
                >
                  info@watersports.ge
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Localized Keywords (SEO Tags - Compact Ribbon on Mobile) */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <h3 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'ge' ? 'პოპულარული ძიებები' : locale === 'ru' ? 'Популярные запросы' : 'Popular Tags'}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeKeywords.map((kw, i) => (
                <Link
                  key={i}
                  to={kw.href}
                  className="font-sans text-[10px] sm:text-xs bg-ocean-navy/60 text-ocean-cyan/70 hover:text-ocean-dark hover:bg-ocean-teal px-2.5 py-1 rounded-md border border-ocean-slate/40 transition-all"
                >
                  {kw.text}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Divider & Rights */}
        <div className="border-t border-ocean-navy/55 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ocean-cyan/50">
          <p className="font-sans text-center sm:text-left">
            &copy; {new Date().getFullYear()} supsurf.ge. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-3 font-semibold">
            <span>Tbilisi (Lisi Lake)</span>
            <span>&bull;</span>
            <span>Shekvetili Beach</span>
          </div>
        </div>
      </div>
    </footer>
  );
}