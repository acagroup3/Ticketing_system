const JWTHandler = require('../services/JWTHandler');
const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		// Requests with refresh-token
		if (req.headers['refresh-token']) {
			// Checking refresh token
			const tokenData = await JWTHandler.verifyToken(
				req.headers['refresh-token']
			);

			// If refresh token is not valid
			if (tokenData.body === null) {
				if (tokenData.errorMessage === 'TokenExpiredError') {
					return res
						.status(401)
						.send('Refresh token date is expired');
				}
				return res.status(401).send('Refresh token is not valid');
			}

			// If refresh token is valid
			const user = await User.findOne({
				_id: tokenData.body['profile-id'],
			});

			if (user === null) {
				return res.status(401).send('Wrong refresh token');
			}

			// If refresh token in request is not the same as in database
			if (req.headers['refresh-token'] !== user.refreshToken) {
				return res.status(401).send('Wrong refresh token');
			}

			// Everything is OK
			if (req.headers['refresh-token'] === user.refreshToken) {
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

			return res
				.status(500)
				.send('Failed to complete verifyJWT test');
		};

		// Requests with access-token
		if (req.headers['access-token']) {
			// Checking access token
			const tokenData = await JWTHandler.verifyToken(
				req.headers['access-token']
			);

			// If access token is not valid
			if (tokenData.body === null) {
				if (tokenData.errorMessage === 'TokenExpiredError') {
					return res.status(401).send('Access token date is expired');
				}
				return res.status(401).send('Access token is not valid');
			}

			// If access token is valid
			const user = await User.findOne({
				_id: tokenData.body['profile-id'],
			});

			if (user === null) {
				return res.status(401).send('Wrong access token');
			}

			// If access token in request is not the same as in database
			if (req.headers['access-token'] !== user.accessToken) {
				return res.status(401).send('Wrong access token');
			}

			// Everything is OK
			if (req.headers['access-token'] === user.accessToken) {
				req.headers['profile-id'] = user._id;
				return next();
			}

			return res
				.status(500)
				.send('Failed to complete verifyJWT test');
		}

		// Requests without tokens
		if (!req.headers['access-token']) {
			return res
				.status(400)
				.send('access-token is not set in request header');
		}

		return res.status(500).send('Failed to complete verifyJWT test');
	} catch (e) {
		console.log(e);
		return res.status(500).send('Failed to complete verifyJWT test');
	}
};
