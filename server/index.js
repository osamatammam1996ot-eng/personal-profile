import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const app = express();
const PORT = 3001;

// ─── Directories ──────────────────────────────────────────────────────────────
const DATA_DIR = join(__dirname, 'data');
const UPLOADS_DIR = join(__dirname, 'uploads');
const CMS_FILE = join(DATA_DIR, 'cms.json');

// Ensure directories exist
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Multer for file uploads ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeName = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
    cb(null, safeName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readCmsData() {
  if (!existsSync(CMS_FILE)) return null;
  try {
    const raw = readFileSync(CMS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCmsData(data) {
  writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// ─── Authentication ───────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { password } = req.body;
  
  if (!password || !ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Invalid password or configuration missing' });
  }

  try {
    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (match) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    console.error('Bcrypt error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// ─── API Routes ───────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'local' });
});

// GET CMS data
app.get('/api/cms/data', (_req, res) => {
  try {
    const data = readCmsData();
    res.json({ data: data ?? null });
  } catch (e) {
    console.error('CMS GET error:', e);
    res.status(500).json({ error: `Failed to retrieve CMS data: ${e}` });
  }
});

// PUT CMS data
app.put('/api/cms/data', authenticateToken, (req, res) => {
  try {
    const body = req.body;
    body.updatedAt = new Date().toISOString();
    writeCmsData(body);
    console.log('[CMS] Data saved successfully');
    res.json({ success: true, updatedAt: body.updatedAt });
  } catch (e) {
    console.error('CMS PUT error:', e);
    res.status(500).json({ error: `Failed to save CMS data: ${e}` });
  }
});

// POST upload image
app.post('/api/cms/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided in form data' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    console.log('[CMS] Image uploaded:', req.file.filename);
    res.json({ url: publicUrl, filename: req.file.filename });
  } catch (e) {
    console.error('Image upload error:', e);
    res.status(500).json({ error: `Image upload failed: ${e}` });
  }
});

// DELETE uploaded image
app.delete('/api/cms/upload/:filename', authenticateToken, (req, res) => {
  try {
    const filepath = join(UPLOADS_DIR, req.params.filename);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
      console.log('[CMS] Image deleted:', req.params.filename);
    }
    res.json({ success: true });
  } catch (e) {
    console.error('Image delete error:', e);
    res.status(500).json({ error: `Delete failed: ${e}` });
  }
});

// ─── Frontend Static Serving ─────────────────────────────────────────────────────
const DIST_DIR = join(__dirname, '../dist');
app.use(express.static(DIST_DIR));

// Fallback for React Router (SPA)
app.get(/.*/, (req, res) => {
  const indexPath = join(DIST_DIR, 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built. Run "npm run build" first.');
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────┐');
  console.log(`  │  CMS Backend Server running on port ${PORT}          │`);
  console.log('  │                                                 │');
  console.log(`  │  Local:   http://localhost:${PORT}                 │`);
  console.log(`  │  Health:  http://localhost:${PORT}/api/health       │`);
  console.log('  │                                                 │');
  console.log('  │  Endpoints:                                     │');
  console.log('  │    GET  /api/cms/data      Read CMS content     │');
  console.log('  │    PUT  /api/cms/data      Save CMS content     │');
  console.log('  │    POST /api/cms/upload    Upload image          │');
  console.log('  │    DEL  /api/cms/upload/:f Delete image          │');
  console.log('  └─────────────────────────────────────────────────┘');
  console.log('');
  
  if (existsSync(CMS_FILE)) {
    console.log('  ✓ Existing CMS data found at:', CMS_FILE);
  } else {
    console.log('  ℹ No CMS data file yet — will be created on first save');
  }
  console.log('');
});
