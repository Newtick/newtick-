const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAuthToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');
const { signupSchema, loginSchema } = require('../utils/validators');

function sanitizeUser(user) {
	return {
		id: user.id,
		username: user.username,
		email: user.email,
		name: user.name,
		avatarUrl: user.avatarUrl,
		bio: user.bio,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

async function signup(req, res, next) {
	try {
		const parsed = signupSchema.parse(req.body);
		const existing = await User.findOne({
			$or: [{ email: parsed.email }, { username: parsed.username }],
		}).lean();
		if (existing) {
			return res.status(409).json({ error: 'Email or username already in use' });
		}

		const passwordHash = await bcrypt.hash(parsed.password, 12);
		const user = await User.create({
			username: parsed.username,
			email: parsed.email,
			name: parsed.name,
			passwordHash,
		});

		const token = signAuthToken({ userId: user.id });
		setAuthCookie(res, token);

		return res.status(201).json({ user: sanitizeUser(user), token });
	} catch (err) {
		return next(err);
	}
}

async function login(req, res, next) {
	try {
		const parsed = loginSchema.parse(req.body);
		const identifier = parsed.emailOrUsername.toLowerCase();
		const user = await User.findOne({
			$or: [{ email: identifier }, { username: identifier }],
		}).select('+passwordHash');

		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const valid = await user.comparePassword(parsed.password);
		if (!valid) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		const token = signAuthToken({ userId: user.id });
		setAuthCookie(res, token);

		return res.json({ user: sanitizeUser(user), token });
	} catch (err) {
		return next(err);
	}
}

async function logout(req, res) {
	clearAuthCookie(res);
	return res.json({ success: true });
}

async function me(req, res, next) {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		return res.json({ user: sanitizeUser(user) });
	} catch (err) {
		return next(err);
	}
}

module.exports = { signup, login, logout, me }; 