import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen, Search } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

interface BlogClientProps {
  categories: Array<{
    id: string;
    title: string;
    blogs: Array<{
      id: string;
      title: string;
      excerpt: string;
      date: string;
      readTime: string;
      author: string;
      image: string;
    }>;
  }>;
  locale: Locale;
  dict: {
    blog_ui?: {
      read_article: string;
      by: string;
    };
  };
}

export default function BlogClient({ categories, locale, dict }: BlogClientProps) {
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 'paddleboarding');
  const [searchQuery, setSearchQuery] = useState('');

  const blogUi = dict.blog_ui || { read_article: 'Read Article', by: 'By' };

  // Flat array of all blogs with category meta
  const allBlogs = categories.flatMap(cat => 
    cat.blogs.map(blog => ({
      ...blog,
      categoryTitle: cat.title,
      categoryId: cat.id
    }))
  );

  // Filter based on search query or selected category tab
  const filteredBlogs = searchQuery.trim() === ''
    ? allBlogs.filter(b => b.categoryId === selectedCatId)
    : allBlogs.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="space-y-6">
      
      {/* Search and Category Filtering Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
        
        {/* Category Tabs Container */}
        {searchQuery.trim() === '' ? (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl border border-ocean-slate/10 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCatId === cat.id
                    ? 'bg-ocean-dark text-white shadow-sm'
                    : 'text-ocean-slate hover:text-ocean-dark hover:bg-ocean-light/40'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs font-bold text-ocean-slate uppercase tracking-wider">
              {locale === 'ge' ? 'ძიების შედეგები' : locale === 'ru' ? 'Результаты поиска' : 'Search Results'}
            </span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-slate/50" />
          <input
            type="text"
            placeholder={locale === 'ge' ? 'მოძებნე სტატია...' : locale === 'ru' ? 'Поиск статьи...' : 'Search article...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-ocean-slate/10 rounded-2xl text-xs text-ocean-dark placeholder-ocean-slate/40 focus:outline-none focus:border-ocean-teal transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 mb-24">
          {filteredBlogs.map((post) => (
            <Link 
              key={post.id}
              to={`/${locale}/blog/${post.id}`}
              className="rounded-2xl sm:rounded-3xl border border-ocean-slate/10 overflow-hidden bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Banner image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ocean-light/30">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 rounded-full bg-ocean-dark/85 backdrop-blur-sm text-white px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider font-sans border border-white/10">
                    {post.categoryTitle}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-3 text-left">
                  {/* Meta stats */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] sm:text-[10px] text-ocean-slate/60 font-sans font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ocean-teal" />
                      <span>{post.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ocean-teal" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="font-display text-xs sm:text-lg font-black text-ocean-dark leading-tight group-hover:text-ocean-teal transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="hidden sm:block font-sans text-xs text-ocean-slate leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & CTA */}
              <div className="p-3 sm:p-6 pt-0 mt-auto text-left">
                <div className="border-t border-ocean-light pt-2.5 sm:pt-4 flex items-center justify-between gap-2">
                  <span className="font-sans text-[7.5px] sm:text-[9px] text-ocean-slate/60 font-bold uppercase tracking-wide truncate max-w-[60%]">
                    {blogUi.by} {post.author.split(' (')[0]}
                  </span>
                  <div
                    className="inline-flex items-center gap-1 font-display text-[9px] sm:text-xs font-black text-ocean-teal group-hover:translate-x-1 transition-transform"
                  >
                    <span>{blogUi.read_article}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-3xl space-y-4">
          <BookOpen className="w-12 h-12 text-ocean-slate/40 mx-auto" />
          <h3 className="font-display text-lg font-bold text-ocean-dark">No Articles Found</h3>
          <p className="font-sans text-xs text-ocean-slate">We are currently writing fresh guides for this activity. Check back soon!</p>
        </div>
      )}

    </div>
  );
}
