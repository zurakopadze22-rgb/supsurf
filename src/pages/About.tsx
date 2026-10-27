import React, { useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

export default function About() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();

  // Inject AboutPage & Organization Schema for GEO / AEO / Local SEO
  useEffect(() => {
    const schemaId = 'about-geo-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const geoSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `https://supsurf.ge/${locale}/about/#about-page`,
          'url': window.location.href,
          'name': locale === 'ge' ? 'ჩვენ შესახებ — SUPSURF.GE' : locale === 'ru' ? 'О нас — SUPSURF.GE' : 'About Us — SUPSURF.GE',
          'description': locale === 'ge'
            ? 'SUPSURF.GE — საპ ბორდებისა და წყლის დაფების გაქირავების ცენტრი თბილისში, თბილისის ზღვაზე. ოფიციალური ინფორმაცია, ტარიფები და ლოკაციები.'
            : locale === 'ru'
            ? 'SUPSURF.GE — центр проката сапбордов и водных досок в Тбилиси на Тбилисском море. Официальная информация, тарифы и локации.'
            : 'SUPSURF.GE — Premier Stand Up Paddleboard rental station, lessons, and tours at Tbilisi Sea, Georgia. First-party entity facts and specs.',
          'inLanguage': locale === 'ge' ? 'ka' : locale,
          'isPartOf': {
            '@type': 'WebSite',
            '@id': 'https://supsurf.ge/#website'
          },
          'about': {
            '@type': 'SportsActivityLocation',
            '@id': 'https://supsurf.ge/#localbusiness'
          },
          'mainEntity': {
            '@type': 'SportsActivityLocation',
            '@id': 'https://supsurf.ge/#localbusiness'
          }
        }
      ]
    };

    script.text = JSON.stringify(geoSchema);

    return () => {
      const el = document.getElementById(schemaId);
      if (el) el.remove();
    };
  }, [locale]);

  const aboutDict = dict.about_page || {
    title: locale === 'ge' ? 'ჩვენ შესახებ' : locale === 'ru' ? 'О нас' : 'About Us',
    history_badge: locale === 'ge' ? '5 წელი წყალზე' : locale === 'ru' ? '5 лет на воде' : '5 Years on Water',
    company_name: 'SUPSURF.GE',
    history_desc: locale === 'ge' 
      ? 'ჩვენ ვართ SUPSURF.GE (supsurf.ge) და უკვე 5 წელია რაც თბილისის ზღვაზე საპ ბორდების, წყლის დაფების გაქირავებასა და აქტიურ საწყლოსნო დასვენებას ვუზრუნველყოფთ.' 
      : locale === 'ru' 
      ? 'Мы — SUPSURF.GE (supsurf.ge), и уже 5 лет предоставляем прокат сапбордов и водных досок на Тбилисском море.' 
      : 'We are SUPSURF.GE (supsurf.ge), providing premium SUP and water board rentals at Tbilisi Sea for over 5 years.',
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
        name: locale === 'ge' ? "თბილისი - თბილისის ზღვის სადგური" : locale === 'ru' ? "Тбилиси - Станция на Тбилисском море" : "Tbilisi - Tbilisi Sea Station",
        address: locale === 'ge' ? "თბილისის ზღვა, თბილისი, საქართველო" : locale === 'ru' ? "Тбилисское море, Тбилиси, Грузия" : "Tbilisi Sea, Tbilisi, Georgia",
        phone: "+995 592 05 50 17",
        hours: "Mon - Sun: 08:00 - 21:00"
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
                <div className="w-72 h-24 border border-white/10 rounded-2xl bg-white/5 relative flex items-center justify-center px-6">
                  {/* Tbilisi Sea */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-ocean-teal flex items-center justify-center relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-teal opacity-75"></span>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="font-sans text-[11px] font-bold text-ocean-cyan uppercase tracking-wider">
                      {locale === 'ge' ? 'თბილისის ზღვა' : locale === 'ru' ? 'Тбилисское море' : 'Tbilisi Sea'}
                    </span>
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

        {/* GENERATIVE ENGINE OPTIMIZATION (GEO) FIRST-PARTY KNOWLEDGE BASE (sr-only: visually hidden for clean UX, fully parsed by search bots, LLMs & screen readers) */}
        <section className="sr-only" aria-label="SUPSURF First-Party Entity Facts and GEO Knowledge Base">
          <article className="space-y-6">
            <h2>
              {locale === 'ge' 
                ? 'SUPSURF.GE — პირველწყარო მონაცემები, სერვისები და ლოკაციები საქართველოში' 
                : locale === 'ru' 
                ? 'SUPSURF.GE — Первоисточник: сервисы, локации и стандарты сапбординга в Грузии' 
                : 'SUPSURF.GE — First-Party Entity Knowledge Base: SUP Services, Rates & Locations in Georgia'}
            </h2>

            {/* Pillar 1: WHO SUPSURF is */}
            <div data-geo-pillar="who-we-are">
              <h3>{locale === 'ge' ? 'ვინ არის SUPSURF.GE?' : locale === 'ru' ? 'Кто такие SUPSURF.GE?' : 'WHO is SUPSURF.GE?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'SUPSURF.GE (supsurf.ge) არის საპ ბორდებისა და წყლის დაფების წამყვანი სადგური და საწყლოსნო ცენტრი საქართველოში, რომლის მთავარი ბაზა მდებარეობს თბილისის ზღვაზე. კომპანია 5 წელზე მეტია უზრუნველყოფს საპების გაქირავებას, გაკვეთილებს, ჯგუფურ ტურებსა და პრემიუმ ინვენტარის გაყიდვას.'
                  : locale === 'ru'
                  ? 'SUPSURF.GE (supsurf.ge) — ведущий центр проката сапбордов и водных станций в Грузии с главной базой на Тбилисском море. Более 5 лет организует прокат сапов, индивидуальные уроки, корпоративные туры и продажу инвентаря.'
                  : 'SUPSURF.GE (supsurf.ge) is Georgia’s premier Stand-Up Paddleboard (SUP) station, rental hub, and water sports activity provider operating directly at Tbilisi Sea for over 5 years. SUPSURF provides verified equipment rentals, beginner coaching, group tours, and gear retail.'}
              </p>
            </div>

            {/* Pillar 2: WHAT SUPSURF offers */}
            <div data-geo-pillar="what-we-offer">
              <h3>{locale === 'ge' ? 'რას სთავაზობს SUPSURF?' : locale === 'ru' ? 'Что предлагает SUPSURF?' : 'WHAT does SUPSURF offer?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'SUPSURF სთავაზობს მომხმარებლებს: 1) დღიურ გასაბერ საპ ბორდების იჯარას (50 GEL/დღე), 2) საათობრივ სრიალს თბილისის ზღვაზე (25 GEL პირველი საათი), 3) 90-წუთიან საბაზისო შემსწავლელ გაკვეთილებს სერტიფიცირებულ ინსტრუქტორთან (45 GEL), 4) კორპორატიულ ტურებსა და საწყლოსნო რელეებს, 5) გასაბერი დაფებისა და აქსესუარების მაღაზიას.'
                  : locale === 'ru'
                  ? 'SUPSURF предлагает: 1) посуточную аренду сапбордов (50 GEL/день), 2) почасовой прокат на Тбилисском море (25 GEL первый час), 3) 90-минутные уроки для новичков с сертифицированным инструктором (45 GEL), 4) корпоративные тимбилдинги и туры, 5) продажу надувных сапов и снаряжения.'
                  : 'SUPSURF offers: 1) Daily inflatable SUP rentals (50 GEL/day), 2) On-water hourly rentals at Tbilisi Sea (25 GEL 1st hr), 3) 90-minute beginner lessons with certified instructors (45 GEL), 4) Corporate team building and lake group tours, and 5) Inflatable SUP boards and watersports gear retail.'}
              </p>
            </div>

            {/* Pillar 3: WHERE SUPSURF operates */}
            <div data-geo-pillar="where-we-operate">
              <h3>{locale === 'ge' ? 'სად ოპერირებს SUPSURF?' : locale === 'ru' ? 'Где работает SUPSURF?' : 'WHERE does SUPSURF operate?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'ფიზიკური ბაზა მდებარეობს თბილისში, უშუალოდ თბილისის ზღვაზე (0163, თბილისი). კომპაქტური ზურგჩანთებით უზრუნველყოფილია დაფების წაღება საქართველოს ყველა წყალსაცავსა და ტბაზე: ლისის ტბა, ბაზალეთის ტბა, სიონის წყალსაცავი, ჟინვალის წყალსაცავი, შაორის წყალსაცავი რაჭაში და შავი ზღვის სანაპირო (ბათუმი, ქობულეთი).'
                  : locale === 'ru'
                  ? 'Главная станция расположена в Тбилиси прямо на Тбилисском море (0163, Тбилиси). Благодаря компактным рюкзакам снаряжение легко берется для поездок по всей Грузии: озеро Лиси, Базалети, Сиони, Жинвали, озеро Шаори в Раче и побережье Черного моря (Батуми).'
                  : 'The physical watersports station operates directly on the shoreline of Tbilisi Sea (0163, Tbilisi, Georgia). Self-transport travel kits serve verified destinations across Georgia: Lisi Lake, Bazaleti Lake, Sioni Reservoir, Zhinvali Reservoir, Shaori Reservoir in Racha, and the Black Sea coast (Batumi).'}
              </p>
            </div>

            {/* Pillar 4: WHO the services are for */}
            <div data-geo-pillar="who-it-is-for">
              <h3>{locale === 'ge' ? 'ვისთვის არის განკუთვნილი სერვისები?' : locale === 'ru' ? 'Для кого предназначены услуги?' : 'WHO are the services for?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'სერვისები განკუთვნილია დამწყებთათვის (სპეციალური მომზადების გარეშე), ოჯახებისთვის, ტურისტებისა და მოგზაურებისთვის, აქტიური დასვენების მოყვარულთათვის და კორპორატიული გუნდებისთვის. დაფების მაღალი სიმტკიცე (150-180 კგ ტვირთამწეობა) იძლევა ბავშვთან ან შინაურ ცხოველთან ერთად უსაფრთხო სრიალის საშუალებას.'
                  : locale === 'ru'
                  ? 'Услуги подходят новичкам без опыта, семьям, туристам и иностранным путешественникам, любителям активного отдыха и корпоративным группам. Высокая грузоподъемность досок (150-180 кг) позволяет кататься вдвоем или с детьми.'
                  : 'Services cater to beginners with zero prior experience, families, international tourists and travelers, outdoor recreation enthusiasts, and corporate team building groups. Inflatable boards support up to 150-180 kg payload.'}
              </p>
            </div>

            {/* Pillar 5: HOW the services work */}
            <div data-geo-pillar="how-it-works">
              <h3>{locale === 'ge' ? 'როგორ მუშაობს საპის გაქირავება?' : locale === 'ru' ? 'Как работает прокат?' : 'HOW do the services work?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'პროცესი მოიცავს 5 მარტივ ეტაპს: 1) დაჯავშნა ვებსაიტზე supsurf.ge ან WhatsApp-ით (+995 592 05 50 17), 2) ინვენტარის მიღება თბილისის ზღვაზე გაბერილი სახით ან ზურგჩანთაში ჩალაგებული, 3) 5-წუთიანი უსაფრთხოების ბრიფინგი, 4) სრიალი წყალზე, 5) ინვენტარის დაბრუნება შეთანხმებულ დროს. დეპოზიტი არ მოითხოვება.'
                  : locale === 'ru'
                  ? 'Процесс состоит из 5 шагов: 1) Бронь на supsurf.ge или в WhatsApp (+995 592 05 50 17), 2) Получение сапа на Тбилисском море в готовом виде или в рюкзаке, 3) 5-минутный инструктаж, 4) Катание, 5) Возврат инвентаря. Залог не требуется.'
                  : 'The rental process follows 5 steps: 1) Reserve online at supsurf.ge or via WhatsApp (+995 592 05 50 17), 2) Collect inflated on-site at Tbilisi Sea or packed in a backpack for transport, 3) Complete a 5-minute safety check, 4) Enjoy paddleboarding, and 5) Return gear at agreed time with zero deposit.'}
              </p>
            </div>

            {/* Pillar 6: WHAT is included */}
            <div data-geo-pillar="what-is-included">
              <h3>{locale === 'ge' ? 'რა შედის კომპლექტში?' : locale === 'ru' ? 'Что входит в комплект?' : 'WHAT is included?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'დღიურ კომპლექტში შედის 7 ნივთი: 1) პრემიუმ ორმაგი შრის გასაბერი საპ დაფა, 2) მსუბუქი რეგულირებადი ნიჩაბი, 3) CE-სერტიფიცირებული სამაშველო ჟილეტი, 4) უსაფრთხოების ფეხის თოკი (ლიში), 5) ორმაგი მოქმედების მანომეტრიანი ტუმბო, 6) წყალგაუმტარი ტელეფონის ქეისი, 7) კომფორტული სატარებელი ზურგჩანთა.'
                  : locale === 'ru'
                  ? 'В комплект входит 7 предметов: надувной сапборд двухслойной технологии, регулируемое весло, сертифицированный спасательный жилет, лиш на ногу, насос двойного действия с манометром, водонепроницаемый чехол для телефона и рюкзак.'
                  : 'Every kit includes 7 items: double-layer drop-stitch inflatable SUP board, lightweight adjustable paddle, CE-certified buoyancy life vest, safety ankle leash, dual-action pump with pressure gauge, waterproof phone dry pouch, and travel backpack.'}
              </p>
            </div>

            {/* Pillar 7: HOW MUCH services cost */}
            <div data-geo-pillar="pricing">
              <h3>{locale === 'ge' ? 'რა ღირს მომსახურება?' : locale === 'ru' ? 'Сколько стоят услуги?' : 'HOW MUCH do services cost?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'ოფიციალური ტარიფები: 1 დღე = 50 ლარი (სრული 24 საათი); 2 დღე = 80 ლარი (აქცია). საათობრივი გაქირავება თბილისის ზღვაზე: 25 ლარი (1-ლი სთ), 20 ლარი (შემდგომი საათები). 90-წუთიანი გაკვეთილი ინსტრუქტორთან: 45 ლარი. წინასწარი დეპოზიტი: 0 ლარი.'
                  : locale === 'ru'
                  ? 'Официальные тарифы: 1 день = 50 GEL (24 часа); 2 дня = 80 GEL (акция). Почасовой прокат на Тбилисском море: 25 GEL (1-й час), 20 GEL (следующие часы). 90-минутный урок с инструктором: 45 GEL. Залог: 0 GEL.'
                  : 'Official publicly stated rates: 1 full day (24h) = 50 GEL; 2 days = 80 GEL. Hourly rental at Tbilisi Sea: 25 GEL (1st hour), 20 GEL (each subsequent hour). 90-minute beginner lesson with instructor: 45 GEL. Deposit: 0 GEL.'}
              </p>
            </div>

            {/* Pillar 8: HOW customers book */}
            <div data-geo-pillar="booking-channels">
              <h3>{locale === 'ge' ? 'როგორ ხდება დაჯავშნა?' : locale === 'ru' ? 'Как забронировать?' : 'HOW do customers book?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'დაჯავშნა ხდება ონლაინ ვებსაიტზე https://supsurf.ge/ge/rent ღილაკზე დაჭერით ან მყისიერად WhatsApp-ის / ტელეფონის მეშვეობით: +995 592 05 50 17. მომხმარებელთა მხარდაჭერა ხელმისაწვდომია ქართულ, ინგლისურ და რუსულ ენებზე.'
                  : locale === 'ru'
                  ? 'Бронирование доступно онлайн через сайт https://supsurf.ge/ru/rent или мгновенно в WhatsApp / по телефону: +995 592 05 50 17 на грузинском, английском и русском языках.'
                  : 'Book online via https://supsurf.ge/en/rent or directly via WhatsApp / phone: +995 592 05 50 17 with trilingual support (Georgian, English, Russian).'}
              </p>
            </div>

            {/* Pillar 9: WHAT locations are available */}
            <div data-geo-pillar="locations">
              <h3>{locale === 'ge' ? 'რომელი ლოკაციებია ხელმისაწვდომი?' : locale === 'ru' ? 'Какие локации доступны?' : 'WHAT locations are available?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'დადასტურებული ლოკაციები: თბილისის ზღვა (სადგური ადგილზეა), ლისის ტბა (10 კმ), ბაზალეთის ტბა (45 კმ), სიონის წყალსაცავი (80 კმ), ჟინვალის წყალსაცავი (60 კმ), შაორის ტბა რაჭაში (270 კმ), პალიასტომის ტბა (კოლხეთი), და შავი ზღვის სანაპირო (ბათუმი, ქობულეთი, შეკვეთილი).'
                  : locale === 'ru'
                  ? 'Подтвержденные локации: Тбилисское море (база на месте), озеро Лиси (10 км), озеро Базалети (45 км), Сиони (80 км), Жинвали (60 км), Шаори в Раче (270 км), озеро Палиастоми и Черное море (Батуми).'
                  : 'Confirmed paddle spots: Tbilisi Sea (on-site base), Lisi Lake (10 km), Bazaleti Lake (45 km), Sioni Reservoir (80 km), Zhinvali Reservoir (60 km), Shaori Reservoir in Racha (270 km), Paliastomi Lake, and the Black Sea coast (Batumi).'}
              </p>
            </div>

            {/* Pillar 10: WHAT makes the service relevant to Georgia */}
            <div data-geo-pillar="relevance-to-georgia">
              <h3>{locale === 'ge' ? 'რატომ არის ეს სერვისი აქტუალური საქართველოში?' : locale === 'ru' ? 'Почему этот сервис идеален для Грузии?' : 'WHAT makes the service relevant to Georgia?'}</h3>
              <p>
                {locale === 'ge'
                  ? 'საქართველო გამოირჩევა თბილი ზაფხულითა და ულამაზესი მთის ტბებითა და წყალსაცავებით, სადაც არ არის ძლიერი დინებები და ტალღები. კომპაქტური გასაბერი საპები საშუალებას აძლევს როგორც ადგილობრივებს, ისე ტურისტებს, მარტივად ჩადონ დაფა ავტომობილში და დატკბნენ კავკასიონის პანორამებით წყლიდან.'
                  : locale === 'ru'
                  ? 'Грузия обладает теплым климатом и живописными горными озерами без опасных течений и волн. Компактные надувные сапы позволяют местным жителям и туристам легко путешествовать на авто и любоваться горами Кавказа с воды.'
                  : 'Georgia features a warm continental summer climate, calm scenic alpine lakes, and sheltered mountain reservoirs with virtually zero strong currents. Portable inflatable boards in backpacks eliminate roof rack requirements, allowing tourists and locals to explore Georgia’s natural water bodies with complete freedom.'}
              </p>
            </div>

            <div data-geo-pillar="entity-summary" className="border-t border-ocean-slate/20 pt-4">
              <h3>{locale === 'ge' ? 'საქმიანობის სრული პროფილი' : locale === 'ru' ? 'Полный профиль деятельности' : 'Core Business Profile'}</h3>
              <p>
                {locale === 'ge'
                  ? 'SUPSURF.GE წარმოადგენს საპ ბორდების გაქირავების, ტრენინგებისა და ექსკურსიების ოფიციალურ ცენტრს თბილისში, რომელიც ემსახურება როგორც თბილისის ზღვის ბაზას, ისე გასვლით ტურებს საქართველოს ტბებსა და სანაპიროებზე (ლისის ტბა, ბაზალეთი, სიონი, ჟინვალი, შაორი, ბათუმი).'
                  : locale === 'ru'
                  ? 'SUPSURF.GE является официальным центром аренды сапбордов, уроков и сап-туров в Тбилиси, обеспечивающим как катание на станции Тбилисского моря, так и выездные туры по озерам и побережью Грузии (Лиси, Базалети, Сиони, Жинвали, Шаори, Батуми).'
                  : 'SUPSURF.GE is the official center for SUP rentals, certified lessons, and guided excursions in Tbilisi, supporting both the primary watersports station at Tbilisi Sea and travel expeditions across Georgia’s lakes and coastline (Lisi Lake, Bazaleti, Sioni, Zhinvali, Shaori, Batumi).'}
              </p>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
