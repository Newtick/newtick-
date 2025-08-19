const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signAuthToken(payload, options = {}) {
	return jwt.sign(payload, env.JWT_SECRET, {
		expiresIn: env.JWT_EXPIRES_IN,
		...options,
	});
}

function verifyAuthToken(token) {
	return jwt.verify(token, env.JWT_SECRET);
}

function setAuthCookie(res, token) {
	const isProd = env.NODE_ENV === 'production';
	res.cookie('token', token, {
		httpOnly: true,
		secure: env.COOKIE_SECURE || isProd,
		sameSite: env.COOKIE_SECURE || isProd ? 'none' : 'lax',
		domain: env.COOKIE_DOMAIN,
		path: '/',
		maxAge: 1000 * 60 * 60 * 24 * 7,
	});
}

function clearAuthCookie(res) {
	res.clearCookie('token', { path: '/' });
}

module.exports = { signAuthToken, verifyAuthToken, setAuthCookie, clearAuthCookie }; 