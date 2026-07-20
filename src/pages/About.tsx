import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

export default function About() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();

  const aboutDict = dict.about_page || {
    title: locale === 'ge' ? 'ჩვენ შესახებ' : locale === 'ru' ? 'О нас' : 'About Us',
    history_badge: locale === 'ge' ? '5 წელი წყალზე' : locale === 'ru' ? '5 лет на воде' : '5 Years on Water',
    company_name: 'supsurf.ge',
    history_desc: locale === 'ge' 
      ? 'ჩვენ ვართ supsurf.ge და უკვე 5 წელია რაც საქართველოში საპ ბორდების გაქირავებასა და აქტიურ საწყლოსნო დასვენებას ვუზრუნველყოფთ.' 
      : locale === 'ru' 
      ? 'Мы — supsurf.ge, и уже 5 лет предоставляем прокат сапбордов премиум-класса и активный водный отдых в Грузии.' 
      : 'We are supsurf.ge, and we have been providing premium SUP renting and active water sports recreation in Georgia for 5 years.',
    our_stations: locale === 'ge' ? 'ჩვენი სადგურები' : locale === 'ru' ? 'Наши станции' : 'Our Stations',
    send_inquiry: locale === 'ge' ? 'მოგვწერეთ შეტყობინება' : locale === 'ru' ? 'Отправить запрос' : 'Send an Inquiry',
    form_subtitle: locale === 'ge' 
      ? 'გაქვთ კითხვები საპების ყიდვასთან ან ჯგუფურ ტურებთან დაკავშირებით? დაგვიტოვეთ კონტაქტი და მალე გიპასუხებთ.' 
      : locale === 'ru' 
      ? 'Есть вопросы о покупке сапов или групповых турах? Оставьте контакты, и мы скоро ответим.' 
      : 'Have questions about custom SUP sales or group events? Leave your contact info and our team will reply shortly.',
    full_name: locale === 'ge' ? 'სახელი და გვარი' : locale === 'ru' ? 'Имя и фамилия' : 'Full Name',
    email_address: locale === 'ge' ? 'ელ. ფოსტა' : locale === 'ru' ? 'Электронная почта' : 'Email Address',
    subject: locale === 'ge' ? 'თემა' : locale === 'ru' ? 'Тема' : 'Subject',
    message: locale === 'ge' ? 'შეტყობინება' : locale === 'ru' ? 'Сообщение' : 'Message',
    btn_send: locale === 'ge' ? 'გაგზავნა' : locale === 'ru' ? 'Отправить сообщение' : 'Send Message',
    map_title: locale === 'ge' ? 'საწყლოსნო აქტივობების რუკა' : locale === 'ru' ? 'Карта водных станций' : 'Interactive Water Sports Map',
    map_desc: locale === 'ge' 
      ? 'ჩვენი გაქირავების კონტეინერები და სერფინგის სკოლები განლაგებულია უშუალოდ წყლის პირას.' 
      : locale === 'ru' 
      ? 'Наши контейнеры проката и школы серфинга расположены прямо у воды для быстрого получения снаряжения.' 
      : 'Our rental containers and surf schools are located right on the water line for instant pickup.',
    active_stations: locale === 'ge' ? 'აქტიური სადგურები' : locale === 'ru' ? 'Активные гео-станции' : 'Active Geo Stations',
    placeholder_name: locale === 'ge' ? 'გიორგი...' : locale === 'ru' ? 'Георгий...' : 'Giorgi...',
    placeholder_subject: locale === 'ge' ? 'მაგ. დაფის ყიდვა, ჯგუფური ტურები' : locale === 'ru' ? 'Напр. покупка доски, групповые уроки' : 'e.g. Board Purchase, Group Lessons',
    placeholder_message: locale === 'ge' ? 'დაწერეთ დეტალები...' : locale === 'ru' ? 'Напишите детали...' : 'Write details...',
    branches: [
      {
        name: locale === 'ge' ? "თბილისი - ლისის ტბის სადგური" : locale === 'ru' ? "Тбилиси - Станция на озере Лиси" : "Tbilisi - Lisi Lake Station",
        address: "Lisi Lake Park, Northern Shore, Tbilisi, Georgia",
        phone: "+995 592 05 50 17",
        hours: "Mon - Sun: 09:00 - 21:00"
      },
      {
        name: locale === 'ge' ? "ბათუმი - ანბანის კოშკის სადგური" : locale === 'ru' ? "Батуми - Станция у Алфавитной башни" : "Batumi - Miracle Beach Station",
        address: "Miracle Beach (near Ferris Wheel), Batumi, Georgia",
        phone: "+995 592 05 50 17",
        hours: "Mon - Sun: 08:00 - 20:00"
      },
      {
        name: locale === 'ge' ? "ანაკლია - ბულვარის პიერსი" : locale === 'ru' ? "Анаклия - Станция на бульваре" : "Anaklia - Boulevard Pier Station",
        address: "Main Boulevard Coastline, Anaklia, Georgia",
        phone: "+995 592 05 50 17",
        hours: "Mon - Sun: 10:00 - 22:00"
      }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(locale === 'ge' ? 'შეკითხვა წარმატებით გაიგზავნა!' : locale === 'ru' ? 'Запрос успешно отправлен!' : 'Inquiry sent successfully!');
  };

  return (
    <div className="bg-ocean-light/20 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* About Company Showcase */}
        <div className="rounded-3xl border border-ocean-slate/10 bg-white p-8 sm:p-12 shadow-sm space-y-6 mb-12 max-w-4xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-gradient-to-r from-ocean-teal to-ocean-cyan text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aboutDict.history_badge}</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ocean-dark tracking-tight">
            {aboutDict.company_name}
          </h1>
          <p className="font-sans text-lg text-ocean-slate leading-relaxed max-w-2xl mx-auto">
            {aboutDict.history_desc}
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Branches Card */}
            <div className="rounded-3xl border border-ocean-slate/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-bold text-ocean-dark">
                {aboutDict.our_stations}
              </h2>
              <div className="divide-y divide-ocean-light space-y-6">
                {aboutDict.branches.map((b: { name: string; address: string; phone: string; hours: string }, idx: number) => (
                  <div key={idx} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
                    <h3 className="font-display text-base font-bold text-ocean-teal">{b.name}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2.5">
                        <MapPin className="w-4.5 h-4.5 text-ocean-slate shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-ocean-slate leading-relaxed">{b.address}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Phone className="w-4.5 h-4.5 text-ocean-slate shrink-0" />
                        <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className="font-sans text-xs text-ocean-slate hover:text-ocean-teal transition-colors">
                          {b.phone}
                        </a>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Clock className="w-4.5 h-4.5 text-ocean-slate shrink-0" />
                        <span className="font-sans text-xs text-ocean-slate">{b.hours}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylized Interactive Map component */}
            <div className="rounded-3xl border border-ocean-slate/10 bg-gradient-to-br from-ocean-navy to-ocean-dark text-white p-6 sm:p-8 shadow-md relative overflow-hidden h-[300px] flex flex-col justify-between">
              {/* Abstract decorative grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-ocean-teal tracking-widest font-sans">
                  {aboutDict.active_stations}
                </span>
                <h3 className="font-display text-lg font-bold text-white">{aboutDict.map_title}</h3>
                <p className="font-sans text-xs text-ocean-cyan/60 max-w-sm">
                  {aboutDict.map_desc}
                </p>
              </div>

              {/* Graphical Representation of Georgia */}
              <div className="relative z-10 h-32 flex items-center justify-center">
                <div className="w-64 h-24 border border-white/10 rounded-2xl bg-white/5 relative flex items-center justify-between px-6">
                  {/* Anaklia */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-ocean-teal flex items-center justify-center relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-teal opacity-75"></span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="font-sans text-[9px] font-bold text-ocean-cyan uppercase">Anaklia</span>
                  </div>

                  {/* Batumi */}
                  <div className="flex flex-col items-center gap-1 self-end mb-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-ocean-teal flex items-center justify-center relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-teal opacity-75"></span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="font-sans text-[9px] font-bold text-ocean-cyan uppercase">Batumi</span>
                  </div>

                  {/* Tbilisi Lisi */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-ocean-teal flex items-center justify-center relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-teal opacity-75"></span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                    <span className="font-sans text-[9px] font-bold text-ocean-cyan uppercase">Tbilisi</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="rounded-3xl border border-ocean-slate/10 bg-white p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-ocean-dark">
                  {aboutDict.send_inquiry}
                </h2>
                <p className="font-sans text-xs text-ocean-slate mt-1">
                  {aboutDict.form_subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs font-bold text-ocean-dark">{aboutDict.full_name}</label>
                  <input
                    type="text"
                    required
                    placeholder={aboutDict.placeholder_name}
                    className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs font-bold text-ocean-dark">{aboutDict.email_address}</label>
                  <input
                    type="email"
                    required
                    placeholder="giorgi@gmail.com"
                    className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs font-bold text-ocean-dark">{aboutDict.subject}</label>
                  <input
                    type="text"
                    required
                    placeholder={aboutDict.placeholder_subject}
                    className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-xs font-bold text-ocean-dark">{aboutDict.message}</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={aboutDict.placeholder_message}
                    className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 hover:shadow-lg font-display font-bold py-3.5 shadow-md transition-all text-white"
              >
                <Send className="w-4.5 h-4.5 text-white" />
                <span>{aboutDict.btn_send}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
