const fs = require('fs');
const path = require('path');

const domain = 'https://supsurf.ge';
const locales = ['ge', 'en', 'ru'];
const staticPaths = ['', '/rent', '/services', '/shop', '/blog', '/about'];

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateSitemap() {
    try {
        const dbPath = path.join(__dirname, '../src/data/db.json');
        let db = { products: [], services: [], blog_categories: [] };
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }

        const items = [];

        // 1. Static Paths
        for (const p of staticPaths) {
            items.push({
                pathSuffix: p,
                priority: p === '' ? '1.0' : '0.9',
                changefreq: 'daily',
                title: 'SUPSURF.GE - საპ ბორდების გაქირავება თბილისში | SUP Board Rental Georgia',
                image: `${domain}/pictures/logo.webp`
            });
        }

        // 2. Services (including static rental items)
        const staticRentals = [
            { id: 'rent_daily', title: 'საპ ბორდისა და წყლის დაფის დღიური გაქირავება', image: '/pictures/paddleboard-1.webp' },
            { id: 'lesson_basic', title: 'საბაზისო შემსწავლელი სეანსი ინსტრუქტორთან', image: '/pictures/paddleboard.webp' },
            { id: 'rent_hourly', title: 'საათობრივი გაქირავება თბილისის ზღვაზე', image: '/pictures/paddleboard-2.webp' },
            { id: 'corporate_event', title: 'კორპორატიული შეკრებები და ტურები', image: '/pictures/paddleboard-1.webp' }
        ];
        const serviceMap = new Map();
        staticRentals.forEach(s => serviceMap.set(s.id, s));
        if (Array.isArray(db.services)) {
            db.services.forEach(s => {
                if (s && s.id) {
                    serviceMap.set(s.id, {
                        id: s.id,
                        title: (s.name && (s.name.ge || s.name.en)) || s.id,
                        image: s.image || '/pictures/logo.webp'
                    });
                }
            });
        }
        serviceMap.forEach(s => {
            const fullImg = s.image && s.image.startsWith('http') ? s.image : `${domain}${s.image || '/pictures/logo.webp'}`;
            items.push({
                pathSuffix: `/services/${s.id}`,
                priority: '0.85',
                changefreq: 'weekly',
                title: s.title,
                image: fullImg
            });
        });

        // 3. Products
        if (Array.isArray(db.products)) {
            for (const prod of db.products) {
                if (prod && prod.id) {
                    const prodTitle = (prod.name && (prod.name.ge || prod.name.en || prod.name.ru)) || 'SUP Board';
                    const prodImg = (prod.image && prod.image.startsWith('http')) ? prod.image : `${domain}${prod.image || '/pictures/logo.webp'}`;
                    items.push({
                        pathSuffix: `/shop/${prod.id}`,
                        priority: '0.8',
                        changefreq: 'weekly',
                        title: prodTitle,
                        image: prodImg
                    });
                }
            }
        }

        // 4. Blogs
        if (Array.isArray(db.blog_categories)) {
            for (const cat of db.blog_categories) {
                if (cat.blogs) {
                    for (const post of cat.blogs) {
                        if (post && post.id) {
                            const blogTitle = (post.title && (post.title.ge || post.title.en || post.title.ru)) || 'SUP Article';
                            const blogImg = (post.image && post.image.startsWith('http')) ? post.image : `${domain}${post.image || '/pictures/logo.webp'}`;
                            items.push({
                                pathSuffix: `/blog/${post.id}`,
                                priority: '0.7',
                                changefreq: 'weekly',
                                title: blogTitle,
                                image: blogImg
                            });
                        }
                    }
                }
            }
        }

        const today = new Date().toISOString().split('T')[0];
        const urlElements = [];

        items.forEach(item => {
            locales.forEach(loc => {
                const locUrl = `${domain}/${loc}${item.pathSuffix}`;
                const geUrl = `${domain}/ge${item.pathSuffix}`;
                const enUrl = `${domain}/en${item.pathSuffix}`;
                const ruUrl = `${domain}/ru${item.pathSuffix}`;

                urlElements.push(`  <url>
    <loc>${escapeXml(locUrl)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ka" href="${escapeXml(geUrl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="ru" href="${escapeXml(ruUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(geUrl)}" />
    <image:image>
      <image:loc>${escapeXml(item.image)}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
    </image:image>
  </url>`);
            });
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements.join('\n')}
</urlset>`;

        const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
        fs.writeFileSync(sitemapPath, xml, 'utf8');
        console.log(`✅ Dynamically generated sitemap with ${urlElements.length} URLs at ${sitemapPath}`);
    } catch (err) {
        console.error('Failed to generate sitemap:', err);
    }
}

generateSitemap();

