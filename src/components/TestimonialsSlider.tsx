'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

const testimonialsData: Record<Locale, Testimonial[]> = {
  en: [
    {
      name: 'Sarah Jenkins',
      role: 'UK Tourist / SUP Enthusiast',
      rating: 5,
      text: 'Absolutely the best SUP board rental in Georgia! We visited Lisi Lake, and the inflatable boards were brand new. The staff was super helpful. Highly recommended!',
      avatar: 'SJ',
    },
    {
      name: 'Levon Davis',
      role: 'Digital Nomad',
      rating: 5,
      text: 'Bought my first surfboard epoxy here. Excellent customer support and great pricing. The delivery to Batumi was fast and secure. 5/5!',
      avatar: 'LD',
    },
    {
      name: 'David K.',
      role: 'Beginner Surfer',
      rating: 5,
      text: 'Took surfing lessons for beginners in Anaklia. The instructor was patient and professional. I managed to stand up on my very first wave! Unforgettable!',
      avatar: 'DK',
    },
  ],
  ge: [
    {
      name: 'სალომე კუპატაძე',
      role: 'ტურისტი / SUP მოყვარული',
      rating: 5,
      text: 'საუკეთესო საპ ბორდების გაქირავება თბილისში! ლისის ტბაზე საუკეთესო გასაბერი დაფები აქვთ. ძალიან კეთილგანწყობილი პერსონალია. ყველას ვურჩევ აქტიურ დასვენებას!',
      avatar: 'სკ',
    },
    {
      name: 'ნიკა გიორგაძე',
      role: 'მუდმივი კლიენტი',
      rating: 5,
      text: 'აქ შევიძინე ჩემი პირველი საპ დაფა. საპების გაყიდვა ძალიან კარგ ფასებში აქვთ. კონსულტაცია და მიტანა ბათუმში მოხდა საოცრად სწრაფად.',
      avatar: 'ნგ',
    },
    {
      name: 'მარიამ რეხვიაშვილი',
      role: 'დამწყები სერფერი',
      rating: 5,
      text: 'ანაკლიაში გავიარე სერფინგის გაკვეთილები დამწყებთათვის. ინსტრუქტორი იყო ძალიან ყურადღებიანი და პროფესიონალი. პირველივე ტალღაზე დავდექი დაფაზე!',
      avatar: 'მრ',
    },
  ],
  ru: [
    {
      name: 'Ольга Смирнова',
      role: 'Туристка / Любитель SUP',
      rating: 5,
      text: 'Отличная аренда сап бордов в Грузии! Брали сапы напрокат на озере Лиси, доски новые, сервис супер. Получили массу удовольствия, рекомендую всем!',
      avatar: 'ОС',
    },
    {
      name: 'Александр В.',
      role: 'Покупатель сапборда',
      rating: 5,
      text: 'Решил купить сапборд в этом магазине. Помогли выбрать отличную жесткую доску, быстро доставили в Батуми. Цена очень порадовала, качество на высоте.',
      avatar: 'АВ',
    },
    {
      name: 'Дмитрий М.',
      role: 'Начинающий серфер',
      rating: 5,
      text: 'Брали уроки сап серфинга для начинающих в Анаклии. Инструктор подробно объяснил технику, встал на доску с первой попытки! Отличный прокат сапов.',
      avatar: 'ДМ',
    },
  ],
};

export default function TestimonialsSlider({ locale }: { locale: Locale }) {
  const list = testimonialsData[locale] || testimonialsData.en;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [list.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 md:px-12 py-8">
      {/* Background Quote Icon */}
      <div className="absolute top-2 left-6 text-ocean-teal/10 pointer-events-none">
        <Quote className="w-24 h-24 rotate-180" />
      </div>

      <div className="relative overflow-hidden min-h-[300px] flex items-center">
        {list.map((item, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={idx}
              className={`w-full transition-all duration-500 ease-in-out absolute top-0 left-0 flex flex-col items-center text-center ${
                isCurrent
                  ? 'opacity-100 translate-x-0 pointer-events-auto relative'
                  : 'opacity-0 translate-x-12 pointer-events-none'
              }`}
            >
              {/* Star ratings */}
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-ocean-coral text-ocean-coral" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="font-display text-lg md:text-xl font-medium text-ocean-navy leading-relaxed max-w-2xl mb-8 italic">
                &ldquo;{item.text}&rdquo;
              </blockquote>

              {/* User Identity */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-ocean-navy to-ocean-teal text-white flex items-center justify-center font-display font-extrabold text-sm shadow-md">
                  {item.avatar}
                </div>
                <div className="text-left">
                  <div className="font-display font-bold text-ocean-dark text-sm leading-tight">
                    {item.name}
                  </div>
                  <div className="font-sans text-xs text-ocean-slate mt-0.5">
                    {item.role}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-ocean-slate/15 hover:border-ocean-teal hover:text-ocean-teal flex items-center justify-center text-ocean-slate hover:bg-ocean-light transition-all-300 shadow-sm"
          aria-label="Previous Testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {list.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-6 bg-ocean-teal' : 'w-2.5 bg-ocean-slate/20'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-ocean-slate/15 hover:border-ocean-teal hover:text-ocean-teal flex items-center justify-center text-ocean-slate hover:bg-ocean-light transition-all-300 shadow-sm"
          aria-label="Next Testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
