import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Play } from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';

function renderBlogVideo(url?: string) {
  if (!url) return null;

  // YouTube embed
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
    } catch (err) {
      console.error('Error parsing YouTube URL:', err);
    }

    if (videoId) {
      return (
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-ocean-slate/15 my-6 sm:my-8 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  }

  // Instagram Reel embed / iframe fallback
  if (url.includes('instagram.com')) {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '') + '/embed';
    return (
      <div className="relative w-full max-w-[340px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden shadow-lg border border-ocean-slate/15 my-6 sm:my-8 bg-black">
        <iframe
          src={cleanUrl}
          title="Instagram post player"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Fallback to direct HTML5 video player
  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-ocean-slate/15 my-6 sm:my-8 bg-black">
      <video
        src={url}
        controls
        playsInline
        className="w-full h-auto max-h-[500px]"
      />
    </div>
  );
}

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useOutletContext<{ locale: Locale; dict: any }>();
  const [db, setDb] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin')
      .then((res) => res.json())
      .then((data) => {
        setDb(data);
        setDbLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load DB in BlogPostDetail:', err);
        setDbLoading(false);
      });
  }, []);

  let activeBlog: any = null;
  let activeCategoryTitle = '';

  if (db) {
    for (const cat of (db.blog_categories || [])) {
      const blog = (cat.blogs || []).find((b: any) => b.id === id);
      if (blog) {
        activeBlog = blog;
        activeCategoryTitle = cat.title[locale] || cat.title.en;
        break;
      }
    }
  }

  const title = activeBlog ? (activeBlog.title[locale] || activeBlog.title.en) : '';
  const content = activeBlog ? (activeBlog.content[locale] || activeBlog.content.en) : '';

  useEffect(() => {
    if (!activeBlog) return;

    const schemaId = 'blogpost-jsonld-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const blogSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'image': activeBlog.image.startsWith('http') ? activeBlog.image : window.location.origin + activeBlog.image,
      'datePublished': activeBlog.date,
      'author': {
        '@type': 'Person',
        'name': activeBlog.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'supsurf.ge',
        'logo': {
          '@type': 'ImageObject',
          'url': window.location.origin + '/pictures/logo.webp'
        }
      },
      'description': activeBlog.excerpt[locale] || activeBlog.excerpt.en,
      'articleBody': content
    };

    script.text = JSON.stringify(blogSchema);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [activeBlog, locale, title, content]);

  if (dbLoading) {
    return (
      <div className="bg-white min-h-screen py-16 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-teal border-t-transparent"></div>
      </div>
    );
  }

  if (!activeBlog) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-2xl font-extrabold text-ocean-dark">
            {locale === 'ge' ? 'სტატია ვერ მოიძებნა' : locale === 'ru' ? 'Статья не найдена' : 'Article Not Found'}
          </h2>
          <Link
            to={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-teal hover:underline font-display"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>{locale === 'ge' ? 'ყველა ბლოგი' : locale === 'ru' ? 'Все блоги' : 'Back to Blogs'}</span>
          </Link>
        </div>
      </div>
    );
  }



  // Split text by newlines into paragraphs for clean rendering
  const paragraphs = content.split('\n').filter(Boolean);

  return (
    <article className="bg-white min-h-screen pb-24 text-left">

      {/* 1. Hero banner cover */}
      <div className="relative w-full h-[50vh] min-h-[380px] bg-ocean-dark text-white flex items-end pb-12">
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-40">
          <img
            src={activeBlog.image}
            alt={title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-ocean-dark/70 to-ocean-dark/30 z-0"></div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full space-y-4">
          <div className="inline-block rounded-full bg-ocean-teal/20 backdrop-blur-md text-ocean-teal px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest font-sans border border-ocean-teal/30">
            {activeCategoryTitle}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white tracking-tight max-w-4xl">
            {title}
          </h1>
        </div>
      </div>

      {/* 2. Content section */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left panel: Back button & Author Card */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
            <Link
              to={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-dark hover:text-ocean-teal transition-colors font-display"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === 'ge' ? 'ყველა ბლოგი' : locale === 'ru' ? 'Все блоги' : 'Back to Blogs'}</span>
            </Link>

            <div className="rounded-2xl border border-ocean-slate/10 bg-ocean-light/20 p-5 space-y-4 shadow-sm">
              <span className="block text-[10px] font-bold text-ocean-slate uppercase tracking-wider">
                {locale === 'ge' ? 'სტატიის შესახებ' : locale === 'ru' ? 'О статье' : 'About Article'}
              </span>
              <div className="space-y-3.5 font-sans text-xs text-ocean-dark">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-ocean-teal shrink-0" />
                  <span className="font-bold">{activeBlog.author}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-ocean-teal shrink-0" />
                  <span className="text-ocean-slate font-medium">{activeBlog.date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-ocean-teal shrink-0" />
                  <span className="text-ocean-slate font-medium">{activeBlog.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Full content body */}
          <div className="lg:col-span-9 space-y-6">

            {/* Embedded Video Guide if present */}
            {activeBlog.videoUrl && (
              <div className="space-y-3">
                <h2 className="font-display text-base sm:text-lg font-black text-ocean-dark flex items-center gap-2 uppercase tracking-wide">
                  <Play className="w-4.5 h-4.5 text-ocean-coral fill-ocean-coral" />
                  <span>{locale === 'ge' ? 'ვიდეო გზამკვლევი' : locale === 'ru' ? 'Видео-инструкция' : 'Video Guide'}</span>
                </h2>
                {renderBlogVideo(activeBlog.videoUrl)}
              </div>
            )}

            {/* Paragraphs and typography */}
            <div className="space-y-5 text-sm sm:text-base text-ocean-slate font-sans leading-relaxed tracking-normal">
              {paragraphs.map((p: string, idx: number) => {
                // Highlight bulleted lists
                if (p.startsWith('- ') || p.startsWith('• ')) {
                  return (
                    <ul key={idx} className="list-disc pl-5 my-2.5 space-y-1.5 text-xs sm:text-sm text-ocean-slate font-medium">
                      <li>{p.substring(2)}</li>
                    </ul>
                  );
                }
                // Bold/Highlight headers
                if (p.startsWith('**') && p.endsWith('**')) {
                  return (
                    <h3 key={idx} className="font-display text-base sm:text-xl font-extrabold text-ocean-dark pt-5 leading-snug">
                      {p.replace(/\*\*/g, '')}
                    </h3>
                  );
                }
                // Highlight blockquotes
                if (p.startsWith('> ')) {
                  return (
                    <blockquote key={idx} className="border-l-4 border-ocean-teal bg-ocean-light/30 px-4 py-3 rounded-r-xl font-medium text-ocean-dark text-xs sm:text-sm italic my-4">
                      {p.substring(2)}
                    </blockquote>
                  );
                }
                // Highlight numbered lists
                if (/^\d+\.\s/.test(p)) {
                  const match = p.match(/^(\d+\.)\s(.*)/);
                  const num = match ? match[1] : '';
                  const text = match ? match[2] : p;
                  return (
                    <div key={idx} className="flex gap-2.5 my-3 pl-2 text-xs sm:text-sm text-ocean-slate font-medium">
                      <span className="font-bold text-ocean-teal font-sans">{num}</span>
                      <p className="flex-1 leading-normal">{text}</p>
                    </div>
                  );
                }
                // Normal paragraph (Apply Drop Cap style on first paragraph if not blockquote/header)
                return (
                  <p key={idx} className="text-xs sm:text-sm leading-relaxed text-ocean-slate font-medium">
                    {p}
                  </p>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </article>
  );
}
