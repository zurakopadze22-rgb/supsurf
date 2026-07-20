import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Locale } from '@/lib/get-dictionary';
import BlogClient from '@/components/BlogClient';

export default function Blog() {
  const { locale, dict } = useOutletContext<{ locale: Locale; dict: any }>();
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
        console.error('Failed to load DB in Blog page:', err);
        setDbLoading(false);
      });
  }, []);

  const rawCategories = db?.blog_categories || [];

  const categories = rawCategories.map((cat: any) => ({
    id: cat.id,
    title: cat.title[locale] || cat.title.en,
    blogs: (cat.blogs || []).map((blog: any) => ({
      id: blog.id,
      title: blog.title[locale] || blog.title.en,
      excerpt: blog.excerpt[locale] || blog.excerpt.en,
      date: blog.date,
      readTime: blog.readTime,
      author: blog.author,
      image: blog.image,
    })),
  }));

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="font-display text-4xl font-extrabold text-ocean-dark tracking-tight">
            {dict.meta.blog.title}
          </h1>
          <p className="font-sans text-base text-ocean-slate max-w-2xl mx-auto">
            {dict.meta.blog.description}
          </p>
        </div>

        {/* Dynamic Category List Grid & Tab Logic */}
        {dbLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-ocean-teal border-t-transparent"></div>
          </div>
        ) : (
          <BlogClient categories={categories} locale={locale} dict={dict} />
        )}

      </div>
    </div>
  );
}
