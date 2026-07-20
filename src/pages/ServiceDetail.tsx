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
      id: 'sup_allround',
      name: {
        en: "Gladiator Pro 10'6\" Inflatable SUP",
        ge: "Gladiator Pro 10'6\" გასაბერი საპი",
        ru: "Надувной сапборд Gladiator Pro 10'6\""
      },
      location: {
        en: "Lisi Lake, Batumi Beach",
        ge: "ლისის ტბა, ბათუმის სანაპირო",
        ru: "Озеро Лиси, Пляж Батуми"
      },
      price: "30 GEL",
      duration: {
        en: "1 Day",
        ge: "1 დღე",
        ru: "1 დღე"
      },
      image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=800&q=80",
      desc: {
        en: "Stable, easy-to-use board perfect for lake paddling and relaxed coastal tours. Includes double-action pump, carbon paddle, safety leash, and travel backpack.",
        ge: "სტაბილური, მარტივად სამართავი დაფა, იდეალურია ტბებზე სასრიალოდ და მშვიდ ზღვაზე სეირნობისთვის. კომპლექტშია ტუმბო, კარბონის ნიჩაბი, ლიში და ჩანთა.",
        ru: "Стабильный, простой в управлении сапборд, идеальный для прогулок по озерам и спокойному морю. В комплекте насос, карбоновое весло, лиш и рюкзак."
      },
      inclusions: {
        en: ["Premium Inflatable SUP Board", "Adjustable Carbon Paddle", "Safety Leash", "High-Pressure Pump", "CE Safety Life Vest", "Waterproof Phone Pouch"],
        ge: ["პრემიუმ გასაბერი საპ დაფა", "რეგულირებადი კარბონის ნიჩაბი", "უსაფრთხოების ლიში", "მაღალი წნევის ტუმბო", "სამაშველო ჟილეტი", "წყალგამძლე ტელეფონის ქეისი"],
        ru: ["Премиум надувная SUP-доска", "Регулируемое карбоновое весло", "Страховочный лиш", "Насос высокого давления", "Спасательный жилет", "Водонепроницаемый чехол"]
      }
    },
    {
      id: 'sup_touring',
      name: {
        en: "Tiki 11'6\" Premium Touring SUP",
        ge: "ტურინგ საპ ბორდი Tiki 11'6\"",
        ru: "Туринговый сапборд Tiki 11'6\""
      },
      location: {
        en: "Batumi, Anaklia Beach",
        ge: "ბათუმი, ანაკლიის სანაპირო",
        ru: "Батуми, Пляж Анаклиа"
      },
      price: "40 GEL",
      duration: {
        en: "1 Day",
        ge: "1 დღე",
        ru: "1 დღე"
      },
      image: "https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=800&q=80",
      desc: {
        en: "Sleek, high-speed design optimized for long distances and open waters. Fitted with dry bag tie-downs and touring fin.",
        ge: "სწრაფი და სპორტული დიზაინის მქონე საპ დაფა, ოპტიმიზებული გრძელ დისტანციებზე სრიალისათვის. აღჭურვილია სპეციალური სამაგრებით წყალგაუმტარი ჩანთისთვის.",
        ru: "Быстрый спортивный сапборд, оптимизированный для длинных дистанций. Оснащен креплениями для гермомешка."
      },
      inclusions: {
        en: ["Touring SUP Board", "Carbon Paddle", "Touring Fin", "Pump & Safety Leash", "CE Safety Life Vest", "Waterproof Phone Pouch"],
        ge: ["ტურისტული საპ დაფა", "კარბონის ნიჩაბი", "სპორტული ფარფლი", "ტუმბო და ლიში", "სამაშველო ჟილეტი", "წყალგამძლე ტელეფონის ქეისი"],
        ru: ["Туринговая SUP-доска", "Карбоновое весло", "Спортивный плавник", "Насос и лиш", "Спасательный жилет", "Водонепроницаемый чехол"]
      }
    },
    {
      id: 'surf_soft',
      name: {
        en: "Surf Softtop Board (8'0\")",
        ge: "სერფინგის Soft-Top დაფა (8'0\")",
        ru: "Серфборд Soft-Top (8'0\")"
      },
      location: {
        en: "Batumi, Anaklia Beach",
        ge: "ბათუმი, ანაკლიის სანაპირო",
        ru: "Батуми, Пляж Анаклиа"
      },
      price: "35 GEL",
      duration: {
        en: "1 Day",
        ge: "1 დღე",
        ru: "1 დღე"
      },
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      desc: {
        en: "Soft-top surfboard designed with max volume and safety for beginners learning stability and control.",
        ge: "რბილი ზედაპირის მქონე სერფინგის დაფა დამწყებთათვის, უზრუნველყოფს მაქსიმალურ სტაბილურობასა და უსაფრთხოებას პირველი ტალღების დაჭერისას.",
        ru: "Мягкий серфборд для новичков, обеспечивающий максимальную стабильность и безопасность при ловле первых волн."
      },
      inclusions: {
        en: ["Softtop Surfboard", "Safety Leash", "Fins Set", "CE Safety Life Vest"],
        ge: ["Softtop სერფინგის დაფა", "უსაფრთხოების ლიში", "ფარფლების კომპლექტი", "სამაშველო ჟილეტი"],
        ru: ["Softtop серфборд", "Страховочный лиш", "Комплект плавников", "Спасательный жилет"]
      }
    },
    {
      id: 'surf_hard',
      name: {
        en: "Epoxy Resin Surfboard (6'4\")",
        ge: "ეპოქსიდური სერფინგის დაფა (6'4\")",
        ru: "Эпоксидный серфборд (6'4\")"
      },
      location: {
        en: "Batumi Beach",
        ge: "ბათუმის სანაპირო",
        ru: "Пляж Батуми"
      },
      price: "50 GEL",
      duration: {
        en: "1 Day",
        ge: "1 დღე",
        ru: "1 დღე"
      },
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
      desc: {
        en: "High performance epoxy surfboard for aggressive turns, high speed and steep waves.",
        ge: "მაღალი მანევრირების მქონე მყარი სერფინგის დაფა გამოცდილი მოყვარულებისთვის, იდეალურია სწრაფი და მყარი ტალღების დასაჭერად.",
        ru: "Маневренный жесткий серфборд для опытных серферов, идеальный для быстрых волн."
      },
      inclusions: {
        en: ["Epoxy Hardtop Surfboard", "Fins Set", "Safety Leash", "Wax & Key"],
        ge: ["ეპოქსიდური სერფინგის დაფა", "ფარფლების კომპლექტი", "უსაფრთხოების ლიში", "ცვილი და გასაღები"],
        ru: ["Эпоксидный серфборд", "Комплект плавников", "Страховочный лиш", "Воск и ключ"]
      }
    },
    {
      id: 'wingfoil',
      name: {
        en: "Wingfoil Complete Package",
        ge: "ვინგფოილის სრული კომპლექტი",
        ru: "Полный комплект вингфойла"
      },
      location: {
        en: "Batumi, Anaklia Beach",
        ge: "ბათუმი, ანაკლიის სანაპირო",
        ru: "Батуми, Пляж Анаклиа"
      },
      price: "100 GEL",
      duration: {
        en: "1 Day",
        ge: "1 დღე",
        ru: "1 დღე"
      },
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      desc: {
        en: "Premium wing and hydrofoil package for high speed flight above water. For intermediate to advanced riders.",
        ge: "პრემიუმ კლასის ფრთისა და ჰიდროფოილის კომპლექტი წყლის ზემოთ ფრენის შეგრძნებისთვის. განკუთვნილია საშუალო და გამოცდილი სერფერებისთვის.",
        ru: "Премиальный комплект крыла и гидрофойла для полета над водой. Для опытных райдеров."
      },
      inclusions: {
        en: ["Wingfoil Board", "Hydrofoil Mast & Wings Set", "Handheld Wing", "Pump & Harness", "Safety Leash & Life Vest"],
        ge: ["ვინგფოილის დაფა", "ჰიდროფოილის ანძა და ფრთები", "ხელის ფრთა (Wing)", "ტუმბო და დამცავი ღვედი", "უსაფრთხოების ლიში და ჟილეტი"],
        ru: ["Доска для вингфойла", "Гидрофойл (мачта и крылья)", "Ручное крыло", "Насос и трапеция", "Страховочный лиш и жилет"]
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
