import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, Clock, Star, Flame, Trophy, CheckCircle2, ShieldCheck, Waves, MessageCircle, Touchpad, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from '@/components/BookingModal';

export default function Services() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [bookingItem, setBookingItem] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
      })
      .catch((err) => {
        console.error('Failed to load DB in Services page:', err);
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
    price: "50 GEL",
    subPrice: locale === 'ge' ? '2 დღე = 80 GEL (აქცია)' : locale === 'ru' ? '2 дня = 80 GEL (Акция)' : '2 Days = 80 GEL (Promo)',
    oldPrice: "70 GEL",
    duration: locale === 'ge' ? "1-2 დღე (სრული კომპლექტი)" : "1-2 Days (Full Kit)",
    image: "/pictures/paddleboard-1.webp",
    desc: locale === 'ge' 
      ? "საპ ბორდის დღიური გაქირავება სპეციალური ფასდაკლებით! 1 დღე = 50 ლარი, ხოლო 2 დღე = 80 ლარი. წაიღეთ დაფა ზურგჩანთით საქართველოს ნებისმიერ ტბაზე!" 
      : "Daily SUP board rental with special discount! 1 day = 50 GEL, 2 days = 80 GEL.",
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
    price: "25 GEL",
    subPrice: locale === 'ge' ? 'ყოფილი შემდგომი საათი = 20 GEL/სთ' : locale === 'ru' ? 'След. часы = 20 GEL/час' : 'Next hours = 20 GEL/hr',
    duration: locale === 'ge' ? "საათობრივი" : "Hourly",
    image: "/pictures/paddleboard-2.webp",
    desc: locale === 'ge' 
      ? "საპ ბორდით სრიალი საათობრივად! პირველი საათი 25 ლარი, ხოლო ყოველი შემდგომი საათი — 20 ლარი." 
      : "Hourly paddleboard rental. 25 GEL 1st hour, 20 GEL for each next hour.",
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
    price: "45 GEL",
    subPrice: locale === 'ge' ? '90 წუთი ინსტრუქტორთან ერთად' : locale === 'ru' ? '90 мин с инструктором' : '90 mins with certified instructor',
    duration: locale === 'ge' ? "90 წუთი" : "90 Mins",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    desc: locale === 'ge' 
      ? "90-წუთიანი შემსწავლელი სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად! მოიცავს ხმელეთზე უსაფრთხოების ბრიფინგს, ბალანსის დაჭერას, ნიჩბოსნობის ტექნიკასა და წყალზე სრიალს." 
      : "90-minute structured beginner session with a certified instructor! Land briefing, balance setup, and guided paddling.",
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
    price: "Custom",
    subPrice: locale === 'ge' ? 'ინდივიდუალური პაკეტი' : 'Tailored Event Package',
    duration: locale === 'ge' ? "მოქნილი დრო" : "Flexible",
    image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=1000&q=80",
    desc: locale === 'ge' 
      ? "ინდივიდუალური კორპორატიული შეთავაზებები კომპანიებისა და ჯგუფებისთვის. გიგანტური საპების შეჯიბრებები, თიმბილდინგი და ფოტო/ვიდეო გადაღება." 
      : "Customized corporate offers and team building for groups and businesses.",
    badgeText: locale === 'ge' ? '🏆 ჯგუფური & კორპორატიული' : '🏆 Group & Corporate',
    highlights: [
      locale === 'ge' ? 'გიგანტური საპები (6-8 კაცზე)' : 'Giant SUPs (6-8 participants)',
      locale === 'ge' ? 'ღონისძიების პერსონალური კოორდინატორი' : 'Personal Event Coordinator',
      locale === 'ge' ? 'ჯგუფური ფასდაკლება & ქეითერინგი' : 'Group Discount & Catering',
      locale === 'ge' ? 'პროფესიონალი ვიდეოგრაფი' : 'Professional Videographer'
    ]
  };

  return (
    <div className="bg-gradient-to-b from-ocean-light/20 via-white to-ocean-light/30 min-h-screen py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
        
        {/* Hidden SEO Header */}
        <div className="sr-only">
          <h1>{dict.meta.services.title}</h1>
          <p>{dict.meta.services.description}</p>
        </div>

        {/* SECTION 1: 🏄‍♂️ საპ ბორდების გაქირავება (SUP Rental Section) */}
        <section className="space-y-4 sm:space-y-6">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-ocean-teal to-teal-400 text-white flex items-center justify-center shadow-md">
              <Waves className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ocean-dark tracking-tight">
              {locale === 'ge' ? '🏄‍♂️ საპ ბორდების გაქირავება' : locale === 'ru' ? '🏄‍♂️ Аренда сапбордов' : '🏄‍♂️ SUP Board Rentals'}
            </h2>
          </div>

          {/* Rental Cards Side-by-Side (Daily Promo vs Hourly Rental) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Card 1: Daily Rental Promo */}
            <div 
              onClick={() => setBookingItem(dailyRentalItem)}
              className="group relative bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 rounded-3xl sm:rounded-[2.5rem] border-2 border-amber-500/30 p-4 sm:p-7 shadow-md hover:shadow-xl hover:border-amber-500 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                    <Flame className="w-3 h-3 fill-white" />
                    {dailyRentalItem.badgeText}
                  </span>
                </div>

                {/* Card Title & Content */}
                <div className="flex gap-4 items-center mb-3">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-ocean-dark shrink-0 shadow-sm">
                    <img 
                      src={dailyRentalItem.image} 
                      alt={dailyRentalItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-lg sm:text-2xl font-black text-ocean-dark group-hover:text-amber-600 transition-colors leading-tight">
                      {dailyRentalItem.name}
                    </h3>
                    <p className="font-sans text-xs text-ocean-slate line-clamp-2 hidden md:block">
                      {dailyRentalItem.desc}
                    </p>
                    <span className="text-[11px] font-bold text-amber-600 block md:hidden">
                      {dailyRentalItem.subPrice}
                    </span>
                  </div>
                </div>

                {/* Feature Chips (Desktop View Only) */}
                <div className="hidden md:grid grid-cols-2 gap-2 pt-2 border-t border-amber-500/15">
                  {dailyRentalItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-ocean-dark bg-white/80 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Footer CTA */}
              <div className="pt-3 sm:pt-4 mt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-ocean-slate line-through">{dailyRentalItem.oldPrice}</span>
                    <span className="font-display text-xl sm:text-3xl font-black text-amber-600">{dailyRentalItem.price}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-ocean-slate">/ {locale === 'ge' ? '1 დღე' : '1 Day'}</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-600 hidden md:block">{dailyRentalItem.subPrice}</span>
                </div>

                <div className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md group-hover:brightness-110 transition-all shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                  <span>{locale === 'ge' ? 'დააკლიკეთ დასაჯავშნად' : 'Click to Book'}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Hourly Rental */}
            <div 
              onClick={() => setBookingItem(hourlyRentalItem)}
              className="group relative bg-gradient-to-br from-sky-500/10 via-white to-blue-500/5 rounded-3xl sm:rounded-[2.5rem] border-2 border-sky-500/30 p-4 sm:p-7 shadow-md hover:shadow-xl hover:border-sky-500 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                    <Clock className="w-3 h-3" />
                    {hourlyRentalItem.badgeText}
                  </span>
                </div>

                {/* Card Title & Content */}
                <div className="flex gap-4 items-center mb-3">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-ocean-dark shrink-0 shadow-sm">
                    <img 
                      src={hourlyRentalItem.image} 
                      alt={hourlyRentalItem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display text-lg sm:text-2xl font-black text-ocean-dark group-hover:text-sky-600 transition-colors leading-tight">
                      {hourlyRentalItem.name}
                    </h3>
                    <p className="font-sans text-xs text-ocean-slate line-clamp-2 hidden md:block">
                      {hourlyRentalItem.desc}
                    </p>
                    <span className="text-[11px] font-bold text-sky-600 block md:hidden">
                      {hourlyRentalItem.subPrice}
                    </span>
                  </div>
                </div>

                {/* Feature Chips (Desktop View Only) */}
                <div className="hidden md:grid grid-cols-2 gap-2 pt-2 border-t border-sky-500/15">
                  {hourlyRentalItem.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-ocean-dark bg-white/80 px-2.5 py-1.5 rounded-xl border border-sky-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Footer CTA */}
              <div className="pt-3 sm:pt-4 mt-3 border-t border-sky-500/20 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl sm:text-3xl font-black text-sky-600">{hourlyRentalItem.price}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-ocean-slate">/ {locale === 'ge' ? '1-ლი სთ' : '1st Hr'}</span>
                  </div>
                  <span className="text-[11px] font-bold text-ocean-teal hidden md:block">{hourlyRentalItem.subPrice}</span>
                </div>

                <div className="py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md group-hover:brightness-110 transition-all shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                  <span>{locale === 'ge' ? 'დააკლიკეთ დასაჯავშნად' : 'Click to Book'}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: 🎓 საბაზისო შემსწავლელი სეანსები (Beginner Lesson Section) */}
        <section className="space-y-4 sm:space-y-6">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ocean-dark tracking-tight">
              {locale === 'ge' ? '🎓 საბაზისო შემსწავლელი სეანსები' : locale === 'ru' ? '🎓 Обучение сапбордингу' : '🎓 Beginner Lessons'}
            </h2>
          </div>

          {/* Compact Beginner Lesson Card */}
          <div 
            onClick={() => setBookingItem(beginnerLessonItem)}
            className="group relative bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 rounded-3xl sm:rounded-[2.5rem] border-2 border-emerald-500/30 p-4 sm:p-7 shadow-md hover:shadow-xl hover:border-emerald-500 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                {beginnerLessonItem.badgeText}
              </span>
            </div>

            <div className="flex gap-4 items-center mb-3">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-ocean-dark shrink-0 shadow-sm relative">
                <img 
                  src={beginnerLessonItem.image} 
                  alt={beginnerLessonItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-lg sm:text-2xl font-black text-ocean-dark group-hover:text-emerald-600 transition-colors leading-tight">
                  {beginnerLessonItem.name}
                </h3>
                <p className="font-sans text-xs text-ocean-slate line-clamp-2 hidden md:block">
                  {beginnerLessonItem.desc}
                </p>
                <span className="text-[11px] font-bold text-emerald-600 block md:hidden">
                  {beginnerLessonItem.subPrice}
                </span>
              </div>
            </div>

            {/* Feature Chips (Desktop View Only) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/15">
              {beginnerLessonItem.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-ocean-dark bg-white/80 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>

            {/* Compact Footer CTA */}
            <div className="pt-3 sm:pt-4 mt-3 border-t border-emerald-500/20 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-xl sm:text-3xl font-black text-emerald-600">{beginnerLessonItem.price}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-ocean-slate">/ 90 {locale === 'ge' ? 'წუთი' : 'Mins'}</span>
                </div>
                <span className="text-[11px] font-bold text-ocean-teal hidden md:block">{beginnerLessonItem.subPrice}</span>
              </div>

              <div className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md group-hover:brightness-110 transition-all shrink-0">
                <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                <span>{locale === 'ge' ? 'დააკლიკეთ დასაჯავშნად' : 'Click to Book'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: 🏆 კორპორატიული შეთავაზებები (Corporate Section) */}
        <section id="corporate-section" className="space-y-4 sm:space-y-6">
          {/* Section Title Header */}
          <div className="flex items-center gap-3 border-b border-ocean-slate/15 pb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-ocean-dark tracking-tight">
              {locale === 'ge' ? '🏆 კორპორატიული შეთავაზებები' : locale === 'ru' ? '🏆 Корпоративы' : '🏆 Corporate Events'}
            </h2>
          </div>

          {/* Corporate Glassmorphism Container */}
          <div className="bg-gradient-to-br from-ocean-dark via-ocean-navy to-slate-900 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="space-y-3 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                <Trophy className="w-3 h-3 text-amber-400" />
                {corporateItem.badgeText}
              </span>

              <h3 className="font-display text-xl sm:text-3xl font-black text-white leading-tight">
                {corporateItem.name}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-ocean-light/80 leading-relaxed max-w-xl">
                {corporateItem.desc}
              </p>
            </div>

            {/* Embedded Corporate Form */}
            <div className="pt-6 border-t border-white/15">
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
      <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 sm:p-6 text-center text-white space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-display text-base font-bold">
          {locale === 'ge' ? 'მოთხოვნა მიღებულია!' : locale === 'ru' ? 'Запрос принят!' : 'Inquiry Received!'}
        </h4>
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
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl mx-auto text-left relative z-10">
      <div className="text-center mb-4">
        <h4 className="font-display text-base sm:text-lg font-bold text-white">
          {locale === 'ge' ? 'მოგვწერეთ თქვენი მოთხოვნები' : locale === 'ru' ? 'Оставьте ваш запрос' : 'Send Your Requirements'}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
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
            className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
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
          className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-ocean-light/90 mb-1 font-sans">
          {locale === 'ge' ? 'მოთხოვნები (თარიღი, მონაწილეები)' : locale === 'ru' ? 'Детали (дата, люди)' : 'Details (date, size)'}
        </label>
        <textarea
          rows={2}
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          placeholder={locale === 'ge' ? 'გვსურს 15 კაციანი ტური...' : 'Write details...'}
          className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-ocean-cyan transition-all resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 bg-gradient-to-r from-ocean-cyan to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-ocean-dark font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{locale === 'ge' ? 'კორპორატიული მოთხოვნის გაგზავნა' : locale === 'ru' ? 'Отправить запрос' : 'Send Corporate Inquiry'}</span>
      </button>
    </form>
  );
}
