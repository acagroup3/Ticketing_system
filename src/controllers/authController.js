const User = require('../models/user');
const Order = require('../models/order');

// Services
const passwordHasher = require('../services/passwordHasher');
const convertPugToHTML = require('../services/convertPugToHTML');
const sendVerificationMail = require('../services/sendVerificationMail');
const JWTHandler = require('../services/JWTHandler');

exports.addUser = async (req, res) => {
	try {
		// Check if a user with given email exists in base
		const oldUser = await User.findOne({ email: req.body.email });
		if (oldUser !== null) {
			// 409 _ Conflict
			return res
				.status(409)
				.send('User with given email already exists.');
		}

		// Hashing passwords
		const hashedPassword = await passwordHasher.hash(req.body.password);

		// Create user
		const user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			country: req.body.country,
			email: req.body.email.toLowerCase(),
			password: hashedPassword,
			isVerified: false,
			coins: 0,
		});

		// Save user in database
		const createdUser = await user.save();

		// Reading verify.pug file
		const htmlText = await convertPugToHTML('verify.pug', {
			name: createdUser.firstName,
			id: createdUser._id,
		});

		// Send verification link to user's email address
		// await sendVerificationMail(htmlText, req.body.email);
		await sendVerificationMail(htmlText, 'aca_node_group3@mail.ru');

		// 201 _ Created
		return res
			.status(201)
			.send(
				'Account successfully registered. Verification link is sent to your email'
			);
	} catch (e) {
		res.status(404).send('Failed to register');
		console.log(e);
	};
	return res.status(404).send('Failed to register');
};

exports.verifyUser = async (req, res) => {
	try {
		// user_id must be a string of 12 or 24 characters
		if (
			req.params.user_id.length === 12 ||
			req.params.user_id.length === 24
		) {
			const user = await User.findOne({ _id: req.params.user_id });

			// If everything is OK
			if (user !== null && user.isVerified === false) {
				user.isVerified = true;
				user.coins = 1000;
				await user.save();

				const order = new Order({
					userId: user._id,
				});
				await order.save();

				return res.status(200).send('Accaunt successfully verified');
			};
			if (user !== null && user.isVerified === true) {
				return res.status(409).send('Accaunt is already verified');
			};
			return res.status(404).send('There is no user with such id');
		};
		return res.status(404).send('Request contains invalid id');
	} catch (e) {
		console.log(e);
		// Internal server error
		return res.status(500).send('A server-side error occured');
	};
};

exports.login = async (req, res) => {
	try {
		// Check if a user with given email exists in base
		const user = await User.findOne({ email: req.body.email });

		if (user === null) {
			return res.status(404).send('Wrong email or password');
		}

		// Comparing password
		const passwordIsCorrect = await passwordHasher.compare(
			req.body.password,
			user.password
		);

		if (passwordIsCorrect === false) {
			return res.status(404).send('Wrong email or password');
		}

		if (passwordIsCorrect === true) {
			if (user.isVerified === false) {
				return res
					.status(200)
					.send(
						'User is not verified. Please make verification via email'
					);
			}
			if (user.isVerified === true) {
				// Create token
				const accessToken = await JWTHandler.createAccessToken(
					user._id,
					user.email
				);
				const refreshToken = await JWTHandler.createRefreshToken(
					user._id,
					user.email
				);
				user.accessToken = accessToken;
				user.refreshToken = refreshToken;
				await user.save();

				return res.status(200).json({
					message: 'Login successfully completed',
					'profile-id': user._id,
					'access-token': user.accessToken,
					'refresh-token': user.refreshToken,
				});
			}
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send('Server side error');
	};
	return res.status(404).send('Authentication failed');
};
