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

		res.status(404).send('Profile not found in base');
	} catch (e) {
		console.log(e);
		return res.status(500).send('Server side error');
	};
	return res.status(404).send('Profile not found in base');
};
