const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./config/db')
require('dotenv').config();

// Security middlewares
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Validate required environment variables before anything else
const validateEnv = require('./config/validateEnv');
validateEnv();

const app = express();

// Configure CORS: set `CORS_ALLOWED_ORIGINS` as a comma-separated list of allowed origins.
// If not set, defaults to permissive CORS for development convenience.
const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS || '';
if (allowedOriginsEnv.trim()) {
	const allowedOrigins = allowedOriginsEnv.split(',').map(s => s.trim()).filter(Boolean);
	const corsOptions = {
		origin: function (origin, callback) {
			// Allow non-browser requests (e.g., curl, server-to-server) with no origin
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true
	};
	app.use(cors(corsOptions));
} else {
	app.use(cors());
}

// Apply security headers
// Disable Helmet's default CORP so browser-loaded images from the Vite dev server can render.
app.use(helmet({
	crossOriginResourcePolicy: false
}));

// Rate limiter: basic global limits suitable as a default for production
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // limit each IP to 200 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
	setHeaders: (res) => {
		res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
	}
}));

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminContactRoutes = require('./routes/adminContactRoutes');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/contact', adminContactRoutes);

const PORT = process.env.PORT || 5000;
// Startup logging: environment, port, and CORS origins
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('CORS allowed origins:', allowedOriginsEnv || 'ALL (development)');

// Serve frontend build if present (assumes frontend build output at ../frontend/dist)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
	app.use(express.static(frontendDistPath));
	// SPA fallback
	app.get('*', (req, res) => {
		res.sendFile(path.join(frontendDistPath, 'index.html'));
	});
	console.log('Serving frontend from:', frontendDistPath);
} else {
	console.log('No frontend build found at', frontendDistPath);
}

// Healthcheck endpoint
app.get('/health', async (req, res) => {
	try {
		// lightweight DB check
		await db.query('SELECT 1');
		res.json({ status: 'ok', db: 'ok' });
	} catch (err) {
		res.status(503).json({ status: 'fail', db: 'unavailable' });
	}
});

app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));