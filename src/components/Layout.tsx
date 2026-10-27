import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getDictionarySync } from '@/lib/get-dictionary';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from './BookingModal';
import db from '../data/db.json';
import { Phone } from 'lucide-react';

export default function Layout() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const supportedLocales: Locale[] = ['en', 'ge', 'ru'];
  const locale = (rawLocale && supportedLocales.includes(rawLocale as Locale) ? rawLocale : 'ge') as Locale;
  const [dict, setDict] = useState<any>(() => getDictionarySync(locale));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState('');

  // Redirect to correct locale prefix if missing or invalid (defaulting to 'ge' for Georgian SEO & canonical consistency)
  useEffect(() => {
    if (!rawLocale || !supportedLocales.includes(rawLocale as Locale)) {
      const browserLang = (navigator.language || '').toLowerCase();
      let detectedLocale: Locale = 'ge';
      if (browserLang.startsWith('ru')) {
        detectedLocale = 'ru';
      }
      
      const currentPath = location.pathname === '/' ? '' : location.pathname;
      navigate(`/${detectedLocale}${currentPath}${location.search}`, { replace: true });
    }
  }, [rawLocale, navigate, location]);

  // Update translation dictionary synchronously when locale changes
  useEffect(() => {
    setDict(getDictionarySync(locale));
  }, [locale]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);


  // Dynamic Page Title, Meta Description, OpenGraph, GEO & Breadcrumbs SEO
  useEffect(() => {
    if (!dict) return;
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    const page = pathParts[1] || 'home'; 
    const detailId = pathParts[2];

    let pageTitle = 'SUPSURF.GE — საპ ბორდების გაქირავება თბილისში | SUP Board Rental Georgia';
    let metaDesc = 'საპ ბორდებისა და წყლის დაფების გაქირავება თბილისის ზღვაზე (50₾/დღე). სრული აღჭურვილობა შედის ფასში. Stand Up Paddleboard (SUP) rental in Tbilisi, Georgia.';
    let pageImage = 'https://supsurf.ge/pictures/logo.webp';
    let detailLabel = '';

    // Check detail pages first (Products, Services, Blog Posts)
    if (detailId) {
      if (page === 'shop') {
        const prod = (db?.products || []).find((p: any) => p.id === detailId);
        if (prod) {
          const pName = prod.name?.[locale] || prod.name?.en || prod.name?.ge || 'SUP Board';
          detailLabel = pName;
          const pDesc = prod.desc?.[locale] || prod.desc?.en || prod.desc?.ge || '';
          pageTitle = locale === 'ge' 
            ? `${pName} — საპების მაღაზია თბილისში | SUPSURF.GE`
            : locale === 'ru' 
            ? `${pName} — Купить сапборд в Тбилиси | SUPSURF.GE`
            : `${pName} — Buy SUP Board in Tbilisi | SUPSURF.GE`;
          metaDesc = pDesc || (locale === 'ge' ? `შეიძინეთ ${pName} გარანტიით თბილისში SUPSURF.GE-სგან.` : `Buy ${pName} with official warranty in Tbilisi, Georgia.`);
          const rawImg = prod.images?.[0] || prod.image;
          if (rawImg) {
            pageImage = rawImg.startsWith('http') ? rawImg : `https://supsurf.ge${rawImg}`;
          }
        }
      } else if (page === 'services') {
        const staticRentals: Record<string, { ge: string; en: string; ru: string }> = {
          rent_daily: { ge: "საპ ბორდისა & წყლის დაფის დღიური გაქირავება", en: "Daily SUP & Water Board Rental", ru: "Посуточная аренда сапборда" },
          lesson_basic: { ge: "საბაზისო შემსწავლელი სეანსი ინსტრუქტორთან", en: "Basic Beginner SUP Session", ru: "Базовое обучающее занятие с инструктором" },
          rent_hourly: { ge: "საათობრივი გაქირავება თბილისის ზღვაზე", en: "Hourly SUP Board Rental", ru: "Почасовая аренда сапборда" },
          corporate_event: { ge: "კორპორატიული შეკრებები და ტურები", en: "Corporate Events & Team Building", ru: "Корпоративные туры" }
        };
        const srv = (db?.services || []).find((s: any) => s.id === detailId);
        const srvTitle = srv ? (srv.name?.[locale] || srv.name?.en || srv.name?.ge) : staticRentals[detailId]?.[locale] || 'SUP Service';
        detailLabel = srvTitle;
        pageTitle = `${srvTitle} — SUPSURF.GE თბილისი`;
        const sDesc = srv ? (srv.desc?.[locale] || srv.desc?.en) : 'SUPSURF.GE premium SUP and water board services at Tbilisi Sea, Georgia.';
        metaDesc = sDesc;
        if (srv?.image) {
          pageImage = srv.image.startsWith('http') ? srv.image : `https://supsurf.ge${srv.image}`;
        }
      } else if (page === 'blog') {
        let foundBlog: any = null;
        for (const cat of (db?.blog_categories || [])) {
          const b = (cat.blogs || []).find((item: any) => item.id === detailId);
          if (b) {
            foundBlog = b;
            break;
          }
        }
        if (foundBlog) {
          const bTitle = foundBlog.title?.[locale] || foundBlog.title?.en || foundBlog.title?.ge || 'Blog';
          detailLabel = bTitle;
          const blogExcerpt = foundBlog.excerpt?.[locale] || foundBlog.excerpt?.en || '';
          
          if (detailId === 'best-lakes-georgia-sup') {
            pageTitle = locale === 'ge'
              ? 'სად ვისრიალოთ საპით საქართველოში: თბილისის ზღვა, ლისი, ბაზალეთი, ბათუმი | SUPSURF.GE'
              : locale === 'ru'
              ? 'Где покататься на сапборде в Грузии: Тбилиси, Лиси, Базалети, Батуми | SUPSURF.GE'
              : 'Best SUP Spots in Georgia: Tbilisi Sea, Lisi Lake, Batumi & Mountain Lakes | SUPSURF.GE';
            metaDesc = locale === 'ge'
              ? 'საპ ბორდით სრიალი თბილისში და საქართველოში: თბილისის ზღვა, ლისის ტბა, ბაზალეთი, სიონი, შაორი და შავი ზღვა (ბათუმი, შეკვეთილი). საწყლოსნო აქტივობები და იჯარა 50₾-დან.'
              : locale === 'ru'
              ? 'Сапсерфинг и водные активности в Грузии: Тбилисское море, озеро Лиси, Базалети, Сиони, Шаори и Черное море в Батуми. Прокат сапов от 50 GEL/день без залога.'
              : 'Paddleboarding and water activities in Georgia: Tbilisi Sea, Lisi Lake, Bazaleti, Sioni, Shaori, and Black Sea in Batumi. Complete SUP rental kits from 50 GEL/day.';
          } else {
            pageTitle = `${bTitle} — SUPSURF.GE`;
            metaDesc = blogExcerpt || foundBlog.content?.[locale]?.substring(0, 160) || metaDesc;
          }

          if (foundBlog.image) {
            pageImage = foundBlog.image.startsWith('http') ? foundBlog.image : `https://supsurf.ge${foundBlog.image}`;
          }
        }
      }
    }

    // Check if current route is admin or invalid detail item - inject noindex
    if (page === 'admin' || (detailId && !detailLabel)) {
      document.title = page === 'admin' ? 'Admin Panel — SUPSURF.GE' : '404 - Not Found | SUPSURF.GE';
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, follow');
      return;
    } else {
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex, follow') {
        robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }
    }

    // Default top-level page fallback if not a detail item
    if (!detailId || !detailLabel) {
      if (locale === 'ge') {
        pageTitle = 'საპ ბორდების გაქირავება თბილისში (50₾/დღე) — თბილისის ზღვა | SUPSURF.GE';
        metaDesc = '№1 საპ ბორდებისა და წყლის დაფების გაქირავება თბილისში და თბილისის ზღვაზე (50₾/დღე, 80₾/2 დღე, 25₾/საათი). სრული 7-ნაწილიანი კომპლექტი ზურგჩანთით დეპოზიტის გარეშე!';
        
        switch (page) {
          case 'rent':
            pageTitle = 'საპ ბორდის გაქირავება თბილისში დღიურად (50₾) და საათობრივად (25₾) — SUPSURF.GE';
            metaDesc = 'იქირავეთ გასაბერი საპ ბორდი (SUP) თბილისში საუკეთესო ფასად: 1 დღე — 50₾, 2 დღე — 80₾, 1 საათი თბილისის ზღვაზე — 25₾. წაიღეთ ზურგჩანთით ლისზე, ჟინვალზე, სიონზე ან ბაზალეთზე დეპოზიტის გარეშე!';
            break;
          case 'shop':
            pageTitle = 'საპ ბორდების ყიდვა თბილისში — გასაბერი საპ დაფების მაღაზია | SUPSURF.GE';
            metaDesc = 'შეიძინეთ ახალი პრემიუმ გასაბერი საპ ბორდები (SUP დაფები) და წყლის სპორტის აქსესუარები თბილისში ოფიციალური გარანტიით (1050₾-დან). უფასო ტესტირება თბილისის ზღვაზე შეძენამდე.';
            break;
          case 'services':
            pageTitle = 'საპ ბორდების გაქირავება, ტურები და გაკვეთილები თბილისის ზღვაზე — SUPSURF.GE';
            metaDesc = 'საპ ბორდების დღიური (50₾) და საათობრივი (25₾) გაქირავება თბილისში, 90-წუთიანი გაკვეთილები ინსტრუქტორთან (45₾) და კორპორატიული საპ ტურები თბილისის ზღვაზე.';
            break;
          case 'blog':
            pageTitle = 'საპ ბორდინგის გზამკვლევი: ფასები, ლოკაციები თბილისში და რჩევები — SUPSURF.GE';
            metaDesc = 'ყველაფერი საპ ბორდების გაქირავების შესახებ თბილისში: სად ვისრიალოთ საპით (თბილისის ზღვა, ლისის ტბა, ბაზალეთი, ჟინვალი, სიონი, შაორი), უსაფრთხოება და ტექნიკა.';
            break;
          case 'about':
            pageTitle = 'ჩვენ შესახებ და კონტაქტი — SUPSURF.GE საპ ბორდების სადგური თბილისის ზღვაზე';
            metaDesc = 'SUPSURF.GE — საპ ბორდების გაქირავების №1 სადგური თბილისში, თბილისის ზღვაზე (ღიაა ყოველდღე 08:00 - 21:00). ტელ / WhatsApp: +995 592 05 50 17.';
            break;
        }
      } else if (locale === 'ru') {
        pageTitle = 'Аренда сапбордов в Тбилиси (50₾/день) — Тбилисское море | SUPSURF.GE';
        metaDesc = '№1 Прокат сапбордов (SUP) и водных досок в Тбилиси на Тбилисском море (50 GEL/день, 80 GEL/2 дня, 25 GEL/час). Полный комплект с рюкзаком, веслом и жилетом без залога!';

        switch (page) {
          case 'rent':
            pageTitle = 'Аренда сапбордов в Тбилиси посуточно (50 GEL) и почасово (25 GEL) — SUPSURF.GE';
            metaDesc = 'Прокат надувных сап-досок в Тбилиси посуточно (50 GEL/день, 2 дня 80 GEL) и на Тбилисском море (25 GEL/час). Компактный рюкзак для поездок на Лиси, Жинвали, Базалети, Сиони без залога.';
            break;
          case 'shop':
            pageTitle = 'Купить сапборд в Тбилиси с гарантией — Магазин SUP досок | SUPSURF.GE';
            metaDesc = 'Продажа новых надувных сап-досок (от 1050 GEL) и водонепроницаемых аксессуаров с гарантией в Тбилиси. Бесплатный тест-драйв на Тбилисском море перед покупкой.';
            break;
          case 'services':
            pageTitle = 'Прокат сапов, САП-туры и обучение с инструктором в Тбилиси — SUPSURF.GE';
            metaDesc = 'Посуточная (50 GEL) и почасовая (25 GEL) аренда сапов на Тбилисском море, обучение для начинающих с инструктором (45 GEL) и корпоративные сап-туры в Тбилиси.';
            break;
          case 'blog':
            pageTitle = 'Гид по сапбордингу в Тбилиси и озерам Грузии — SUPSURF.GE';
            metaDesc = 'Полный путеводитель по сапсерфингу в Тбилиси и Грузии: лучшие локации (Тбилисское море, Лиси, Базалети, Жинвали, Сиони, Шаори), цены на прокат и техника гребли.';
            break;
          case 'about':
            pageTitle = 'О нас и Контакты — Станция проката сапбордов SUPSURF.GE на Тбилисском море';
            metaDesc = 'SUPSURF.GE — главная станция сапсерфинга и проката сапбордов в Тбилиси на Тбилисском море (ежедневно 08:00 - 21:00). Тел / WhatsApp: +995 592 05 50 17.';
            break;
        }
      } else {
        pageTitle = 'SUP Board Rental Tbilisi (50 GEL/Day) — Tbilisi Sea Station | SUPSURF.GE';
        metaDesc = '#1 Stand Up Paddleboard (SUP) rental in Tbilisi at Tbilisi Sea (50 GEL/day, 80 GEL/2 days, 25 GEL/hour). Full 7-piece kit in carry backpack with paddle, life vest & pump. Zero deposit!';

        switch (page) {
          case 'rent':
            pageTitle = 'Daily & Hourly SUP Board Rental in Tbilisi (50 GEL/Day) — SUPSURF.GE';
            metaDesc = 'Rent inflatable SUP boards in Tbilisi by the day (50 GEL/1 day, 80 GEL/2 days) or hour at Tbilisi Sea (25 GEL). Takeaway backpack kit for Lisi, Zhinvali, Bazaleti & Sioni. No deposit.';
            break;
          case 'shop':
            pageTitle = 'Buy Inflatable SUP Boards in Tbilisi, Georgia — Watersports Shop | SUPSURF.GE';
            metaDesc = 'Shop brand-new inflatable Stand Up Paddleboards (from 1,050 GEL) and waterproof accessories in Tbilisi, Georgia. Water-tested at Tbilisi Sea with official warranty.';
            break;
          case 'services':
            pageTitle = 'SUP Rentals, Guided Tours & Beginner Lessons in Tbilisi — SUPSURF.GE';
            metaDesc = 'Daily (50 GEL) & hourly (25 GEL) paddleboard rentals at Tbilisi Sea, 90-minute beginner SUP lessons with certified instructors (45 GEL), and corporate water events in Tbilisi.';
            break;
          case 'blog':
            pageTitle = 'Tbilisi & Georgia Paddleboarding Guide: Spots, Prices & Tips — SUPSURF.GE';
            metaDesc = 'Complete guide to Stand Up Paddleboarding in Tbilisi and Georgia: best lakes (Tbilisi Sea, Lisi Lake, Bazaleti, Zhinvali, Sioni, Shaori), rental rates, and safety tips.';
            break;
          case 'about':
            pageTitle = 'About Us & Contact — SUPSURF.GE Tbilisi Sea Paddleboard Station';
            metaDesc = 'SUPSURF.GE — Premier SUP board rental station located at Tbilisi Sea, Tbilisi (open daily 08:00 - 21:00). Rentals, lessons, and gear sales. WhatsApp: +995 592 05 50 17.';
            break;
        }
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
    // Normalize /rent/:id canonical to /services/:id to prevent duplicate content and ranking cannibalization
    const canonicalPath = (pathParts[1] === 'rent' && pathParts[2]) 
      ? `services/${pathParts[2]}` 
      : subPath;
    const pathSuffix = canonicalPath ? `/${canonicalPath}` : '';
    const currentCanonicalUrl = `https://supsurf.ge/${locale}${pathSuffix}`;

    // Update <html lang="..."> attribute dynamically for Internationalization & Technical SEO
    document.documentElement.lang = locale === 'ge' ? 'ka' : locale;

    // Meta Description
    setMetaTag('name', 'description', metaDesc);

    // Canonical link
    setLinkTag('canonical', currentCanonicalUrl);

    // Multilingual Hreflang links for Google Search (using ISO 639-1 ka for Georgian)
    setLinkTag('alternate', `https://supsurf.ge/ge${pathSuffix}`, 'ka');
    setLinkTag('alternate', `https://supsurf.ge/ru${pathSuffix}`, 'ru');
    setLinkTag('alternate', `https://supsurf.ge/en${pathSuffix}`, 'en');
    setLinkTag('alternate', `https://supsurf.ge/ge${pathSuffix}`, 'x-default');

    // Remove legacy invalid hreflang='ge' if present
    const legacyGeTag = document.querySelector('link[rel="alternate"][hreflang="ge"]');
    if (legacyGeTag) legacyGeTag.remove();

    // OpenGraph Social & Search Meta Tags
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', metaDesc);
    setMetaTag('property', 'og:url', currentCanonicalUrl);
    setMetaTag('property', 'og:type', detailId ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', 'SUPSURF.GE');
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:locale', locale === 'ge' ? 'ka_GE' : locale === 'ru' ? 'ru_RU' : 'en_US');

    // Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', metaDesc);
    setMetaTag('name', 'twitter:image', pageImage);

    // Geo Target Meta Tags for Localized Search Priority (GEO)
    setMetaTag('name', 'geo.region', 'GE-TB');
    setMetaTag('name', 'geo.placename', 'Tbilisi, Georgia');
    setMetaTag('name', 'geo.position', '41.7450;44.8650');
    setMetaTag('name', 'ICBM', '41.7450, 44.8650');

    // Breadcrumb JSON-LD Schema for Google Search Snippets
    const breadcrumbItems: any[] = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'SUPSURF.GE',
        'item': `https://supsurf.ge/${locale}`
      }
    ];

    if (page && page !== 'home') {
      const pageNames: Record<string, Record<string, string>> = {
        rent: { ge: 'გაქირავება', ru: 'Прокат', en: 'Rentals' },
        shop: { ge: 'მაღაზია', ru: 'Магазин', en: 'Shop' },
        services: { ge: 'სერვისები', ru: 'Услуги', en: 'Services' },
        blog: { ge: 'ბლოგი', ru: 'Блог', en: 'Blog' },
        about: { ge: 'ჩვენ შესახებ', ru: 'О нас', en: 'About' },
        admin: { ge: 'ადმინი', ru: 'Админ', en: 'Admin' }
      };

      const pageLabel = pageNames[page]?.[locale] || page;
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 2,
        'name': pageLabel,
        'item': `https://supsurf.ge/${locale}/${page}`
      });

      if (detailId && detailLabel) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          'position': 3,
          'name': detailLabel,
          'item': currentCanonicalUrl
        });
      }
    }

    let schemaScript = document.getElementById('breadcrumb-schema') as HTMLScriptElement;
    if (breadcrumbItems.length >= 2) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbItems
      };
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'breadcrumb-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(breadcrumbSchema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [location.pathname, dict, locale]);

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

      {/* Mobile Floating Quick-Action Bar for Instant Booking Conversions */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-2 p-2 bg-ocean-dark/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-ocean-dark/50 animate-fade-in">
        <a
          href={`https://wa.me/${db?.contact?.phone?.replace(/\+/g, '').replace(/\s+/g, '') || '995592055017'}?text=${encodeURIComponent(locale === 'ge' ? 'გამარჯობა, მინდა საპ ბორდის დაჯავშნა supsurf.ge-დან' : locale === 'ru' ? 'Здравствуйте, хочу забронировать сапборд на supsurf.ge' : 'Hello, I would like to book a SUP board from supsurf.ge')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          <span>{locale === 'ge' ? 'WhatsApp დაჯავშნა' : locale === 'ru' ? 'WhatsApp Бронь' : 'WhatsApp Book'}</span>
        </a>

        <a
          href={db?.contact?.instagram || 'https://www.instagram.com/sun_set_paddle/'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
          aria-label="Instagram"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
      </div>
    </>
  );
}
