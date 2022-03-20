const jwt = require('jsonwebtoken');

const JWT_KEY = 'PxMW5O9*o[D,pc;b&*U?eT)5ccVY"<';

exports.createVerificationToken = async (id) =>
	jwt.sign({ 'profile-id': id }, JWT_KEY, {
		expiresIn: '6h',
	});

exports.createAccessToken = async (id) =>
	jwt.sign({ 'profile-id': id }, JWT_KEY, {
		expiresIn: '2h',
	});

exports.createRefreshToken = async (id) =>
	jwt.sign({ 'profile-id': id }, JWT_KEY, {
		expiresIn: '120d',
	});

exports.verifyToken = async (token) => {
	const tokenData = [];
	try {
		tokenData.body = await jwt.verify(token, JWT_KEY);
		return tokenData;
	} catch (e) {
		tokenData.body = null;
		if (e.name === 'TokenExpiredError') {
			tokenData.errorMessage = 'TokenExpiredError';
		}
		return tokenData;
	}
};
