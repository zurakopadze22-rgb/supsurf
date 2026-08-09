const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());

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

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 API Running on ${PORT}`));
}
module.exports = app;

