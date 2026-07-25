import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Star, ArrowLeft, MessageCircle, PhoneCall, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from '@/components/BookingModal';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setDbLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load DB in Service Detail:', err);
        setDbLoading(false);
      });
  }, []);

  const staticRentalServices: any[] = [
    {
      id: "rent_daily",
      name: { ge: "საპ ბორდის დღიური გაქირავება (აქცია)", en: "Daily SUP Board Rental (Special Offer)", ru: "Посуточная аренда сапборда (Акция)" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "50 GEL (1 დღე) / 80 GEL (2 დღე)",
      duration: { ge: "1-2 დღე (სრული კომპლექტი)", en: "1-2 Days (Full Kit)", ru: "1-2 Дня (Полный комплект)" },
      image: "/pictures/paddleboard-1.webp",
      desc: { ge: "საპ ბორდის დღიური გაქირავება სპეციალური ფასდაკლებით! 1 დღე = 50 ლარი, ხოლო 2 დღე = 80 ლარი. ფასში შედის სრული პროფესიონალური აღჭურვილობა: გასაბერი დაფა, კარბონის ნიჩაბი, სამაშველო ჟილეტი, უსაფრთხოების თოკი (Leash), ტუმბო და წყალგაუმტარი ტელეფონის ქეისი.", en: "Daily SUP board rental with special discount! 1 day = 50 GEL, 2 days = 80 GEL. Includes full kit: inflatable board, carbon paddle, life vest, safety leash, high-pressure pump, and waterproof phone case.", ru: "Посуточная аренда сапборда по акции! 1 день = 50 GEL, 2 дня = 80 GEL. В стоимость входит полный комплект: надувная доска, карбоновое весло, спасательный жилет, лиш, насос и водонепроницаемый чехол." },
      inclusions: {
        ge: ["გასაბერი საპ დაფა", "მსუბუქი კარბონის ნიჩაბი", "სამაშველო ჟილეტი", "უსაფრთხოების თოკი (Leash)", "მაღალი წნევის ტუმბო", "წყალგაუმტარი ტელეფონის ქეისი", "ზურგჩანთა ტრანსპორტირებისთვის"],
        en: ["Inflatable SUP Board", "Lightweight Carbon Paddle", "Buoyancy Safety Life Vest", "Ankle Safety Leash", "High-Pressure Dual Pump", "Waterproof Phone Case", "Travel Backpack"],
        ru: ["Надувная SUP-доска", "Карбоновое весло", "Спасательный жилет", "Страховочный лиш", "Насос высокого давления", "Водонепроницаемый чехол", "Рюкзак для транспортировки"]
      }
    },
    {
      id: "lesson_basic",
      name: { ge: "საბაზისო შემსწავლელი სეანსი (90 წუთი)", en: "Basic Beginner SUP Session (90 Mins)", ru: "Базовое обучающее занятие (90 минут)" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "45 GEL",
      duration: { ge: "90 წუთი (ინსტრუქტორთან ერთად)", en: "90 Mins (With Instructor)", ru: "90 Минут (С инструктором)" },
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
      desc: { ge: "90-წუთიანი შემსწავლელი სეანსი სერტიფიცირებულ ინსტრუქტორთან ერთად! მოიცავს ხმელეთზე უსაფრთხოების ბრიფინგს, ბალანსის დაჭერას, ნიჩბოსნობის სწორ ტექნიკასა და წყალზე პრაქტიკულ სრიალს ინსტრუქტორის მეთვალყურეობით.", en: "90-minute structured beginner session with a certified instructor! Includes safety briefing on shore, posture balance setup, correct stroke technique, and guided paddling on the water.", ru: "90-минутное обучающее занятие с сертифицированным инструктором! Включает инструктаж по безопасности, постановку баланса, технику гребли и сопровождение инструктора на воде." },
      inclusions: {
        ge: ["90 წუთი ინსტრუქტორთან", "სრული საპ აღჭურვილობა", "უსაფრთხოების ბრიფინგი", "ბალანსისა და ნიჩბოსნობის ტექნიკა", "ფოტო/ვიდეო გადაღება"],
        en: ["90 Mins with Instructor", "Full SUP Kit Included", "Safety & Land Briefing", "Balance & Stroke Technique", "Photo & Video Shots"],
        ru: ["90 минут с инструктором", "Полный комплект снаряжения", "Инструктаж по безопасности", "Техника гребли и баланса", "Фото и видеосъемка"]
      }
    },
    {
      id: "rent_hourly",
      name: { ge: "საათობრივი გაქირავება", en: "Hourly SUP Board Rental", ru: "Почасовая аренда сапборда" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "25 GEL (1-ლი სთ) / 20 GEL (შემდეგი)",
      duration: { ge: "საათობრივი", en: "Hourly", ru: "Почасовая" },
      image: "/pictures/paddleboard-2.webp",
      desc: { ge: "საპ ბორდით სრიალი საათობრივად ლისის ტბასა და შეკვეთილის სანაპიროზე! პირველი საათის ღირებულება შეადგენს 25 ლარს, ხოლო ყოველი შემდგომი საათი — 20 ლარს. მოიცავს სრულ აღჭურვილობას.", en: "Hourly paddleboard rental on Lisi Lake and Shekvetili beach. 25 GEL for the 1st hour, and 20 GEL for each subsequent hour. Includes full gear.", ru: "Почасовая аренда сапбордов на озере Лиси и на пляже Шекветили. 25 GEL за первый час и 20 GEL за каждый последующий час. Полное снаряжение включено." },
      inclusions: {
        ge: ["1-ლი საათი: 25 ლარი", "ყოველი შემდგომი საათი: 20 ლარი", "სრული საპ აღჭურვილობა", "სამაშველო ჟილეტი", "წყალგაუმტარი ქეისი"],
        en: ["1st Hour: 25 GEL", "Each Next Hour: 20 GEL", "Full SUP Gear Included", "Safety Life Vest", "Waterproof Phone Pouch"],
        ru: ["1-й час: 25 GEL", "Каждый следующий час: 20 GEL", "Полный комплект", "Спасательный жилет", "Водонепроницаемый чехол"]
      }
    },
    {
      id: "corporate_event",
      name: { ge: "კორპორატიული შეთავაზებები", en: "Corporate & Group Offers", ru: "Корпоративные предложения" },
      location: { ge: "თბილისი (ლისის ტბა) & შეკვეთილი", en: "Tbilisi (Lisi Lake) & Shekvetili", ru: "Тбилиси (Озеро Лиси) и Шекветили" },
      price: "Custom / ინდივიდუალური",
      duration: { ge: "მოქნილი დრო", en: "Flexible Time", ru: "Гибкое время" },
      image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=800&q=80",
      desc: { ge: "ინდივიდუალური კორპორატიული შეთავაზებები კომპანიებისა და ჯგუფებისთვის. მოგვწერეთ თქვენი სურვილები (მონაწილეთა რაოდენობა, თარიღი) და შევადგენთ სპეციალურად თქვენზე მორგებულ პაკეტს ლისის ტბასა თუ შეკვეთილში.", en: "Customized corporate offers and team building for groups and businesses. Contact us with your requirements (group size, date) to receive a tailored package at Lisi Lake or Shekvetili.", ru: "Индивидуальные корпоративные предложения для компаний и групп. Напишите нам ваши пожелания (число участников, дата), и мы подготовим специальный пакет на озере Лиси или в Шекветили." },
      inclusions: {
        ge: ["ჯგუფური საპ შეჯიბრებები", "ღონისძიების კოორდინატორი", "სრული აღჭურვილობის უზრუნველყოფა", "ინდივიდუალური ფასდაკლება", "ფოტო/ვიდეო გადაღება"],
        en: ["Group SUP Races & Relay", "Event Coordinator", "Full Gear & Safety Setup", "Custom Group Discount", "Photo & Video Shots"],
        ru: ["Групповые соревнования на сапах", "Координатор мероприятия", "Полное обеспечение снаряжением", "Групповая скидка", "Фото и видеосъемка"]
      }
    }
  ];

  const service = (db?.services || []).find((s: any) => s.id === id) || staticRentalServices.find((s: any) => s.id === id);
  const contact = db?.contact || { phone: '', whatsapp: '', instagram: '' };

  // Inject Service/Tour JSON-LD Structured Data Schema for AEO/GEO/SEO (Called at top level to satisfy Rules of Hooks)
  useEffect(() => {
    if (!service) return;

    const schemaId = 'service-jsonld-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const priceVal = parseFloat(service.price.replace(/[^0-9.]/g, '')) || 0;
    const schemaName = service.name[locale] || service.name.en;
    const schemaDesc = service.desc[locale] || service.desc.en;
    const schemaInclusions = service.inclusions[locale] || service.inclusions.en || [];
    const schemaImages = service.images && service.images.length > 0 ? service.images : [service.image];

    const serviceSchema = {
      '@context': 'https://schema.org/',
      '@type': 'TouristTrip',
      'name': schemaName,
      'description': schemaDesc,
      'image': schemaImages.map((img: string) => img.startsWith('http') ? img : window.location.origin + img),
      'touristType': 'Water sports lovers',
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'GEL',
        'price': priceVal,
        'availability': 'https://schema.org/InStock'
      },
      'itinerary': {
        '@type': 'ItemList',
        'itemListElement': schemaInclusions.map((inc: string, idx: number) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': inc
        }))
      }
    };

    script.text = JSON.stringify(serviceSchema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [service, locale]);

  if (dbLoading) {
    return (
      <div className="bg-ocean-light/20 min-h-screen py-16 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-teal border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-ocean-light/20 min-h-screen py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-2xl font-extrabold text-ocean-dark">
            {locale === 'ge' ? 'სერვისი ვერ მოიძებნა' : locale === 'ru' ? 'Услуга не найдена' : 'Service Not Found'}
          </h2>
          <Link
            to={`/${locale}/services`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-teal hover:underline font-display"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>{locale === 'ge' ? 'სერვისებზე დაბრუნება' : locale === 'ru' ? 'Назад к услугам' : 'Back to Services'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const name = service.name[locale] || service.name.en;
  const location = service.location[locale] || service.location.en;
  const duration = service.duration[locale] || service.duration.en;
  const desc = service.desc[locale] || service.desc.en;
  const inclusions = service.inclusions[locale] || service.inclusions.en || [];
  
  const images = service.images && service.images.length > 0 ? service.images : [service.image];

  const getWhatsAppBookLink = () => {
    let text = '';
    if (locale === 'ge') {
      text = `გამარჯობა! მსურს დავჯავშნო ტური / გაკვეთილი:
• ტური: ${name}
• ლოკაცია: ${location}
• ხანგრძლივობა: ${duration}
• ფასი: ${service.price}

გთხოვთ დამიდასტუროთ ხელმისაწვდომობა. მადლობა!`;
    } else if (locale === 'ru') {
      text = `Здравствуйте! Хочу забронировать тур / занятие:
• Тур: ${name}
• Локация: ${location}
• Длительность: ${duration}
• Цена: ${service.price}

Подскажите, пожалуйста, свободные места. Спасибо!`;
    } else {
      text = `Hello! I would like to book a tour / lesson:
• Package: ${name}
• Location: ${location}
• Duration: ${duration}
• Price: ${service.price}

Could you please confirm availability? Thank you!`;
    }
    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const handlePrevImage = () => {
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-ocean-light/20 min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to={`/${locale}/services`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-dark hover:text-ocean-teal transition-colors font-display"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>{locale === 'ge' ? 'სერვისებზე დაბრუნება' : locale === 'ru' ? 'Назад к услугам' : 'Back to Services'}</span>
          </Link>
        </div>

        {/* Details Card */}
        <div className="rounded-3xl border border-ocean-slate/10 bg-white p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Slider */}
          <div className="md:col-span-5 w-full space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-ocean-slate/10 shadow-md bg-ocean-light/35 group">
              <img
                src={images[activeImgIdx]}
                alt={name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {/* Slider Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ocean-dark p-2 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ocean-dark p-2 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeImgIdx ? 'bg-white w-4' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-ocean-slate/20">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 bg-ocean-light/30 transition-all ${
                      idx === activeImgIdx ? 'border-ocean-teal scale-[0.98]' : 'border-transparent hover:border-ocean-slate/20'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="inline-flex items-center gap-1 text-[10px] text-ocean-teal uppercase font-bold tracking-widest font-sans bg-ocean-teal/10 px-2.5 py-1 rounded-md">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-ocean-navy uppercase font-bold tracking-widest font-sans bg-ocean-light border border-ocean-slate/10 px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-ocean-teal" />
                  {duration}
                </span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ocean-dark leading-tight">
                {name}
              </h1>
            </div>

            {/* Price display */}
            <div className="p-4 bg-ocean-light/50 border border-ocean-slate/10 rounded-2xl">
              <span className="block text-[10px] font-bold text-ocean-slate uppercase tracking-wider font-sans">
                {locale === 'ge' ? 'ღირებულება' : locale === 'ru' ? 'Стоимость' : 'Price / Rate'}
              </span>
              <span className="font-display text-3xl font-extrabold text-ocean-dark">
                {service.price}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2 font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
              <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                {locale === 'ge' ? 'ტურის აღწერა' : locale === 'ru' ? 'Описание тура' : 'Description'}
              </h3>
              <p className="whitespace-pre-line text-xs sm:text-sm text-ocean-slate">
                {desc}
              </p>
            </div>

            {/* Inclusions */}
            {inclusions.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                  {locale === 'ge' ? 'რა შედის პაკეტში:' : locale === 'ru' ? 'Что входит в стоимость:' : 'What is Included:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inclusions.map((inc: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                      <span className="font-sans text-xs text-ocean-slate font-medium">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-ocean-slate/10">
              <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                {locale === 'ge' ? 'დაჯავშნა ან შეკითხვა' : locale === 'ru' ? 'Забронировать или спросить' : 'Reservation / Inquiries'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* WhatsApp booking */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-3.5 text-xs shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white fill-white shrink-0" />
                  <span>{locale === 'ge' ? 'დაჯავშნე ტური' : locale === 'ru' ? 'Забронировать' : 'WhatsApp Reservation'}</span>
                </button>

                {/* Direct Booking on Site */}
                <Link
                  to={`/${locale}/rent`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white font-display font-bold py-3.5 text-xs shadow-md transition-colors"
                >
                  <Calendar className="w-4.5 h-4.5 text-ocean-teal" />
                  <span>Use Booking Form</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Instagram DM */}
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white font-display font-bold py-3.5 text-xs shadow-md transition-all"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram DM</span>
                </a>

                {/* Direct Calling */}
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-slate/20 hover:bg-ocean-light py-3 font-sans text-xs font-bold text-ocean-dark transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-ocean-teal" />
                  <span>{locale === 'ge' ? 'დარეკვა: ' : locale === 'ru' ? 'Позвонить: ' : 'Call direct: '}{contact.phone}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        itemName={name}
        locale={locale}
        contact={contact}
      />
    </div>
  );
}
