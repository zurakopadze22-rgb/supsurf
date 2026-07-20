'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Mail, Phone, MessageCircle, AlertCircle, CheckCircle, Calculator, PhoneCall, ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

// Daily rates in GEL
const DAILY_RATES = {
  sup_allround: 30,
  sup_touring: 40,
  surf_soft: 35,
  surf_hard: 50,
  wingfoil: 100,
  accessories: 10,
};

interface BookingFormProps {
  locale: Locale;
  dict: {
    booking: {
      title: string;
      subtitle: string;
      select_board: string;
      board_options: {
        sup_allround: string;
        sup_touring: string;
        surf_soft: string;
        surf_hard: string;
        wingfoil: string;
        accessories: string;
      };
      pricing_note: string;
      location: string;
      locations: {
        lisi: string;
        batumi: string;
        anaklia: string;
      };
      start_date: string;
      end_date: string;
      full_name: string;
      email: string;
      phone: string;
      comments: string;
      summary: string;
      duration: string;
      days: string;
      rate: string;
      total: string;
      btn_submit: string;
      btn_submitting: string;
      success_title: string;
      success_desc: string;
      error_title: string;
      errors: {
        name: string;
        email: string;
        phone: string;
        dates: string;
        past_date: string;
      };
    };
  };
}

export default function BookingForm({ locale, dict }: BookingFormProps) {
  // Form states
  const [equipment, setEquipment] = useState<keyof typeof DAILY_RATES>('sup_allround');
  const [location, setLocation] = useState<'lisi' | 'batumi' | 'anaklia'>('lisi');
  
  // Get today's date in YYYY-MM-DD format for HTML date inputs
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');

  // Status states
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Contact Info state
  const [contactInfo, setContactInfo] = useState({
    phone: '+995 555 123 456',
    whatsapp: '995555123456',
    instagram: 'https://instagram.com/supsurf.ge'
  });

  // Fetch live contacts from DB
  useEffect(() => {
    fetch('/api/admin')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data.contact) {
          setContactInfo(data.contact);
        }
      })
      .catch((err) => console.error('Failed to load contact info dynamically:', err));
  }, []);

  // Price calculations (Derived state)
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate difference in days
  const diffTime = end.getTime() - start.getTime();
  let calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (isNaN(calculatedDays) || calculatedDays < 1) {
    calculatedDays = 1;
  }
  const days = calculatedDays;

  let dailyRate = DAILY_RATES[equipment as keyof typeof DAILY_RATES] || DAILY_RATES.sup_allround;
  let discount = 0;
  let totalPrice = dailyRate * days;
  let saving = 0;
  let originalPrice = dailyRate * days;

  if (equipment === 'sup_allround') {
    // Promo pricing rules:
    if (days === 1) {
      originalPrice = 70;
      totalPrice = 50;
      dailyRate = 50;
    } else if (days === 2) {
      originalPrice = 100;
      totalPrice = 80;
      dailyRate = 40;
    } else {
      originalPrice = 50 * days;
      totalPrice = 35 * days;
      dailyRate = 35;
    }
    saving = originalPrice - totalPrice;
    discount = 0; // Promo doesn't stack additional volume discounts
  } else {
    // Apply volume discounts: 3+ days (10% off), 7+ days (25% off)
    let calculatedDiscount = 0;
    if (days >= 7) {
      calculatedDiscount = 0.25;
    } else if (days >= 3) {
      calculatedDiscount = 0.10;
    }
    discount = calculatedDiscount * 100;

    originalPrice = dailyRate * days;
    totalPrice = originalPrice * (1 - calculatedDiscount);
    saving = originalPrice - totalPrice;
  }


  const validateForm = () => {
    const validationErrors: string[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // Validate Name
    if (fullName.trim().length < 3) {
      validationErrors.push(dict.booking.errors.name);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.push(dict.booking.errors.email);
    }

    // Validate Phone
    const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      validationErrors.push(dict.booking.errors.phone);
    }

    // Validate Dates
    if (start < today) {
      validationErrors.push(dict.booking.errors.past_date);
    }

    if (end < start) {
      validationErrors.push(dict.booking.errors.dates);
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors([]);

    // Switch to contacts confirmation screen
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  // Compile pre-filled WhatsApp message
  const getWhatsAppLink = () => {
    const eqName = dict.booking.board_options[equipment] || equipment;
    const locName = location === 'lisi' ? dict.booking.locations.lisi : location === 'batumi' ? dict.booking.locations.batumi : dict.booking.locations.anaklia;
    
    let text = '';
    if (locale === 'ge') {
      text = `გამარჯობა! მსურს საპ აღჭურვილობის დაჯავშნა:
• სახელი: ${fullName}
• ტელეფონი: ${phone}
• ელ-ფოსტა: ${email}
• ინვენტარი: ${eqName}
• ლოკაცია: ${locName}
• თარიღები: ${startDate}-დან ${endDate}-მდე (${days} დღე)
• ჯამური ფასი: ${totalPrice.toFixed(0)} GEL
• კომენტარი: ${comments || 'არ არის'}`;
    } else if (locale === 'ru') {
      text = `Здравствуйте! Я бы хотел забронировать сап-снаряжение:
• Имя: ${fullName}
• Телефон: ${phone}
• Email: ${email}
• Снаряжение: ${eqName}
• Локация: ${locName}
• Даты: с ${startDate} по ${endDate} (${days} дн.)
• Итоговая стоимость: ${totalPrice.toFixed(0)} GEL
• Комментарий: ${comments || 'нет'}`;
    } else {
      text = `Hello! I would like to book water sports equipment:
• Name: ${fullName}
• Phone: ${phone}
• Email: ${email}
• Equipment: ${eqName}
• Location: ${locName}
• Dates: ${startDate} to ${endDate} (${days} days)
• Total Cost: ${totalPrice.toFixed(0)} GEL
• Comments: ${comments || 'none'}`;
    }
    
    return `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  if (isSuccess) {
    const eqName = dict.booking.board_options[equipment] || equipment;
    const locName = location === 'lisi' ? dict.booking.locations.lisi : location === 'batumi' ? dict.booking.locations.batumi : dict.booking.locations.anaklia;

    return (
      <div className="w-full max-w-3xl mx-auto rounded-3xl bg-white border border-ocean-slate/10 p-6 sm:p-10 md:p-12 shadow-2xl animate-fade-in-up space-y-8">
        
        {/* Title area */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ocean-dark">
            {locale === 'ge' ? 'ჯავშნის ღირებულება გამოთვლილია!' : locale === 'ru' ? 'Стоимость рассчитана!' : 'Booking Cost Calculated!'}
          </h3>
          <p className="font-sans text-sm text-ocean-slate max-w-lg mx-auto leading-relaxed">
            {locale === 'ge' 
              ? 'დაჯავშნის დასასრულებლად, გთხოვთ გადმოგვიგზავნოთ ეს მოთხოვნა ვათსაფზე, მოგვწეროთ ინსტაგრამზე ან დაგვიკავშირდეთ ტელეფონით.'
              : locale === 'ru'
              ? 'Для завершения бронирования, пожалуйста, отправьте этот запрос на WhatsApp, напишите нам в Instagram или позвоните по телефону.'
              : 'To finalize your booking, please send this calculated request to us via WhatsApp, message us on Instagram, or call us directly.'}
          </p>
        </div>

        {/* Detailed summary receipt */}
        <div className="rounded-2xl bg-ocean-light border border-ocean-slate/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-ocean-dark">
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-ocean-teal uppercase tracking-wider">
              {locale === 'ge' ? 'საიჯარო დეტალები' : locale === 'ru' ? 'Детали аренды' : 'Rental Details'}
            </h4>
            <ul className="space-y-2 font-sans text-xs">
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'ინვენტარი:' : locale === 'ru' ? 'Снаряжение:' : 'Equipment:'}</span>
                <span className="font-bold">{eqName}</span>
              </li>
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'ლოკაცია:' : locale === 'ru' ? 'Станция:' : 'Station:'}</span>
                <span className="font-bold">{locName}</span>
              </li>
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'პერიოდი:' : locale === 'ru' ? 'Даты:' : 'Dates:'}</span>
                <span className="font-bold">{startDate} — {endDate} ({days} {locale === 'ge' ? 'დღე' : locale === 'ru' ? 'дн.' : 'days'})</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold text-ocean-teal uppercase tracking-wider">
              {locale === 'ge' ? 'კლიენტის მონაცემები' : locale === 'ru' ? 'Данные клиента' : 'Customer Info'}
            </h4>
            <ul className="space-y-2 font-sans text-xs">
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'სახელი:' : locale === 'ru' ? 'Имя:' : 'Name:'}</span>
                <span className="font-bold">{fullName}</span>
              </li>
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'ტელეფონი:' : locale === 'ru' ? 'Телефон:' : 'Phone:'}</span>
                <span className="font-bold">{phone}</span>
              </li>
              <li className="flex justify-between border-b pb-1 border-ocean-slate/10">
                <span className="text-ocean-slate">{locale === 'ge' ? 'ფასი:' : locale === 'ru' ? 'Стоимость:' : 'Total Price:'}</span>
                <span className="font-bold text-ocean-coral text-sm">{totalPrice.toFixed(0)} GEL</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact pathways actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp CTA */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-4 text-xs shadow-md transition-all sm:col-span-1"
          >
            <MessageCircle className="w-5 h-5 text-white fill-white" />
            <span>WhatsApp Booking</span>
          </a>

          {/* Instagram CTA */}
          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white font-display font-bold py-4 text-xs shadow-md transition-all"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Instagram DM</span>
          </a>

          {/* Call CTA */}
          <a
            href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white font-display font-bold py-4 text-xs shadow-md transition-all"
          >
            <PhoneCall className="w-5 h-5 text-ocean-teal" />
            <span>{locale === 'ge' ? 'დარეკვა' : locale === 'ru' ? 'Позвонить' : 'Call Station'}</span>
          </a>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-xs text-ocean-slate hover:text-ocean-dark underline font-semibold"
          >
            {locale === 'ge' ? 'მონაცემების შეცვლა' : locale === 'ru' ? 'Изменить параметры' : 'Change parameters'}
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-ocean-slate/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      
      {/* Booking Form Side */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 lg:col-span-7 space-y-6">
        <div>
          <h3 className="font-display text-2xl font-extrabold text-ocean-dark">
            {dict.booking.title}
          </h3>
          <p className="font-sans text-sm text-ocean-slate mt-1">
            {dict.booking.subtitle}
          </p>
        </div>

        {/* Validation Errors alert */}
        {errors.length > 0 && (
          <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 animate-fade-in-up">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-display text-sm font-bold text-rose-800">
                  {dict.booking.error_title}
                </h5>
                <ul className="list-disc pl-4 mt-1.5 space-y-1">
                  {errors.map((err, idx) => (
                    <li key={idx} className="font-sans text-xs text-rose-700 leading-normal">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Equipment selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-sm font-bold text-ocean-dark">
              {dict.booking.select_board}
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value as keyof typeof DAILY_RATES)}
              className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 bg-ocean-light/50 text-sm font-medium text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all"
            >
              <option value="sup_allround">{dict.booking.board_options.sup_allround}</option>
              <option value="sup_touring">{dict.booking.board_options.sup_touring} — {DAILY_RATES.sup_touring} GEL/{dict.booking.days.substring(0, 1)}</option>
              <option value="surf_soft">{dict.booking.board_options.surf_soft} — {DAILY_RATES.surf_soft} GEL/{dict.booking.days.substring(0, 1)}</option>
              <option value="surf_hard">{dict.booking.board_options.surf_hard} — {DAILY_RATES.surf_hard} GEL/{dict.booking.days.substring(0, 1)}</option>
              <option value="wingfoil">{dict.booking.board_options.wingfoil} — {DAILY_RATES.wingfoil} GEL/{dict.booking.days.substring(0, 1)}</option>
              <option value="accessories">{dict.booking.board_options.accessories} — {DAILY_RATES.accessories} GEL/{dict.booking.days.substring(0, 1)}</option>
            </select>
            <span className="font-sans text-[11px] text-ocean-slate italic">
              {dict.booking.pricing_note}
            </span>
          </div>

          {/* Location selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-sm font-bold text-ocean-dark">
              {dict.booking.location}
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as 'lisi' | 'batumi' | 'anaklia')}
              className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 bg-ocean-light/50 text-sm font-medium text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all"
            >
              <option value="lisi">{dict.booking.locations.lisi}</option>
              <option value="batumi">{dict.booking.locations.batumi}</option>
              <option value="anaklia">{dict.booking.locations.anaklia}</option>
            </select>
          </div>

          {/* Dates grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ocean-teal" />
                {dict.booking.start_date}
              </label>
              <input
                type="date"
                value={startDate}
                min={getTodayString()}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ocean-teal" />
                {dict.booking.end_date}
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
              <User className="w-4 h-4 text-ocean-teal" />
              {dict.booking.full_name}
            </label>
            <input
              type="text"
              value={fullName}
              placeholder="e.g. Giorgi Kopadze"
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-ocean-teal" />
                {dict.booking.email}
              </label>
              <input
                type="email"
                value={email}
                placeholder="giorgi@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-ocean-teal" />
                {dict.booking.phone}
              </label>
              <input
                type="tel"
                value={phone}
                placeholder="+995 555 123 456"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col gap-1.5">
            <label className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-ocean-teal" />
              {dict.booking.comments}
            </label>
            <textarea
              value={comments}
              rows={3}
              placeholder={locale === 'ge' ? 'მაგალითად: სიმაღლე 180სმ, დამწყები...' : locale === 'ru' ? 'Например: рост 180см, новичок...' : 'e.g. Height 180cm, beginner...'}
              onChange={(e) => setComments(e.target.value)}
              className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans resize-none"
            />
          </div>
        </div>

        {/* Submit btn */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 py-4 font-display font-bold text-white shadow-lg shadow-ocean-coral/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] focus:outline-none transition-all duration-200 ${
            isSubmitting ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          {isSubmitting ? dict.booking.btn_submitting : dict.booking.btn_submit}
        </button>
      </form>

      {/* Summary side */}
      <div className="bg-gradient-to-br from-ocean-navy to-ocean-dark text-white p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2 text-ocean-teal">
              <Calculator className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold uppercase tracking-wider">
              {dict.booking.summary}
            </h4>
          </div>

          <div className="divide-y divide-white/10 space-y-4">
            <div className="flex justify-between items-center pt-2">
              <span className="font-sans text-sm text-ocean-cyan/60">{dict.booking.duration}</span>
              <span className="font-sans text-base font-semibold">
                {days} {dict.booking.days}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-sans text-sm text-ocean-cyan/60">{dict.booking.rate}</span>
              <span className="font-sans text-base font-semibold">{dailyRate} GEL</span>
            </div>
            {saving > 0 && (
              <div className="flex flex-col gap-1 pt-4">
                <div className="flex justify-between items-center text-ocean-cyan/60">
                  <span className="font-sans text-xs">{locale === 'ge' ? 'სტანდარტული ფასი' : locale === 'ru' ? 'Стандартная цена' : 'Regular Price'}</span>
                  <span className="font-sans text-sm line-through">{originalPrice} GEL</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-sans text-xs font-bold">{locale === 'ge' ? 'თქვენ ზოგავთ' : locale === 'ru' ? 'Вы экономите' : 'You Save'}</span>
                  <span className="font-sans text-sm font-bold">-{saving} GEL</span>
                </div>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between items-center pt-4 text-emerald-400">
                <span className="font-sans text-sm text-emerald-400/80">
                  {locale === 'ge' ? 'ფასდაკლება' : locale === 'ru' ? 'Скидка' : 'Volume Discount'}
                </span>
                <span className="font-sans text-base font-bold">-{discount}%</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t-2 border-white/10">
              <span className="font-display text-lg font-bold text-white">{dict.booking.total}</span>
              <div className="flex flex-col items-end">
                <span className="font-display text-2xl font-extrabold text-ocean-teal">
                  {totalPrice.toFixed(0)} GEL
                </span>
                {equipment === 'sup_allround' && (
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wider font-sans uppercase">
                    {locale === 'ge' ? 'აქციით კომპლექტით' : locale === 'ru' ? 'Промо-цена за комплект' : 'Promo Set Active'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Location badge display */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ocean-teal font-sans">
              Selected Station
            </span>
            <span className="font-display text-sm font-semibold">
              {location === 'lisi' ? dict.booking.locations.lisi : location === 'batumi' ? dict.booking.locations.batumi : dict.booking.locations.anaklia}
            </span>
            <span className="text-xs text-ocean-cyan/60 font-sans leading-normal">
              {location === 'lisi' 
                ? 'Lisi Lake, Near water gates. Open 09:00 - 21:00.' 
                : location === 'batumi'
                ? 'Miracle Beach coastal line, near Ferris Wheel. Open 08:00 - 20:00.'
                : 'Anaklia Boulevard pier. Open 10:00 - 22:00.'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
