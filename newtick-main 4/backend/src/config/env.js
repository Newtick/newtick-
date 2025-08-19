const { z } = require('zod');

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	PORT: z.coerce.number().default(5000),
	CORS_ORIGIN: z.string().default('http://localhost:3000'),
	COOKIE_DOMAIN: z.string().optional().nullable().transform((v) => v || undefined),
	COOKIE_SECURE: z.coerce.boolean().default(false),
	MONGODB_URI: z.string().url().or(z.string().startsWith('mongodb://')).default('mongodb://127.0.0.1:27017/newtick'),
	JWT_SECRET: z.string().min(24, 'JWT_SECRET must be a reasonably long random string'),
	JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
	throw new Error('Invalid environment configuration');
}

const env = parsed.data;

module.exports = { env }; 