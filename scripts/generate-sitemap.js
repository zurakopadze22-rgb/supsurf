const fs = require('fs');
const path = require('path');

const domain = 'https://www.supsurf.ge';
const locales = ['en', 'ge', 'ru'];
const staticPaths = ['', '/shop', '/services', '/blog', '/about'];

function generateSitemap() {
    try {
        const dbPath = path.join(__dirname, '../src/data/db.json');
        let db = { products: [], services: [], blog_categories: [] };
        if (fs.existsSync(dbPath)) {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }

        const urls = [];

        // 1. Static Paths
        for (const locale of locales) {
            for (const p of staticPaths) {
                urls.push(`${domain}/${locale}${p}`);
            }
        }

        // 2. Products
        if (db.products) {
            for (const prod of db.products) {
                for (const locale of locales) {
                    urls.push(`${domain}/${locale}/shop/${prod.id}`);
                }
            }
        }

        // 3. Services (including static rental items)
        const staticRentals = [
            'sup_allround', 'sup_touring', 'surf_soft', 'surf_hard', 'wingfoil'
        ];
        const serviceIds = new Set(staticRentals);
        if (db.services) {
            for (const srv of db.services) {
                serviceIds.add(srv.id);
            }
        }
        for (const id of serviceIds) {
            for (const locale of locales) {
                urls.push(`${domain}/${locale}/services/${id}`);
            }
        }

        // 4. Blogs
        if (db.blog_categories) {
            for (const cat of db.blog_categories) {
                if (cat.blogs) {
                    for (const post of cat.blogs) {
                        for (const locale of locales) {
                            urls.push(`${domain}/${locale}/blog/${post.id}`);
                        }
                    }
                }
            }
        }

        // Generate XML with Image Sitemap Namespace
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('/blog/') || url.includes('/shop/') || url.includes('/services/') ? '0.7' : '1.0'}</priority>
    <image:image>
      <image:loc>${domain}/pictures/logo.webp</image:loc>
      <image:title>supsurf.ge - SUP Board Rental &amp; Sales Georgia</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

        const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
        fs.writeFileSync(sitemapPath, xml, 'utf8');
        console.log(`✅ Dynamically generated sitemap with ${urls.length} URLs at ${sitemapPath}`);
    } catch (err) {
        console.error('Failed to generate sitemap:', err);
    }
}

generateSitemap();
