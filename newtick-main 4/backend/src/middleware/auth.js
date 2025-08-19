const { verifyAuthToken } = require('../utils/jwt');

function getTokenFromRequest(req) {
	const bearer = req.headers.authorization;
	if (bearer && bearer.startsWith('Bearer ')) {
		return bearer.substring('Bearer '.length);
	}
	if (req.cookies && req.cookies.token) {
		return req.cookies.token;
	}
	return null;
}

function requireAuth(req, res, next) {
	try {
		const token = getTokenFromRequest(req);
		if (!token) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		const decoded = verifyAuthToken(token);
		req.userId = decoded.userId;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}

module.exports = { requireAuth }; 