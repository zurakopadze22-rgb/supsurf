import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Waves, ArrowRight, ShieldCheck, Heart, Users, CheckCircle2, Play, Sparkles,
  Clock, MapPin, BadgePercent, Compass, HelpCircle, Briefcase, MessageCircle, Phone
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import type { Locale } from '@/lib/get-dictionary';
import initialDb from '../data/db.json';

const DAILY_RATES = {
  sup_allround: 30,
  sup_touring: 40,
  surf_soft: 35,
  surf_hard: 50,
  wingfoil: 100,
  accessories: 10,
};

function renderVideoOrYoutube(url: string, isBackground: boolean = false, poster?: string, isMobile: boolean = false) {
  if (!url) {
    url = isBackground
      ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  }

  const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(youtubeRegExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    if (isBackground) {
      if (isMobile) {
        return (
          <div className="w-full h-full relative overflow-hidden bg-ocean-dark">
            <img
              src={poster || "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=1200&q=80"}
              className="w-full h-full object-cover absolute inset-0 scale-105"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          </div>
        );
      }
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`;
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full object-cover scale-[1.35] pointer-events-none absolute inset-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Background Video"
        />
      );
    } else {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full absolute inset-0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video Player"
        />
      );
    }
  }

  const instagramRegExp = /(?:instagram\.com\/p\/|instagram\.com\/reel\/)([A-Za-z0-9_-]+)/;
  const instaMatch = url.match(instagramRegExp);

  if (instaMatch) {
    const postId = instaMatch[1];
    const embedUrl = `https://www.instagram.com/p/${postId}/embed`;
    return (
      <iframe
        src={embedUrl}
        className="w-full h-full absolute inset-0 border-0"
        scrolling="no"
        allowTransparency={true}
        allowFullScreen
        title="Instagram Reel Player"
      />
    );
  }

  return (
    <video
      autoPlay={isBackground}
      loop={true}
      muted={isBackground}
      playsInline
      controls={!isBackground}
      className="w-full h-full object-cover"
      poster={poster}
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default function Home() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(initialDb);
  const [dbLoading, setDbLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setDbLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load DB in Home page:', err);
        setDbLoading(false);
      });
  }, []);

  // Inject LocalBusiness Schema for AEO/GEO/SEO
  useEffect(() => {
    const schemaId = 'home-localbusiness-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const homeWebPageSchema = {
      '@type': 'WebPage',
      '@id': `https://supsurf.ge/${locale}/#webpage`,
      'url': `https://supsurf.ge/${locale}`,
      'name': locale === 'ge' 
        ? 'საპ ბორდების გაქირავება თბილისში — SUPSURF.GE' 
        : locale === 'ru' 
          ? 'Аренда сапбордов в Тбилиси и Грузии — SUPSURF.GE' 
          : 'SUP Board Rental Tbilisi & Georgia — SUPSURF.GE',
      'description': locale === 'ge' 
        ? 'საპ ბორდების გაქირავება და გაყიდვა საქართველოში (თბილისის ზღვის ბაზა). საუკეთესო დღიური ფასები (50 ლარი/დღე), სრული აღჭურვილობა შედის ფასში.' 
        : locale === 'ru'
          ? 'Аренда и продажа SUP-бордов в Грузии (база на Тбилисском море). Отличные цены (50 GEL/день), полные комплекты снаряжения.'
          : 'Premium SUP board rentals and sales in Georgia (Tbilisi Sea base). Best daily rates (50 GEL/day), full adventure gear included.',
      'isPartOf': { '@id': 'https://supsurf.ge/#website' },
      'about': { '@id': 'https://supsurf.ge/#localbusiness' },
      'inLanguage': locale === 'ge' ? 'ka-GE' : locale === 'ru' ? 'ru-GE' : 'en-GE'
    };

    const faqSchema = {
      '@type': 'FAQPage',
      '@id': `https://supsurf.ge/${locale}/#faq`,
      'mainEntity': locale === 'ge' ? [
        {
          '@type': 'Question',
          'name': 'რა ღირს საპ ბორდის გაქირავება თბილისში (დღიურად და საათობრივად)?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'SUPSURF.GE-ზე საპ ბორდის 1 დღით (24 საათი) გაქირავების ფასია 50 ლარი, ხოლო 2 დღით — 80 ლარი. თბილისის ზღვის სადგურზე საათობრივი ქირაობა ღირს 25 ლარი (პირველი საათი) და 20 ლარი ყოველი მომდევნო საათი. ფასში შედის სრული 7-ნაწილიანი აღჭურვილობა.'
          }
        },
        {
          '@type': 'Question',
          'name': 'სად მდებარეობს SUPSURF.GE-ს სადგური თბილისში და შეიძლება თუ არა დაფის წაღება სხვა ტბებზე?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ჩვენი მთავარი სადგური მდებარეობს თბილისში, თბილისის ზღვაზე (ღიაა ყოველდღე 08:00–21:00). დღიური გაქირავებისას გადმოგეცემათ კომპაქტური ზურგჩანთა სრული ინვენტარით, რომლის წაღებაც შეგიძლიათ ლისის ტბაზე, ბაზალეთის ტბაზე, ჟინვალის წყალსაცავზე, სიონზე, შაორზე ან შავი ზღვის სანაპიროზე.'
          }
        },
        {
          '@type': 'Question',
          'name': 'რა შედის საპ ბორდის გაქირავების 50 ლარიან კომპლექტში?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '50 ლარიან დღიურ პაკეტში შედის სრული 7-ნაწილიანი ეკიპირება: 1) გასაბერი საპ ბორდი (SUP დაფა), 2) რეგულირებადი მსუბუქი ნიჩაბი, 3) სერტიფიცირებული სამაშველო ჟილეტი, 4) წყალგაუმტარი ტელეფონის ქეისი, 5) უსაფრთხოების ფეხის თოკი (Leash), 6) მაღალი წნევის ტუმბო და მოსახსნელი ფარფლი, 7) კომპაქტური ზურგჩანთა.'
          }
        },
        {
          '@type': 'Question',
          'name': 'საჭიროა თუ არა დეპოზიტი (გირაო) ან წინასწარი გადახდა საპ ბორდის ქირაობისას?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'არა, SUPSURF.GE-ზე საპ ბორდის დაჯავშნა და ქირაობა ხდება 0 ლარი დეპოზიტით (გირაოს გარეშე). თანხას იხდით ადგილზე აღჭურვილობის მიღებისას.'
          }
        },
        {
          '@type': 'Question',
          'name': 'შეუძლია თუ არა დამწყებს ან ცურვის არმცოდნეს საპ ბორდით სრიალი?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'დიახ! ჩვენი განიერი (81–84 სმ) All-Round საპ დაფები გამოირჩევა მაქსიმალური სტაბილურობით, ხოლო კომპლექტში შემავალი სერტიფიცირებული სამაშველო ჟილეტი უზრუნველყოფს სრულ უსაფრთხოებას წყალზე. სურვილის შემთხვევაში შეგიძლიათ ჩაეწეროთ 90-წუთიან გაკვეთილზე ინსტრუქტორთან (45 ლარი).'
          }
        },
        {
          '@type': 'Question',
          'name': 'რა წონას უძლებს გასაბერი საპ ბორდი და როგორ დავჯავშნო?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ჩვენი საპ ბორდები უძლებს 150–158 კგ-მდე დატვირთვას, რაც საშუალებას იძლევა დაფაზე დადგეს ნებისმიერი წონის ზრდასრული ან ზრდასრული ბავშვთან ერთად. დასაჯავშნად მოგვწერეთ საიტზე ან WhatsApp-ზე: +995 592 05 50 17.'
          }
        }
      ] : locale === 'ru' ? [
        {
          '@type': 'Question',
          'name': 'Сколько стоит аренда сапборда в Тбилиси (посуточно и почасово)?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Посуточная аренда сапборда на 1 день (24 часа) стоит 50 GEL, на 2 дня — 80 GEL. Почасовой прокат на станции на Тбилисском море стоит 25 GEL за первый час и 20 GEL за каждый последующий час. В цену включен полный комплект из 7 предметов.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Где находится станция SUPSURF.GE в Тбилиси и можно ли взять сап на другие озера?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Главная станция расположена на Тбилисском море (открыта ежедневно с 08:00 до 21:00). При посуточной аренде вы получаете компактный рюкзак со всем снаряжением, который легко помещается в багажник авто для поездок на озеро Лиси, Базалети, Жинвали, Сиони, Шаори или в Батуми.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Что входит в комплект аренды сапборда за 50 GEL?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'В суточный комплект входят 7 предметов: устойчивая надувная SUP-доска, регулируемое весло, сертифицированный спасательный жилет, водонепроницаемый чехол для телефона, страховочный лиш, насос высокого давления с плавником и удобный рюкзак для переноски.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Нужен ли залог (депозит) или предоплата для аренды сапборда?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Нет, мы предоставляем сапборды в аренду без залога (0 GEL депозит) и без предоплаты. Оплата производится при получении снаряжения.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Подходит ли сапборд для новичков и какая максимальная нагрузка доски?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Да! Наши широкие доски (81–84 см) выдерживают до 150–158 кг и идеально подходят для новичков. В комплект входит спасательный жилет, а на Тбилисском море доступны 90-минутные уроки с инструктором (45 GEL).'
          }
        },
        {
          '@type': 'Question',
          'name': 'Как быстро забронировать сапборд в Тбилиси?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Вы можете оставить заявку прямо на сайте supsurf.ge или написать нам в WhatsApp по номеру +995 592 05 50 17.'
          }
        }
      ] : [
        {
          '@type': 'Question',
          'name': 'How much does SUP board rental cost in Tbilisi (daily and hourly)?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Daily 24-hour SUP rental is 50 GEL for 1 day or 80 GEL for 2 days. Hourly paddleboard rental at our Tbilisi Sea station is 25 GEL for the first hour and 20 GEL for each additional hour. All rentals include a full 7-piece equipment kit.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Where is the SUPSURF.GE station in Tbilisi and can I take the board to other lakes?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our main watersports station is located at Tbilisi Sea (open daily 08:00–21:00). With our daily rental, you receive a compact travel backpack that fits in any car trunk so you can paddle at Lisi Lake, Bazaleti Lake, Zhinvali Reservoir, Sioni Reservoir, Shaori Lake, or Batumi.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is included in the 50 GEL daily SUP rental package?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The 7-piece kit includes: 1) Premium inflatable SUP board, 2) Adjustable lightweight paddle, 3) Certified safety life vest (PFD), 4) Waterproof phone pouch, 5) Safety ankle leash, 6) High-pressure pump & removable fin, and 7) Ergonomic travel backpack.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is a security deposit or upfront payment required to rent a SUP board?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No! SUPSURF.GE operates with a 0 GEL advance deposit policy. You pay upon picking up your equipment.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is paddleboarding suitable for beginners and what is the weight limit?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! Our wide all-round boards (32–34 inches) support up to 150–158 kg (350 lbs) and provide exceptional stability for first-timers. Every rental includes a certified life vest, and we also offer 90-minute coached lessons at Tbilisi Sea for 45 GEL.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How can I book a SUP board in Tbilisi?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'You can book directly on supsurf.ge or message us on WhatsApp at +995 592 05 50 17 for instant confirmation.'
          }
        }
      ]
    };

    const combinedSchema = {
      '@context': 'https://schema.org',
      '@graph': [homeWebPageSchema, faqSchema]
    };

    script.text = JSON.stringify(combinedSchema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [locale]);

  const promo = dict.promo;
  const promoTitle = db?.promo_title?.[locale] || promo.title;
  const promoSubtitle = db?.promo_subtitle?.[locale] || promo.subtitle;
  // დეფოლტად უზის ხარისხიანი საპ ბორდების სურათი, თუ ბაზიდან არ მოვა
  const promoImage = db?.promo_image || '/pictures/paddleboard-1.webp';
  const dbKitItems = db?.kit_items || [];

  const keywordTags = {
    en: ['SUP Board Rental Tbilisi', 'Tbilisi Sea Paddleboarding', 'Rent SUP 50 GEL/Day', 'Lisi & Zhinvali SUP', 'Buy Inflatable SUP Georgia'],
    ge: ['საპ ბორდების გაქირავება თბილისში', 'საპი თბილისის ზღვაზე', 'საპ ბორდის ქირაობა 50₾', 'წყლის დაფის გაქირავება', 'საპ ბორდი ლისის ტბაზე', 'საპ დაფების ყიდვა'],
    ru: ['Аренда сапбордов Тбилиси', 'Прокат сапов Тбилисское море', 'Сапборд 50 GEL/день', 'Сап туры Грузия', 'Купить сапборд Тбилиси'],
  };

  const activeTags = keywordTags[locale] || keywordTags.en;

  const kitItems = dbKitItems.map((item: any) => ({
    key: item.key,
    image: item.image,
    title: item.title[locale] || item.title.en,
    desc: item.desc[locale] || item.desc.en,
  }));

  // ტექსტების თარგმანი ახალი სექციისთვის ქართულად/ინგლისურად/რუსულად
  const labels = {
    claimPromo: locale === 'ge' ? 'ისარგებლე აქციით' : locale === 'ru' ? 'Воспользоваться акцией' : 'Claim Special Rate',
    whatsAppBtn: locale === 'ge' ? 'დაჯავშნე WhatsApp-ით' : locale === 'ru' ? 'Забронировать через WhatsApp' : 'Book via WhatsApp',
    bestValue: locale === 'ge' ? '⭐ საუკეთესო ფასი' : locale === 'ru' ? '⭐ Лучшая цена' : '⭐ Best Value',
    mostPopular: locale === 'ge' ? 'ყველაზე პოპულარული' : locale === 'ru' ? 'Самый популярный' : 'Most Popular',
    summerSale: locale === 'ge' ? '☀️ საზაფხულო აქცია' : locale === 'ru' ? '☀️ Летняя აქция' : '☀️ Summer Sale',
    insteadOfLight1: locale === 'ge' ? '70₾-ის ნაცვლად' : locale === 'ru' ? 'вместо 70₾' : 'instead of 70₾',
    insteadOfLight2: locale === 'ge' ? '100₾-ის ნაცვლად' : locale === 'ru' ? 'вместо 100₾' : 'instead of 100₾',
    wholeDay: locale === 'ge' ? 'მთელი დღე' : locale === 'ru' ? 'весь день' : 'whole day',
    weekendTrip: locale === 'ge' ? 'უქმეები / ტური' : locale === 'ru' ? 'выходные / тур' : 'weekend / trip'
  };

  const features = locale === 'ge' ? [
    'საპ დაფა',
    'ნიჩაბი',
    'სამაშველო ჟილეტი',
    'ლიში (უსაფრთხოების თოკი)',
    'ტელეფონის წყალგამძლე ქეისი',
    'ელექტრო და მექანიკური ტუმბო',
    'ფარფლი',
    'ჩანთა სატარებლად'
  ] : locale === 'ru' ? [
    'SUP доска',
    'Весло',
    'Спасательный жилет',
    'Лиш (страховочный шнур)',
    'Водонепроницаемый чехол для телефона',
    'Электрический и ручной насос',
    'Плавник',
    'Сумка-рюкзак для переноски'
  ] : [
    'SUP board',
    'Paddle',
    'Life jacket',
    'Leash',
    'Waterproof phone case',
    'Electric & hand pump',
    'Fin',
    'Backpack carry bag'
  ];

  const whatsappNumber = db?.contact?.whatsapp || '995555123456';

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO SECTION WITH IMAGE BACKGROUND */}
      <section className="relative overflow-hidden min-h-0 md:min-h-[85vh] flex items-start md:items-center bg-ocean-dark text-white pt-20 md:pt-24 pb-8 md:pb-20">

        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-80">
          <img
            src={db?.promo_image || "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=1200&q=80"}
            alt="Hero Background"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-ocean-dark"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Hero Text content */}
            <div className="lg:col-span-7 space-y-4 md:space-y-8 text-left">
              <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ocean-teal/20 px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-ocean-cyan border border-ocean-teal/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  {locale === 'ge'
                    ? '🏄‍♂️ SUPSURF.GE — საპების გაქირავება & გაყიდვა საქართველოში'
                    : locale === 'ru'
                      ? '🏄‍♂️ SUPSURF.GE — Аренда и продажа SUP-бордов в Грузии'
                      : '🏄‍♂️ SUPSURF.GE — Premium SUP Rentals & Sales in Georgia'}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-2xl text-white">
                {promoTitle}
              </h1>

              <p className="font-sans text-base md:text-lg text-ocean-cyan/80 leading-relaxed max-w-xl mr-auto ml-0 lg:mx-0">
                {promoSubtitle}
              </p>

              {/* Quick Steps Visual Flow */}
              <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm text-left">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/20 text-orange-400 flex items-center justify-center shrink-0 font-black text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                      {locale === 'ge' ? 'აირჩიე დაფა' : locale === 'ru' ? 'Выбери сап' : 'Choose SUP'}
                    </h4>
                    <p className="font-sans text-[9px] sm:text-[10px] text-white/60 mt-0.5 leading-tight">
                      {locale === 'ge' ? 'სრულ კომპლექტში' : locale === 'ru' ? 'Вся экипировка' : 'Full kit is included'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm text-left">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/20 text-teal-400 flex items-center justify-center shrink-0 font-black text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                      {locale === 'ge' ? 'მიიღე სადგურზე' : locale === 'ru' ? 'Забери на станции' : 'Pick Up Station'}
                    </h4>
                    <p className="font-sans text-[9px] sm:text-[10px] text-white/60 mt-0.5 leading-tight">
                      {locale === 'ge' ? 'თბილისი, ბათუმი...' : locale === 'ru' ? 'Тбилиси, Батуми...' : 'Tbilisi, Batumi...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm text-left">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 font-black text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-display text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
                      {locale === 'ge' ? 'ისრიალე წყალზე' : locale === 'ru' ? 'Катайся в кайф' : 'Ride & Enjoy'}
                    </h4>
                    <p className="font-sans text-[9px] sm:text-[10px] text-white/60 mt-0.5 leading-tight">
                      {locale === 'ge' ? 'თავისუფლად, ტურის გარეშე' : locale === 'ru' ? 'Без спешки და гидов' : 'Explore on your own'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#booking-section"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ocean-coral to-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-ocean-coral/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all font-display"
                >
                  {dict.home.hero.rentCTA}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to={`/${locale}/shop`}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all font-display"
                >
                  {dict.home.hero.shopCTA}
                </Link>
              </div>

              {/* Mobile Promo Cards - Single unified clickable card & advantages */}
              {isMobile && (
                <div className="space-y-2.5 max-w-sm ml-0 mr-auto w-full mt-2.5">
                  {/* Unified Promo Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setModalItem(locale === 'ge' ? 'საპ აქცია (50ლ / 80ლ)' : 'SUP Special Promo (50GEL / 80GEL)');
                      setModalOpen(true);
                    }}
                    className="w-full block p-3 rounded-2xl bg-gradient-to-br from-white to-ocean-light/50 border border-ocean-teal/20 backdrop-blur-md shadow-lg text-left hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="border-b border-ocean-slate/10 pb-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-black uppercase text-ocean-teal tracking-wider">
                          ☀️ {labels.summerSale}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-black text-emerald-600 border border-emerald-500/20">
                          SALE
                        </span>
                      </div>
                      <span className="block font-sans text-xs font-black text-center mt-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md uppercase tracking-wider">
                        {locale === 'ge' ? 'იქირავე სრული აღჭურვილობა' : locale === 'ru' ? 'Аренда полного комплекта' : 'Rent Full Adventure Equipment'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      {/* 1 Day Option */}
                      <div className="bg-white/90 border border-ocean-slate/10 p-2.5 rounded-xl text-left">
                        <span className="block font-display text-[9px] font-black text-ocean-dark/70 uppercase tracking-wider">{promo.day_1}</span>
                        <div className="mt-1 flex items-baseline justify-start gap-1.5">
                          <span className="font-display text-2xl font-black text-blue-600">50₾</span>
                          <span className="font-display text-xs text-red-500 font-bold line-through">70₾</span>
                        </div>
                      </div>

                      {/* 2 Days Option */}
                      <div className="bg-white border-2 border-ocean-teal/40 p-2.5 rounded-xl text-left relative shadow-sm">
                        <span className="absolute top-0 right-0 bg-gradient-to-r from-ocean-teal to-teal-400 px-1.5 py-0.5 text-[6px] font-black uppercase text-white rounded-bl-md">
                          POP
                        </span>
                        <span className="block font-display text-[9px] font-black text-ocean-dark uppercase tracking-wider">{promo.day_2}</span>
                        <div className="mt-1 flex items-baseline justify-start gap-1.5">
                          <span className="font-display text-2xl font-black text-blue-600">80₾</span>
                          <span className="font-display text-xs text-red-500 font-bold line-through">100₾</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25">
                        <span>{labels.claimPromo}</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </button>
                </div>
              )}

              <div className="hidden sm:block pt-6 border-t border-white/10 space-y-3">
                <span className="block font-sans text-xs font-bold text-ocean-cyan/60 uppercase tracking-wider">
                  {dict.home.hero.keywords_label}
                </span>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {activeTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-sans text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Interactive Pricing Showcase Card */}
            <div className="hidden lg:flex lg:col-span-5 lg:order-last justify-center items-center w-full">
              <div
                className="w-full max-w-[390px] rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl border border-ocean-slate/15 flex flex-col justify-between transform hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden bg-gradient-to-br from-white via-white to-ocean-light/50 min-h-[340px] sm:min-h-[385px] md:min-h-[420px]"
              >
                <div className="relative z-10 space-y-4 sm:space-y-6 flex-1 flex flex-col justify-between">
                  <div className="border-b border-ocean-slate/10 pb-2.5 sm:pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm sm:text-base font-extrabold tracking-wide uppercase text-ocean-teal">
                        {labels.summerSale}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-emerald-600 border border-emerald-500/20">
                        SALE
                      </span>
                    </div>
                    <span className="block font-sans text-xs sm:text-sm font-black text-center mt-2.5 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md uppercase tracking-wider">
                      {locale === 'ge' ? 'იქირავე სრული აღჭურვილობა' : locale === 'ru' ? 'Аренда полного комплекта' : 'Rent Full Adventure Equipment'}
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center text-left">
                    {/* 1 Day Package */}
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/70 border border-ocean-slate/15 hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden group shadow-sm">
                      <div className="space-y-0.5">
                        <span className="block font-display text-sm sm:text-base font-extrabold text-ocean-dark tracking-wide uppercase">{promo.day_1}</span>
                        <span className="block font-sans text-[10px] text-ocean-slate">{labels.wholeDay}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span className="font-display text-3xl font-black text-blue-600">50₾</span>
                          <span className="font-display text-sm text-red-500 font-bold line-through">70₾</span>
                        </div>
                      </div>
                    </div>

                    {/* 2 Days Package */}
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border-2 border-ocean-teal/40 hover:border-ocean-teal transition-all duration-300 relative overflow-hidden group shadow-md">
                      {/* Most Popular Badge */}
                      <div className="absolute top-0 left-0">
                        <span className="inline-flex items-center rounded-br-xl bg-gradient-to-r from-ocean-teal to-teal-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                          {labels.mostPopular}
                        </span>
                      </div>

                      <div className="space-y-0.5 pt-1">
                        <span className="block font-display text-sm sm:text-base font-extrabold text-ocean-dark tracking-wide uppercase">{promo.day_2}</span>
                        <span className="block font-sans text-[10px] text-ocean-slate">{labels.weekendTrip}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1.5">
                          <span className="font-display text-3xl font-black text-blue-600">80₾</span>
                          <span className="font-display text-sm text-red-500 font-bold line-through">100₾</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalItem(locale === 'ge' ? 'საპ აქცია (50ლ / 80ლ)' : 'SUP Special Promo (50GEL / 80GEL)');
                        setModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 py-3.5 text-sm font-black text-white transition-all shadow-md shadow-emerald-500/25 font-display cursor-pointer uppercase tracking-wider"
                    >
                      <span>{labels.claimPromo}</span>
                      <ArrowRight className="w-4.5 h-4.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* 2.5 COMBINED: RENTAL OPTIONS & ADVANTAGES */}
      <section className="bg-white py-10 md:py-20 border-b border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left side: Why Self-Rent & What's Included */}
            <div className="hidden md:block lg:col-span-7 space-y-8">
              <div className="space-y-4 text-center lg:text-left">
                <span className="text-xs font-extrabold uppercase tracking-widest text-ocean-teal bg-ocean-teal/10 px-3 py-1 rounded-full">
                  {locale === 'ge' ? 'რატომ supsurf.ge?' : locale === 'ru' ? 'Почему supsurf.ge?' : 'Why supsurf.ge?'}
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-ocean-dark tracking-tight">
                  {locale === 'ge' ? 'რატომ სჯობს დღიური გაქირავება?' : locale === 'ru' ? 'Почему посуточная аренда лучше?' : 'Why is daily rental better?'}
                </h2>
                <p className="hidden sm:block font-sans text-sm text-ocean-slate leading-relaxed">
                  {locale === 'ge'
                    ? 'იქირავე სრული კომპლექტი ყოველგვარი ფარული ხარჯების გარეშე. ჩვენ გაძლევთ სრულ თავისუფლებას, რათა აღმოაჩინოთ საქართველოს ულამაზესი ტბები საკუთარი განრიგით.'
                    : locale === 'ru'
                      ? 'Арендуйте полный комплект без скрытых комиссий. Мы даем вам полную свободу для исследования красивейших озер Грузии по собственному графику.'
                      : 'Rent a complete kit with zero hidden fees. We give you total freedom to explore Georgia\'s most beautiful lakes on your own schedule.'}
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 pt-6 border-t border-ocean-slate/10">

                {/* 1. Schedule */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 font-display text-lg shrink-0">
                    ⏰
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'შენი განრიგი' : locale === 'ru' ? 'Свой график' : 'Your Schedule'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'ისრიალე დღიურად, ტურების ფიქსირებული დროის გარეშე.' : locale === 'ru' ? 'Катайся посуточно, без жестких графиков туров.' : 'Rent by day, no rigid tour timelines or restrictions.'}
                    </p>
                  </div>
                </div>

                {/* 2. Lakes */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'ნებისმიერი ლოკაცია' : locale === 'ru' ? 'Любая локация' : 'Any Location'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'წაიღე დაფა ყველგან: სიონი, ჟინვალი, ბაზალეთი თუ ზღვა.' : locale === 'ru' ? 'Возьми сап на Сиони, Жинвали, Базалети или на море.' : 'Take your board to Sioni, Zhinvali, Bazaleti, or the sea.'}
                    </p>
                  </div>
                </div>

                {/* 3. Budget */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                    <BadgePercent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'ბიუჯეტური & ხელმისაწვდომი' : locale === 'ru' ? 'Выгодно и доступно' : 'Budget-Friendly'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'თვითმომსახურება ნიშნავს მეტ დროს წყალზე ნაკლებ ფასად.' : locale === 'ru' ? 'Самовывоз — это больше времени на воде за меньшие деньги.' : 'Self-serve model means more time on the water for less money.'}
                    </p>
                  </div>
                </div>

                {/* 4. No Rush */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'სრული აუჩქარებლობა' : locale === 'ru' ? 'Без спешки' : 'No Guide, No Rush'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'აღმოაჩინე ბუნება შენი ტემპით, გიდების და ჯგუფების გარეშე.' : locale === 'ru' ? 'Исследуй природу в своем темпе, без гидов и спешки.' : 'Explore nature at your own pace without guided tour rush.'}
                    </p>
                  </div>
                </div>

                {/* 5. Group Fun */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'ჯგუფური გასვლები' : locale === 'ru' ? 'Для компаний' : 'Group Adventures'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'დაფები მეგობრებისთვის, ოჯახისთვის თუ გუნდური გასვლებისთვის.' : locale === 'ru' ? 'Доски для друзей, семейного отдыха или корпоративов.' : 'Rent multiple boards for families, friends, or team building.'}
                    </p>
                  </div>
                </div>

                {/* 6. Full Kit */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-bold text-ocean-dark">
                      {locale === 'ge' ? 'ყველაფერი კომპლექტშია' : locale === 'ru' ? 'Все включено' : 'All-Inclusive Kit'}
                    </h4>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-normal">
                      {locale === 'ge' ? 'დაფა, ნიჩაბი, ჟილეტი, ლიში, ქეისი, ტუმბო, ფარფლი, ჩანთა — ყველაფერი შედის ფასში.' : locale === 'ru' ? 'Сап, весло, жилет, лиш, чехол, насос, плавник, рюкзак — все входит.' : 'Board, paddle, vest, leash, phone case, pump, fin, bag included.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Mobile-only Compact Advantages & Shop Banner */}
            <div className="md:hidden w-full space-y-6">
              {/* Shop Banner */}
              <Link
                to={`/${locale}/shop`}
                className="bg-gradient-to-r from-ocean-dark to-ocean-navy border border-white/10 rounded-[2rem] p-5 flex flex-row items-center justify-between gap-4 hover:bg-white/10 transition-all duration-300 block text-left"
              >
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-display text-xs font-black text-white leading-none">
                    {locale === 'ge' ? 'შეიძინე საპ ბორდი' : locale === 'ru' ? 'Купить SUP-борд' : 'Buy SUP Board'}
                  </h3>
                  <p className="font-sans text-[9px] text-white/60 leading-tight">
                    {locale === 'ge'
                      ? 'უმაღლესი ხარისხის გასაბერი დაფები და აქსესუარები გარანტიით.'
                      : 'Premium inflatable paddle boards and accessories.'}
                  </p>
                  <div className="inline-flex items-center gap-1 font-display text-[9px] font-bold text-ocean-teal">
                    <span>{locale === 'ge' ? 'მაღაზიაში გადასვლა' : 'Explore Shop'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img
                    src="/pictures/paddleboard.webp"
                    alt="SUP Boards Shop"
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              {/* Advantages List */}
              <div className="space-y-4">
                <div className="space-y-2 text-left">

                  <h3 className="font-display text-lg font-black text-ocean-dark tracking-tight leading-tight">
                    {locale === 'ge' ? 'დღიური გაქირავების ბენეფიტები' : locale === 'ru' ? 'Преимущества посуточной аренды' : 'Benefits of Daily Rental'}
                  </h3>

                </div>

                {/* 6 Advantages Cards in 2-column compact grid */}
                <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-ocean-slate/10 text-left">
                  {/* 1. Schedule */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 font-display text-sm shrink-0">
                      ⏰
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'შენი განრიგი' : locale === 'ru' ? 'Свой график' : 'Your Schedule'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'ისრიალე დღიურად, ტურების დროის გარეშე.' : locale === 'ru' ? 'Катайся посуточно, без жестких графиков.' : 'Rent by day, no rigid tour timelines.'}
                      </p>
                    </div>
                  </div>

                  {/* 2. Pace */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'შენი ტემპი' : locale === 'ru' ? 'Свой темп' : 'Your Pace'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'აღმოაჩინე ბუნება შენს ტემპში, გიდების გარეშე.' : locale === 'ru' ? 'Исследуй природу в своем темпе, без гидов.' : 'Explore nature at your own pace.'}
                      </p>
                    </div>
                  </div>

                  {/* 3. Location */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-500 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'ნებისმიერი ლოკაცია' : locale === 'ru' ? 'Любая локация' : 'Any Location'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'წაიღე დაფა სიონზე, ჟინვალზე თუ ზღვაზე.' : locale === 'ru' ? 'Возьми сап на Сиони, Жинвали или на море.' : 'Take your board to Sioni, Zhinvali, or the sea.'}
                      </p>
                    </div>
                  </div>

                  {/* 4. Budget */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                      <BadgePercent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'ბიუჯეტური' : locale === 'ru' ? 'Выгодно' : 'Budget-Friendly'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'მეტი დრო წყალზე ნაკლებ ფასად.' : locale === 'ru' ? 'Больше времени за меньше денег.' : 'More time on water for less money.'}
                      </p>
                    </div>
                  </div>

                  {/* 5. Full Kit */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'სრული კომპლექტი' : locale === 'ru' ? 'Полный комплект' : 'Full Kit'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'დაფა, ნიჩაბი, ჟილეტი და ყველა საჭირო აქსესუარი.' : locale === 'ru' ? 'Сап, весло, жилет и все аксессуары.' : 'Board, paddle, vest and all needed accessories.'}
                      </p>
                    </div>
                  </div>

                  {/* 6. Unique Experience */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-[11px] font-bold text-ocean-dark leading-none">
                        {locale === 'ge' ? 'უნიკალური გამოცდილება' : locale === 'ru' ? 'Уникальный опыт' : 'Unique Experience'}
                      </h4>
                      <p className="font-sans text-[9px] text-ocean-slate leading-tight">
                        {locale === 'ge' ? 'გაატარე დაუვიწყარი დრო მეგობრებთან ერთად.' : locale === 'ru' ? 'Проведите незабываемое время с друзьями.' : 'Spend unforgettable time with friends.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* Right side: Compact Pricing Cards */}
            <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 w-full max-w-sm mx-auto">



            </div>

          </div>
        </div>
      </section>
      {/* 5. BUY YOUR SUP BOARD PROMO SECTION */}
      <section className="hidden md:block bg-gradient-to-r from-ocean-dark to-ocean-navy py-6 sm:py-16 overflow-hidden relative border-b border-ocean-slate/10">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-ocean-teal/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-ocean-coral/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <Link
            to={`/${locale}/shop`}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-12 lg:p-16 flex flex-row items-center justify-between gap-4 sm:gap-8 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] hover:shadow-2xl hover:shadow-ocean-teal/5 transition-all duration-500 group block"
          >
            {/* Left Column: Text content */}
            <div className="space-y-2 sm:space-y-6 lg:max-w-xl text-left flex-1">
              <span className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[10px] font-bold text-ocean-teal bg-ocean-teal/10 px-3.5 py-1.5 rounded-full border border-ocean-teal/20 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                {locale === 'ge' ? 'ონლაინ მაღაზია' : locale === 'ru' ? 'Онлайн-магазин' : 'Online Store'}
              </span>
              <h2 className="font-display text-sm sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {locale === 'ge'
                  ? 'შეიძინე საპ ბორდი'
                  : locale === 'ru'
                    ? 'Купить SUP-борд'
                    : 'Buy SUP Board'}
              </h2>
              <p className="font-sans text-xs sm:text-base text-ocean-cyan/70 leading-relaxed hidden sm:block">
                {locale === 'ge'
                  ? 'აღმოაჩინე უმაღლესი ხარისხის გასაბერი დაფებისა და აქსესუარების საუკეთესო არჩევანი საქართველოში. ოფიციალური გარანტიით, ტესტირებითა და უფასო კონსულტაციით.'
                  : locale === 'ru'
                    ? 'Откройте для себя лучший выбор надувных сапбордов и аксессуаров в Грузии. Официальная гарантия, тест-драйв и бесплатная консультация.'
                    : 'Discover the finest collection of premium inflatable paddle boards and gear in Georgia. Comes with official warranty, lake testing, and expert advice.'}
              </p>
              <div className="pt-0.5 sm:pt-2 flex justify-start">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 hover:from-orange-500 hover:to-ocean-coral text-white px-3 sm:px-6 py-2 sm:py-3.5 text-[9px] sm:text-xs font-bold font-display shadow-md shadow-ocean-coral/25 group-hover:scale-105 transition-all duration-300">
                  <span>{locale === 'ge' ? 'მაღაზიაში გადასვლა' : locale === 'ru' ? 'Перейти в магазин' : 'Explore Shop'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Right Column: Promotional Image card */}
            <div className="relative w-20 h-20 sm:w-64 sm:h-auto sm:aspect-[4/3] lg:max-w-lg lg:w-full rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 sm:border-2 shadow-2xl shrink-0 group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/pictures/paddleboard.webp"
                alt="SUP Boards Shop"
                width={400}
                height={300}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/60 via-transparent to-transparent hidden sm:block"></div>
              <div className="absolute bottom-4 left-4 right-4 hidden sm:flex justify-between items-center bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-xl">
                <div>
                  <h4 className="font-display text-[11px] lg:text-sm font-bold text-white leading-none">NOVA 3.0 SUP</h4>
                  <span className="text-[9px] text-ocean-teal font-semibold font-sans mt-1 block">Tours, Lakes & Waves</span>
                </div>
                <span className="font-display text-[11px] lg:text-sm font-extrabold text-white bg-ocean-dark/50 border border-white/10 px-2 py-0.5 rounded-lg">
                  1,150 GEL
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. INCLUDED EQUIPMENT GRID */}
      <section className="bg-ocean-light/30 py-10 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ocean-dark">
              {promo.kit_includes_title}
            </h2>
            <p className="hidden sm:block font-sans text-base text-ocean-slate max-w-2xl mx-auto">
              {promo.kit_includes_desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {dbLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-3xl bg-ocean-light animate-pulse border border-ocean-slate/10"></div>
              ))
            ) : (
              kitItems.map((item: any) => (
                <div
                  key={item.key}
                  className="rounded-3xl bg-white border border-ocean-slate/10 p-3 sm:p-5 shadow-sm hover:shadow-md hover:border-ocean-teal/40 transition-all flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4.5 group"
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-ocean-slate/15 shadow-sm shrink-0 bg-ocean-light/50 flex items-center justify-center group-hover:border-ocean-teal/30 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1 mt-0.5">
                    <h3 className="font-display text-sm sm:text-base font-bold text-ocean-dark group-hover:text-ocean-teal transition-colors">
                      {item.title}
                    </h3>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEW: SUP SESSIONS SECTION */}
      <section className="bg-white py-12 md:py-20 border-b border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left side: Image and details */}
            <div className="lg:col-span-6 relative rounded-[2rem] overflow-hidden border border-ocean-slate/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
                alt="SUP Session Group"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/70 via-ocean-dark/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <span className="inline-flex items-center gap-1 bg-ocean-teal px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {locale === 'ge' ? 'აქტიური დასვენება' : locale === 'ru' ? 'Активный отдых' : 'Active Recreation'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black">
                  {locale === 'ge' ? 'ჯგუფური საპ სეირნობები' : locale === 'ru' ? 'Групповые SUP-прогулки' : 'Group SUP Tours'}
                </h3>
                <p className="font-sans text-xs text-white/80 mt-1 leading-relaxed">
                  {locale === 'ge'
                    ? 'შეიკრიბეთ მეგობრები, ოჯახი ან კოლეგები და მოაწყვეთ დაუვიწყარი დღე წყალზე.'
                    : locale === 'ru'
                      ? 'Соберите друзей, семью или коллег и устройте незабываемый день на воде.'
                      : 'Gather friends, family or colleagues and plan an unforgettable day on the water.'}
                </p>
              </div>
            </div>

            {/* Right side: Detailed Information & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="space-y-3">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-ocean-teal bg-ocean-teal/10 px-3 py-1 rounded-full">
                  {locale === 'ge' ? 'სეანსები & ტურები' : locale === 'ru' ? 'Сеансы и Туры' : 'SUP Sessions & Tours'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-ocean-dark tracking-tight leading-none">
                  {locale === 'ge' ? 'როგორ ხდება სეანსების დაჯავშნა?' : locale === 'ru' ? 'Как проходят сеансы?' : 'How do Sessions Work?'}
                </h2>
                <p className="font-sans text-sm text-ocean-slate leading-relaxed">
                  {locale === 'ge'
                    ? 'აღმოაჩინეთ საპ სრიალის ხელოვნება. ჩვენი სეანსები განკუთვნილია როგორც დამწყებთათვის, ისე გამოცდილი მოყვარულებისთვის, სადაც ყველა დეტალი წინასწარაა ორგანიზებული.'
                    : locale === 'ru'
                      ? 'Откройте для себя искусство SUP-серфинга. Наши сеансы подходят как новичкам, так и опытным любителям.'
                      : 'Discover the art of paddleboarding. Our sessions are tailored for both beginners and experienced paddlers.'}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-ocean-slate/10 pt-6">
                <div className="space-y-1">
                  <span className="block font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                    {locale === 'ge' ? '⏰ ხანგრძლივობა' : locale === 'ru' ? '⏰ Длительность' : '⏰ Duration'}
                  </span>
                  <p className="font-sans text-xs text-ocean-slate leading-relaxed">
                    {locale === 'ge' ? '1.5 - 2 საათი' : locale === 'ru' ? '1.5 - 2 часа' : '1.5 - 2 hours'}
                    <span className="block text-[10px] text-ocean-slate/60 mt-0.5">{locale === 'ge' ? 'ინსტრუქტაჟითა და პრაქტიკით' : 'Includes briefing & practice'}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="block font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                    {locale === 'ge' ? '👥 ჯგუფის შეკვრა' : locale === 'ru' ? '👥 Сбор группы' : '👥 Group Size'}
                  </span>
                  <p className="font-sans text-xs text-ocean-slate leading-relaxed">
                    {locale === 'ge' ? 'მინიმუმ 3 ადამიანი' : locale === 'ru' ? 'От 3-х человек' : 'Minimum 3 people'}
                    <span className="block text-[10px] text-ocean-slate/60 mt-0.5">{locale === 'ge' ? 'ან შეუერთდით სხვა ჯგუფებს' : 'Or join existing groups'}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalItem(locale === 'ge' ? 'ჯგუფური საპ სეანსი / ტური' : 'Group SUP Session / Tour');
                    setModalOpen(true);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-ocean-coral/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-display"
                >
                  <MessageCircle className="w-4 h-4 text-white shrink-0" />
                  <span>{locale === 'ge' ? 'დაჯავშნე სეანსი სოც. ქსელით' : locale === 'ru' ? 'Забронировать через соцсети' : 'Book Session via Social Media'}</span>
                </button>

                <div className="text-center sm:text-left">
                  <Link
                    to={`/${locale}/services`}
                    className="inline-flex items-center gap-1.5 font-display text-xs font-extrabold text-ocean-teal hover:text-ocean-cyan transition-colors"
                  >
                    <span>{locale === 'ge' ? 'იხილეთ სრული დეტალები სერვისების გვერდზე' : locale === 'ru' ? 'Смотреть все детали' : 'View full details on Services page'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 4. DEDICATED LIFESTYLE VIDEO SECTION */}
      <section className="hidden md:block bg-white py-20 border-b border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-ocean-teal/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ocean-navy">
                <Play className="w-3.5 h-3.5 fill-ocean-navy text-ocean-navy" />
                <span>SUP Vacation Reel</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ocean-dark leading-tight">
                {promo.video_title}
              </h2>
              <p className="font-sans text-sm text-ocean-slate leading-relaxed">
                {promo.video_desc}
              </p>
              <div className="flex flex-col gap-3.5 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-sans text-xs font-semibold text-ocean-slate">{locale === 'ge' ? 'აქტიური დასვენება და განტვირთვა' : locale === 'ru' ? 'Активный отдых и релакс' : 'Active vacation & mind relaxation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-sans text-xs font-semibold text-ocean-slate">{locale === 'ge' ? 'შაბათ-კვირის მხიარული რბოლები და ჩელენჯები' : locale === 'ru' ? 'Гонки и челленджи на выходных' : 'Weekend races and team challenges'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-sans text-xs font-semibold text-ocean-slate">{locale === 'ge' ? 'ბუნებასთან კავშირი და საოცარი მომენტები' : locale === 'ru' ? 'Связь с природой и яркие моменты' : 'Deeper connection with nature and flows'}</span>
                </div>
              </div>
            </div>

            {/* Right side cinematic player container */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-ocean-navy/15 border-4 border-white group">
                {renderVideoOrYoutube(db?.lifestyle_video_url, false, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80")}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. LIVE BOOKING FORM SECTION */}
      <section id="booking-section" className="bg-gradient-to-b from-white to-blue-50/50 py-12 border-t border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-ocean-dark">
              {locale === 'ge' ? 'დასაჯავშნად დაგვიკავშირდით' : locale === 'ru' ? 'Свяжитесь с нами для бронирования' : 'Contact Us to Book'}
            </h2>
            <p className="hidden sm:block font-sans text-sm text-ocean-slate max-w-lg mx-auto leading-relaxed">
              {locale === 'ge'
                ? 'ჯავშნის მისაღებად დაგვიკავშირდით ნებისმიერ სოციალურ ქსელში ან დაგვირეკეთ მითითებულ ნომერზე.'
                : locale === 'ru'
                  ? 'Свяжитесь с нами в социальных сетях или позвоните по телефону, чтобы подтвердить бронирование.'
                  : 'Get in touch with us on social media or call our number to confirm your booking.'}
            </p>
          </div>

          <div className="max-w-xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">

            {/* WhatsApp Link Card */}
            <a
              href={`https://wa.me/${(db?.contact?.whatsapp || '995592055017').replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-ocean-slate/10 p-3 sm:p-6 rounded-2xl sm:rounded-3xl text-center space-y-2 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-emerald-100 shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-display text-[10px] sm:text-sm font-bold text-ocean-dark">WhatsApp</h3>
            </a>

            {/* Instagram Link Card */}
            <a
              href={db?.contact?.instagram || 'https://www.instagram.com/sun_set_paddle/'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-ocean-slate/10 p-3 sm:p-6 rounded-2xl sm:rounded-3xl text-center space-y-2 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-pink-100 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <h3 className="font-display text-[10px] sm:text-sm font-bold text-ocean-dark">Instagram</h3>
            </a>

            {/* Facebook Link Card */}
            <a
              href="https://www.facebook.com/SUNSETPSUP/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-ocean-slate/10 p-3 sm:p-6 rounded-2xl sm:rounded-3xl text-center space-y-2 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </div>
              <h3 className="font-display text-[10px] sm:text-sm font-bold text-ocean-dark">Facebook</h3>
            </a>

          </div>
        </div>
      </section>

      {/* 6. VISIBLE CUSTOMER REVIEWS & TESTIMONIALS (5.0 ★ RATING FOR LOCAL SEO TRUST) */}
      <section className="py-12 md:py-20 bg-white border-t border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-extrabold text-amber-600 border border-amber-200">
              <span>★★★★★ 5.0 / 5.0</span>
              <span>•</span>
              <span>{locale === 'ge' ? '128+ კმაყოფილი მომხმარებელი თბილისში' : locale === 'ru' ? '128+ довольных клиентов в Тбилиси' : '128+ Verified Riders in Tbilisi'}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ocean-dark tracking-tight">
              {locale === 'ge'
                ? 'რას ამბობენ ჩვენი მომხმარებლები'
                : locale === 'ru'
                  ? 'Отзывы наших клиентов о прокате сапов в Тбилиси'
                  : 'What Our Riders Say About SUP Rental in Tbilisi'}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ocean-slate">
              {locale === 'ge'
                ? 'რეალური შეფასებები თბილისის ზღვის სადგურისა და დღიური გაქირავების მომხმარებლებისგან.'
                : locale === 'ru'
                  ? 'Реальные впечатления гостей станции на Тбилисском море и посуточного проката сапбордов.'
                  : 'Real experiences from visitors at our Tbilisi Sea station and weekend takeaway SUP renters.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: locale === 'ge' ? 'ნიკა კვარაცხელია' : locale === 'ru' ? 'Ника Кварацхелия' : 'Nika Kvaratskhelia',
                spot: locale === 'ge' ? 'თბილისის ზღვა & ჟინვალი' : locale === 'ru' ? 'Тбилисское море и Жинвали' : 'Tbilisi Sea & Zhinvali',
                text: locale === 'ge'
                  ? 'საუკეთესო საპ ბორდების გაქირავება თბილისში! 2 დღით ვიქირავეთ 80 ლარად, ზურგჩანთაში იდეალურად იყო ჩალაგებული ტუმბოც, ჟილეტიც და ტელეფონის წყალგაუმტარი ქეისიც. არანაირი დეპოზიტი არ მოუთხოვიათ!'
                  : locale === 'ru'
                    ? 'Лучшая аренда сапбордов в Тбилиси! Взяли на 2 дня за 80 лари для поездки на Жинвали. В рюкзаке было всё: насос, спасжилет и чехол для телефона. Очень удобно, что без залога!'
                    : 'Best SUP board rental in Tbilisi! We rented for 2 days (80 GEL) and took the backpacks to Zhinvali. Everything was clean and included—life vest, waterproof phone pouch, and pump. Zero deposit!'
              },
              {
                name: locale === 'ge' ? 'ანა მჭედლიძე' : locale === 'ru' ? 'Анна Мчедлидзе' : 'Ana Mchedlidze',
                spot: locale === 'ge' ? 'თბილისის ზღვის სადგური' : locale === 'ru' ? 'Станция на Тбилисском море' : 'Tbilisi Sea Station',
                text: locale === 'ge'
                  ? 'პირველად ვიდექი საპ დაფაზე თბილისის ზღვაზე. დაფები უკვე გაბერილი დაგვხვდა ნაპირზე, ინსტრუქტორმა 5 წუთში აგვიხსნა ბალანსის დაჭერა და მზის ჩასვლისას სასწაული ემოციები მივიღეთ!'
                  : locale === 'ru'
                    ? 'Впервые встала на сапборд на Тбилисском море. Доски уже были накачаны на берегу, инструктор за 5 минут объяснил как держать баланс. На закате вода как зеркало — полный восторг!'
                    : 'First time on a paddleboard at Tbilisi Sea! The boards were already inflated at the shore, and the coach taught us how to stand up in 5 minutes. Paddling at sunset was unforgettable.'
              },
              {
                name: locale === 'ge' ? 'დავით ბერიძე' : locale === 'ru' ? 'Давид Беридзе' : 'Davit Beridze',
                spot: locale === 'ge' ? 'სიონის წყალსაცავი & ბაზალეთი' : locale === 'ru' ? 'Сионское водохранилище' : 'Sioni & Bazaleti Lake',
                text: locale === 'ge'
                  ? 'უკვე მესამედ ვქირაობთ SUPSURF.GE-ში. დაფები არის ძალიან განიერი, მყარი და 150 კგ-მდე უძლებს, ბავშვთან ერთად ვსრიალებ სრულიად უსაფრთხოდ. ფასი 50 ლარი მთელი დღით უკონკურენტოა თბილისში.'
                  : locale === 'ru'
                    ? 'Уже третий раз берем сапы в SUPSURF.GE. Доски широкие и очень устойчивые (до 150 кг), спокойно катаемся вдвоем с ребенком. Цена 50 лари за сутки со всей экипировкой — топ в Тбилиси.'
                    : 'Third time renting from SUPSURF.GE. The boards are wide, rigid, and easily hold me and my kid together. 50 GEL for 24 hours with a carbon paddle and life vest is unbeatable in Tbilisi.'
              }
            ].map((rev, i) => (
              <div key={i} className="bg-ocean-light/40 border border-ocean-slate/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 text-sm font-black tracking-widest">★★★★★</span>
                    <span className="text-[11px] font-bold text-ocean-teal bg-ocean-teal/10 px-2.5 py-1 rounded-full">{rev.spot}</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed italic">
                    “{rev.text}”
                  </p>
                </div>
                <div className="pt-3 border-t border-ocean-slate/10 flex items-center justify-between">
                  <span className="font-display text-xs sm:text-sm font-bold text-ocean-dark">{rev.name}</span>
                  <span className="text-[10px] font-semibold text-emerald-600">✓ Verified Rental</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VISIBLE INTERACTIVE FAQ SECTION (MATCHES FAQPAGE JSON-LD 1:1 FOR GOOGLE RICH SNIPPETS) */}
      <section id="faq" className="py-12 md:py-20 bg-ocean-light/60 border-t border-ocean-slate/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-block rounded-full bg-ocean-teal/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ocean-teal">
              FAQ • SUPSURF.GE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ocean-dark tracking-tight">
              {locale === 'ge'
                ? 'ხშირად დასმული კითხვები — საპ ბორდის გაქირავება თბილისში'
                : locale === 'ru'
                  ? 'Часто задаваемые вопросы — Аренда сапбордов в Тбилиси'
                  : 'Frequently Asked Questions — SUP Board Rental in Tbilisi'}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ocean-slate">
              {locale === 'ge'
                ? 'ყველაფერი ფასების, თბილისის ზღვის სადგურის, უდეპოზიტო ჯავშნისა და აღჭურვილობის შესახებ.'
                : locale === 'ru'
                  ? 'Ответы на главные вопросы о ценах, станции на Тбилисском море, прокате без залога и комплектации.'
                  : 'Clear answers about daily & hourly prices, our Tbilisi Sea station, zero-deposit rentals, and full gear.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {(locale === 'ge' ? [
              {
                q: 'რა ღირს საპ ბორდის გაქირავება თბილისში (დღიურად და საათობრივად)?',
                a: 'SUPSURF.GE-ზე საპ ბორდის 1 დღით (24 საათი) გაქირავების ფასია 50 ლარი, ხოლო 2 დღით — 80 ლარი. თბილისის ზღვის სადგურზე საათობრივი ქირაობა ღირს 25 ლარი (პირველი საათი) და 20 ლარი ყოველი მომდევნო საათი. ფასში შედის სრული 7-ნაწილიანი აღჭურვილობა.'
              },
              {
                q: 'სად მდებარეობს SUPSURF.GE-ს სადგური თბილისში და შეიძლება თუ არა დაფის წაღება სხვა ტბებზე?',
                a: 'ჩვენი მთავარი სადგური მდებარეობს თბილისში, თბილისის ზღვაზე (ღიაა ყოველდღე 08:00–21:00). დღიური გაქირავებისას გადმოგეცემათ კომპაქტური ზურგჩანთა სრული ინვენტარით, რომლის წაღებაც შეგიძლიათ ლისის ტბაზე, ბაზალეთის ტბაზე, ჟინვალის წყალსაცავზე, სიონზე, შაორზე ან შავი ზღვის სანაპიროზე.'
              },
              {
                q: 'რა შედის საპ ბორდის გაქირავების 50 ლარიან კომპლექტში?',
                a: '50 ლარიან დღიურ პაკეტში შედის სრული 7-ნაწილიანი ეკიპირება: 1) გასაბერი საპ ბორდი (SUP დაფა), 2) რეგულირებადი მსუბუქი ნიჩაბი, 3) სერტიფიცირებული სამაშველო ჟილეტი, 4) წყალგაუმტარი ტელეფონის ქეისი, 5) უსაფრთხოების ფეხის თოკი (Leash), 6) მაღალი წნევის ტუმბო და მოსახსნელი ფარფლი, 7) კომპაქტური ზურგჩანთა.'
              },
              {
                q: 'საჭიროა თუ არა დეპოზიტი (გირაო) ან წინასწარი გადახდა საპ ბორდის ქირაობისას?',
                a: 'არა, SUPSURF.GE-ზე საპ ბორდის დაჯავშნა და ქირაობა ხდება 0 ლარი დეპოზიტით (გირაოს გარეშე). თანხას იხდით ადგილზე აღჭურვილობის მიღებისას.'
              },
              {
                q: 'შეუძლია თუ არა დამწყებს ან ცურვის არმცოდნეს საპ ბორდით სრიალი?',
                a: 'დიახ! ჩვენი განიერი (81–84 სმ) All-Round საპ დაფები გამოირჩევა მაქსიმალური სტაბილურობით, ხოლო კომპლექტში შემავალი სერტიფიცირებული სამაშველო ჟილეტი უზრუნველყოფს სრულ უსაფრთხოებას წყალზე. სურვილის შემთხვევაში შეგიძლიათ ჩაეწეროთ 90-წუთიან გაკვეთილზე ინსტრუქტორთან (45 ლარი).'
              },
              {
                q: 'რა წონას უძლებს გასაბერი საპ ბორდი და როგორ დავჯავშნო?',
                a: 'ჩვენი საპ ბორდები უძლებს 150–158 კგ-მდე დატვირთვას, რაც საშუალებას იძლევა დაფაზე დადგეს ნებისმიერი წონის ზრდასრული ან ზრდასრული ბავშვთან ერთად. დასაჯავშნად მოგვწერეთ საიტზე ან WhatsApp-ზე: +995 592 05 50 17.'
              }
            ] : locale === 'ru' ? [
              {
                q: 'Сколько стоит аренда сапборда в Тбилиси (посуточно и почасово)?',
                a: 'Посуточная аренда сапборда на 1 день (24 часа) стоит 50 GEL, на 2 дня — 80 GEL. Почасовой прокат на станции на Тбилисском море стоит 25 GEL за первый час и 20 GEL за каждый последующий час. В цену включен полный комплект из 7 предметов.'
              },
              {
                q: 'Где находится станция SUPSURF.GE в Тбилиси и можно ли взять сап на другие озера?',
                a: 'Главная станция расположена на Тбилисском море (открыта ежедневно с 08:00 до 21:00). При посуточной аренде вы получаете компактный рюкзак со всем снаряжением, который легко помещается в багажник авто для поездок на озеро Лиси, Базалети, Жинвали, Сиони, Шаори или в Батуми.'
              },
              {
                q: 'Что входит в комплект аренды сапборда за 50 GEL?',
                a: 'В суточный комплект входят 7 предметов: устойчивая надувная SUP-доска, регулируемое весло, сертифицированный спасательный жилет, водонепроницаемый чехол для телефона, страховочный лиш, насос высокого давления с плавником и удобный рюкзак для переноски.'
              },
              {
                q: 'Нужен ли залог (депозит) или предоплата для аренды сапборда?',
                a: 'Нет, мы предоставляем сапборды в аренду без залога (0 GEL депозит) и без предоплаты. Оплата производится при получении снаряжения.'
              },
              {
                q: 'Подходит ли сапборд для новичков и какая максимальная нагрузка доски?',
                a: 'Да! Наши широкие доски (81–84 см) выдерживают до 150–158 кг и идеально подходят для новичков. В комплект входит спасательный жилет, а на Тбилисском море доступны 90-минутные уроки с инструктором (45 GEL).'
              },
              {
                q: 'Как быстро забронировать сапборд в Тбилиси?',
                a: 'Вы можете оставить заявку прямо на сайте supsurf.ge или написать нам в WhatsApp по номеру +995 592 05 50 17.'
              }
            ] : [
              {
                q: 'How much does SUP board rental cost in Tbilisi (daily and hourly)?',
                a: 'Daily 24-hour SUP rental is 50 GEL for 1 day or 80 GEL for 2 days. Hourly paddleboard rental at our Tbilisi Sea station is 25 GEL for the first hour and 20 GEL for each additional hour. All rentals include a full 7-piece equipment kit.'
              },
              {
                q: 'Where is the SUPSURF.GE station in Tbilisi and can I take the board to other lakes?',
                a: 'Our main watersports station is located at Tbilisi Sea (open daily 08:00–21:00). With our daily rental, you receive a compact travel backpack that fits in any car trunk so you can paddle at Lisi Lake, Bazaleti Lake, Zhinvali Reservoir, Sioni Reservoir, Shaori Lake, or Batumi.'
              },
              {
                q: 'What is included in the 50 GEL daily SUP rental package?',
                a: 'The 7-piece kit includes: 1) Premium inflatable SUP board, 2) Adjustable lightweight paddle, 3) Certified safety life vest (PFD), 4) Waterproof phone pouch, 5) Safety ankle leash, 6) High-pressure pump & removable fin, and 7) Ergonomic travel backpack.'
              },
              {
                q: 'Is a security deposit or upfront payment required to rent a SUP board?',
                a: 'No! SUPSURF.GE operates with a 0 GEL advance deposit policy. You pay upon picking up your equipment.'
              },
              {
                q: 'Is paddleboarding suitable for beginners and what is the weight limit?',
                a: 'Yes! Our wide all-round boards (32–34 inches) support up to 150–158 kg (350 lbs) and provide exceptional stability for first-timers. Every rental includes a certified life vest, and we also offer 90-minute coached lessons at Tbilisi Sea for 45 GEL.'
              },
              {
                q: 'How can I book a SUP board in Tbilisi?',
                a: 'You can book directly on supsurf.ge or message us on WhatsApp at +995 592 05 50 17 for instant confirmation.'
              }
            ]).map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 sm:p-6 border border-ocean-slate/10 shadow-sm space-y-2.5">
                <h3 className="font-display text-sm sm:text-base font-extrabold text-ocean-dark leading-snug">
                  {item.q}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VISIBLE TBILISI & GEORGIA SUP LOCATIONS & SEO GUIDE (INDEXED BY GOOGLE WITH FULL WEIGHT) */}
      <section className="py-12 md:py-16 bg-white border-t border-ocean-slate/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-ocean-light/50 to-white rounded-3xl p-6 sm:p-10 border border-ocean-slate/10 shadow-sm space-y-8">
            <div className="border-b border-ocean-slate/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-ocean-teal">
                  {locale === 'ge' ? 'ლოკაციები და გზამკვლევი' : locale === 'ru' ? 'Локации и Путеводитель' : 'Locations & Local Guide'}
                </span>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-ocean-dark mt-1">
                  {locale === 'ge' 
                    ? 'საპ ბორდების გაქირავება თბილისში და საუკეთესო ლოკაციები საქართველოში' 
                    : locale === 'ru' 
                      ? 'Аренда сапбордов в Тбилиси и лучшие водоемы для катания в Грузии' 
                      : 'SUP Board Rental in Tbilisi & Best Paddleboarding Spots in Georgia'}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-ocean-slate mt-2 max-w-3xl">
                  {locale === 'ge' 
                    ? 'ისრიალეთ ჩვენს სადგურზე თბილისის ზღვაზე ან წაიღეთ გასაბერი საპ დაფა ზურგჩანთით საქართველოს ნებისმიერ ტბასა და წყალსაცავზე.' 
                    : locale === 'ru' 
                      ? 'Катайтесь на нашей станции на Тбилисском море или берите надувной сапборд в рюкзаке на любые озера и водохранилища Грузии.' 
                      : 'Paddle right from our Tbilisi Sea station or take our portable backpack SUP kit to any lake, reservoir, or coastline across Georgia.'}
                </p>
              </div>
              <Link
                to={`/${locale}/blog/sup-board-rental-tbilisi-price-guide`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ocean-teal hover:text-ocean-dark transition-colors shrink-0"
              >
                <span>{locale === 'ge' ? 'სრული გზამკვლევი (2026)' : locale === 'ru' ? 'Полный гид (2026)' : 'Read Full 2026 Guide'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Popular Paddling Spots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  title: locale === 'ge' ? 'თბილისის ზღვა' : locale === 'ru' ? 'Тбилисское море' : 'Tbilisi Sea',
                  sub: locale === 'ge' ? 'მთავარი სადგური (15 წთ)' : locale === 'ru' ? 'Главная база (15 мин)' : 'Main Station (15 min)'
                },
                {
                  title: locale === 'ge' ? 'ლისის ტბა' : locale === 'ru' ? 'Озеро Лиси' : 'Lisi Lake',
                  sub: locale === 'ge' ? 'თბილისი (10 კმ)' : locale === 'ru' ? 'Тбилиси (10 км)' : 'Tbilisi (10 km)'
                },
                {
                  title: locale === 'ge' ? 'ჟინვალის წყალსაცავი' : locale === 'ru' ? 'Жинвали' : 'Zhinvali Reservoir',
                  sub: locale === 'ge' ? 'ანანური (50 წთ)' : locale === 'ru' ? 'Ананури (50 мин)' : 'Ananuri (50 min)'
                },
                {
                  title: locale === 'ge' ? 'ბაზალეთის ტბა' : locale === 'ru' ? 'Озеро Базалети' : 'Bazaleti Lake',
                  sub: locale === 'ge' ? 'დუშეთი (40 წთ)' : locale === 'ru' ? 'Душети (40 мин)' : '40 min from Tbilisi'
                },
                {
                  title: locale === 'ge' ? 'სიონის წყალსაცავი' : locale === 'ru' ? 'Сиони' : 'Sioni Reservoir',
                  sub: locale === 'ge' ? 'თიანეთი (1 სთ)' : locale === 'ru' ? 'Тианети (1 ч)' : 'Mountain Forest Lake'
                },
                {
                  title: locale === 'ge' ? 'შაორი & ბათუმი' : locale === 'ru' ? 'Шаори и Батуми' : 'Shaori & Batumi',
                  sub: locale === 'ge' ? '2-დღიანი ტურები (80₾)' : locale === 'ru' ? 'Туры на 2 дня (80₾)' : 'Weekend Trips (80 GEL)'
                }
              ].map((spot, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-ocean-slate/10 text-left">
                  <div className="font-display text-xs sm:text-sm font-extrabold text-ocean-dark">{spot.title}</div>
                  <div className="font-sans text-[11px] text-ocean-slate mt-0.5">{spot.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
              <div className="space-y-2">
                <h3 className="font-display text-sm sm:text-base font-bold text-ocean-dark">
                  {locale === 'ge' ? 'რატომ არის SUPSURF.GE №1 საპ ბორდების გაქირავება თბილისში?' : locale === 'ru' ? 'Почему SUPSURF.GE — №1 прокат сапбордов в Тбилиси?' : 'Why SUPSURF.GE is #1 for SUP Board Rental in Tbilisi'}
                </h3>
                <p>
                  {locale === 'ge'
                    ? 'საპ ბორდინგი (Stand-Up Paddleboarding / წყლის დაფით სრიალი) საუკეთესო განტვირთვაა ზაფხულში. ჩვენს სადგურზე თბილისის ზღვაზე დაგხვდებათ უკვე გაბერილი პრემიუმ საპ დაფები საათობრივი სრიალისთვის (25₾/სთ), ხოლო დღიური გაქირავებისას (50₾/24 სთ, 80₾/2 დღე) გაგატანთ სრულ 7-ნაწილიან კომპლექტს კომპაქტური ზურგჩანთით ყოველგვარი დეპოზიტის გარეშე.'
                    : locale === 'ru'
                      ? 'Сапбординг (Stand-Up Paddleboarding) — лучший летний отдых на воде в Тбилиси. На нашей станции на Тбилисском море вас ждут уже накачанные доски для почасового катания (25 GEL/час), а для поездок за город мы выдаем полный комплект в рюкзаке посуточно (50 GEL/день, 80 GEL/2 дня) без залога.'
                      : 'Stand-Up Paddleboarding (SUP) is the top outdoor water activity in Tbilisi. At our Tbilisi Sea station, inflated boards are ready on the shoreline for hourly sessions (25 GEL/hr), or you can rent a complete 24-hour backpack package (50 GEL/day, 80 GEL/2 days) with zero deposit.'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-sm sm:text-base font-bold text-ocean-dark">
                  {locale === 'ge' ? 'სწრაფი ბმულები და სერვისები' : locale === 'ru' ? 'Быстрые ссылки и услуги' : 'Quick Links & Services'}
                </h3>
                <p>
                  {locale === 'ge'
                    ? 'გაეცანით ჩვენს სერვისებს და დაჯავშნეთ ონლაინ ან WhatsApp-ით (+995 592 05 50 17):'
                    : locale === 'ru'
                      ? 'Ознакомьтесь с нашими услугами и бронируйте онлайн или через WhatsApp (+995 592 05 50 17):'
                      : 'Explore our core water sports services and book online or via WhatsApp (+995 592 05 50 17):'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to={`/${locale}/rent`} className="px-3 py-1.5 rounded-xl bg-ocean-teal/10 text-ocean-teal font-bold text-xs hover:bg-ocean-teal hover:text-white transition-colors">
                    {locale === 'ge' ? 'საპ ბორდის დღიური გაქირავება (50₾)' : locale === 'ru' ? 'Посуточная аренда сапов (50₾)' : 'Daily SUP Rental (50 GEL)'}
                  </Link>
                  <Link to={`/${locale}/services/rent_hourly`} className="px-3 py-1.5 rounded-xl bg-ocean-teal/10 text-ocean-teal font-bold text-xs hover:bg-ocean-teal hover:text-white transition-colors">
                    {locale === 'ge' ? 'საათობრივი ქირაობა თბილისის ზღვაზე (25₾)' : locale === 'ru' ? 'Почасовой прокат Тбилисское море (25₾)' : 'Hourly Tbilisi Sea Rental (25 GEL)'}
                  </Link>
                  <Link to={`/${locale}/services/lesson_basic`} className="px-3 py-1.5 rounded-xl bg-ocean-teal/10 text-ocean-teal font-bold text-xs hover:bg-ocean-teal hover:text-white transition-colors">
                    {locale === 'ge' ? 'საპ გაკვეთილი ინსტრუქტორთან (45₾)' : locale === 'ru' ? 'Урок с инструктором (45₾)' : 'Beginner SUP Lesson (45 GEL)'}
                  </Link>
                  <Link to={`/${locale}/shop`} className="px-3 py-1.5 rounded-xl bg-ocean-teal/10 text-ocean-teal font-bold text-xs hover:bg-ocean-teal hover:text-white transition-colors">
                    {locale === 'ge' ? 'საპ ბორდების ყიდვა თბილისში' : locale === 'ru' ? 'Купить сапборд в Тбилиси' : 'Buy SUP Boards in Tbilisi'}
                  </Link>
                  <Link to={`/${locale}/blog/best-lakes-georgia-sup`} className="px-3 py-1.5 rounded-xl bg-ocean-teal/10 text-ocean-teal font-bold text-xs hover:bg-ocean-teal hover:text-white transition-colors">
                    {locale === 'ge' ? 'საქართველოს ტბების გზამკვლევი' : locale === 'ru' ? 'Гид по озерам Грузии' : 'Georgia SUP Lakes Guide'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemName={modalItem}
        locale={locale}
        contact={db?.contact || { phone: '', whatsapp: '', instagram: '' }}
      />
    </div>
  );
}