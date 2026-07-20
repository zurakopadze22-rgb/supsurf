import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ShoppingBag, Star, Shield, ArrowLeft, MessageCircle, PhoneCall, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import BookingModal from '@/components/BookingModal';

export default function ProductDetail() {
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
        console.error('Failed to load DB in Product Detail:', err);
        setDbLoading(false);
      });
  }, []);

  const product = (db?.products || []).find((p: any) => p.id === id);
  const contact = db?.contact || { phone: '', whatsapp: '', instagram: '' };

  // Inject Product JSON-LD Structured Data Schema for AEO/GEO/SEO (Called at top level to satisfy Rules of Hooks)
  useEffect(() => {
    if (!product) return;

    const schemaId = 'product-jsonld-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
    const isNew = product.condition === 'New' || product.condition === 'ახალი' || product.condition === 'Новый';
    const schemaName = product.name[locale] || product.name.en;
    const schemaDesc = product.desc[locale] || product.desc.en;
    const schemaImages = product.images && product.images.length > 0 ? product.images : [product.image];

    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': schemaName,
      'image': schemaImages.map((img: string) => img.startsWith('http') ? img : window.location.origin + img),
      'description': schemaDesc,
      'sku': product.id,
      'brand': {
        '@type': 'Brand',
        'name': 'supsurf.ge'
      },
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'GEL',
        'price': priceVal,
        'availability': 'https://schema.org/InStock',
        'itemCondition': isNew ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition'
      }
    };

    script.text = JSON.stringify(productSchema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [product, locale]);

  if (dbLoading) {
    return (
      <div className="bg-ocean-light/20 min-h-screen py-16 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-teal border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-ocean-light/20 min-h-screen py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-2xl font-extrabold text-ocean-dark">
            {locale === 'ge' ? 'პროდუქტი ვერ მოიძებნა' : locale === 'ru' ? 'Товар не найден' : 'Product Not Found'}
          </h2>
          <Link
            to={`/${locale}/shop`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-teal hover:underline font-display"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>{locale === 'ge' ? 'მაღაზიაში დაბრუნება' : locale === 'ru' ? 'Назад в магазин' : 'Back to Shop'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const name = product.name[locale] || product.name.en;
  const category = product.category[locale] || product.category.en;
  const condition = product.condition[locale] || product.condition.en;
  const desc = product.desc[locale] || product.desc.en;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const getWhatsAppBuyLink = () => {
    let text = '';
    if (locale === 'ge') {
      text = `გამარჯობა! მსურს შევიძინო / ვიკითხო ინვენტარის შესახებ:
• პროდუქტი: ${name}
• ფასი: ${product.price}

მაინტერესებს ხელმისაწვდომობა და დეტალები. მადლობა!`;
    } else if (locale === 'ru') {
      text = `Здравствуйте! Меня интересует покупка товара:
• Товар: ${name}
• Цена: ${product.price}

Подскажите, пожалуйста, наличие и детали. Спасибо!`;
    } else {
      text = `Hello! I am interested in purchasing/inquiring about:
• Product: ${name}
• Price: ${product.price}

Could you please confirm availability and details? Thank you!`;
    }
    return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-ocean-light/20 min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to={`/${locale}/shop`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-dark hover:text-ocean-teal transition-colors font-display"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>{locale === 'ge' ? 'მაღაზიაში დაბრუნება' : locale === 'ru' ? 'Назад в магазин' : 'Back to Shop'}</span>
          </Link>
        </div>

        {/* Product Details Card */}
        <div className="rounded-3xl border border-ocean-slate/10 bg-white p-6 sm:p-10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Product Image Gallery Carousel */}
          <div className="md:col-span-5 w-full space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-ocean-slate/10 shadow-md bg-ocean-light/30 group">
              <img
                src={images[activeImgIdx]}
                alt={name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {/* Slider Chevrons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ocean-dark p-2 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ocean-dark p-2 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === activeImgIdx ? 'bg-white w-3' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-ocean-slate/20">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 bg-ocean-light/35 transition-all ${
                      idx === activeImgIdx ? 'border-ocean-teal scale-[0.98]' : 'border-transparent hover:border-ocean-slate/20'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-ocean-slate font-sans bg-ocean-light/40 p-3.5 rounded-xl border border-ocean-slate/5">
              <Shield className="w-4.5 h-4.5 text-ocean-teal shrink-0" />
              <span>
                {locale === 'ge' 
                  ? 'ოფიციალური შემოწმება და ტესტირება გაყიდვამდე ლისის ტბაზე.' 
                  : locale === 'ru' 
                  ? 'Официальная проверка и тестирование перед продажей на озере Лиси.' 
                  : 'Safety-checked and tested on Lisi Lake before delivery.'}
              </span>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-ocean-teal uppercase font-bold tracking-widest font-sans">
                  {category}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-sans border ${
                  condition === 'New' || condition === 'ახალი' || condition === 'Новый'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {condition}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ocean-dark leading-tight">
                {name}
              </h1>

              {/* Stars */}
              <div className="flex gap-0.5 items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-ocean-coral text-ocean-coral' 
                        : 'text-ocean-slate/20'
                    }`} 
                  />
                ))}
                <span className="text-xs text-ocean-slate ml-2 font-sans font-semibold">({product.rating} / 5.0)</span>
              </div>
            </div>

            {/* Price display */}
            <div className="p-4 bg-ocean-light/50 border rounded-2xl">
              <span className="block text-[10px] font-bold text-ocean-slate uppercase tracking-wider font-sans">
                {locale === 'ge' ? 'ფასი' : locale === 'ru' ? 'Цена' : 'Price'}
              </span>
              <span className="font-display text-3xl font-extrabold text-ocean-dark">
                {product.price}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2 font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
              <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                {locale === 'ge' ? 'პროდუქტის აღწერა' : locale === 'ru' ? 'Описание товара' : 'Description'}
              </h3>
              <p className="whitespace-pre-line text-xs sm:text-sm text-ocean-slate">
                {desc}
              </p>
            </div>

            {/* Specifications / Features */}
            {product.features?.[locale] && product.features[locale].length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                  {locale === 'ge' ? 'მახასიათებლები / დეტალები' : locale === 'ru' ? 'Характеристики' : 'Specifications'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features[locale].map((feat: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 text-ocean-teal shrink-0" />
                      <span className="font-sans text-xs text-ocean-slate font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-ocean-slate/10">
              <h3 className="font-display text-xs font-bold text-ocean-dark uppercase tracking-wider">
                {locale === 'ge' ? 'შეძენა ან შეკითხვა' : locale === 'ru' ? 'Купить или спросить' : 'Purchase / Inquire'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* WhatsApp Buy */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold py-3.5 text-xs shadow-md transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white fill-white shrink-0" />
                  <span>{locale === 'ge' ? 'შეიძინე საპ ბორდი' : locale === 'ru' ? 'Купить' : 'WhatsApp Inquire'}</span>
                </button>

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
              </div>

              {/* Call direct */}
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-slate/20 hover:bg-ocean-light py-3 font-sans text-xs font-bold text-ocean-dark transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-ocean-teal" />
                <span>{locale === 'ge' ? 'დარეკვა: ' : locale === 'ru' ? 'Позвонить: ' : 'Call operator: '}{contact.phone}</span>
              </a>
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
