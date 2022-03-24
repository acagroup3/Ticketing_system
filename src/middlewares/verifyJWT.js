const JWTHandler = require('../services/JWTHandler');
const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		
		// Request must contain authorization header
		if (req.headers['authorization']) {

			// Swagger API adds 'Bearer ' string at the beginning of token
			// We need to delete it before verification
			if (req.headers['authorization'].slice(0,7) === 'Bearer ') {
				req.headers['authorization'] = req.headers['authorization'].slice(7);
			};

			// Checking authorization token
			const tokenData = await JWTHandler.verifyToken(
				req.headers['authorization']
			);

			// If token is not valid
			if (tokenData.body === null) {
				if (tokenData.errorMessage === 'TokenExpiredError') {
					return res
						.status(401)
						.send('Authorization token date is expired');
				}
				return res.status(401).send('Authorization token is not valid');
			}

			// If token is valid
			const user = await User.findOne({
				_id: tokenData.body['profile-id'],
			});

			if (user === null) {
				return res.status(401).send('Wrong authorization token');
			};

			// If token is refresh-token
			if (req.headers['authorization'] === user.refreshToken) {
				// Create new access-token and refresh-token for user
				try {
					// Create tokens
					const accessToken = await JWTHandler.createAccessToken(
						user._id
					);
					const refreshToken = await JWTHandler.createRefreshToken(
						user._id
					);
					user.accessToken = accessToken;
					user.refreshToken = refreshToken;
					await user.save();

					return res.status(200).json({
						message:
							'access-token and refresh-token successfully updated',
						'access-token': user.accessToken,
						'refresh-token': user.refreshToken,
					});
				} catch (e) {
					return res.status(500).send('Failed to update access-token and refresh-token');
				}
			};

			// If token is access-token
			if (req.headers['authorization'] === user.accessToken) {
				req.headers['profile-id'] = user._id;
				return next();
			};

			// If token is neither refresh nor access
			return res.status(401).send('Wrong authorization token');
		} else {
			return res.status(400).send('Request must contain authorization header');
		};

		return res.status(500).send('Failed to verify authorization token');
	} catch (e) {
		return res.status(500).send('Failed to verify authorization token');
	}
};
