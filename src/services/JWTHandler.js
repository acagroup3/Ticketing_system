const jwt = require('jsonwebtoken');

const JWT_KEY = 'PxMW5O9*o[D,pc;b&*U?eT)5ccVY"<';

exports.createAccessToken = async (id, email) => jwt.sign({ user_id: id, email }, JWT_KEY, {
		expiresIn: '30m',
	});

exports.createRefreshToken = async (id, email) => jwt.sign({ user_id: id, email }, JWT_KEY, {
		expiresIn: '120d',
	});

exports.verifyToken = async (token) => {
	const tokenData = [];
	try {
		tokenData.body = await jwt.verify(token, JWT_KEY);
		return tokenData;
	} catch (e) {
		tokenData.body = null;
		console.log(e.name);
		if (e.name === 'TokenExpiredError') {
			tokenData.errorMessage = 'TokenExpiredError';
		}
		return tokenData;
	}
};
