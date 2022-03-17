const JWTHandler = require('../services/JWTHandler');
const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		// Requests without profile-id
		if (!req.headers['profile-id']) {
			return res
				.status(404)
				.send('profile-id is not set in request header');
		}

		// Requests with invalid profile-id length
		if (
			req.headers['profile-id'].length !== 12 &&
			req.headers['profile-id'].length !== 24
		) {
			return res
				.status(404)
				.send('profile-id shall contain 12 or 24 characters');
		}

		const user = await User.findOne({ _id: req.headers['profile-id'] });

		// Requests with invalid profile-id
		if (user === null) {
			return res
				.status(404)
				.send('There is no user with such profile-id');
		}

		// Requests with refresh-token
		if (req.headers['refresh-token']) {
			// If refresh-token in request is not the same as in database
			if (req.headers['refresh-token'] !== user.refreshToken) {
				return res.status(404).send('Wrong refresh-token');
			}

			// Verifying refresh-token
			const tokenData = await JWTHandler.verifyToken(
				req.headers['refresh-token']
			);

			// If refresh-token is not valid
			if (tokenData.body === null) {
				if (tokenData.errorMessage === 'TokenExpiredError') {
					return res
						.status(404)
						.send('refresh-token date is expired');
				};
				return res.status(404).send('refresh-token is not valid');
			}

			// If refresh-token is valid, but it is for another user
			if (req.headers['profile-id'] !== tokenData.body.user_id) {
				return res.status(404).send('Token is for another user');
			}

			// Everything is OK
			if (req.headers['profile-id'] === tokenData.body.user_id) {
				// Create new access-token and refresh-token for user
				try {
					// Create tokens
					const accessToken = await JWTHandler.createAccessToken(
						tokenData.body.user_id,
						tokenData.body.email
					);
					const refreshToken = await JWTHandler.createRefreshToken(
						tokenData.body.user_id,
						tokenData.body.email
					);
					user.accessToken = accessToken;
					user.refreshToken = refreshToken;
					await user.save();

					return res.status(200).json({
						message:
							'access-token and refresh-token successfully updated',
						'profile-id': user._id,
						'access-token': user.accessToken,
						'refresh-token': user.refreshToken,
					});
				} catch (e) {
					console.log(e);
					console.log(
						'An error occured while creating new tokens for user'
					);
				}
			}

			return res
				.status(404)
				.send('verifyJWT test not passed for refresh-token');
		}

		// Requests with access-token
		if (req.headers['access-token']) {
			// If access-token in request is not the same as in database
			if (req.headers['access-token'] !== user.accessToken) {
				return res.status(404).send('Wrong access-token');
			}

			// Verifying access-token
			const tokenData = await JWTHandler.verifyToken(
				req.headers['access-token']
			);

			// If access-token is not valid
			if (tokenData.body === null) {
				if (tokenData.errorMessage === 'TokenExpiredError') {
					return res.status(404).send('access-token date is expired');
				};
				return res.status(404).send('access-token is not valid');
			}

			// If access-token is valid, but it is for another user
			if (req.headers['profile-id'] !== tokenData.body.user_id) {
				return res.status(404).send('Token is for another user');
			}

			// Everything is OK
			if (req.headers['profile-id'] === tokenData.body.user_id) {
				return next();
			}

			return res
				.status(404)
				.send('verifyJWT test not passed for access-token');
		}

		// Requests without tokens
		if (!req.headers['access-token']) {
			return res
				.status(404)
				.send('access-token is not set in request header');
		};
	} catch (e) {
		res.status(404).send('verifyJWT test not passed!');
		console.log(e);
	};
	return res.status(404).send('verifyJWT test not passed!');
};
