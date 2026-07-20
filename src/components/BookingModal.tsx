import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  locale: Locale;
  contact: {
    whatsapp: string;
    instagram: string;
    phone: string;
  };
}

export default function BookingModal({ isOpen, onClose, itemName, locale, contact }: BookingModalProps) {
  if (!isOpen) return null;

  const cleanWhatsApp = contact.whatsapp.replace(/\s+/g, '');
  let waText = '';
  if (locale === 'ge') {
    waText = `გამარჯობა! მსურს დაჯავშნა: ${itemName}`;
  } else if (locale === 'ru') {
    waText = `Здравствуйте! Я бы хотел забронировать: ${itemName}`;
  } else {
    waText = `Hello! I would like to book: ${itemName}`;
  }
  const whatsappLink = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(waText)}`;
  const facebookLink = 'https://www.facebook.com/SUNSETPSUP/';
  const instagramLink = contact.instagram || 'https://www.instagram.com/sun_set_paddle/';

  return (
    <div className="fixed inset-0 z-[100] bg-ocean-dark/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-ocean-slate/10 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative space-y-6">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ocean-slate hover:text-ocean-dark bg-ocean-light/50 p-1.5 rounded-full transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pr-6">
          <h3 className="font-display text-base font-extrabold text-ocean-dark">
            {locale === 'ge' ? 'აირჩიეთ საკონტაქტო არხი' : locale === 'ru' ? 'Выберите канал связи' : 'Choose Contact Channel'}
          </h3>
          <p className="font-sans text-[11px] text-ocean-slate leading-relaxed">
            {locale === 'ge' 
              ? `სად გირჩევნიათ დაკავშირება „${itemName}“-ს დასაჯავშნად?` 
              : locale === 'ru' 
                ? `Где вам удобнее связаться для бронирования «${itemName}»?` 
                : `Where would you prefer to reach us to book "${itemName}"?`}
          </p>
        </div>

        {/* Contact Options Row */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="bg-white border border-ocean-slate/10 p-3 rounded-xl text-center space-y-1.5 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-emerald-100 shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display text-[9px] font-bold text-ocean-dark">WhatsApp</span>
          </a>

          {/* Instagram */}
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="bg-white border border-ocean-slate/10 p-3 rounded-xl text-center space-y-1.5 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-pink-100 shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <span className="font-display text-[9px] font-bold text-ocean-dark">Instagram</span>
          </a>

          {/* Facebook */}
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="bg-white border border-ocean-slate/10 p-3 rounded-xl text-center space-y-1.5 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-blue-100 shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </div>
            <span className="font-display text-[9px] font-bold text-ocean-dark">Facebook</span>
          </a>

        </div>
      </div>
    </div>
  );
}
