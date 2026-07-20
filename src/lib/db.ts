import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export interface DBData {
  contact: {
    phone: string;
    whatsapp: string;
    instagram: string;
  };
  promo_image: string;
  logo?: string;
  hero_video_url?: string;
  lifestyle_video_url?: string;
  promo_title?: Record<string, string>;
  promo_subtitle?: Record<string, string>;
  kit_items: Array<{
    key: string;
    image: string;
    title: Record<string, string>;
    desc: Record<string, string>;
  }>;
  services: Array<{
    id: string;
    name: Record<string, string>;
    location: Record<string, string>;
    price: string;
    duration: Record<string, string>;
    image: string;
    images?: string[];
    desc: Record<string, string>;
    inclusions: Record<string, string[]>;
  }>;
  products: Array<{
    id: string;
    name: Record<string, string>;
    category: Record<string, string>;
    condition: Record<string, string>;
    price: string;
    rating: number;
    image: string;
    images?: string[];
    desc: Record<string, string>;
    features?: Record<string, string[]>;
  }>;
  blog_categories: Array<{
    id: string;
    title: Record<string, string>;
    blogs: Array<{
      id: string;
      title: Record<string, string>;
      excerpt: Record<string, string>;
      content: Record<string, string>;
      date: string;
      readTime: string;
      author: string;
      image: string;
      videoUrl?: string;
    }>;
  }>;
  corporate_inquiries?: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
  }>;
}

export function readDB(): DBData {
  try {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading DB:', error);
    return {
      contact: { phone: '', whatsapp: '', instagram: '' },
      promo_image: '',
      kit_items: [],
      services: [],
      products: [],
      blog_categories: []
    };
  }
}

export function writeDB(data: DBData): boolean {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
}
