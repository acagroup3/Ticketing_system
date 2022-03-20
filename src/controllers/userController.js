const User = require('../models/user');

exports.getProfileData = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] });

		if (user !== null) {
			return res.status(200).json({
				firstName: user.firstName,
				lastName: user.lastName,
				country: user.country,
				email: user.email,
				coins: user.coins,
			});
		}

		return res.status(404).send('Profile not found in base');
	} catch (e) {
		console.log(e);
		return res.status(500).send('Server side error');
	}
};

exports.logout = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.headers['profile-id'] });

		// Delete all tokens for user
		if (user !== null) {
			user.accessToken = undefined;
			user.refreshToken = undefined;
			await user.save();

			return res.status(200).send('Logout successfully completed');
		}

		return res.status(404).send('Profile not found in base');
	} catch (e) {
		console.log(e);
		return res.status(500).send('Server side error');
	}
};
