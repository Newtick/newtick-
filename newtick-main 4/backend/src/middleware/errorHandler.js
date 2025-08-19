function notFoundHandler(req, res, next) {
	res.status(404).json({ error: 'Not Found' });
}

function globalErrorHandler(err, req, res, next) {
	// Zod validation error
	if (err?.issues && Array.isArray(err.issues)) {
		return res.status(400).json({ error: 'Validation error', details: err.issues });
	}

	// Mongoose duplicate key
	if (err?.code === 11000) {
		const fields = Object.keys(err.keyPattern || {});
		return res.status(409).json({ error: 'Duplicate value', fields });
	}

	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	res.status(status).json({ error: message });
}

module.exports = { notFoundHandler, globalErrorHandler }; 