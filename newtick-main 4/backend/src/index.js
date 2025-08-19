const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectToDatabase } = require('./config/database');
const { env } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({
	origin: env.CORS_ORIGIN,
	credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', service: 'newtick-backend' });
});

app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const start = async () => {
	await connectToDatabase(env.MONGODB_URI);
	app.listen(env.PORT, () => {
		console.log(`Server running on http://localhost:${env.PORT}`);
	});
};

start().catch((err) => {
	console.error('Failed to start server', err);
	process.exit(1);
}); 