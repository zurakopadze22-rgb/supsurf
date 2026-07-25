import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Sparkles, Calendar, Search, MapPin, Clock, Star, Flame, Trophy, CheckCircle2, ArrowRight, ShieldCheck, Waves, Users, Zap, MessageCircle } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from '@/components/BookingModal';

export default function Services() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookingItem, setBookingItem] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setDbLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load DB in Services page:', err);
        setDbLoading(false);
      });
  }, []);

  const contact = db?.contact || {
    phone: '+995 592 05 50 17',
    whatsapp: '995 592 05 50 17',
    instagram: 'https://www.instagram.com/sun_set_paddle/'
  };

  const rawPackages = db?.services || [
    {
      id: "rent_daily",
      name: { 
        ge: "საპ ბორდის დღიური გაქირავება (აქცია)", 
        en: "Daily SUP Board Rental (Special Offer)", 
        ru: "Посуточная аренда сапборда (Акция)" 
      },
      location: { 
        ge: "თბილისი (ლისის ტბა) & შეკვეთილი", 
        en: "Tbilisi (Lisi Lake) & Shekvetili", 
        ru: "Тбилиси (Озеро Лиси) и Шекветили" 
      },
      price: "50 GEL",
      subPrice: locale === 'ge' ? '2 დღე = 80 GEL (აქცია)' : locale === 'ru' ? '2 дня = 80 GEL (Акция)' : '2 Days = 80 GEL (Promo)',
      oldPrice: "70 GEL",
      duration: { 
        ge: "1-2 დღე (სრული კომპლექტი)", 
        en: "1-2 Days (Full Kit)", 
        ru: "1-2 Дня (Полный комплект)" 
      },
      image: "/pictures/paddleboard-1.webp",
      desc: { 
        ge: "საპ ბორდის დღიური გაქირავება სპეციალური ფასდაკლებით! 1 დღე = 50 ლარი, ხოლო 2 დღე = 80 ლარი. წაიღეთ დაფა ზურგჩანთით საქართველოს ნებისმიერ ტბაზე!", 
        en: "Daily SUP board rental with special discount! 1 day = 50 GEL, 2 days = 80 GEL. Take the board in a backpack to any lake across Georgia!", 
        ru: "Посуточная аренда сапборда по акции! 1 день = 50 GEL, 2 дня = 80 GEL. Возьмите сап в рюкзаке на любое озеро Грузии!" 
      },
      isRental: true,
      badgeType: 'promo',
      badgeText: locale === 'ge' ? '🔥 ექსკლუზიური აქცია' : locale === 'ru' ? '🔥 Акция -30%' : '🔥 Special Offer',
      accentGradient: 'from-amber-500/20 via-orange-500/10 to-teal-500/20',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25',
      highlights: [
        locale === 'ge' ? 'გასაბერი დაფა + კარბონის ნიჩაბი' : 'Inflatable Board + Carbon Paddle',
        locale === 'ge' ? 'სამაშველო ჟილეტი & Leash' : 'Life Vest & Safety Leash',
        locale === 'ge' ? 'წყალგაუმტარი ქეისი ტელეფონისთვის' : 'Waterproof Phone Case',
        locale === 'ge' ? 'კომპაქტური ზურგჩანთით ტრანსპორტირება' : 'Compact Backpack Transport'
      ]
    },
    {
      id: "lesson_basic",
      name: { 
        ge: "საბაზისო შემსწავლელი სეანსი (90 წუთი)", 
        en: "Basic Beginner SUP Session (90 Mins)", 
        ru: "Базовое обучающее занятие (90 минут)" 
      },
      location: { 
        ge: "თბილისი (ლისის ტბა) & შეკვეთილი", 
        en: "Tbilisi (Lisi Lake) & Shekvetili", 
        ru: "Тбилиси (Озеро Лиси) и Шекветили" 
      },
      price: "45 GEL",
      subPrice: locale === 'ge' ? '90 წუთი ინსტრუქტორთან' : locale === 'ru' ? '90 мин с инструктором' : '90 mins with instructor',
      duration: { 
        ge: "90 წუთი (ინსტრუქტორთან ერთად)", 
        en: "90 Mins (With Instructor)", 
        ru: "90 Минут (С инструктором)" 
      },
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      desc: { 
        ge: "90-წუთიანი შემსწავლელი სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად! მოიცავს ხმელეთზე უსაფრთხოების ბრიფინგს, ბალანსის დაჭერას და წყალზე მართვას.", 
        en: "90-minute structured beginner session with a certified instructor! Covers land safety briefing, balance setup, and guided paddling.", 
        ru: "90-минутное обучающее занятие с сертифицированным инструктором! Включает инструктаж, балансировку и сопровождение на воде." 
      },
      isRental: false,
      badgeType: 'popular',
      badgeText: locale === 'ge' ? '⭐ ყველაზე პოპულარული' : locale === 'ru' ? '⭐ Топ Выбор' : '⭐ Most Popular',
      accentGradient: 'from-teal-500/20 via-cyan-500/10 to-blue-500/20',
      badgeBg: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/25',
      highlights: [
        locale === 'ge' ? '90 წუთი პირად ინსტრუქტორთან' : '90 Mins with Personal Instructor',
        locale === 'ge' ? 'უსაფრთხოების ბრიფინგი & ტექნიკა' : 'Safety Briefing & Technique',
        locale === 'ge' ? 'სრული აღჭურვილობა შედის ფასში' : 'Full Gear Included',
        locale === 'ge' ? 'ფოტო/ვიდეო გადაღება წყალზე' : 'Action Photos/Videos Included'
      ]
    },
    {
      id: "rent_hourly",
      name: { 
        ge: "საათობრივი გაქირავება", 
        en: "Hourly SUP Board Rental", 
        ru: "Почасовая аренда сапборда" 
      },
      location: { 
        ge: "თბილისი (ლისის ტბა) & შეკვეთილი", 
        en: "Tbilisi (Lisi Lake) & Shekvetili", 
        ru: "Тбилиси (Озеро Лиси) и Шекветили" 
      },
      price: "25 GEL",
      subPrice: locale === 'ge' ? 'შემდგომი საათები = 20 GEL/სთ' : locale === 'ru' ? 'След. часы = 20 GEL/час' : 'Next hours = 20 GEL/hr',
      duration: { 
        ge: "საათობრივი", 
        en: "Hourly", 
        ru: "Почасовая" 
      },
      image: "/pictures/paddleboard-2.webp",
      desc: { 
        ge: "საპ ბორდით სრიალი საათობრივად ლისის ტბასა და შეკვეთილის სანაპიროზე! პირველი საათი 25 ლარი, ხოლო ყოველი შემდგომი საათი — 20 ლარი.", 
        en: "Hourly paddleboard rental on Lisi Lake and Shekvetili beach. 25 GEL for the 1st hour, 20 GEL for each subsequent hour.", 
        ru: "Почасовая аренда сапбордов на озере Лиси и пляже Шекветили. 25 GEL за 1-й час, 20 GEL за каждый последующий." 
      },
      isRental: true,
      badgeType: 'hourly',
      badgeText: locale === 'ge' ? '⏱️ საათობრივი ტარიფი' : locale === 'ru' ? '⏱️ Почасовой Тариф' : '⏱️ Hourly Flex',
      accentGradient: 'from-cyan-500/20 via-sky-500/10 to-indigo-500/20',
      badgeBg: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/25',
      highlights: [
        locale === 'ge' ? '1-ლი საათი: 25 GEL' : '1st Hour: 25 GEL',
        locale === 'ge' ? 'ყოველი შემდგომი საათი: 20 GEL' : 'Each Next Hour: 20 GEL',
        locale === 'ge' ? 'მყისიერი სტარტი წყლის პირას' : 'Instant Water Launch',
        locale === 'ge' ? 'სრული უსაფრთხოების აღჭურვილობა' : 'Full Safety Gear'
      ]
    },
    {
      id: "corporate_event",
      name: { 
        ge: "კორპორატიული შეთავაზებები", 
        en: "Corporate & Group Offers", 
        ru: "Корпоративные предложения" 
      },
      location: { 
        ge: "თბილისი (ლისის ტბა) & შეკვეთილი", 
        en: "Tbilisi (Lisi Lake) & Shekvetili", 
        ru: "Тбилиси (Озеро Лиси) и Шекветили" 
      },
      price: "Custom",
      subPrice: locale === 'ge' ? 'ინდივიდუალური პაკეტი' : locale === 'ru' ? 'Индивидуальный пакет' : 'Tailored Event Package',
      duration: { 
        ge: "მოქნილი დრო", 
        en: "Flexible Time", 
        ru: "Гибкое время" 
      },
      image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=800&q=80",
      desc: { 
        ge: "ინდივიდუალური კორპორატიული შეთავაზებები კომპანიებისა და ჯგუფებისთვის. გიგანტური საპების შეჯიბრებები, თიმბილდინგი და ფოტო/ვიდეო გადაღება.", 
        en: "Customized corporate offers and team building for groups and businesses. Giant SUP races, games, and videography included.", 
        ru: "Индивидуальные корпоративные предложения для компаний и групп. Гонки на гигантских сапах, тимбилдинг и видеосъемка." 
      },
      isRental: false,
      badgeType: 'corporate',
      badgeText: locale === 'ge' ? '🏆 ჯგუფური & კორპორატიული' : locale === 'ru' ? '🏆 Корпоративы' : '🏆 Group & Corporate',
      accentGradient: 'from-purple-500/20 via-indigo-500/10 to-ocean-dark/30',
      badgeBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25',
      highlights: [
        locale === 'ge' ? 'გიგანტური საპები (6-8 კაცზე)' : 'Giant SUPs (6-8 participants)',
        locale === 'ge' ? 'ღონისძიების პერსონალური კოორდინატორი' : 'Personal Event Coordinator',
        locale === 'ge' ? 'ჯგუფური ფასდაკლება & ქეითერინგი' : 'Group Discount & Catering',
        locale === 'ge' ? 'პროფესიონალი ვიდეოგრაფი' : 'Professional Videographer'
      ]
    }
  ];

  const allItems = rawPackages.map((pkg: any) => ({
    id: pkg.id,
    name: pkg.name[locale] || pkg.name.ge || pkg.name.en,
    location: pkg.location[locale] || pkg.location.ge || pkg.location.en,
    price: pkg.price,
    subPrice: pkg.subPrice || (locale === 'ge' ? 'სრული აღჭურვილობა' : 'Full Gear Included'),
    oldPrice: pkg.oldPrice,
    duration: pkg.duration[locale] || pkg.duration.ge || pkg.duration.en,
    desc: pkg.desc[locale] || pkg.desc.ge || pkg.desc.en,
    image: pkg.image,
    isRental: pkg.id.includes('rent'),
    badgeText: pkg.badgeText || (pkg.id.includes('daily') ? '🔥 ექსკლუზიური აქცია' : pkg.id.includes('lesson') ? '⭐ ყველაზე პოპულარული' : pkg.id.includes('hourly') ? '⏱️ საათობრივი' : '🏆 კორპორატიული'),
    badgeBg: pkg.badgeBg || 'bg-ocean-dark text-white',
    accentGradient: pkg.accentGradient || 'from-ocean-teal/10 to-transparent',
    highlights: pkg.highlights || []
  }));

  const filteredItems = allItems.filter(item => {
    if (selectedCategory === 'tours' && item.isRental) return false;
    if (selectedCategory === 'rentals' && !item.isRental) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(q);
      const descMatch = item.desc.toLowerCase().includes(q);
      const locMatch = item.location.toLowerCase().includes(q);
      return nameMatch || descMatch || locMatch;
    }
    
    return true;
  });

  const filterTabs = [
    { id: 'all', name: locale === 'ge' ? '⚡ ყველა სერვისი' : locale === 'ru' ? '⚡ Все услуги' : '⚡ All Services' },
    { id: 'rentals', name: locale === 'ge' ? '🏄‍♂️ საპ გაქირავება' : locale === 'ru' ? '🏄‍♂️ Аренда сапов' : '🏄‍♂️ SUP Rental' },
    { id: 'tours', name: locale === 'ge' ? '🎓 შემსწავლელი სეანსი' : locale === 'ru' ? '🎓 Обучение' : '🎓 Beginner Lessons' },
    { id: 'corporate', name: locale === 'ge' ? '🏆 კორპორატიული' : locale === 'ru' ? '🏆 Корпоративы' : '🏆 Corporate Events' }
  ];

  return (
    <div className="bg-gradient-to-b from-ocean-light/30 via-white to-ocean-light/20 min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hidden SEO Header */}
        <div className="sr-only">
          <h1>{dict.meta.services.title}</h1>
          <p>{dict.meta.services.description}</p>
        </div>

        {/* Page Hero Title & Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-teal/10 border border-ocean-teal/20 text-ocean-teal text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {locale === 'ge' ? 'SUPSURF.GE ექსკლუზიური სერვისები' : locale === 'ru' ? 'Эксклюзивные Услуги SUPSURF.GE' : 'SUPSURF.GE Exclusive Services'}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-ocean-dark tracking-tight leading-none">
            {locale === 'ge' ? (
              <>აღმოაჩინე წყლის თავგადასავალი <span className="bg-gradient-to-r from-ocean-teal via-teal-400 to-cyan-500 bg-clip-text text-transparent">ლისის ტბასა &amp; შეკვეთილში</span></>
            ) : locale === 'ru' ? (
              <>Водные приключения на <span className="bg-gradient-to-r from-ocean-teal via-teal-400 to-cyan-500 bg-clip-text text-transparent">озере Лиси и в Шекветили</span></>
            ) : (
              <>Water Adventures at <span className="bg-gradient-to-r from-ocean-teal via-teal-400 to-cyan-500 bg-clip-text text-transparent">Lisi Lake &amp; Shekvetili</span></>
            )}
          </h1>

          <p className="font-sans text-sm sm:text-base text-ocean-slate leading-relaxed max-w-2xl mx-auto">
            {locale === 'ge'
              ? 'აირჩიე შენზე მორგებული პაკეტი: დღიური აქცია (50 GEL / 80 GEL), 90-წუთიანი შემსწავლელი სეანსი ინსტრუქტორთან, საათობრივი გაქირავება ან კორპორატიული თიმბილდინგი.'
              : locale === 'ru'
                ? 'Выберите подходящий пакет: посуточная акция (50/80 GEL), 90-минутное обучение с инструктором, почасовая аренда или корпоративный тимбилдинг.'
                : 'Select your ideal experience: daily rental deal (50/80 GEL), 90-min beginner lesson with instructor, hourly rental, or corporate team building.'}
          </p>

          {/* Social Proof Stats Ribbon */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-ocean-dark">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-ocean-slate/10 shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 {locale === 'ge' ? 'შეფასება' : 'Rating'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-ocean-slate/10 shadow-sm">
              <Waves className="w-4 h-4 text-ocean-teal" />
              <span>1,500+ {locale === 'ge' ? 'კმაყოფილი მცურავი' : 'Happy Paddlers'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-ocean-slate/10 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% {locale === 'ge' ? 'უსაფრთხოების გარანტია' : 'Safety Guaranteed'}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search Box */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-10">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-ocean-slate/10 overflow-x-auto w-full sm:w-auto shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'corporate') {
                    const el = document.getElementById('corporate-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    setSelectedCategory(tab.id);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-ocean-dark text-white shadow-md shadow-ocean-dark/20 scale-[1.02]'
                    : 'text-ocean-slate hover:text-ocean-dark hover:bg-ocean-light/50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-slate/50" />
            <input
              type="text"
              placeholder={locale === 'ge' ? 'მოძებნე სერვისი...' : locale === 'ru' ? 'Поиск услуги...' : 'Search service...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ocean-slate/10 rounded-2xl text-xs text-ocean-dark placeholder-ocean-slate/40 focus:outline-none focus:border-ocean-teal transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Dynamic & Distinct Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-24">
          {dbLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-white border border-ocean-slate/10 animate-pulse h-96"></div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-semibold text-ocean-slate bg-white rounded-3xl border border-ocean-slate/10">
              {locale === 'ge' ? 'სერვისები ვერ მოიძებნა' : locale === 'ru' ? 'Услуги не найдены' : 'No services found'}
            </div>
          ) : (
            filteredItems.map((item: any) => (
              <div 
                key={item.id}
                className="relative bg-white rounded-3xl border border-ocean-slate/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group cursor-pointer hover:-translate-y-1.5"
              >
                {/* Background Color Accent Gradient Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accentGradient} opacity-40 pointer-events-none group-hover:opacity-80 transition-opacity duration-500`}></div>

                <div>
                  {/* Top Image Section */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-ocean-dark">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Top Custom Badge */}
                    <div className={`absolute top-4 left-4 rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider font-sans border border-white/20 shadow-lg ${item.badgeBg}`}>
                      {item.badgeText}
                    </div>

                    {/* Location Badge */}
                    <div className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold font-sans border border-white/10 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-ocean-teal" />
                      <span>{item.location}</span>
                    </div>

                    {/* Overlay Price Callout on Image Bottom Right */}
                    <div className="absolute bottom-4 right-4 text-right">
                      {item.oldPrice && (
                        <span className="line-through text-xs font-bold text-white/70 block">
                          {item.oldPrice}
                        </span>
                      )}
                      <span className="font-display text-2xl font-black text-white drop-shadow-md">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-4 relative">
                    <div className="space-y-1.5">
                      <h2 className="font-display text-xl sm:text-2xl font-black text-ocean-dark group-hover:text-ocean-teal transition-colors leading-tight">
                        {item.name}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Feature Highlight Pills */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="pt-2 border-t border-ocean-slate/10 space-y-2">
                        <span className="text-[10px] uppercase font-black tracking-widest text-ocean-slate/70 font-sans block">
                          {locale === 'ge' ? 'პაკეტში შედის:' : locale === 'ru' ? 'В пакет входит:' : 'Includes:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.highlights.map((feat: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-ocean-dark bg-ocean-light/40 px-3 py-1.5 rounded-xl border border-ocean-slate/10">
                              <CheckCircle2 className="w-3.5 h-3.5 text-ocean-teal shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions Bar */}
                <div className="p-6 pt-0 mt-auto relative">
                  <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-ocean-slate/10 pt-4">
                    {/* View Details Button */}
                    <Link
                      to={`/${locale}/services/${item.id}`}
                      className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-ocean-slate/20 text-ocean-dark font-bold text-xs flex items-center justify-center gap-2 hover:bg-ocean-dark hover:text-white transition-all duration-300"
                    >
                      <span>{locale === 'ge' ? 'დეტალების ნახვა' : locale === 'ru' ? 'Подробнее' : 'View Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Quick WhatsApp/Modal Booking Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBookingItem(item);
                      }}
                      className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white/20" />
                      <span>{locale === 'ge' ? '1-დაჭერით დაჯავშნა' : locale === 'ru' ? 'Забронировать 1-клик' : '1-Click Booking'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Corporate Offers & Event Inquiry Section */}
        <div id="corporate-section" className="border-t border-ocean-slate/15 pt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-ocean-dark via-ocean-navy to-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-ocean-teal/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-4 mb-10 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-ocean-cyan text-xs font-bold uppercase tracking-widest border border-white/10">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {locale === 'ge' ? 'სპეციალური შეთავაზებები' : locale === 'ru' ? 'Специальные предложения' : 'Special Proposals'}
              </span>

              <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                {locale === 'ge' ? 'კორპორატიული ღონისძიებები &amp; თიმბილდინგი' : locale === 'ru' ? 'Корпоративы и Тимбилдинг' : 'Corporate Events & Team Building'}
              </h2>

              <p className="font-sans text-xs sm:text-sm text-ocean-light/80 max-w-xl mx-auto leading-relaxed">
                {locale === 'ge' 
                  ? 'გსურთ მოაწყოთ დაუვიწყარი დღე თქვენი კომპანიისთვის ლისის ტბასა თუ შეკვეთილში? გიგანტური საპები, შეჯიბრებები, ფოტო/ვიდეო გადაღება და ინდივიდუალური პაკეტები.'
                  : locale === 'ru'
                    ? 'Хотите организовать незабываемый день для вашей компании на озере Лиси или в Шекветили? Гигантские сапы, соревнования и индивидуальные пакеты.'
                    : 'Organize an unforgettable day for your company at Lisi Lake or Shekvetili! Giant SUPs, races, videography, and custom group discounts.'}
              </p>
            </div>

            <CorporateForm locale={locale} />
          </div>
        </div>

      </div>

      {/* Booking Modal Trigger */}
      {bookingItem && (
        <BookingModal
          isOpen={!!bookingItem}
          onClose={() => setBookingItem(null)}
          itemName={bookingItem.name}
          locale={locale}
          contact={contact}
        />
      )}
    </div>
  );
}

function CorporateForm({ locale }: { locale: Locale }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center text-white space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="font-display text-lg font-bold">
          {locale === 'ge' ? 'მოთხოვნა მიღებულია!' : locale === 'ru' ? 'Запрос принят!' : 'Inquiry Received!'}
        </h3>
        <p className="font-sans text-xs text-ocean-light/80">
          {locale === 'ge' 
            ? 'ჩვენი წარმომადგენელი დაგიკავშირდეთ 30 წუთში ინდივიდუალური პაკეტის შესათავაზებლად.'
            : locale === 'ru'
              ? 'Наш менеджер свяжется с вами в течение 30 минут.'
              : 'Our team will contact you within 30 minutes with a custom proposal.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-left relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-ocean-light/90 mb-1 font-sans">
            {locale === 'ge' ? 'სახელი და გვარი' : locale === 'ru' ? 'Имя и фамилия' : 'Full Name'}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={locale === 'ge' ? 'გიორგი დევდარიანი' : 'Giorgi...'}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ocean-light/90 mb-1 font-sans">
            {locale === 'ge' ? 'კომპანია / ჯგუფი' : locale === 'ru' ? 'Компания / Группа' : 'Company / Group'}
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder={locale === 'ge' ? 'მაგ. 10 მცურავი' : 'Company Name...'}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-ocean-light/90 mb-1 font-sans">
          {locale === 'ge' ? 'ტელეფონის ნომერი (WhatsApp)' : locale === 'ru' ? 'Телефон (WhatsApp)' : 'Phone (WhatsApp)'}
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+995 5xx xx xx xx"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-ocean-light/90 mb-1 font-sans">
          {locale === 'ge' ? 'მოთხოვნები (თარიღი, ლოკაცია, მონაწილეები)' : locale === 'ru' ? 'Детали (дата, локация, люди)' : 'Details (date, location, size)'}
        </label>
        <textarea
          rows={3}
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          placeholder={locale === 'ge' ? 'გვსურს 15 კაციანი ტური ლისის ტბაზე...' : 'Write details...'}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-4 px-6 bg-gradient-to-r from-ocean-cyan to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-ocean-dark font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-ocean-cyan/20 transition-all cursor-pointer"
      >
        {locale === 'ge' ? 'კორპორატიული მოთხოვნის გაგზავნა' : locale === 'ru' ? 'Отправить запрос' : 'Send Corporate Inquiry'}
      </button>
    </form>
  );
}
