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
		await user.save();

		// Create verification token
		const verificationToken = await JWTHandler.createVerificationToken(
			user._id
		);
		user.verificationToken = verificationToken;
		await user.save();

		// Reading verify.pug file
		const htmlText = await convertPugToHTML('verify.pug', {
			name: user.firstName,
			token: verificationToken,
		});

		// Send verification link to user's email address
		await sendVerificationMail(htmlText, 'aca_node_group3@mail.ru');
		// await sendVerificationMail(htmlText, req.body.email);

		// 201 _ Created
		return res
			.status(201)
			.send(
				'Account successfully registered. Verification link is sent to your email'
			);
	} catch (e) {
		console.log(e);
		// 500 _ Internal server errors
		return res.status(500).send('A server-side error occured');
	}
};

exports.verifyUser = async (req, res) => {
	try {
		// Checking verification token
		const tokenData = await JWTHandler.verifyToken(
			req.params.verificationToken
		);

		// If verification-token is not valid
		if (tokenData.body === null) {
			if (tokenData.errorMessage === 'TokenExpiredError') {
				return res
					.status(404)
					.send('Verification token date is expired');
			}
			return res.status(404).send('Verification token is not valid');
		}

		// If verification token is valid
		const user = await User.findOne({ _id: tokenData.body['profile-id'] });

		if (user === null) {
			return res
				.status(404)
				.send(
					'Verification token is valid, but user data can not be found in database'
				);
		}

		if (user !== null && user.isVerified === true) {
			return res.status(409).send('Accaunt is already verified');
		}

		// If everything is OK
		if (user !== null && user.isVerified === false) {
			// Complete verification and add 1000 coins
			user.isVerified = true;
			user.coins = 1000;

			// Delete the token used for verification
			user.verificationToken = undefined;
			await user.save();

			// Create empty order document for user
			const order = new Order({
				userId: user._id,
			});
			await order.save();

			return res.status(200).send('Accaunt successfully verified');
		}

		return res.status(404).send('Verification failed');
	} catch (e) {
		console.log(e);
		return res.status(500).send('A server-side error occured');
	}
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
					user._id
				);
				const refreshToken = await JWTHandler.createRefreshToken(
					user._id
				);
				user.accessToken = accessToken;
				user.refreshToken = refreshToken;
				await user.save();

				return res.status(200).json({
					message: 'Login successfully completed',
					'access-token': user.accessToken,
					'refresh-token': user.refreshToken,
				});
			}
		}
		return res.status(404).send('Authentication failed');
	} catch (e) {
		console.log(e);
		return res.status(500).send('A server-side error occured');
	}
};
