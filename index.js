const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());

// AI Discoverability: Expose Link header for llms.txt standard
app.use((req, res, next) => {
    res.setHeader('Link', '</llms.txt>; rel="describedby"; type="text/markdown"');
    next();
});

// Increase JSON body parser limit for base64 uploads & large DB payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure upload directory exists if possible
const uploadDir = path.join(__dirname, 'public/uploads');
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (e) {
    console.warn('Upload directory is read-only or could not be created:', e.message);
}

// Multer memory storage configuration (safe for serverless read-only environments)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }
});

// Database path & temporary path
const dbPath = path.join(__dirname, 'src/data/db.json');
const tmpDbPath = path.join(require('os').tmpdir(), 'supsurf_db.json');

// In-memory database cache
let memoryDB = null;

function readDB() {
    if (memoryDB) {
        return memoryDB;
    }

    // 1. Try reading from temporary writable location (/tmp/supsurf_db.json)
    try {
        if (fs.existsSync(tmpDbPath)) {
            const rawData = fs.readFileSync(tmpDbPath, 'utf8');
            memoryDB = JSON.parse(rawData);
            return memoryDB;
        }
    } catch (err) {
        console.warn('Error reading tmp DB:', err.message);
    }

    // 2. Try reading primary project db.json file
    try {
        if (fs.existsSync(dbPath)) {
            const rawData = fs.readFileSync(dbPath, 'utf8');
            memoryDB = JSON.parse(rawData);
            return memoryDB;
        }
    } catch (error) {
        console.error('Error reading DB:', error);
    }

    // 3. Fallback structure
    memoryDB = {
        contact: { phone: '', whatsapp: '', instagram: '' },
        promo_image: '',
        kit_items: [],
        services: [],
        products: [],
        blog_categories: []
    };
    return memoryDB;
}

