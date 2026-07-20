import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ShoppingBag, Star, Shield, Search, X, SlidersHorizontal } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

export default function Shop() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(3000);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setDbLoading(false);
        
        // Dynamically calculate maximum price from database
        if (data && Array.isArray(data.products)) {
          const parsedPrices = data.products.map((p: any) => {
            return parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0;
          });
          const maxP = Math.max(...parsedPrices, 500);
          setMaxPrice(maxP);
          setMaxPriceLimit(maxP);
        }
      })
      .catch((err) => {
        console.error('Failed to load DB in Shop page:', err);
        setDbLoading(false);
      });
  }, []);

  const rawProducts = db?.products || [];

  // Extract unique categories and their translations dynamically
  const categories = Array.from(new Set(rawProducts.map((p: any) => p.category?.en || 'Accessories'))).map((enCat: any) => {
    const prod = rawProducts.find((p: any) => p.category?.en === enCat);
    return {
      en: enCat,
      ge: prod?.category?.ge || enCat,
      ru: prod?.category?.ru || enCat
    };
  });

  // Multilingual labels for filters
  const labels = {
    search: { en: 'Search products...', ge: 'პროდუქტების ძებნა...', ru: 'Поиск товаров...' },
    category: { en: 'Categories', ge: 'კატეგორიები', ru: 'Категории' },
    all_categories: { en: 'All Products', ge: 'ყველა პროდუქტი', ru: 'Все товары' },
    price_range: { en: 'Price Range', ge: 'ფასის დიაპაზონი', ru: 'Диапазон цен' },
    min: { en: 'Min', ge: 'მინ', ru: 'Мин' },
    max: { en: 'Max', ge: 'მაქს', ru: 'Макс' },
    reset: { en: 'Reset Filters', ge: 'ფილტრების გასუფთავება', ru: 'Сбросить ფილტრები' },
    no_results: { en: 'No products match your filters.', ge: 'ფილტრის შესაბამისი პროდუქტები ვერ მოიძებნა.', ru: 'Товары по вашему запросу не найдены.' },
    no_results_sub: { en: 'Try clearing your search query or resetting filters.', ge: 'შეცვალეთ საძიებო სიტყვა ან გაასუფთავეთ ფილტრები.', ru: 'Попробуйте изменить поисковый запрос или сбросить фильтры.' }
  };

  // Filter matching predicate
  const filteredProducts = rawProducts.filter((prod: any) => {
    // 1. Search Match (EN, GE, RU in name and desc)
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = q === '' ||
      (prod.name?.en || '').toLowerCase().includes(q) ||
      (prod.name?.ge || '').toLowerCase().includes(q) ||
      (prod.name?.ru || '').toLowerCase().includes(q) ||
      (prod.desc?.en || '').toLowerCase().includes(q) ||
      (prod.desc?.ge || '').toLowerCase().includes(q) ||
      (prod.desc?.ru || '').toLowerCase().includes(q);

    // 2. Category Match
    const matchesCategory = selectedCategory === 'all' || prod.category?.en === selectedCategory;

    // 3. Price Match
    const priceVal = parseFloat(prod.price.replace(/[^0-9.]/g, '')) || 0;
    const matchesPrice = priceVal >= minPrice && priceVal <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  }).map((prod: any) => ({
    id: prod.id,
    name: prod.name[locale] || prod.name.en,
    category: prod.category[locale] || prod.category.en,
    condition: prod.condition[locale] || prod.condition.en,
    price: prod.price,
    rating: prod.rating,
    image: prod.image,
    desc: prod.desc[locale] || prod.desc.en,
  }));

  const shopUi = dict.shop_ui || {
    buy_inquire: 'Buy / Inquire',
    warranty_title: 'Official Warranty & Gear Exchange Support',
    warranty_desc: 'We stand behind all water sports products we sell. New inflatable boards come with a 2-year manufacturer warranty. Used boards are fully safety inspected, and tested on Lisi Lake/Batumi before being offered for resale. Want to upgrade? Ask about our Gear Exchange program.'
  };

  const isFilterActive = searchQuery !== '' || selectedCategory !== 'all' || minPrice > 0 || maxPrice < maxPriceLimit;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header (Visually hidden for clean UX, but present for SEO) */}
        <div className="sr-only">
          <h1 className="font-display text-4xl font-extrabold text-ocean-dark tracking-tight">
            {dict.meta.shop.title}
          </h1>
          <p className="font-sans text-base text-ocean-slate max-w-2xl mx-auto">
            {dict.meta.shop.description}
          </p>
        </div>

        {/* E-Commerce Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Filter Sidebar (Visible on desktop only) */}
          <div className="hidden lg:block lg:col-span-3 bg-ocean-light/20 p-5 rounded-3xl border border-ocean-slate/10 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b pb-3 border-ocean-slate/10">
              <h3 className="font-display text-sm font-bold text-ocean-dark flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-ocean-teal" />
                <span>{locale === 'ge' ? 'ფილტრები' : locale === 'ru' ? 'Фильтры' : 'Filters'}</span>
              </h3>
              {isFilterActive && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 font-sans transition-colors cursor-pointer"
                >
                  {labels.reset[locale]}
                </button>
              )}
            </div>

            {/* 1. Search Bar */}
            <div className="space-y-1.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-slate/40" />
                <input
                  type="text"
                  placeholder={labels.search[locale]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-ocean-slate/15 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ocean-slate/40 hover:text-ocean-dark cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Categories List */}
            <div className="space-y-2">
              <h4 className="font-display text-xs font-bold text-ocean-dark">{labels.category[locale]}</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 text-[11px] font-bold rounded-lg text-left cursor-pointer transition-all whitespace-nowrap w-full ${
                    selectedCategory === 'all'
                      ? 'bg-ocean-dark text-white shadow-sm'
                      : 'bg-white hover:bg-ocean-light border border-ocean-slate/10 text-ocean-slate'
                  }`}
                >
                  {labels.all_categories[locale]}
                </button>

                {categories.map((cat: any) => {
                  const catLabel = cat[locale] || cat.en;
                  const catCount = rawProducts.filter((p: any) => p.category?.en === cat.en).length;
                  return (
                    <button
                      key={cat.en}
                      onClick={() => setSelectedCategory(cat.en)}
                      className={`px-3 py-2 text-[11px] font-bold rounded-lg text-left cursor-pointer transition-all whitespace-nowrap flex items-center justify-between gap-2 w-full ${
                        selectedCategory === cat.en
                          ? 'bg-ocean-dark text-white shadow-sm'
                          : 'bg-white hover:bg-ocean-light border border-ocean-slate/10 text-ocean-slate'
                      }`}
                    >
                      <span>{catLabel}</span>
                      <span className={`text-[9px] rounded px-1.5 py-0.5 ${
                        selectedCategory === cat.en ? 'bg-white/20 text-white' : 'bg-ocean-light text-ocean-slate'
                      }`}>{catCount}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Price Filter */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display text-xs font-bold text-ocean-dark">{labels.price_range[locale]}</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-ocean-slate uppercase tracking-wider">{labels.min[locale]} (GEL)</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPriceLimit}
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border border-ocean-slate/10 bg-white rounded-lg px-2 py-1.5 text-xs text-center font-sans focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-ocean-slate uppercase tracking-wider">{labels.max[locale]} (GEL)</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPriceLimit}
                    value={maxPrice === maxPriceLimit ? '' : maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value) || maxPriceLimit)}
                    className="w-full border border-ocean-slate/10 bg-white rounded-lg px-2 py-1.5 text-xs text-center font-sans focus:outline-none"
                  />
                </div>
              </div>

              {/* Slider for Max Price */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPriceLimit}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value) || maxPriceLimit)}
                  className="w-full h-1 bg-ocean-slate/20 rounded-lg appearance-none cursor-pointer accent-ocean-teal"
                />
                <div className="flex justify-between text-[9px] font-bold text-ocean-slate uppercase font-sans">
                  <span>{minPrice} GEL</span>
                  <span>{maxPriceLimit} GEL</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Products Display */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Mobile Filter Panel (Visible on mobile only, always open, compact) */}
            <div className="lg:hidden bg-ocean-light/20 p-4 rounded-3xl border border-ocean-slate/10 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* 1. Search Bar */}
                <div className="relative flex-1 max-w-sm w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-slate/40" />
                  <input
                    type="text"
                    placeholder={labels.search[locale]}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-ocean-slate/15 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-ocean-teal font-sans transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ocean-slate/40 hover:text-ocean-dark cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 2. Categories Horizontal Scroll List */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-ocean-dark text-white shadow-sm'
                        : 'bg-white hover:bg-ocean-light border border-ocean-slate/10 text-ocean-slate'
                    }`}
                  >
                    {labels.all_categories[locale]}
                  </button>
                  {categories.map((cat: any) => {
                    const catLabel = cat[locale] || cat.en;
                    const catCount = rawProducts.filter((p: any) => p.category?.en === cat.en).length;
                    return (
                      <button
                        key={cat.en}
                        onClick={() => setSelectedCategory(cat.en)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-lg text-center cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          selectedCategory === cat.en
                            ? 'bg-ocean-dark text-white shadow-sm'
                            : 'bg-white hover:bg-ocean-light border border-ocean-slate/10 text-ocean-slate'
                        }`}
                      >
                        <span>{catLabel}</span>
                        <span className={`text-[9px] rounded px-1.5 py-0.5 ${
                          selectedCategory === cat.en ? 'bg-white/20 text-white' : 'bg-ocean-light text-ocean-slate'
                        }`}>{catCount}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Price Filter & Reset */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap justify-between md:justify-end">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder={labels.min[locale]}
                      min="0"
                      max={maxPriceLimit}
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 border border-ocean-slate/10 bg-white rounded-lg px-2 py-1.5 text-[11px] text-center font-sans focus:outline-none"
                    />
                    <span className="text-[10px] text-ocean-slate">-</span>
                    <input
                      type="number"
                      placeholder={labels.max[locale]}
                      min="0"
                      max={maxPriceLimit}
                      value={maxPrice === maxPriceLimit ? '' : maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || maxPriceLimit)}
                      className="w-16 border border-ocean-slate/10 bg-white rounded-lg px-2 py-1.5 text-[11px] text-center font-sans focus:outline-none"
                    />
                    <span className="text-[10px] font-bold text-ocean-slate">GEL</span>
                  </div>

                  {isFilterActive && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 font-sans transition-colors cursor-pointer border border-rose-100 bg-rose-50 px-2.5 py-1.5 rounded-lg shrink-0"
                    >
                      {labels.reset[locale]}
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Products Listing Grid */}
            {dbLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 lg:h-96 rounded-2xl lg:rounded-3xl bg-ocean-light animate-pulse border border-ocean-slate/10"></div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty results screen */
              <div className="rounded-3xl border border-dashed border-ocean-slate/20 bg-ocean-light/10 p-12 text-center space-y-4 animate-fade-in">
                <div className="mx-auto w-12 h-12 rounded-full bg-ocean-light flex items-center justify-center text-ocean-slate">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-ocean-dark">{labels.no_results[locale]}</h3>
                  <p className="font-sans text-xs text-ocean-slate">{labels.no_results_sub[locale]}</p>
                </div>
                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white text-xs font-semibold px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {labels.reset[locale]}
                  </button>
                )}
              </div>
            ) : (
              /* Products listing */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-8">
                {filteredProducts.map((prod: any) => (
                  <div 
                    key={prod.id}
                    className="rounded-2xl lg:rounded-3xl border border-ocean-slate/10 overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <Link to={`/${locale}/shop/${prod.id}`} className="block">
                      {/* Product image */}
                      <div className="relative aspect-square w-full bg-ocean-light/40 overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className={`absolute top-2 lg:top-4 left-2 lg:left-4 rounded-full px-2 lg:px-3.5 py-0.5 lg:py-1 text-[8px] lg:text-[10px] font-bold uppercase tracking-wider font-sans border ${
                          prod.condition === 'New' || prod.condition === 'ახალი' || prod.condition === 'Новый'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {prod.condition}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-3.5 lg:p-6 space-y-1.5 lg:space-y-3">
                        <span className="text-[9px] lg:text-[10px] text-ocean-teal uppercase font-bold tracking-wider font-sans">
                          {prod.category}
                        </span>
                        <h3 
                          className="font-display text-xs lg:text-base font-bold text-ocean-dark group-hover:text-ocean-teal transition-colors leading-snug"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.4rem'
                          }}
                        >
                          {prod.name}
                        </h3>
                        
                        {/* Stars */}
                        <div className="hidden lg:flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(prod.rating) 
                                  ? 'fill-ocean-coral text-ocean-coral' 
                                  : 'text-ocean-slate/20'
                              }`} 
                            />
                          ))}
                          <span className="text-[10px] text-ocean-slate ml-1.5 font-sans font-semibold">{prod.rating}</span>
                        </div>

                        <p className="hidden lg:block font-sans text-xs text-ocean-slate leading-relaxed">
                          {prod.desc.length > 75 ? prod.desc.slice(0, 75) + '...' : prod.desc}
                        </p>
                      </div>
                    </Link>

                    {/* Price & Action */}
                    <div className="p-3.5 lg:p-6 lg:pt-0 pt-0 border-t border-ocean-light mt-2 lg:mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 lg:gap-4">
                      <span className="font-display text-sm lg:text-xl font-extrabold text-ocean-dark">
                        {prod.price}
                      </span>
                      <Link
                        to={`/${locale}/shop/${prod.id}`}
                        className="inline-flex items-center justify-center gap-1 lg:gap-1.5 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white px-2.5 lg:px-4 py-2 lg:py-2.5 text-[10px] lg:text-xs font-semibold shadow-sm transition-colors font-display w-full sm:w-auto"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-ocean-teal shrink-0" />
                        <span>
                          {locale === 'ge' ? 'დეტალები' : locale === 'ru' ? 'Подробнее' : (
                            <>
                              <span className="hidden lg:inline">View Details</span>
                              <span className="lg:hidden">View</span>
                            </>
                          )}
                        </span>
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Info box */}
        <div className="mt-20 rounded-3xl bg-ocean-light/50 border border-ocean-slate/10 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="rounded-2xl bg-white p-3 text-ocean-teal shadow-sm shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-lg font-bold text-ocean-dark">{shopUi.warranty_title}</h4>
            <p className="font-sans text-sm text-ocean-slate leading-relaxed">
              {shopUi.warranty_desc}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
