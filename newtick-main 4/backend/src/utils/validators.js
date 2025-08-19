const { z } = require('zod');

const usernameSchema = z
	.string()
	.min(3)
	.max(30)
	.regex(/^[a-zA-Z0-9_]+$/, 'Username can contain letters, numbers, and underscores only')
	.transform((v) => v.toLowerCase());

const signupSchema = z.object({
	username: usernameSchema,
	email: z.string().email().transform((v) => v.toLowerCase()),
	password: z.string().min(8),
	name: z.string().max(50).optional(),
});

const loginSchema = z.object({
	emailOrUsername: z.string().min(3),
	password: z.string().min(8),
});

module.exports = { signupSchema, loginSchema }; 