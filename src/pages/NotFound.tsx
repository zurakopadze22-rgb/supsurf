import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Waves, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

export default function NotFound() {
  const context = useOutletContext<{ locale?: Locale; dict?: any }>() || {};
  const locale = context.locale || 'ge';

  useEffect(() => {
    document.title = locale === 'ge' 
      ? '404 - გვერდი ვერ მოიძებნა | SUPSURF.GE' 
      : locale === 'ru' 
      ? '404 - Страница не найдена | SUPSURF.GE' 
      : '404 - Page Not Found | SUPSURF.GE';

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const previousContent = robotsMeta.getAttribute('content');
    robotsMeta.setAttribute('content', 'noindex, follow');

    return () => {
      if (robotsMeta && previousContent) {
        robotsMeta.setAttribute('content', previousContent);
      }
    };
  }, [locale]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-ocean-light/20">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-ocean-slate/15 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
          <Waves className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-display text-4xl sm:text-5xl font-extrabold text-ocean-teal">
            404
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-ocean-dark">
            {locale === 'ge' 
              ? 'გვერდი ვერ მოიძებნა' 
              : locale === 'ru' 
              ? 'Страница не найдена' 
              : 'Page Not Found'}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ocean-slate leading-relaxed">
            {locale === 'ge'
              ? 'თქვენ მიერ მოთხოვნილი გვერდი არ არსებობს ან გადატანილია სხვა მისამართზე.'
              : locale === 'ru'
              ? 'Запрошенная страница не существует или была перемещена.'
              : 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white text-xs font-bold font-display shadow-sm transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>{locale === 'ge' ? 'მთავარი გვერდი' : locale === 'ru' ? 'На главную' : 'Back Home'}</span>
          </Link>
          <Link
            to={`/${locale}/rent`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ocean-teal hover:bg-ocean-dark text-white text-xs font-bold font-display shadow-sm transition-colors"
          >
            <span>{locale === 'ge' ? 'საპის ქირაობა' : locale === 'ru' ? 'Аренда сапов' : 'Rent a SUP'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
