import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Sparkles, Calendar, Search, MapPin } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import { firestoreDb, isFirebaseConfigured } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Services() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const rawPackages = db?.services || [
    {
      id: "rent_daily",
      name: { ge: "საპ ბორდის დღიური გაქირავება (აქცია)", en: "Daily SUP Board Rental (Special Offer)", ru: "Посуточная аренда сапборда (Акция)" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "50 GEL (1 დღე) / 80 GEL (2 დღე)",
      duration: { ge: "1-2 დღე (სრული კომპლექტი)", en: "1-2 Days (Full Kit)", ru: "1-2 Дня (Полный комплект)" },
      image: "/pictures/paddleboard-1.webp",
      desc: { ge: "საპ ბორდის დღიური გაქირავება სპეციალური ფასდაკლებით! 1 დღე = 50 ლარი, ხოლო 2 დღე = 80 ლარი.", en: "Daily SUP board rental with special discount! 1 day = 50 GEL, 2 days = 80 GEL.", ru: "Посуточная аренда сапборда по акции! 1 день = 50 GEL, 2 дня = 80 GEL." },
      isRental: true
    },
    {
      id: "lesson_basic",
      name: { ge: "საბაზისო შემსწავლელი სეანსი (90 წუთი)", en: "Basic Beginner SUP Session (90 Mins)", ru: "Базовое обучающее занятие (90 минут)" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "45 GEL",
      duration: { ge: "90 წუთი (ინსტრუქტორთან ერთად)", en: "90 Mins (With Instructor)", ru: "90 Минут (С инструктором)" },
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      desc: { ge: "90-წუთიანი შემსწავლელი სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად!", en: "90-minute structured beginner session with a certified instructor!", ru: "90-минутное обучающее занятие с сертифицированным инструктором!" },
      isRental: false
    },
    {
      id: "rent_hourly",
      name: { ge: "საათობრივი გაქირავება", en: "Hourly SUP Board Rental", ru: "Почасовая аренда сапборда" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "25 GEL (1-ლი სთ) / 20 GEL (შემდეგი)",
      duration: { ge: "საათობრივი", en: "Hourly", ru: "Почасовая" },
      image: "/pictures/paddleboard-2.webp",
      desc: { ge: "საპ ბორდით სრიალი საათობრივად ლისის ტბასა და შეკვეთილის სანაპიროზე! 25 ლარი 1-ლი საათი, 20 ლარი შემდგომი.", en: "Hourly paddleboard rental on Lisi Lake and Shekvetili beach. 25 GEL 1st hr, 20 GEL next.", ru: "Почасовая аренда сапбордов на озере Лиси и на пляже Шекветили." },
      isRental: true
    },
    {
      id: "corporate_event",
      name: { ge: "კორპორატიული შეთავაზებები", en: "Corporate & Group Offers", ru: "Корпоративные предложения" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "Custom / ინდივიდუალური",
      duration: { ge: "მოქნილი დრო", en: "Flexible Time", ru: "Гибкое время" },
      image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=500&q=80",
      desc: { ge: "ინდივიდუალური კორპორატიული შეთავაზებები კომპანიებისა და ჯგუფებისთვის.", en: "Customized corporate offers and team building for groups and businesses.", ru: "Индивидуальные корпоративные предложения для компаний и групп." },
      isRental: false
    }
  ];

  const allItems = rawPackages.map((pkg: any) => ({
    id: pkg.id,
    name: pkg.name[locale] || pkg.name.ge || pkg.name.en,
    category: pkg.location[locale] || pkg.location.ge || pkg.location.en,
    price: pkg.price,
    duration: pkg.duration[locale] || pkg.duration.ge || pkg.duration.en,
    desc: pkg.desc[locale] || pkg.desc.ge || pkg.desc.en,
    image: pkg.image,
    isRental: pkg.id.includes('rent')
  }));

  const filteredItems = allItems.filter(item => {
    // Filter by category type
    if (selectedCategory === 'tours' && item.isRental) return false;
    if (selectedCategory === 'rentals' && !item.isRental) return false;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(q);
      const descMatch = item.desc.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      return nameMatch || descMatch || catMatch;
    }
    
    return true;
  });

  const filterTabs = [
    { id: 'all', name: locale === 'ge' ? 'ყველა' : locale === 'ru' ? 'Все' : 'All' },
    { id: 'tours', name: locale === 'ge' ? 'ტურები & სეანსები' : locale === 'ru' ? 'Туры и уроки' : 'Tours & Sessions' },
    { id: 'rentals', name: locale === 'ge' ? 'ინვენტარის გაქირავება' : locale === 'ru' ? 'Аренда снаряжения' : 'Rental Equipment' },
    { id: 'corporate', name: locale === 'ge' ? 'კორპორატიული' : locale === 'ru' ? 'Корпоративы' : 'Corporate' }
  ];

  return (
    <div className="bg-ocean-light/20 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hidden SEO Header */}
        <div className="sr-only">
          <h1>{dict.meta.services.title}</h1>
          <p>{dict.meta.services.description}</p>
        </div>

        {/* Filter and Search Container */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 md:mb-12">
          {/* Tab Filter */}
          <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 rounded-2xl border border-ocean-slate/10 overflow-x-auto w-full sm:w-auto">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  (selectedCategory === tab.id || (tab.id === 'corporate' && selectedCategory === 'corporate-dummy-never'))
                    ? 'bg-ocean-dark text-white shadow-sm'
                    : 'text-ocean-slate hover:text-ocean-dark hover:bg-ocean-light/40'
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
              placeholder={locale === 'ge' ? 'მოძებნე...' : locale === 'ru' ? 'Поиск...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ocean-slate/10 rounded-2xl text-xs text-ocean-dark placeholder-ocean-slate/40 focus:outline-none focus:border-ocean-teal transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Unified Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-24">
          {dbLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-3xl bg-white border border-ocean-slate/10 animate-pulse h-80"></div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm font-semibold text-ocean-slate">
              {locale === 'ge' ? 'სერვისები ვერ მოიძებნა' : locale === 'ru' ? 'Услуги не найдены' : 'No services found'}
            </div>
          ) : (
            filteredItems.map((item: any) => (
              <Link 
                key={item.id}
                to={`/${locale}/services/${item.id}`}
                className="bg-white border border-ocean-slate/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-ocean-light/40">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 rounded-full bg-ocean-dark/85 backdrop-blur-sm text-white px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider font-sans border border-white/10">
                      {item.isRental 
                        ? (locale === 'ge' ? 'გაქირავება' : locale === 'ru' ? 'Аренда' : 'Rental')
                        : (locale === 'ge' ? 'ტური' : locale === 'ru' ? 'Тур' : 'Tour')}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-3">
                    <h3 className="font-display text-xs sm:text-lg font-black text-ocean-dark group-hover:text-ocean-teal transition-colors leading-tight line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="p-3 sm:p-6 pt-0 mt-auto">
                  <div className="flex items-center justify-between border-t border-ocean-light pt-2.5 sm:pt-4">
                    <div className="flex flex-col">
                      <span className="text-[7.5px] sm:text-[9px] text-ocean-slate uppercase tracking-wider font-sans font-bold">
                        {locale === 'ge' ? 'ტარიფი' : locale === 'ru' ? 'Стоимость' : 'Rate'}
                      </span>
                      <span className="font-display text-xs sm:text-base font-black text-ocean-dark">
                        {item.price}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[7.5px] sm:text-[9px] text-ocean-slate uppercase tracking-wider font-sans font-bold">
                        {locale === 'ge' ? 'დრო / ლოკაცია' : locale === 'ru' ? 'Время / Лок.' : 'Duration / Loc'}
                      </span>
                      <span className="font-sans text-xs font-bold text-ocean-teal leading-tight">
                        {item.duration || item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Corporate Offers & Event Inquiry Section */}
        <div id="corporate-section" className="border-t border-ocean-slate/10 pt-20 max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <span className="text-[10px] text-ocean-teal uppercase font-bold tracking-widest font-sans">
              {locale === 'ge' ? 'სპეციალური შეთავაზებები' : locale === 'ru' ? 'Специальные предложения' : 'Special Proposals'}
            </span>
            <h2 className="font-display text-3xl font-extrabold text-ocean-dark">
              {locale === 'ge' ? 'კორპორატიული შეთავაზებები' : locale === 'ru' ? 'Корпоративные предложения' : 'Corporate & Team Events'}
            </h2>
            <p className="font-sans text-sm text-ocean-slate max-w-lg mx-auto leading-relaxed">
              {locale === 'ge' 
                ? 'გსურთ მოაწყოთ დაუვიწყარი კორპორატიული დღე თქვენი გუნდისთვის? დაგვიტოვეთ თქვენი საკონტაქტო და მოთხოვნები და ჩვენ მალევე დაგიკავშირდებით.'
                : locale === 'ru'
                  ? 'Хотите организовать незабываемый корпоратив для вашей команды? Оставьте свои контакты и пожелания, и мы свяжемся с вами в ближайшее время.'
                  : 'Want to organize an unforgettable corporate day or group event? Leave your contact details and requirements, and we will get back to you shortly.'}
            </p>
          </div>

          <CorporateForm locale={locale} />
        </div>

      </div>
    </div>
  );
}



function CorporateForm({ locale }: { locale: Locale }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert(locale === 'ge' ? 'გთხოვთ შეავსოთ სავალდებულო ველები' : 'Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Fetch current database data
      const getRes = await fetch('/api/admin');
      const dbData = await getRes.json();

      // 2. Append new corporate inquiry
      const newInquiry = {
        id: 'inq_' + Date.now(),
        name,
        email,
        phone,
        message,
        date: new Date().toISOString()
      };

      const updatedInquiries = dbData.corporate_inquiries 
        ? [...dbData.corporate_inquiries, newInquiry]
        : [newInquiry];

      const updatedDb = {
        ...dbData,
        corporate_inquiries: updatedInquiries
      };

      // 3. Save database back (local storage API)
      let postSuccess = false;
      try {
        const postRes = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDb)
        });
        postSuccess = postRes.ok;
      } catch (err) {
        console.error('Failed to save to local API, fallback to Firestore/Client:', err);
      }

      // 4. Save to Firestore if configured
      if (isFirebaseConfigured && firestoreDb) {
        try {
          await addDoc(collection(firestoreDb, 'corporate_inquiries'), {
            id: newInquiry.id,
            name,
            email,
            phone,
            message,
            date: newInquiry.date
          });
          postSuccess = true; // Overwrite error if Firestore succeeds
        } catch (fErr) {
          console.error('Firestore save failed:', fErr);
        }
      }

      if (postSuccess) {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Error submitting corporate inquiry:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center space-y-3 max-w-xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold">✓</div>
        <h3 className="font-display text-lg font-bold text-ocean-dark">
          {locale === 'ge' ? 'მოთხოვნა გაგზავნილია!' : locale === 'ru' ? 'Запрос отправлен!' : 'Inquiry Submitted!'}
        </h3>
        <p className="font-sans text-xs text-ocean-slate leading-relaxed">
          {locale === 'ge' 
            ? 'გმადლობთ დაინტერესებისთვის. ჩვენი გუნდი მალე დაგიკავშირდებათ დეტალების განსახილველად.' 
            : locale === 'ru' 
              ? 'Спасибо за интерес. Наша команда свяжется с вами в ближайшее время.' 
              : 'Thank you for your interest. Our team will contact you shortly to discuss details.'}
        </p>
        <button 
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs font-bold text-ocean-teal hover:underline font-display"
        >
          {locale === 'ge' ? 'კიდევ ერთი მოთხოვნის გაგზავნა' : 'Send another inquiry'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-ocean-slate/10 p-8 sm:p-10 rounded-3xl shadow-sm space-y-5 max-w-xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-ocean-dark uppercase tracking-wider font-sans">
            {locale === 'ge' ? 'სახელი / კომპანია *' : locale === 'ru' ? 'Имя / Компания *' : 'Name / Company *'}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-ocean-light/35 border border-ocean-slate/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all"
            placeholder="e.g. Red Bull Georgia"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-ocean-dark uppercase tracking-wider font-sans">
            {locale === 'ge' ? 'ტელეფონის ნომერი' : locale === 'ru' ? 'Телефон' : 'Phone Number'}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-ocean-light/35 border border-ocean-slate/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all"
            placeholder="+995 555 123 456"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-ocean-dark uppercase tracking-wider font-sans">
          {locale === 'ge' ? 'ელ. ფოსტა *' : locale === 'ru' ? 'Эл. почта *' : 'Email Address *'}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-ocean-light/35 border border-ocean-slate/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all"
          placeholder="contact@company.com"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-ocean-dark uppercase tracking-wider font-sans">
          {locale === 'ge' ? 'რა გჭირდებათ? (ღონისძიების აღწერა) *' : locale === 'ru' ? 'Что вам нужно? (Описание мероприятия) *' : 'Event Details & Requirements *'}
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-ocean-light/35 border border-ocean-slate/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all resize-none"
          placeholder={locale === 'ge' ? 'მაგალითად: კორპორატიული აქტივობა 20 ადამიანისთვის ლისის ტბაზე...' : 'e.g. Teambuilding for 25 people at Lisi Lake with giant SUP boards...'}
        />
      </div>

      {status === 'error' && (
        <p className="text-[11px] font-semibold text-rose-600 font-sans text-center">
          {locale === 'ge' ? 'შეცდომაა. გთხოვთ სცადოთ მოგვიანებით.' : 'Submission error. Please try again later.'}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center rounded-xl bg-ocean-dark hover:bg-ocean-navy disabled:bg-ocean-dark/50 text-white font-display font-bold py-3 text-xs transition-colors cursor-pointer"
      >
        {submitting ? '...' : (locale === 'ge' ? 'გაგზავნე მოთხოვნა' : locale === 'ru' ? 'Отправить запрос' : 'Submit Inquiry')}
      </button>
    </form>
  );
}
