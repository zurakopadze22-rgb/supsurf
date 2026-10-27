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
      { text: 'SUP Board Rental Tbilisi Sea', href: `/${locale}/rent` },
      { text: 'Water Board Rental Tbilisi', href: `/${locale}/rent` },
      { text: 'SUP Rent Tbilisi', href: `/${locale}/rent` },
      { text: 'Paddleboard Tbilisi Sea', href: `/${locale}/rent` },
      { text: 'Buy SUP Board Georgia', href: `/${locale}/shop` },
      { text: 'Guided SUP Tours Tbilisi Sea', href: `/${locale}/services` },
      { text: 'Water Sports Tbilisi Sea', href: `/${locale}/services` },
    ],
    ge: [
      { text: 'საპ ბორდების გაქირავება თბილისში', href: `/${locale}/rent` },
      { text: 'წყლის დაფის გაქირავება', href: `/${locale}/rent` },
      { text: 'საპ ბორდი თბილისის ზღვაზე', href: `/${locale}/rent` },
      { text: 'საპ რენტი თბილისი', href: `/${locale}/rent` },
      { text: 'წყლის დაფები თბილისის ზღვა', href: `/${locale}/rent` },
      { text: 'გასაბერი საპ დაფის ყიდვა', href: `/${locale}/shop` },
      { text: 'საპ ტურები თბილისის ზღვაზე', href: `/${locale}/services` },
      { text: 'სერფინგის დაფა თბილისი', href: `/${locale}/shop` },
    ],
    ru: [
      { text: 'аренда сапбордов Тбилисское море', href: `/${locale}/rent` },
      { text: 'прокат сапов Тбилиси', href: `/${locale}/rent` },
      { text: 'водная доска сап Тбилиси', href: `/${locale}/rent` },
      { text: 'доска для плавания Тбилиси', href: `/${locale}/rent` },
      { text: 'купить сапборд в Тбилиси', href: `/${locale}/shop` },
      { text: 'сап туры Тбилисское море', href: `/${locale}/services` },
      { text: 'сапсерфинг Тбилиси', href: `/${locale}/services` },
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
                <div className="h-7 w-[69px] group-hover:scale-105 transition-transform flex items-center bg-white/10 p-1 rounded-xl border border-white/20">
                  <img
                    src={db.logo}
                    alt="SUPSURF.GE - საპ ბორდების გაქირავება"
                    width={69}
                    height={28}
                    style={{ aspectRatio: '2394 / 968' }}
                    className="h-full w-auto object-contain max-h-[28px]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-tr from-ocean-teal to-ocean-cyan p-1.5 text-ocean-dark shadow-md">
                  <Waves className="h-4 w-4" />
                </div>
              )}
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                SUPSURF.GE <span className="text-ocean-teal text-[10px] sm:text-xs tracking-widest uppercase block font-sans">supsurf.ge</span>
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
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              {dict.footer.quick_links}
            </h3>
            <ul className="space-y-2 font-sans text-xs">
              <li><Link to={`/${locale}`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.home}</Link></li>
              <li><Link to={`/${locale}/rent`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.rent}</Link></li>
              <li><Link to={`/${locale}/shop`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.shop}</Link></li>
              <li><Link to={`/${locale}/services`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.services}</Link></li>
              <li><Link to={`/${locale}/blog`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.blog}</Link></li>
              <li><Link to={`/${locale}/about`} className="text-ocean-cyan/70 hover:text-ocean-teal transition-colors">{dict.nav.about}</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              {dict.footer.contact_info}
            </h3>
            <ul className="space-y-2.5 font-sans text-xs text-ocean-cyan/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-ocean-teal shrink-0 mt-0.5" />
                <span>{locale === 'ge' ? 'თბილისის ზღვა, თბილისი' : locale === 'ru' ? 'Тбилисское море, Тбилиси' : 'Tbilisi Sea, Tbilisi'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ocean-teal shrink-0" />
                <a href={`tel:${(db?.contact?.phone || '+995 592 05 50 17').replace(/\s+/g, '')}`} className="hover:text-ocean-teal transition-colors">{db?.contact?.phone || '+995 592 05 50 17'}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ocean-teal shrink-0" />
                <a href="mailto:info@supsurf.ge" className="hover:text-ocean-teal transition-colors">info@supsurf.ge</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Keywords */}
          <div className="col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              {locale === 'ge' ? 'პოპულარული ძიებები' : locale === 'ru' ? 'Популярные запросы' : 'Popular Searches'}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {activeKeywords.map((kw, idx) => (
                <Link key={idx} to={kw.href} className="font-sans text-[10px] sm:text-xs bg-ocean-navy/60 text-ocean-cyan/70 hover:text-ocean-dark hover:bg-ocean-teal px-2.5 py-1 rounded-md border border-ocean-slate/40 transition-all">
                  {kw.text}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Divider & Rights */}
        <div className="border-t border-ocean-navy/55 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ocean-cyan/50">
          <p className="font-sans text-center sm:text-left">
            &copy; {new Date().getFullYear()} SUPSURF.GE (supsurf.ge). {dict.footer.rights}
          </p>
          <div className="flex items-center gap-3 font-semibold">
            <span>{locale === 'ge' ? 'თბილისის ზღვა' : locale === 'ru' ? 'Тбилисское море' : 'Tbilisi Sea (Tbilisi)'}</span>
            <span>&bull;</span>
            <span>supsurf.ge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}