const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		name: {
			type: String,
			trim: true,
			maxlength: 50,
		},
		avatarUrl: {
			type: String,
			trim: true,
		},
		bio: {
			type: String,
			trim: true,
			maxlength: 160,
		},
		passwordHash: {
			type: String,
			required: true,
			select: false,
		},
	},
	{ timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
	return bcrypt.compare(plainPassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 