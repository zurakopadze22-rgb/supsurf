import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Settings, Layers, ShoppingBag, BookOpen, Trash2, Plus, 
  Save, Upload, Image as ImageIcon, Lock, Unlock, Check, 
  AlertCircle, ChevronRight, RefreshCw, LogOut, FileText 
} from 'lucide-react';
import type { Locale } from '@/lib/get-dictionary';
import type { DBData } from '@/lib/db';
import { firestoreDb, isFirebaseConfigured } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function Admin() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const locale = (['en', 'ge', 'ru'].includes(rawLocale || '') ? rawLocale : 'en') as Locale;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // DB State
  const [dbData, setDbData] = useState<DBData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'kit' | 'services' | 'shop' | 'blogs' | 'inquiries'>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Active editors / expanded states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string>('paddleboarding');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Dynamic Firestore inquiries loading for Admin
  const [firestoreInquiries, setFirestoreInquiries] = useState<any[]>([]);

  useEffect(() => {
    if (isFirebaseConfigured && firestoreDb && activeTab === 'inquiries') {
      const q = query(collection(firestoreDb, 'corporate_inquiries'), orderBy('date', 'desc'));
      getDocs(q).then((snapshot) => {
        const inqs = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id // Use firestore document ID
        }));
        setFirestoreInquiries(inqs);
      }).catch(err => {
        console.error('Error fetching Firestore inquiries:', err);
      });
    }
  }, [activeTab]);

  // Load database
  useEffect(() => {
    fetch('/api/admin')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load database');
        return res.json();
      })
      .then((data) => {
        setDbData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('Could not load database file. Make sure src/data/db.json exists.');
        setIsLoading(false);
      });
  }, []);

  // Simple hardcoded check for ease of use (can be configured via env later)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'supsurf2026') {
      setIsAuthenticated(true);
      setAuthError('');
      // Store in session storage so it persists during refresh
      sessionStorage.setItem('supsurf_admin_authenticated', 'true');
    } else {
      setAuthError(locale === 'ge' ? 'არასწორი პაროლი' : locale === 'ru' ? 'Неверный пароль' : 'Incorrect passcode');
    }
  };

  // Check session storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('supsurf_admin_authenticated');
      if (auth === 'true') {
        setTimeout(() => setIsAuthenticated(true), 0);
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('supsurf_admin_authenticated');
  };

  // Save changes to disk
  const saveChanges = async (updatedData: DBData) => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to save data');
      setDbData(updatedData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setErrorMessage('Could not write updates to disk.');
    }
  };

  // Image Upload helper
  const handleImageUpload = async (
    file: File, 
    onUploadSuccess: (url: string) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ocean-light/10 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-ocean-teal animate-spin" />
          <span className="font-sans text-sm font-bold text-ocean-navy">
            {locale === 'ge' ? 'მონაცემთა ბაზა იტვირთება...' : locale === 'ru' ? 'Загрузка базы данных...' : 'Loading database...'}
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-navy to-ocean-dark flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 space-y-6 animate-fade-in-up">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-ocean-teal/10 flex items-center justify-center text-ocean-teal">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-ocean-dark">
              {locale === 'ge' ? 'ადმინისტრატორის პანელი' : locale === 'ru' ? 'Панель администратора' : 'Admin Portal'}
            </h1>
            <p className="font-sans text-xs text-ocean-slate">
              {locale === 'ge' ? 'შეიყვანეთ პაროლი საიტის სამართავად' : locale === 'ru' ? 'Введите пароль для управления сайтом' : 'Enter passcode to unlock configuration settings'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <input
                type="password"
                required
                placeholder={locale === 'ge' ? 'პაროლი (admin)' : locale === 'ru' ? 'Пароль (admin)' : 'Passcode (admin)'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-ocean-slate/20 px-4 py-3 text-sm text-ocean-dark focus:border-ocean-teal focus:ring-1 focus:ring-ocean-teal focus:outline-none transition-all font-sans text-center"
              />
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ocean-coral to-orange-500 hover:shadow-lg font-display font-bold py-3.5 shadow-md transition-all text-white text-sm"
          >
            <Unlock className="w-4 h-4" />
            <span>{locale === 'ge' ? 'შესვლა' : locale === 'ru' ? 'Войти' : 'Unlock Panel'}</span>
          </button>
        </form>
      </div>
    );
  }

  if (!dbData) {
    return (
      <div className="min-h-screen bg-ocean-light/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md shadow-lg border text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-display text-lg font-extrabold text-ocean-dark">Database Error</h3>
          <p className="font-sans text-xs text-ocean-slate">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // State update utilities
  const updateContact = (key: 'phone' | 'whatsapp' | 'instagram', val: string) => {
    const updated = {
      ...dbData,
      contact: {
        ...dbData.contact,
        [key]: val
      }
    };
    saveChanges(updated);
  };

  const updatePromoImage = (url: string) => {
    if (!dbData) return;
    const updated = {
      ...dbData,
      promo_image: url
    };
    saveChanges(updated);
  };

  const updateGeneralField = (key: 'hero_video_url' | 'lifestyle_video_url' | 'logo', value: string) => {
    if (!dbData) return;
    const updated = {
      ...dbData,
      [key]: value
    };
    saveChanges(updated);
  };

  const updateLocalizedPromoText = (key: 'promo_title' | 'promo_subtitle', lang: 'en' | 'ge' | 'ru', value: string) => {
    if (!dbData) return;
    const updated = {
      ...dbData,
      [key]: {
        ...(dbData[key] || {}),
        [lang]: value
      }
    };
    saveChanges(updated);
  };

  const updateKitItem = (idx: number, field: 'image' | 'title' | 'desc', lang: string | null, value: string) => {
    const updatedKit = [...dbData.kit_items];
    if (field === 'image') {
      updatedKit[idx].image = value;
    } else if (lang) {
      updatedKit[idx][field] = {
        ...updatedKit[idx][field],
        [lang]: value
      };
    }
    const updated = {
      ...dbData,
      kit_items: updatedKit
    };
    saveChanges(updated);
  };

  return (
    <div className="bg-ocean-light/10 min-h-screen pb-24">
      {/* Header bar */}
      <div className="bg-white border-b border-ocean-slate/10 py-4 shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-extrabold text-ocean-dark flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              SUP Surf Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <span className="text-xs text-ocean-slate flex items-center gap-1.5 bg-ocean-light px-3 py-1.5 rounded-lg border">
                <RefreshCw className="w-3.5 h-3.5 text-ocean-teal animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                All changes saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-xs text-rose-700 flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                Save Failed
              </span>
            )}

            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 px-3.5 py-1.5 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <Settings className="w-5 h-5" />
            General & Promo
          </button>
          <button
            onClick={() => setActiveTab('kit')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'kit'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <Layers className="w-5 h-5" />
            Kit Equipment
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
            Services & Tours
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Inventory
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'blogs'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            SEO Blogs
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-ocean-dark text-white shadow-md'
                : 'bg-white border hover:bg-ocean-light/50 text-ocean-dark border-ocean-slate/10'
            }`}
          >
            <FileText className="w-5 h-5" />
            Corporate Inquiries
          </button>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 bg-white border border-ocean-slate/10 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ocean-dark">General & Promo Settings</h2>
                <p className="font-sans text-xs text-ocean-slate mt-1">Configure company links and homepage promotional board carousel pictures.</p>
              </div>

              {/* 1. Contacts */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Contact Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Phone Number</label>
                    <input 
                      type="text" 
                      value={dbData.contact.phone} 
                      onChange={(e) => updateContact('phone', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">WhatsApp ID (Phone format, no spaces/+)</label>
                    <input 
                      type="text" 
                      value={dbData.contact.whatsapp} 
                      onChange={(e) => updateContact('whatsapp', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Instagram URL</label>
                    <input 
                      type="text" 
                      value={dbData.contact.instagram} 
                      onChange={(e) => updateContact('instagram', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Promo Background Picture */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Daily Promo Background Image</h3>
                <div className="w-full max-w-md border border-ocean-slate/10 rounded-2xl p-4 bg-ocean-light/10 space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white border max-w-[280px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dbData.promo_image || 'https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=600&q=80'} alt="Promo Background" className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={dbData.promo_image || ''} 
                      onChange={(e) => updatePromoImage(e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal"
                      placeholder="Image URL"
                    />
                    <label className="cursor-pointer bg-white hover:bg-ocean-light border text-xs font-semibold text-ocean-slate px-3 py-2 rounded-lg inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Background
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (url) => updatePromoImage(url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 2.5 Header Brand Logo */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Header Branding Logo</h3>
                <div className="w-full max-w-md border border-ocean-slate/10 rounded-2xl p-4 bg-ocean-light/10 space-y-4">
                  {dbData.logo && (
                    <div className="relative h-12 rounded-lg overflow-hidden bg-ocean-dark border p-2 max-w-[150px] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dbData.logo} alt="Header Logo" className="object-contain h-full max-w-full" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={dbData.logo || ''} 
                      onChange={(e) => updateGeneralField('logo', e.target.value)}
                      className="w-full border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal"
                      placeholder="Logo URL (e.g. /uploads/image.png or external URL)"
                    />
                    <label className="cursor-pointer bg-white hover:bg-ocean-light border text-xs font-semibold text-ocean-slate px-3 py-2 rounded-lg inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Logo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(e.target.files[0], (url) => updateGeneralField('logo', url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Promo Videos */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Promo & Lifestyle Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Hero Background Video URL</label>
                    <input 
                      type="text" 
                      value={dbData.hero_video_url || ''} 
                      onChange={(e) => updateGeneralField('hero_video_url', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Lifestyle Section Video URL</label>
                    <input 
                      type="text" 
                      value={dbData.lifestyle_video_url || ''} 
                      onChange={(e) => updateGeneralField('lifestyle_video_url', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Promo Titles */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Hero Promo Title Translations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">English Title</label>
                    <input 
                      type="text" 
                      value={dbData.promo_title?.en || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_title', 'en', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Georgian Title (ქართული)</label>
                    <input 
                      type="text" 
                      value={dbData.promo_title?.ge || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_title', 'ge', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Russian Title (Русский)</label>
                    <input 
                      type="text" 
                      value={dbData.promo_title?.ru || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_title', 'ru', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Promo Subtitles */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-display text-sm font-bold text-ocean-dark">Hero Promo Subtitle Translations</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">English Subtitle</label>
                    <textarea 
                      rows={2}
                      value={dbData.promo_subtitle?.en || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_subtitle', 'en', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none resize-none font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Georgian Subtitle (ქართული)</label>
                    <textarea 
                      rows={2}
                      value={dbData.promo_subtitle?.ge || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_subtitle', 'ge', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none resize-none font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-xs font-semibold text-ocean-slate">Russian Subtitle (Русский)</label>
                    <textarea 
                      rows={2}
                      value={dbData.promo_subtitle?.ru || ''} 
                      onChange={(e) => updateLocalizedPromoText('promo_subtitle', 'ru', e.target.value)}
                      className="border rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-ocean-teal focus:outline-none resize-none font-sans"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KIT EQUIPMENT */}
          {activeTab === 'kit' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ocean-dark">Kit Equipment Components</h2>
                <p className="font-sans text-xs text-ocean-slate mt-1">Manage images, labels and translations for the 6 kit components included in the daily rental set.</p>
              </div>

              <div className="divide-y space-y-8">
                {dbData.kit_items.map((item, idx) => (
                  <div key={item.key} className={`pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 ${idx === 0 ? 'pt-0 border-t-0' : 'border-t'}`}>
                    
                    {/* Left: Image selector */}
                    <div className="md:col-span-3 space-y-2 text-center md:text-left">
                      <label className="block font-display text-xs font-bold text-ocean-dark capitalize">{item.key}</label>
                      <div className="relative aspect-square w-full max-w-[130px] mx-auto md:mx-0 rounded-2xl overflow-hidden border bg-ocean-light/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.key} className="object-cover w-full h-full" />
                      </div>
                      <label className="cursor-pointer bg-white hover:bg-ocean-light border text-[10px] font-semibold text-ocean-slate px-2 py-1.5 rounded-lg inline-flex items-center justify-center gap-1 w-full max-w-[130px]">
                        <Upload className="w-3 h-3" />
                        Replace Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(e.target.files[0], (url) => updateKitItem(idx, 'image', null, url));
                            }
                          }}
                        />
                      </label>
                      <input 
                        type="text" 
                        value={item.image}
                        onChange={(e) => updateKitItem(idx, 'image', null, e.target.value)}
                        className="w-full text-[9px] border rounded p-1"
                        placeholder="Or paste URL"
                      />
                    </div>

                    {/* Right: Translations */}
                    <div className="md:col-span-9 space-y-4">
                      {/* Name Translations */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">English Title</span>
                          <input 
                            type="text" 
                            value={item.title.en} 
                            onChange={(e) => updateKitItem(idx, 'title', 'en', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">Georgian Title (GE)</span>
                          <input 
                            type="text" 
                            value={item.title.ge} 
                            onChange={(e) => updateKitItem(idx, 'title', 'ge', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">Russian Title (RU)</span>
                          <input 
                            type="text" 
                            value={item.title.ru} 
                            onChange={(e) => updateKitItem(idx, 'title', 'ru', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal"
                          />
                        </div>
                      </div>

                      {/* Description Translations */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">English Description</span>
                          <textarea 
                            rows={2}
                            value={item.desc.en} 
                            onChange={(e) => updateKitItem(idx, 'desc', 'en', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">Georgian Description</span>
                          <textarea 
                            rows={2}
                            value={item.desc.ge} 
                            onChange={(e) => updateKitItem(idx, 'desc', 'ge', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-ocean-slate uppercase tracking-wider">Russian Description</span>
                          <textarea 
                            rows={2}
                            value={item.desc.ru} 
                            onChange={(e) => updateKitItem(idx, 'desc', 'ru', e.target.value)}
                            className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ocean-teal resize-none"
                          />
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: SERVICES EDITOR */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-ocean-dark">Services & Tours</h2>
                  <p className="font-sans text-xs text-ocean-slate mt-1">Configure your water sports lessons, corporate packages, and tours.</p>
                </div>
                <button
                  onClick={() => {
                    const newId = `service_${Date.now()}`;
                    const newService = {
                      id: newId,
                      name: { en: 'New Service', ge: 'ახალი სერვისი', ru: 'Новая услуга' },
                      location: { en: 'Lisi Lake', ge: 'ლისის ტბა', ru: 'Озеро Лиси' },
                      price: '50 GEL',
                      duration: { en: '1 Hour', ge: '1 საათი', ru: '1 Час' },
                      image: 'https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=500&q=80',
                      desc: { en: 'Write details here...', ge: 'დაწერეთ დეტალები...', ru: 'Описание...' },
                      inclusions: {
                        en: ['SUP Board', 'Instructor'],
                        ge: ['საპ დაფა', 'ინსტრუქტორი'],
                        ru: ['Сапборд', 'Инструктор']
                      }
                    };
                    const updated = {
                      ...dbData,
                      services: [...dbData.services, newService]
                    };
                    setEditingServiceId(newId);
                    saveChanges(updated);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white text-xs font-bold px-4 py-2.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-ocean-teal" /> Add Service
                </button>
              </div>

              {/* Service Cards list */}
              <div className="space-y-4">
                {dbData.services.map((srv) => (
                  <div key={srv.id} className="border border-ocean-slate/10 rounded-2xl overflow-hidden shadow-sm">
                    {/* Collapsed Header */}
                    <div 
                      onClick={() => setEditingServiceId(editingServiceId === srv.id ? null : srv.id)}
                      className="p-4 bg-ocean-light/10 hover:bg-ocean-light/20 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={srv.image} alt={srv.name.en} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-ocean-dark">{srv.name[locale] || srv.name.en}</h4>
                          <span className="text-[10px] text-ocean-teal font-semibold font-sans">{srv.location[locale] || srv.location.en} | {srv.price}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-ocean-slate transition-transform ${editingServiceId === srv.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Expanded Editor */}
                    {editingServiceId === srv.id && (
                      <div className="p-6 bg-white border-t border-ocean-slate/10 space-y-6 animate-fade-in-up">
                        
                        {/* Meta and fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Price Tag (e.g. 60 GEL)</label>
                            <input 
                              type="text" 
                              value={srv.price} 
                              onChange={(e) => {
                                const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, price: e.target.value } : s);
                                saveChanges({ ...dbData, services: updatedSrv });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Image Cover URL (Cover)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={srv.image} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updatedImages = [...(srv.images || [])];
                                  if (updatedImages.length > 0) {
                                    updatedImages[0] = val;
                                  } else if (val) {
                                    updatedImages.push(val);
                                  }
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, image: val, images: updatedImages } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-1"
                              />
                              <label className="cursor-pointer bg-white hover:bg-ocean-light border text-[10px] font-semibold text-ocean-slate px-3 py-2 rounded-lg inline-flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleImageUpload(e.target.files[0], (url) => {
                                        const updatedImages = [...(srv.images || [])];
                                        if (updatedImages.length > 0) {
                                          updatedImages[0] = url;
                                        } else {
                                          updatedImages.push(url);
                                        }
                                        const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, image: url, images: updatedImages } : s);
                                        saveChanges({ ...dbData, services: updatedSrv });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex flex-col justify-end">
                            <button
                              onClick={() => {
                                const updatedSrv = dbData.services.filter(s => s.id !== srv.id);
                                saveChanges({ ...dbData, services: updatedSrv });
                              }}
                              className="w-full flex items-center justify-center gap-1 text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg py-2.5 text-xs font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Service
                            </button>
                          </div>
                        </div>

                        {/* Text Fields Translations */}
                        <div className="space-y-4 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">Name & Location Translations</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">English</span>
                              <input 
                                type="text" 
                                placeholder="Service Name (EN)" 
                                value={srv.name.en}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, name: { ...s.name, en: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Location (EN)" 
                                value={srv.location.en}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, location: { ...s.location, en: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Duration (EN)" 
                                value={srv.duration.en}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, duration: { ...s.duration, en: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="Description (EN)" 
                                value={srv.desc.en}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, desc: { ...s.desc, en: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={3}
                              />
                            </div>

                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">Georgian (GE)</span>
                              <input 
                                type="text" 
                                placeholder="სერვისის სახელი (GE)" 
                                value={srv.name.ge}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, name: { ...s.name, ge: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="ლოკაცია (GE)" 
                                value={srv.location.ge}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, location: { ...s.location, ge: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="ხანგრძლივობა (GE)" 
                                value={srv.duration.ge}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, duration: { ...s.duration, ge: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="აღწერა (GE)" 
                                value={srv.desc.ge}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, desc: { ...s.desc, ge: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={3}
                              />
                            </div>

                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">Russian (RU)</span>
                              <input 
                                type="text" 
                                placeholder="Название услуги (RU)" 
                                value={srv.name.ru}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, name: { ...s.name, ru: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Локация (RU)" 
                                value={srv.location.ru}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, location: { ...s.location, ru: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Длительность (RU)" 
                                value={srv.duration.ru}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, duration: { ...s.duration, ru: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="Описание (RU)" 
                                value={srv.desc.ru}
                                onChange={(e) => {
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, desc: { ...s.desc, ru: e.target.value } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-3 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">What is Included (Comma separated lists)</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">English inclusions</span>
                              <input 
                                type="text" 
                                value={srv.inclusions.en.join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, inclusions: { ...s.inclusions, en: list } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="e.g. Life Jacket, Board"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">Georgian inclusions</span>
                              <input 
                                type="text" 
                                value={srv.inclusions.ge.join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, inclusions: { ...s.inclusions, ge: list } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="მაგ. საპ დაფა, ჟილეტი"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">Russian inclusions</span>
                              <input 
                                type="text" 
                                value={srv.inclusions.ru.join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { ...s, inclusions: { ...s.inclusions, ru: list } } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="например: Сапборд, Жилет"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Service Image Gallery */}
                        <div className="space-y-3 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">Additional Image Gallery</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {(srv.images || []).map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden border border-ocean-slate/15 group">
                                <img src={imgUrl} alt="" className="object-cover w-full h-full" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImages = (srv.images || []).filter((_, i) => i !== imgIdx);
                                    const updatedSrv = dbData.services.map(s => s.id === srv.id ? { 
                                      ...s, 
                                      images: updatedImages,
                                      image: updatedImages[0] || '' 
                                    } : s);
                                    saveChanges({ ...dbData, services: updatedSrv });
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                  title="Delete image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-ocean-dark/70 text-white text-[9px] py-0.5 text-center font-sans">
                                  {imgIdx === 0 ? 'Cover' : `#${imgIdx + 1}`}
                                </div>
                              </div>
                            ))}

                            {/* Add Image Button */}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-ocean-slate/20 rounded-xl hover:border-ocean-teal hover:bg-ocean-light/20 transition-all cursor-pointer text-ocean-slate hover:text-ocean-teal">
                              <Plus className="w-5 h-5 mb-1 text-ocean-teal" />
                              <span className="text-[10px] font-bold">Add Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0], (url) => {
                                      const currentImages = srv.images || (srv.image ? [srv.image] : []);
                                      const updatedImages = [...currentImages, url];
                                      const updatedSrv = dbData.services.map(s => s.id === srv.id ? { 
                                        ...s, 
                                        images: updatedImages,
                                        image: updatedImages[0] || '' 
                                      } : s);
                                      saveChanges({ ...dbData, services: updatedSrv });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* Manual URL Input */}
                          <div className="flex gap-2 max-w-md">
                            <input 
                              type="text" 
                              placeholder="Or paste image URL here..." 
                              id={`manual-url-srv-${srv.id}`}
                              className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.currentTarget;
                                  const url = target.value.trim();
                                  if (url) {
                                    const currentImages = srv.images || (srv.image ? [srv.image] : []);
                                    const updatedImages = [...currentImages, url];
                                    const updatedSrv = dbData.services.map(s => s.id === srv.id ? { 
                                      ...s, 
                                      images: updatedImages,
                                      image: updatedImages[0] || '' 
                                    } : s);
                                    saveChanges({ ...dbData, services: updatedSrv });
                                    target.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`manual-url-srv-${srv.id}`) as HTMLInputElement;
                                const url = input?.value.trim();
                                if (url) {
                                  const currentImages = srv.images || (srv.image ? [srv.image] : []);
                                  const updatedImages = [...currentImages, url];
                                  const updatedSrv = dbData.services.map(s => s.id === srv.id ? { 
                                    ...s, 
                                    images: updatedImages,
                                    image: updatedImages[0] || '' 
                                  } : s);
                                  saveChanges({ ...dbData, services: updatedSrv });
                                  input.value = '';
                                }
                              }}
                              className="bg-ocean-teal hover:bg-ocean-dark text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: SHOP INVENTORY */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-ocean-dark">Shop Inventory</h2>
                  <p className="font-sans text-xs text-ocean-slate mt-1">Manage Stand-Up paddle boards, surfboards, foils, and accessories for sale.</p>
                </div>
                <button
                  onClick={() => {
                    const newId = `product_${Date.now()}`;
                    const newProd = {
                      id: newId,
                      name: { en: 'Carbon Paddle Model X', ge: 'კარბონის ნიჩაბი X', ru: 'Карбоновое весло X' },
                      category: { en: 'Accessories', ge: 'აქსესუარები', ru: 'Аксессуары' },
                      condition: { en: 'New', ge: 'ახალი', ru: 'Новый' },
                      price: '300 GEL',
                      rating: 5,
                      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
                      desc: { en: 'Write details here...', ge: 'დაწერეთ დეტალები...', ru: 'Описание...' }
                    };
                    const updated = {
                      ...dbData,
                      products: [...dbData.products, newProd]
                    };
                    setEditingProductId(newId);
                    saveChanges(updated);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white text-xs font-bold px-4 py-2.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-ocean-teal" /> Add Product
                </button>
              </div>

              {/* Product Cards */}
              <div className="space-y-4">
                {dbData.products.map((prod) => (
                  <div key={prod.id} className="border border-ocean-slate/10 rounded-2xl overflow-hidden shadow-sm">
                    
                    {/* Collapsed Header */}
                    <div 
                      onClick={() => setEditingProductId(editingProductId === prod.id ? null : prod.id)}
                      className="p-4 bg-ocean-light/10 hover:bg-ocean-light/20 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prod.image} alt={prod.name.en} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-ocean-dark">{prod.name[locale] || prod.name.en}</h4>
                          <span className="text-[10px] text-ocean-teal font-semibold font-sans">{prod.category[locale] || prod.category.en} | {prod.condition[locale] || prod.condition.en} | {prod.price}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-ocean-slate transition-transform ${editingProductId === prod.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Expanded Editor */}
                    {editingProductId === prod.id && (
                      <div className="p-6 bg-white border-t border-ocean-slate/10 space-y-6 animate-fade-in-up">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Price Tag (e.g. 1,499 GEL)</label>
                            <input 
                              type="text" 
                              value={prod.price} 
                              onChange={(e) => {
                                const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, price: e.target.value } : p);
                                saveChanges({ ...dbData, products: updatedProds });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Condition (e.g. New / Used)</label>
                            <div className="grid grid-cols-3 gap-2">
                              <input 
                                type="text" 
                                placeholder="EN" 
                                value={prod.condition.en}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, condition: { ...p.condition, en: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2 py-1.5 text-xs text-center"
                              />
                              <input 
                                type="text" 
                                placeholder="GE" 
                                value={prod.condition.ge}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, condition: { ...p.condition, ge: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2 py-1.5 text-xs text-center"
                              />
                              <input 
                                type="text" 
                                placeholder="RU" 
                                value={prod.condition.ru}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, condition: { ...p.condition, ru: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2 py-1.5 text-xs text-center"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Rating (1 to 5 Stars)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              min="1"
                              max="5"
                              value={prod.rating} 
                              onChange={(e) => {
                                const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, rating: parseFloat(e.target.value) || 5 } : p);
                                saveChanges({ ...dbData, products: updatedProds });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Image cover path */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Product Image URL (Cover)</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={prod.image} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updatedImages = [...(prod.images || [])];
                                  if (updatedImages.length > 0) {
                                    updatedImages[0] = val;
                                  } else if (val) {
                                    updatedImages.push(val);
                                  }
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, image: val, images: updatedImages } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-1"
                              />
                              <label className="cursor-pointer bg-white hover:bg-ocean-light border text-[10px] font-semibold text-ocean-slate px-3 py-2 rounded-lg inline-flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleImageUpload(e.target.files[0], (url) => {
                                        const updatedImages = [...(prod.images || [])];
                                        if (updatedImages.length > 0) {
                                          updatedImages[0] = url;
                                        } else {
                                          updatedImages.push(url);
                                        }
                                        const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, image: url, images: updatedImages } : p);
                                        saveChanges({ ...dbData, products: updatedProds });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex flex-col justify-end">
                            <button
                              onClick={() => {
                                const updatedProds = dbData.products.filter(p => p.id !== prod.id);
                                saveChanges({ ...dbData, products: updatedProds });
                              }}
                              className="w-full flex items-center justify-center gap-1 text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg py-2.5 text-xs font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Product
                            </button>
                          </div>
                        </div>

                        {/* Multi-lingual names & categories & description */}
                        <div className="space-y-4 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">Descriptions & Titles</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            
                            {/* EN */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">English (EN)</span>
                              <input 
                                type="text" 
                                placeholder="Product Name" 
                                value={prod.name.en}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, name: { ...p.name, en: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Category" 
                                value={prod.category.en}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, category: { ...p.category, en: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="Description" 
                                value={prod.desc.en}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, desc: { ...p.desc, en: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={4}
                              />
                            </div>

                            {/* GE */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">Georgian (GE)</span>
                              <input 
                                type="text" 
                                placeholder="პროდუქტის სახელი" 
                                value={prod.name.ge}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, name: { ...p.name, ge: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="კატეგორია" 
                                value={prod.category.ge}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, category: { ...p.category, ge: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="აღწერა" 
                                value={prod.desc.ge}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, desc: { ...p.desc, ge: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={4}
                              />
                            </div>

                            {/* RU */}
                            <div className="space-y-3">
                              <span className="text-[10px] font-bold text-ocean-teal tracking-widest uppercase">Russian (RU)</span>
                              <input 
                                type="text" 
                                placeholder="Название товара" 
                                value={prod.name.ru}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, name: { ...p.name, ru: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <input 
                                type="text" 
                                placeholder="Категория" 
                                value={prod.category.ru}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, category: { ...p.category, ru: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs"
                              />
                              <textarea 
                                placeholder="Описание" 
                                value={prod.desc.ru}
                                onChange={(e) => {
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, desc: { ...p.desc, ru: e.target.value } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="w-full border rounded-lg px-2.5 py-2 text-xs resize-none"
                                rows={4}
                              />
                            </div>

                          </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-3 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">Additional Image Gallery</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {(prod.images || []).map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden border border-ocean-slate/15 group">
                                <img src={imgUrl} alt="" className="object-cover w-full h-full" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedImages = (prod.images || []).filter((_, i) => i !== imgIdx);
                                    const updatedProds = dbData.products.map(p => p.id === prod.id ? { 
                                      ...p, 
                                      images: updatedImages,
                                      image: updatedImages[0] || '' 
                                    } : p);
                                    saveChanges({ ...dbData, products: updatedProds });
                                  }}
                                  className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                  title="Delete image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-ocean-dark/70 text-white text-[9px] py-0.5 text-center font-sans">
                                  {imgIdx === 0 ? 'Cover' : `#${imgIdx + 1}`}
                                </div>
                              </div>
                            ))}

                            {/* Add Image Button */}
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-ocean-slate/20 rounded-xl hover:border-ocean-teal hover:bg-ocean-light/20 transition-all cursor-pointer text-ocean-slate hover:text-ocean-teal">
                              <Plus className="w-5 h-5 mb-1 text-ocean-teal" />
                              <span className="text-[10px] font-bold">Add Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0], (url) => {
                                      const currentImages = prod.images || (prod.image ? [prod.image] : []);
                                      const updatedImages = [...currentImages, url];
                                      const updatedProds = dbData.products.map(p => p.id === prod.id ? { 
                                        ...p, 
                                        images: updatedImages,
                                        image: updatedImages[0] || '' 
                                      } : p);
                                      saveChanges({ ...dbData, products: updatedProds });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* Manual URL Input */}
                          <div className="flex gap-2 max-w-md">
                            <input 
                              type="text" 
                              placeholder="Or paste image URL here..." 
                              id={`manual-url-prod-${prod.id}`}
                              className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.currentTarget;
                                  const url = target.value.trim();
                                  if (url) {
                                    const currentImages = prod.images || (prod.image ? [prod.image] : []);
                                    const updatedImages = [...currentImages, url];
                                    const updatedProds = dbData.products.map(p => p.id === prod.id ? { 
                                      ...p, 
                                      images: updatedImages,
                                      image: updatedImages[0] || '' 
                                    } : p);
                                    saveChanges({ ...dbData, products: updatedProds });
                                    target.value = '';
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`manual-url-prod-${prod.id}`) as HTMLInputElement;
                                const url = input?.value.trim();
                                if (url) {
                                  const currentImages = prod.images || (prod.image ? [prod.image] : []);
                                  const updatedImages = [...currentImages, url];
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { 
                                    ...p, 
                                    images: updatedImages,
                                    image: updatedImages[0] || '' 
                                  } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                  input.value = '';
                                }
                              }}
                              className="bg-ocean-teal hover:bg-ocean-dark text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>

                        {/* Features List (Comma separated) */}
                        <div className="space-y-3 border-t pt-4">
                          <h5 className="font-display text-xs font-bold text-ocean-dark">Key Specifications / Features (Comma separated lists)</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">English Features</span>
                              <input 
                                type="text" 
                                value={(prod.features?.en || []).join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, features: { ...(p.features || {}), en: list } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="e.g. Double-layer, Lightweight"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">Georgian Features</span>
                              <input 
                                type="text" 
                                value={(prod.features?.ge || []).join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, features: { ...(p.features || {}), ge: list } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="მაგ. ორშრიანი მასალა, მსუბუქი"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-ocean-slate uppercase">Russian Features</span>
                              <input 
                                type="text" 
                                value={(prod.features?.ru || []).join(', ')} 
                                onChange={(e) => {
                                  const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                  const updatedProds = dbData.products.map(p => p.id === prod.id ? { ...p, features: { ...(p.features || {}), ru: list } } : p);
                                  saveChanges({ ...dbData, products: updatedProds });
                                }}
                                className="border rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                                placeholder="например: Двухслойный ПВХ, Легкий"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: BLOGS EDITOR */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              
              {/* Category tabs */}
              <div className="flex flex-wrap items-center justify-between border-b pb-4 gap-4">
                <div className="flex gap-2">
                  {dbData.blog_categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedBlogCategory(cat.id);
                        setEditingBlogId(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedBlogCategory === cat.id
                          ? 'bg-ocean-teal/20 text-ocean-teal border border-ocean-teal/30'
                          : 'text-ocean-slate hover:bg-ocean-light/50 border border-transparent'
                      }`}
                    >
                      {cat.title[locale] || cat.title.en}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const newBlogId = `blog_${Date.now()}`;
                    const newBlog = {
                      id: newBlogId,
                      title: { en: 'New Blog Post', ge: 'ახალი ბლოგ პოსტი', ru: 'Новый блог пост' },
                      excerpt: { en: 'Write a short summary...', ge: 'მოკლე შინაარსი...', ru: 'Краткое описание...' },
                      content: { en: 'Write full content here...', ge: 'სრული ტექსტი აქ...', ru: 'Полный текст...' },
                      date: new Date().toISOString().split('T')[0],
                      readTime: '3 min',
                      author: 'Admin',
                      image: 'https://images.unsplash.com/photo-1500309722644-cf8528574a7b?auto=format&fit=crop&w=500&q=80',
                      videoUrl: ''
                    };

                    const updatedCat = dbData.blog_categories.map((cat) => {
                      if (cat.id === selectedBlogCategory) {
                        return {
                          ...cat,
                          blogs: [...cat.blogs, newBlog]
                        };
                      }
                      return cat;
                    });

                    setEditingBlogId(newBlogId);
                    saveChanges({ ...dbData, blog_categories: updatedCat });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-dark hover:bg-ocean-navy text-white text-xs font-bold px-3.5 py-2.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 text-ocean-teal" /> Write Blog
                </button>
              </div>

              {/* Blogs list in selected category */}
              <div className="space-y-4">
                {dbData.blog_categories.find(c => c.id === selectedBlogCategory)?.blogs.map((post) => (
                  <div key={post.id} className="border border-ocean-slate/10 rounded-2xl overflow-hidden shadow-sm">
                    {/* Collapsed Header */}
                    <div 
                      onClick={() => setEditingBlogId(editingBlogId === post.id ? null : post.id)}
                      className="p-4 bg-ocean-light/10 hover:bg-ocean-light/20 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.image} alt={post.title.en} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-ocean-dark">{post.title[locale] || post.title.en}</h4>
                          <span className="text-[10px] text-ocean-teal font-semibold font-sans">{post.author} | {post.date}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-ocean-slate transition-transform ${editingBlogId === post.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Expanded Editor */}
                    {editingBlogId === post.id && (
                      <div className="p-6 bg-white border-t border-ocean-slate/10 space-y-6 animate-fade-in-up">
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Author Name</label>
                            <input 
                              type="text" 
                              value={post.author} 
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, author: e.target.value } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Date (YYYY-MM-DD)</label>
                            <input 
                              type="date" 
                              value={post.date} 
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, date: e.target.value } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-ocean-slate uppercase">Read Time (e.g. 3 min)</label>
                            <input 
                              type="text" 
                              value={post.readTime} 
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, readTime: e.target.value } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="border rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col justify-end">
                            <button
                              onClick={() => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.filter(b => b.id !== post.id)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full flex items-center justify-center gap-1 text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 rounded-lg py-2.5 text-xs font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete Blog
                            </button>
                          </div>
                        </div>

                        {/* Image path */}
                        <div className="flex flex-col gap-1.5 border-t pt-4">
                          <label className="text-[10px] font-bold text-ocean-slate uppercase">Thumbnail Image URL</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={post.image} 
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, image: e.target.value } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none flex-1"
                            />
                            <label className="cursor-pointer bg-white hover:bg-ocean-light border text-[10px] font-semibold text-ocean-slate px-3 py-2 rounded-lg inline-flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0], (url) => {
                                      const updatedCat = dbData.blog_categories.map((c) => {
                                        if (c.id === selectedBlogCategory) {
                                          return {
                                            ...c,
                                            blogs: c.blogs.map(b => b.id === post.id ? { ...b, image: url } : b)
                                          };
                                        }
                                        return c;
                                      });
                                      saveChanges({ ...dbData, blog_categories: updatedCat });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Video URL */}
                        <div className="flex flex-col gap-1.5 border-t pt-4">
                          <label className="text-[10px] font-bold text-ocean-slate uppercase">Video URL (optional - YouTube or Instagram reel link)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. https://www.youtube.com/watch?v=R3L01q1BexE"
                            value={post.videoUrl || ''} 
                            onChange={(e) => {
                              const updatedCat = dbData.blog_categories.map((c) => {
                                if (c.id === selectedBlogCategory) {
                                  return {
                                    ...c,
                                    blogs: c.blogs.map(b => b.id === post.id ? { ...b, videoUrl: e.target.value } : b)
                                  };
                                }
                                return c;
                              });
                              saveChanges({ ...dbData, blog_categories: updatedCat });
                            }}
                            className="border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none w-full"
                          />
                        </div>

                        {/* Blog Titles, Excerpts, & Contents Translations */}
                        <div className="space-y-6 border-t pt-4">
                          {/* EN */}
                          <div className="space-y-2.5 border-b pb-4">
                            <span className="text-[10px] font-extrabold text-ocean-teal tracking-widest uppercase flex items-center gap-1.5">
                              <FileText className="w-4 h-4" /> English Version
                            </span>
                            <input 
                              type="text" 
                              placeholder="Blog Title (EN)" 
                              value={post.title.en}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, title: { ...b.title, en: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs font-bold"
                            />
                            <input 
                              type="text" 
                              placeholder="Short Excerpt (EN)" 
                              value={post.excerpt.en}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, excerpt: { ...b.excerpt, en: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs"
                            />
                            <textarea 
                              placeholder="Full Article Content (Markdown / Text) (EN)" 
                              value={post.content.en}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, content: { ...b.content, en: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs resize-y"
                              rows={8}
                            />
                          </div>

                          {/* GE */}
                          <div className="space-y-2.5 border-b pb-4">
                            <span className="text-[10px] font-extrabold text-ocean-teal tracking-widest uppercase flex items-center gap-1.5">
                              <FileText className="w-4 h-4" /> Georgian Version (GE)
                            </span>
                            <input 
                              type="text" 
                              placeholder="სათაური (GE)" 
                              value={post.title.ge}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, title: { ...b.title, ge: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs font-bold"
                            />
                            <input 
                              type="text" 
                              placeholder="მოკლე აღწერა (GE)" 
                              value={post.excerpt.ge}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, excerpt: { ...b.excerpt, ge: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs"
                            />
                            <textarea 
                              placeholder="სრული ბლოგის ტექსტი (GE)" 
                              value={post.content.ge}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, content: { ...b.content, ge: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs resize-y"
                              rows={8}
                            />
                          </div>

                          {/* RU */}
                          <div className="space-y-2.5">
                            <span className="text-[10px] font-extrabold text-ocean-teal tracking-widest uppercase flex items-center gap-1.5">
                              <FileText className="w-4 h-4" /> Russian Version (RU)
                            </span>
                            <input 
                              type="text" 
                              placeholder="Заголовок блога (RU)" 
                              value={post.title.ru}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, title: { ...b.title, ru: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs font-bold"
                            />
                            <input 
                              type="text" 
                              placeholder="Краткое описание (RU)" 
                              value={post.excerpt.ru}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, excerpt: { ...b.excerpt, ru: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs"
                            />
                            <textarea 
                              placeholder="Полный текст статьи (RU)" 
                              value={post.content.ru}
                              onChange={(e) => {
                                const updatedCat = dbData.blog_categories.map((c) => {
                                  if (c.id === selectedBlogCategory) {
                                    return {
                                      ...c,
                                      blogs: c.blogs.map(b => b.id === post.id ? { ...b, content: { ...b.content, ru: e.target.value } } : b)
                                    };
                                  }
                                  return c;
                                });
                                saveChanges({ ...dbData, blog_categories: updatedCat });
                              }}
                              className="w-full border rounded-lg px-2.5 py-2 text-xs resize-y"
                              rows={8}
                            />
                          </div>

                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: CORPORATE INQUIRIES */}
          {activeTab === 'inquiries' && (() => {
            const inquiriesToRender = isFirebaseConfigured 
              ? firestoreInquiries 
              : (dbData?.corporate_inquiries || []);
              
            return (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-ocean-dark">Corporate & Group Inquiries</h2>
                  <p className="font-sans text-xs text-ocean-slate mt-1">Review requests sent by teams, companies, and large groups from the Services page.</p>
                </div>

                {inquiriesToRender.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-ocean-slate/20 bg-ocean-light/10 p-12 text-center space-y-2">
                    <FileText className="w-8 h-8 text-ocean-slate/30 mx-auto" />
                    <h3 className="font-display text-sm font-bold text-ocean-dark">No inquiries yet</h3>
                    <p className="font-sans text-xs text-ocean-slate">Submissions from the corporate form on the Services page will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiriesToRender.map((inq: any) => (
                      <div 
                        key={inq.id} 
                        className="bg-white border border-ocean-slate/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="font-display text-base font-bold text-ocean-dark">{inq.name}</h4>
                            <span className="text-[10px] text-ocean-slate font-sans bg-ocean-light px-2 py-0.5 rounded-full">
                              {new Date(inq.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs font-sans text-ocean-slate">
                            <div>
                              <span className="font-semibold text-ocean-dark">Email: </span>
                              <a href={`mailto:${inq.email}`} className="text-ocean-teal hover:underline">{inq.email}</a>
                            </div>
                            {inq.phone && (
                              <div>
                                <span className="font-semibold text-ocean-dark">Phone: </span>
                                <a href={`tel:${inq.phone}`} className="text-ocean-teal hover:underline">{inq.phone}</a>
                              </div>
                            )}
                          </div>
                          <div className="bg-ocean-light/30 border border-ocean-slate/5 rounded-xl p-3.5 mt-2">
                            <p className="font-sans text-xs text-ocean-slate leading-relaxed whitespace-pre-wrap">
                              {inq.message}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this inquiry?')) {
                              if (isFirebaseConfigured && firestoreDb) {
                                try {
                                  await deleteDoc(doc(firestoreDb, 'corporate_inquiries', inq.id));
                                  setFirestoreInquiries(prev => prev.filter(x => x.id !== inq.id));
                                } catch (err) {
                                  console.error('Failed to delete Firestore doc:', err);
                                }
                              } else {
                                const updated = {
                                  ...dbData,
                                  corporate_inquiries: dbData.corporate_inquiries.filter((x: any) => x.id !== inq.id)
                                };
                                saveChanges(updated);
                              }
                            }
                          }}
                          className="rounded-xl p-2.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-100 hover:border-rose-600 transition-colors shrink-0"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        </main>
      </div>

    </div>
  );
}