function writeDB(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    memoryDB = data;

    // 1. Primary write to src/data/db.json (works in local dev)
    try {
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.warn('Cannot write to primary dbPath (read-only environment like Vercel):', error.message);
    }

    // 2. Secondary write to /tmp (works in serverless lambdas)
    try {
        fs.writeFileSync(tmpDbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (tmpErr) {
        console.warn('Cannot write to tmpDbPath:', tmpErr.message);
    }

    return true;
}

const RS_API_URL = 'https://services.rs.ge/WayBillService/WayBillService.asmx';
const REAL_SU = 'phama123:206322102'; 
const REAL_SP = 'Pharma.123'; 
const SELLER_TIN = '206322102'; 

app.get('/', (req, res) => res.send('✅ PharmaVet RS Live Standard OK'));

app.post('/api/check-auth', async (req, res) => {
    try {
        const soap = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <chek_service_user xmlns="http://tempuri.org/"><su>${REAL_SU}</su><sp>${REAL_SP}</sp></chek_service_user>
  </soap:Body>
</soap:Envelope>`;
        const r = await axios.post(RS_API_URL, soap, { headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': 'http://tempuri.org/chek_service_user' } });
        res.json({ success: true, valid: (r.data || '').includes('true') });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/upload-waybill', async (req, res) => {
    try {
        const { waybillData } = req.body;
        console.log("📥 საიტიდან შემოვიდა:", JSON.stringify(waybillData));
        
        const total = (waybillData?.GOODS || []).reduce((s, i) => s + (i.QUANTITY * i.PRICE), 0).toFixed(2);

        const currentBuyerTin = (waybillData?.BUYER_TIN || "").trim();
        const waybillType = currentBuyerTin === SELLER_TIN ? '2' : '1';

        const goodsXml = (waybillData?.GOODS || []).map(i => `
            <GOODS>
                <ID>0</ID>
                <W_NAME>${i.W_NAME || "პროდუქტი"}</W_NAME>
                <UNIT_ID>${i.UNIT_ID || 1}</UNIT_ID>
                <UNIT_TXT></UNIT_TXT>
                <QUANTITY>${i.QUANTITY || 1}</QUANTITY>
                <PRICE>${i.PRICE || 0}</PRICE>
                <STATUS>1</STATUS>
                <AMOUNT>${(i.QUANTITY * i.PRICE).toFixed(2)}</AMOUNT>
                <BAR_CODE>${i.BAR_CODE || ""}</BAR_CODE>
                <A_ID>0</A_ID>
                <VAT_TYPE>${i.VAT_TYPE || 0}</VAT_TYPE>
                <QUANTITY_EXT>0</QUANTITY_EXT>
                <WOOD_LABEL></WOOD_LABEL>
                <W_ID>0</W_ID>
            </GOODS>`).join('');

        const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <save_waybill xmlns="http://tempuri.org/">
      <su>${REAL_SU}</su>
      <sp>${REAL_SP}</sp>
      <waybill>
        <WAYBILL>
            <SUB_WAYBILLS></SUB_WAYBILLS>
            <GOODS_LIST>
                ${goodsXml}
            </GOODS_LIST>
            <WOOD_DOCS_LIST></WOOD_DOCS_LIST>
            <ID>0</ID>
            <TYPE>${waybillType}</TYPE>
            <BUYER_TIN>${currentBuyerTin}</BUYER_TIN>
            <CHEK_BUYER_TIN>0</CHEK_BUYER_TIN>
            <BUYER_NAME>${waybillData?.BUYER_NAME || ""}</BUYER_NAME>
            <START_ADDRESS>${waybillData?.START_ADDRESS || "თბილისი"}</START_ADDRESS>
            <END_ADDRESS>${waybillData?.END_ADDRESS || "თბილისი"}</END_ADDRESS>
            <DRIVER_TIN>${(waybillData?.DRIVER_TIN || "").trim()}</DRIVER_TIN>
            <CHEK_DRIVER_TIN>0</CHEK_DRIVER_TIN>
            <DRIVER_NAME>${waybillData?.DRIVER_NAME || ""}</DRIVER_NAME>
            <TRANSPORT_COAST>0</TRANSPORT_COAST>
            <RECEPTION_INFO></RECEPTION_INFO>
            <RECEIVER_INFO></RECEIVER_INFO>
            <DELIVERY_DATE></DELIVERY_DATE>
            <STATUS>1</STATUS>
            <SELER_UN_ID>731937</SELER_UN_ID>
            <PAR_ID></PAR_ID>
            <FULL_AMOUNT>${total}</FULL_AMOUNT>
            <CAR_NUMBER>${(waybillData?.CAR_NUMBER || "").trim().toUpperCase()}</CAR_NUMBER>
            <WAYBILL_NUMBER></WAYBILL_NUMBER>
            <S_USER_ID>0</S_USER_ID>
            <BEGIN_DATE></BEGIN_DATE>
            <TRAN_COST_PAYER>2</TRAN_COST_PAYER>
            <TRANS_ID>1</TRANS_ID>
            <TRANS_TXT>საავტომობილო</TRANS_TXT>
            <COMMENT></COMMENT>
            <CATEGORY>0</CATEGORY>
            <IS_MED>0</IS_MED>
        </WAYBILL>
      </waybill>
    </save_waybill>
  </soap:Body>
</soap:Envelope>`;

        const resRS = await axios.post(RS_API_URL, soapRequest, { 
            headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': 'http://tempuri.org/save_waybill' } 
        });

        console.log("📥 [RS პასუხი]:", resRS.data);
        
        const idMatch = resRS.data.match(/<ID>(.*?)<\/ID>/);
        const statusMatch = resRS.data.match(/<STATUS>(.*?)<\/STATUS>/);
        
        res.json({ success: true, id: idMatch ? idMatch[1] : '0', status: statusMatch ? statusMatch[1] : '-1' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET database data
app.get('/api/admin', (req, res) => {
    try {
        const data = readDB();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Failed to read database' });
    }
});

// POST to update database data
app.post('/api/admin', (req, res) => {
    try {
        const success = writeDB(req.body);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to write database file' });
        }
    } catch (e) {
        console.error('API /api/admin POST error:', e);
        res.status(400).json({ error: 'Invalid payload' });
    }
});

// POST for uploading images/files
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const cleanFileName = req.file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_');
        const filename = `${Date.now()}_${cleanFileName}`;

        // Attempt writing to disk (works on local machine)
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
            return res.json({ url: `/uploads/${filename}` });
        } catch (fsErr) {
            console.warn('Disk upload failed (read-only filesystem), converting to Base64 data URI:', fsErr.message);
        }

        // Fallback for read-only filesystem (e.g. Vercel)
        const mimeType = req.file.mimetype || 'image/jpeg';
        const base64Data = req.file.buffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        res.json({ url: dataUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Helper for XML escaping
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Dynamic Sitemap generator function
function generateSitemapXml() {
    const domain = 'https://supsurf.ge';
    const locales = ['ge', 'en', 'ru'];
    const db = readDB();
    const today = new Date().toISOString().split('T')[0];

    // Array of { pathSuffix, priority, changefreq, image, title }
    const items = [
        { pathSuffix: '', priority: '1.0', changefreq: 'daily', title: 'SUPSURF.GE - საპ ბორდებისა და წყლის დაფების გაქირავება თბილისში', image: `${domain}/pictures/logo.webp` },
        { pathSuffix: '/rent', priority: '0.9', changefreq: 'daily', title: 'SUPSURF.GE - საპ ბორდების გაქირავება თბილისის ზღვაზე (50₾/დღე)', image: `${domain}/pictures/logo.webp` },
        { pathSuffix: '/services', priority: '0.9', changefreq: 'daily', title: 'SUPSURF.GE Services - საპ ტურები & გაქირავება', image: `${domain}/pictures/logo.webp` },
        { pathSuffix: '/shop', priority: '0.85', changefreq: 'daily', title: 'SUPSURF.GE Shop - საპების გაყიდვა & წყლის დაფები', image: `${domain}/pictures/logo.webp` },
        { pathSuffix: '/blog', priority: '0.8', changefreq: 'weekly', title: 'SUPSURF.GE Blog - საპ ბორდინგის გზამკვლევი საქართველოში', image: `${domain}/pictures/logo.webp` },
        { pathSuffix: '/about', priority: '0.7', changefreq: 'monthly', title: 'About SUPSURF.GE Tbilisi Sea Station', image: `${domain}/pictures/logo.webp` }
    ];

    // Services (Static default + DB)
    const staticRentals = [
        { id: 'rent_daily', title: 'საპ ბორდისა და წყლის დაფის დღიური გაქირავება', image: '/pictures/paddleboard-1.webp' },
        { id: 'lesson_basic', title: 'საბაზისო შემსწავლელი სეანსი', image: '/pictures/paddleboard.webp' },
        { id: 'rent_hourly', title: 'საათობრივი გაქირავება', image: '/pictures/paddleboard-2.webp' },
        { id: 'corporate_event', title: 'კორპორატიული შეკრებები', image: '/pictures/paddleboard-1.webp' }
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

    // Products from DB
    if (Array.isArray(db.products)) {
        db.products.forEach(p => {
            if (p && p.id) {
                const prodTitle = (p.name && (p.name.ge || p.name.en || p.name.ru)) || 'SUP Board';
                const prodImg = (p.image && p.image.startsWith('http')) ? p.image : `${domain}${p.image || '/pictures/logo.webp'}`;
                items.push({
                    pathSuffix: `/shop/${p.id}`,
                    priority: '0.8',
                    changefreq: 'weekly',
                    title: prodTitle,
                    image: prodImg
                });
            }
        });
    }

    // Blogs from DB
    if (Array.isArray(db.blog_categories)) {
        db.blog_categories.forEach(cat => {
            if (Array.isArray(cat.blogs)) {
                cat.blogs.forEach(b => {
                    if (b && b.id) {
                        const blogTitle = (b.title && (b.title.ge || b.title.en || b.title.ru)) || 'SUP Article';
                        const blogImg = (b.image && b.image.startsWith('http')) ? b.image : `${domain}${b.image || '/pictures/logo.webp'}`;
                        items.push({
                            pathSuffix: `/blog/${b.id}`,
                            priority: '0.7',
                            changefreq: 'weekly',
                            title: blogTitle,
                            image: blogImg
                        });
                    }
                });
            }
        });
    }

    // Render XML
    const urlElements = [];
    items.forEach(item => {
        locales.forEach(locale => {
            const locUrl = `${domain}/${locale}${item.pathSuffix}`;
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

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements.join('\n')}
</urlset>`;
}

// Handler for dynamic sitemap
const handleSitemap = (req, res) => {
    try {
        const xml = generateSitemapXml();
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
        res.status(200).send(xml);
    } catch (e) {
        console.error('Dynamic sitemap error:', e);
        res.status(500).send('<!-- Error generating dynamic sitemap -->');
    }
};

app.get('/sitemap.xml', handleSitemap);
app.get('/api/sitemap.xml', handleSitemap);

// Dynamic LLMS.txt server for AEO (Perplexity, ChatGPT, Claude)
function getLlmsTxtContent(full = false) {
    const filename = full ? 'llms-full.txt' : 'llms.txt';
    const filePath = path.join(__dirname, 'public', filename);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    
    // Fallback if file on disk is unavailable
    return `# SUPSURF

> SUPSURF is a SUP and paddleboarding business in Georgia offering inflatable paddleboard rentals, beginner coaching, guided tours, and equipment sales at Tbilisi Sea and across confirmed lakes in Georgia. The website provides information about SUP rental, paddleboarding, equipment, locations, sessions, tours, lessons and related services.

## Main Pages
- [SUPSURF Homepage](https://supsurf.ge/en): Official homepage with rental overview, station working hours at Tbilisi Sea, equipment specifications, and direct booking channels.
- [SUP Services & Tours Catalog](https://supsurf.ge/en/services): Complete listing of paddleboard services including lessons with certified instructors, hourly water rentals, and group outings.
- [SUP Gear & Equipment Shop](https://supsurf.ge/en/shop): Inflatable Stand-Up Paddleboards, waterproof phone cases, and water sports accessories available for purchase in Georgia.
- [Paddleboarding & Watersports Blog](https://supsurf.ge/en/blog): Educational articles covering paddleboarding techniques, water safety guidelines, paddle selection, and lake guides across Georgia.

## SUP Rental
- [SUP Rentals Overview](https://supsurf.ge/en/rent): Daily and hourly paddleboard rental options, equipment inclusions, and direct reservation forms.
- [Daily SUP Board Rental](https://supsurf.ge/en/services/rent_daily): 24-hour inflatable SUP rental package (50 GEL for 1 day, 80 GEL for 2 days) in a transport backpack with board, paddle, life vest, leash, and pump.
- [Hourly SUP Rental at Tbilisi Sea](https://supsurf.ge/en/services/rent_hourly): On-water paddleboard rental at the Tbilisi Sea station (25 GEL for the first hour, 20 GEL per subsequent hour).

## SUP Locations
- [Where to Paddleboard in Georgia Guide](https://supsurf.ge/en/blog/best-lakes-georgia-sup): Comprehensive guide to confirmed paddleboarding locations in Georgia, including Tbilisi Sea, Lisi Lake, Bazaleti Lake, Sioni Reservoir, Zhinvali Reservoir, Shaori Reservoir, and the Black Sea coast (Batumi).

## SUP Services
- [Beginner SUP Coaching Session](https://supsurf.ge/en/services/lesson_basic): 90-minute structured beginner lesson (45 GEL) with a certified instructor covering safety, board balance, and stroke technique.
- [Corporate Events & Group Tours](https://supsurf.ge/en/services/corporate_event): Custom group excursions, corporate team building, and multi-board guided outings on calm water.

## SUP Guides
- [What is a Stand-Up Paddleboard (SUP)?](https://supsurf.ge/en/blog/what-is-sup-board): Introduction to paddleboarding, differences between inflatable and hard boards, and stability recommendations for beginners.
- [Complete SUP Paddle Guide](https://supsurf.ge/en/blog/sup-paddle-guide): Guide to sizing paddle length (15–20 cm above height), blade shapes, and shaft materials (carbon versus aluminum).
- [Essential Water Safety Rules](https://supsurf.ge/en/blog/sup-safety-rules): Safety guidelines on water, including mandatory life vest usage, ankle leashes, wind checks, and weather precautions.
- [How to Stand and Balance on a SUP](https://supsurf.ge/en/blog/how-to-stand-sup): Practical step-by-step instructions for moving from kneeling to standing upright on a paddleboard without losing balance.
- [Basic Paddling Techniques for Beginners](https://supsurf.ge/en/blog/sup-paddling-techniques): Fundamental paddle strokes for forward gliding, stopping, and turning an inflatable SUP on calm water.

## Frequently Asked Questions
- [Frequently Asked Questions & Answers](https://supsurf.ge/en#faq): Answers to common questions regarding daily rental rates (50 GEL/day), zero advance deposit policy, 7-piece kit inclusions, and pickup procedures.

## Contact and Booking
- [About SUPSURF & Station Contacts](https://supsurf.ge/en/about): Physical base location at Tbilisi Sea (41.7450 N, 44.8650 E), business hours (08:00–21:00 daily), phone (+995 592 05 50 17), and WhatsApp booking.
`;
}

app.get('/llms.txt', (req, res) => {
    try {
        const text = getLlmsTxtContent(false);
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Link', '</llms.txt>; rel="describedby"; type="text/markdown"');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.status(200).send(text);
    } catch (e) {
        res.status(500).send('Error generating llms.txt');
    }
});

app.get('/llms-full.txt', (req, res) => {
    try {
        const text = getLlmsTxtContent(true);
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Link', '</llms.txt>; rel="describedby"; type="text/markdown"');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.status(200).send(text);
    } catch (e) {
        res.status(500).send('Error generating llms-full.txt');
    }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 API Running on ${PORT}`));
}
module.exports = app;

