import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getDictionary } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from './BookingModal';
import db from '../data/db.json';

export default function Layout() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [dict, setDict] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState('');

  const supportedLocales: Locale[] = ['en', 'ge', 'ru'];
  const locale = (rawLocale && supportedLocales.includes(rawLocale as Locale) ? rawLocale : 'en') as Locale;

  // Redirect to correct locale prefix if missing or invalid
  useEffect(() => {
    if (!rawLocale || !supportedLocales.includes(rawLocale as Locale)) {
      // Check browser language preference
      const browserLang = navigator.language.toLowerCase();
      let detectedLocale = 'en';
      if (browserLang.includes('ka') || browserLang.includes('ge')) {
        detectedLocale = 'ge';
      } else if (browserLang.includes('ru')) {
        detectedLocale = 'ru';
      }
      
      const currentPath = location.pathname === '/' ? '' : location.pathname;
      navigate(`/${detectedLocale}${currentPath}${location.search}`, { replace: true });
    }
  }, [rawLocale, navigate, location]);

  // Fetch translation dictionary
  useEffect(() => {
    let active = true;
    setLoading(true);
    getDictionary(locale)
      .then((data) => {
        if (active) {
          setDict(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load dictionary:', err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);


  // Dynamic Page Title & Meta Description SEO
  useEffect(() => {
    if (!dict) return;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    const page = pathParts[1] || 'home'; 

    let pageTitle = 'supsurf.ge | Premium SUP & Surf Georgia';
    let metaDesc = 'Premium SUP board rentals and sales in Georgia (Tbilisi, Batumi, Anaklia). Best daily rates, full adventure gear included.';

    if (locale === 'ge') {
      pageTitle = 'supsurf.ge | საპების გაქირავება & გაყიდვა საქართველოში';
      metaDesc = 'საპ ბორდების გაქირავება და გაყიდვა საქართველოში (თბილისი, ბათუმი, ანაკლია). საუკეთესო დღიური ფასები, სრული აღჭურვილობა შედის ფასში.';
      
      switch (page) {
        case 'rent':
          pageTitle = 'საპების გაქირავება | supsurf.ge';
          metaDesc = 'საპ ბორდების დღიური გაქირავება სრული აღჭურვილობით. 1 დღე 50 ლარად, 2 დღე 80 ლარად. დაჯავშნე WhatsApp-ით.';
          break;
        case 'shop':
          pageTitle = 'საპების მაღაზია | supsurf.ge';
          metaDesc = 'შეიძინეთ უმაღლესი ხარისხის გასაბერი საპ დაფები და წყლის აქსესუარები გარანტიითა და ადგილზე მიწოდებით.';
          break;
        case 'services':
          pageTitle = 'სერვისები & ტურები | supsurf.ge';
          metaDesc = 'საპ ტურები, კორპორატიული გასვლები და ჯგუფური აქტივობები წყალზე. შეისწავლე საპინგი პროფესიონალებთან ერთად.';
          break;
        case 'blog':
          pageTitle = 'ბლოგი & რჩევები | supsurf.ge';
          metaDesc = 'სასარგებლო რჩევები საპ ბორდით სრიალის შესახებ. როგორ ავირჩიოთ საპი და სად ვიპოვოთ საუკეთესო ტბები საქართველოში.';
          break;
        case 'about':
          pageTitle = 'ჩვენ შესახებ | supsurf.ge';
          metaDesc = 'supsurf.ge-ის 5 წლიანი ისტორია საქართველოში. გაიცანით ჩვენი გუნდი და აქტიური სადგურები თბილისში, ბათუმსა და ანაკლიაში.';
          break;
      }
    } else if (locale === 'ru') {
      pageTitle = 'supsurf.ge | Аренда и продажа SUP-бордов в Грузии';
      metaDesc = 'Аренда и продажа SUP-досок в Грузии (Тбилиси, Батуми, Анаклия). Отличные цены, полные комплекты снаряжения включены в стоимость.';

      switch (page) {
        case 'rent':
          pageTitle = 'Прокат сапов в Грузии | supsurf.ge';
          metaDesc = 'Посуточный прокат сапбордов со всем снаряжением. 1 день за 50 GEL, 2 дня за 80 GEL. Забронируйте через WhatsApp.';
          break;
        case 'shop':
          pageTitle = 'Купить сапборд в Грузии | supsurf.ge Shop';
          metaDesc = 'Продажа надувных сап-досок премиум-класса и водных аксессуаров с гарантией и доставкой по всей Грузии.';
          break;
        case 'services':
          pageTitle = 'Услуги и SUP-туры | supsurf.ge';
          metaDesc = 'Сап-прогулки, корпоративные мероприятия и групповые активности на воде. Научитесь сапсерфингу с инструктором.';
          break;
        case 'blog':
          pageTitle = 'Блог о сапсерфинге | supsurf.ge';
          metaDesc = 'Полезные советы и статьи о сапбординге. Как выбрать сап и где найти лучшие локации для катания в Грузии.';
          break;
        case 'about':
          pageTitle = 'О нас | supsurf.ge';
          metaDesc = '5 лет опыта supsurf.ge в Грузии. Наша история, контакты и активные станции проката в Тбилиси, Батуми и Анаклии.';
          break;
      }
    } else {
      switch (page) {
        case 'rent':
          pageTitle = 'SUP Rentals in Georgia | supsurf.ge';
          metaDesc = 'Daily stand-up paddleboard rentals with full gear. 1 day for 50 GEL, 2 days for 80 GEL. Book easily via WhatsApp.';
          break;
        case 'shop':
          pageTitle = 'SUP Board Shop | supsurf.ge';
          metaDesc = 'Shop premium inflatable paddleboards and watersports accessories with warranty and shipping across Georgia.';
          break;
        case 'services':
          pageTitle = 'SUP Services & Tours | supsurf.ge';
          metaDesc = 'Paddleboarding tours, corporate team building, and group events. Learn stand-up paddling with our certified guides.';
          break;
        case 'blog':
          pageTitle = 'SUP Blog & Tips | supsurf.ge';
          metaDesc = 'Discover useful guides and tips on paddleboarding. Learn how to choose your gear and discover top paddling lakes in Georgia.';
          break;
        case 'about':
          pageTitle = 'About Us | supsurf.ge';
          metaDesc = 'supsurf.ge\'s 5-year history in Georgia. Meet our team and discover active rental stations in Tbilisi, Batumi, and Anaklia.';
          break;
      }
    }

    document.title = pageTitle;

    // Helper to set or create meta element
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Helper to set or create link element
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]` 
        : `link[rel="${rel}"]`;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('href', href);
      } else {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) element.setAttribute('hreflang', hreflang);
        element.setAttribute('href', href);
        document.head.appendChild(element);
      }
    };

    const subPath = pathParts.slice(1).join('/');
    const pathSuffix = subPath ? `/${subPath}` : '';
    const currentCanonicalUrl = `https://www.supsurf.ge/${locale}${pathSuffix}`;

    // Meta Description
    setMetaTag('name', 'description', metaDesc);

    // Canonical link
    setLinkTag('canonical', currentCanonicalUrl);

    // Multilingual Hreflang links for Google Search
    setLinkTag('alternate', `https://www.supsurf.ge/ge${pathSuffix}`, 'ka');
    setLinkTag('alternate', `https://www.supsurf.ge/ge${pathSuffix}`, 'ge');
    setLinkTag('alternate', `https://www.supsurf.ge/ru${pathSuffix}`, 'ru');
    setLinkTag('alternate', `https://www.supsurf.ge/en${pathSuffix}`, 'en');
    setLinkTag('alternate', `https://www.supsurf.ge/ge${pathSuffix}`, 'x-default');

    // OpenGraph Social & Search Meta Tags
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:url', currentCanonicalUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'supsurf.ge');
    setMetaTag('property', 'og:image', 'https://www.supsurf.ge/pictures/logo.webp');
    setMetaTag('property', 'og:locale', locale === 'ge' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US');

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', 'https://www.supsurf.ge/pictures/logo.webp');

    // Geo Target Meta Tags for Localized Search Priority
    setMetaTag('name', 'geo.region', 'GE');
    setMetaTag('name', 'geo.placename', 'Tbilisi, Batumi, Georgia');
  }, [location.pathname, dict, locale]);

  if (loading || !dict) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-ocean-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-teal border-t-transparent"></div>
          <span className="font-display text-sm font-semibold tracking-wider uppercase text-ocean-slate animate-pulse">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar 
        locale={locale} 
        dict={dict} 
        onBookNow={() => {
          setModalItem(locale === 'ge' ? 'საპ ტური / გაქირავება' : 'SUP Tour / Rental');
          setModalOpen(true);
        }} 
      />
      <main className="flex-grow">
        <Outlet context={{ locale, dict, setModalOpen, setModalItem }} />
      </main>
      <Footer locale={locale} dict={dict} />
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={db?.contact}
        locale={locale}
        itemName={modalItem}
      />
    </>
  );
}
