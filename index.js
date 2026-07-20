const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const cleanFileName = file.originalname
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .replace(/_{2,}/g, '_');
        cb(null, `${Date.now()}_${cleanFileName}`);
    }
});

const upload = multer({ storage: storage });

// Database path
const dbPath = path.join(__dirname, 'src/data/db.json');

function readDB() {
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

function writeDB(data) {
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
        res.status(400).json({ error: 'Invalid payload' });
    }
});

// POST for uploading images/files
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
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
