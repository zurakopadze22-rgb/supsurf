import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, Calendar, Search, MapPin, Clock, Star, Flame, Trophy, CheckCircle2, ShieldCheck, Waves, Users, Zap, MessageCircle, ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from '@/components/BookingModal';

export default function Services() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
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

  const dailyRentalItem = {
    id: "rent_daily",
    name: locale === 'ge' ? "დღიური გაქირავება (აქცია)" : locale === 'ru' ? "Посуточная аренда (Акция)" : "Daily SUP Rental (Promo)",
    location: locale === 'ge' ? "თბილისი (ლისის ტბა) & შეკვეთილი" : "Tbilisi (Lisi Lake) & Shekvetili",
    price: "50 GEL",
    subPrice: locale === 'ge' ? '2 დღე = 80 GEL (აქცია)' : locale === 'ru' ? '2 дня = 80 GEL (Акция)' : '2 Days = 80 GEL (Promo)',
    oldPrice: "70 GEL",
    duration: locale === 'ge' ? "1-2 დღე (სრული კომპლექტი)" : "1-2 Days (Full Kit)",
    image: "/pictures/paddleboard-1.webp",
    desc: locale === 'ge' 
      ? "საპ ბორდის დღიური გაქირავება სპეციალური ფასდაკლებით! 1 დღე = 50 ლარი, ხოლო 2 დღე = 80 ლარი. წაიღეთ დაფა ზურგჩანთით საქართველოს ნებისმიერ ტბაზე!" 
      : "Daily SUP board rental with special discount! 1 day = 50 GEL, 2 days = 80 GEL. Take the board in a backpack to any lake!",
    badgeText: locale === 'ge' ? '🔥 ექსკლუზიური აქცია' : '🔥 Special Promo',
    highlights: [
      locale === 'ge' ? 'გასაბერი დაფა + კარბონის ნიჩაბი' : 'Inflatable Board + Carbon Paddle',
      locale === 'ge' ? 'სამაშველო ჟილეტი & Leash' : 'Life Vest & Safety Leash',
      locale === 'ge' ? 'წყალგაუმტარი ქეისი ტელეფონისთვის' : 'Waterproof Phone Case',
      locale === 'ge' ? 'კომპაქტური ზურგჩანთით ტრანსპორტირება' : 'Backpack Transport'
    ]
  };

  const hourlyRentalItem = {
    id: "rent_hourly",
    name: locale === 'ge' ? "საათობრივი გაქირავება" : locale === 'ru' ? "Почасовая аренда" : "Hourly SUP Rental",
    location: locale === 'ge' ? "თბილისი (ლისის ტბა) & შეკვეთილი" : "Tbilisi (Lisi Lake) & Shekvetili",
    price: "25 GEL",
    subPrice: locale === 'ge' ? 'ყოფილი შემდგომი საათი = 20 GEL/სთ' : locale === 'ru' ? 'След. часы = 20 GEL/час' : 'Next hours = 20 GEL/hr',
    duration: locale === 'ge' ? "საათობრივი" : "Hourly",
    image: "/pictures/paddleboard-2.webp",
    desc: locale === 'ge' 
      ? "საპ ბორდით სრიალი საათობრივად ლისის ტბასა და შეკვეთილის სანაპიროზე! პირველი საათი 25 ლარი, ხოლო ყოველი შემდგომი საათი — 20 ლარი." 
      : "Hourly paddleboard rental on Lisi Lake and Shekvetili beach. 25 GEL 1st hour, 20 GEL for each next hour.",
    badgeText: locale === 'ge' ? '⏱️ საათობრივი ტარიფი' : '⏱️ Hourly Flex',
    highlights: [
      locale === 'ge' ? '1-ლი საათი: 25 GEL' : '1st Hour: 25 GEL',
      locale === 'ge' ? 'ყოფილი შემდგომი საათი: 20 GEL' : 'Each Next Hour: 20 GEL',
      locale === 'ge' ? 'მყისიერი სტარტი წყლის პირას' : 'Instant Water Launch',
      locale === 'ge' ? 'სრული უსაფრთხოების აღჭურვილობა' : 'Full Safety Gear'
    ]
  };

  const beginnerLessonItem = {
    id: "lesson_basic",
    name: locale === 'ge' ? "საბაზისო შემსწავლელი სეანსი (90 წუთი)" : locale === 'ru' ? "Базовое обучение (90 минут)" : "Basic Beginner Lesson (90 Mins)",
    location: locale === 'ge' ? "თბილისი (ლისის ტბა) & შეკვეთილი" : "Tbilisi (Lisi Lake) & Shekvetili",
    price: "45 GEL",
    subPrice: locale === 'ge' ? '90 წუთი ინსტრუქტორთან ერთად' : locale === 'ru' ? '90 мин с инструктором' : '90 mins with certified instructor',
    duration: locale === 'ge' ? "90 წუთი" : "90 Mins",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    desc: locale === 'ge' 
      ? "90-წუთიანი შემსწავლელი სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად! მოიცავს ხმელეთზე უსაფრთხოების ბრიფინგს, ბალანსის დაჭერას, ნიჩბოსნობის ტექნიკასა და წყალზე სრიალს." 
      : "90-minute structured beginner session with a certified instructor! Land briefing, balance setup, and guided paddling on water.",
    badgeText: locale === 'ge' ? '⭐ ყველაზე პოპულარული' : '⭐ Most Popular',
    highlights: [
      locale === 'ge' ? '90 წუთი პირად ინსტრუქტორთან' : '90 Mins with Personal Instructor',
      locale === 'ge' ? 'უსაფრთხოების ბრიფინგი & ტექნიკა' : 'Safety Briefing & Technique',
      locale === 'ge' ? 'სრული აღჭურვილობა შედის ფასში' : 'Full Gear Included',
      locale === 'ge' ? 'ფოტო/ვიდეო გადაღება წყალზე' : 'Action Photos/Videos Included'
    ]
  };

  const corporateItem = {
    id: "corporate_event",
    name: locale === 'ge' ? "კორპორატიული შეთავაზებები" : locale === 'ru' ? "Корпоративные предложения" : "Corporate & Group Events",
    location: locale === 'ge' ? "თბილისი (ლისის ტბა) & შეკვეთილი" : "Tbilisi (Lisi Lake) & Shekvetili",
    price: "Custom",
    subPrice: locale === 'ge' ? 'ინდივიდუალური პაკეტი' : 'Tailored Event Package',
    duration: locale === 'ge' ? "მოქნილი დრო" : "Flexible",
    image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=1000&q=80",
    desc: locale === 'ge' 
      ? "ინდივიდუალური კორპორატიული შეთავაზებები კომპანიებისა და ჯგუფებისთვის. გიგანტური საპების შეჯიბრებები, თიმბილდინგი და ფოტო/ვიდეო გადაღება." 
      : "Customized corporate offers and team building for groups and businesses. Giant SUP races, games, and videography.",
    badgeText: locale === 'ge' ? '🏆 ჯგუფური & კორპორატიული' : '🏆 Group & Corporate',
    highlights: [
      locale === 'ge' ? 'გიგანტური საპები (6-8 კაცზე)' : 'Giant SUPs (6-8 participants)',
      locale === 'ge' ? 'ღონისძიების პერსონალური კოორდინატორი' : 'Personal Event Coordinator',
      locale === 'ge' ? 'ჯგუფური ფასდაკლება & ქეითერინგი' : 'Group Discount & Catering',
      locale === 'ge' ? 'პროფესიონალი ვიდეოგრაფი' : 'Professional Videographer'
    ]
  };

  return (
    <div className="bg-gradient-to-b from-ocean-light/20 via-white to-ocean-light/30 min-h-screen py-8 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Hidden SEO Header */}
        <div className="sr-only">
          <h1>{dict.meta.services.title}</h1>
          <p>{dict.meta.services.description}</p>
        </div>

        {/* SECTION 1: 🏄‍♂️ საპ ბორდების გაქირავება (SUP Rental Section) */}
        <section className="space-y-6 sm:space-y-8">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-ocean-teal to-teal-400 text-white flex items-center justify-center shadow-lg shadow-ocean-teal/20">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ocean-dark tracking-tight">
                {locale === 'ge' ? '🏄‍♂️ საპ ბორდების გაქირავება' : locale === 'ru' ? '🏄‍♂️ Аренда сапбордов' : '🏄‍♂️ SUP Board Rentals'}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ocean-slate font-medium">
                {locale === 'ge' ? 'დღიური აქციები და საათობრივი გაქირავება ლისის ტბასა & შეკვეთილში' : 'Daily promotional deals & hourly rentals at Lisi Lake & Shekvetili'}
              </p>
            </div>
          </div>

          {/* Rental Cards Side-by-Side (Daily Promo vs Hourly Rental) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Card 1: Daily Rental Promo (Orange/Amber Theme) */}
            <div 
              onClick={() => setBookingItem(dailyRentalItem)}
              className="group relative bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 rounded-[2.5rem] border-2 border-amber-500/30 p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
            >
              {/* Top Accent Badge & Flame */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/25">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  {dailyRentalItem.badgeText}
                </span>
                <span className="text-xs font-bold text-ocean-slate bg-white px-3 py-1 rounded-full border border-ocean-slate/10 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {dailyRentalItem.location}
                </span>
              </div>

              <div className="space-y-4">
                {/* Image & Title Header */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-ocean-dark relative shadow-md">
                    <img 
                      src={dailyRentalItem.image} 
                      alt={dailyRentalItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-ocean-dark group-hover:text-amber-600 transition-colors leading-tight">
                      {dailyRentalItem.name}
                    </h3>
                    <p className="font-sans text-xs text-ocean-slate leading-relaxed">
                      {dailyRentalItem.desc}
                    </p>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-500/15">
                  {dailyRentalItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-ocean-dark bg-white/80 px-3 py-2 rounded-xl border border-amber-500/20 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Instant Action Footer */}
              <div className="pt-6 mt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-ocean-slate line-through">{dailyRentalItem.oldPrice}</span>
                    <span className="font-display text-3xl font-black text-amber-600">{dailyRentalItem.price}</span>
                    <span className="text-xs font-bold text-ocean-slate">/ {locale === 'ge' ? '1 დღე' : '1 Day'}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 block mt-0.5">{dailyRentalItem.subPrice}</span>
                </div>

                <button 
                  type="button"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 group-hover:brightness-110 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{locale === 'ge' ? 'დააჭირეთ დასაჯავშნად' : 'Click to Book'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Hourly Rental (Cyan/Sky Theme) */}
            <div 
              onClick={() => setBookingItem(hourlyRentalItem)}
              className="group relative bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 rounded-[2.5rem] border-2 border-sky-500/30 p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:border-sky-500 transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
            >
              {/* Top Accent Badge & Clock */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-sky-500/25">
                  <Clock className="w-3.5 h-3.5" />
                  {hourlyRentalItem.badgeText}
                </span>
                <span className="text-xs font-bold text-ocean-slate bg-white px-3 py-1 rounded-full border border-ocean-slate/10 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  {hourlyRentalItem.location}
                </span>
              </div>

              <div className="space-y-4">
                {/* Image & Title Header */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-ocean-dark relative shadow-md">
                    <img 
                      src={hourlyRentalItem.image} 
                      alt={hourlyRentalItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-ocean-dark group-hover:text-sky-600 transition-colors leading-tight">
                      {hourlyRentalItem.name}
                    </h3>
                    <p className="font-sans text-xs text-ocean-slate leading-relaxed">
                      {hourlyRentalItem.desc}
                    </p>
                  </div>
                </div>

                {/* Feature Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-sky-500/15">
                  {hourlyRentalItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-ocean-dark bg-white/80 px-3 py-2 rounded-xl border border-sky-500/20 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Instant Action Footer */}
              <div className="pt-6 mt-6 border-t border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-sky-600">{hourlyRentalItem.price}</span>
                    <span className="text-xs font-bold text-ocean-slate">/ {locale === 'ge' ? '1-ლი საათი' : '1st Hour'}</span>
                  </div>
                  <span className="text-xs font-bold text-ocean-teal block mt-0.5">{hourlyRentalItem.subPrice}</span>
                </div>

                <button 
                  type="button"
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 group-hover:brightness-110 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{locale === 'ge' ? 'დააჭირეთ დასაჯავშნად' : 'Click to Book'}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: 🎓 საბაზისო შემსწავლელი სეანსები (Beginner Lesson Section) */}
        <section className="space-y-6 sm:space-y-8">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ocean-dark tracking-tight">
                {locale === 'ge' ? '🎓 საბაზისო შემსწავლელი სეანსები' : locale === 'ru' ? '🎓 Обучение сапбордингу' : '🎓 Beginner SUP Lessons'}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ocean-slate font-medium">
                {locale === 'ge' ? '90-წუთიანი პრაქტიკული სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად' : '90-minute structured beginner lesson with certified instructor'}
              </p>
            </div>
          </div>

          {/* Spotlight Wide Hero Card for Beginner Lesson */}
          <div 
            onClick={() => setBookingItem(beginnerLessonItem)}
            className="group relative bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 rounded-[2.5rem] border-2 border-emerald-500/30 p-6 sm:p-10 shadow-xl hover:shadow-2xl hover:border-emerald-500 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-1.5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Image with Badge */}
              <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-ocean-dark shadow-lg">
                <img 
                  src={beginnerLessonItem.image} 
                  alt={beginnerLessonItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-md">
                  {beginnerLessonItem.badgeText}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold font-sans">
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    90 Mins Lesson
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    100% Safe
                  </span>
                </div>
              </div>

              {/* Right Column Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-ocean-teal mb-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{beginnerLessonItem.location}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-black text-ocean-dark group-hover:text-emerald-600 transition-colors leading-tight">
                    {beginnerLessonItem.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed mt-2">
                    {beginnerLessonItem.desc}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {beginnerLessonItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-ocean-dark bg-white px-3.5 py-2.5 rounded-2xl border border-emerald-500/20 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-black text-emerald-600">{beginnerLessonItem.price}</span>
                      <span className="text-xs font-bold text-ocean-slate">/ {beginnerLessonItem.duration}</span>
                    </div>
                    <span className="text-xs font-bold text-ocean-teal block mt-0.5">{beginnerLessonItem.subPrice}</span>
                  </div>

                  <button 
                    type="button"
                    className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 group-hover:brightness-110 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                    <span>{locale === 'ge' ? 'დააჭირეთ სეანსის დასაჯავშნად' : 'Click to Book Lesson'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: 🏆 კორპორატიული შეთავაზებები (Corporate Section) */}
        <section id="corporate-section" className="space-y-6 sm:space-y-8">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-ocean-dark tracking-tight">
                {locale === 'ge' ? '🏆 კორპორატიული შეთავაზებები &amp; თიმბილდინგი' : locale === 'ru' ? '🏆 Корпоративы и Тимбилдинг' : '🏆 Corporate Events & Team Building'}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ocean-slate font-medium">
                {locale === 'ge' ? 'ინდივიდუალური პაკეტები კომპანიებისთვის, გიგანტური საპები & შეჯიბრებები' : 'Tailored packages for companies, giant SUPs, races & videography'}
              </p>
            </div>
          </div>

          {/* Corporate Glassmorphism Card */}
          <div className="bg-gradient-to-br from-ocean-dark via-ocean-navy to-slate-900 rounded-[2.5rem] p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 mb-8">
              
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-widest border border-white/10">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {corporateItem.badgeText}
                </span>

                <h3 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                  {corporateItem.name}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-ocean-light/80 leading-relaxed">
                  {corporateItem.desc}
                </p>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {corporateItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-white bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column Image Container */}
              <div className="lg:col-span-5 aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-black/40 border border-white/10 relative shadow-2xl">
                <img 
                  src={corporateItem.image} 
                  alt={corporateItem.name} 
                  className="w-full h-full object-cover brightness-[0.85]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs font-bold text-ocean-cyan uppercase tracking-wider font-sans">
                    {locale === 'ge' ? 'ლისის ტბა & შეკვეთილის სანაპირო' : 'Lisi Lake & Shekvetili Coast'}
                  </span>
                </div>
              </div>

            </div>

            {/* Embedded Corporate Form */}
            <div className="pt-8 border-t border-white/15 relative z-10">
              <CorporateForm locale={locale} />
            </div>

          </div>
        </section>

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
      <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-6 text-center text-white space-y-3">
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
      <div className="text-center mb-6">
        <h4 className="font-display text-lg font-bold text-white">
          {locale === 'ge' ? 'მოგვწერეთ თქვენი მოთხოვნები' : locale === 'ru' ? 'Оставьте ваш запрос' : 'Send Your Requirements'}
        </h4>
        <p className="font-sans text-xs text-ocean-light/70">
          {locale === 'ge' ? 'შევადგენთ სპეციალურად თქვენზე მორგებულ კორპორატიულ პაკეტს' : 'We will build a customized corporate event package for your team'}
        </p>
      </div>

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
        className="w-full py-4 px-6 bg-gradient-to-r from-ocean-cyan to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-ocean-dark font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-ocean-cyan/20 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{locale === 'ge' ? 'კორპორატიული მოთხოვნის გაგზავნა' : locale === 'ru' ? 'Отправить запрос' : 'Send Corporate Inquiry'}</span>
      </button>
    </form>
  );
}
