// Models
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
			return res
				.status(409)
				.send('User with given email already exists');
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

		// Processes after creating user profile
		try {
			// Create verification token
			const verificationToken = await JWTHandler.createVerificationToken(
				user._id
			);
			user.verificationToken = verificationToken;
			await user.save();

			// Reading verify.pug file
			let htmlText;
			if (process.env.NODE_ENV === 'development') {
				htmlText = await convertPugToHTML('verify.pug', {
					name: user.firstName,
					token: verificationToken,
					host: 'http://127.0.0.1:3000'
				});
			} else {
				htmlText = await convertPugToHTML('verify.pug', {
					name: user.firstName,
					token: verificationToken,
					host: `${process.env.HOST}:${process.env.PORT}`
				});
			};			

			// Send verification link to user's email address
			if (process.env.NODE_ENV === 'development') {
				await sendVerificationMail(htmlText, 'aca_node_group3@mail.ru');
			} else {
				await sendVerificationMail(htmlText, req.body.email);
			};			
			
		} catch(e) {
			return res
				.status(207)
				.send(
					'Account successfully registered, but failed to send verification email'
				);
		};

		// Everything is OK
		return res
			.status(201)
			.send(
				'Account successfully registered. Verification link is sent to your email address'
			);
	} catch (e) {
		return res.status(500).send('Failed to register');
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
					.status(401)
					.send('Verification token date is expired');
			}
			return res.status(401).send('Verification token is not valid');
		}

		// If verification token is valid
		const user = await User.findOne({ _id: tokenData.body['profile-id'] });

		if (user === null) {
			return res
				.status(404)
				.send(
					'Verification token is valid, but user data can not be found in database'
				);
		};

		if (user !== null && user.isVerified === true) {
			return res.status(409).send('Accaunt is already verified');
		};

		// If verification token in request is not the same as in database
		if (req.params.verificationToken !== user.verificationToken) {
			return res.status(401).send('Wrong verification token');
		};

		// If everything is OK
		if (user !== null && user.isVerified === false) {
			// Complete verification and add 1000 coins
			user.isVerified = true;
			user.coins = 1000;

			// Delete the token used for verification
			user.verificationToken = undefined;
			await user.save();

			// Create empty order document for user
			try {				
				const order = new Order({
					userId: user._id,
				});
				await order.save();
			} catch(e) {
				return res.status(207).send('Accaunt successfully verified, but failed to create order document for user');
			};			

			return res.status(200).send('Accaunt successfully verified');
		};

		return res.status(500).send('Verification failed due to an error on the server');
	} catch (e) {
		return res.status(500).send('Verification failed due to an error on the server');
	}
};

exports.login = async (req, res) => {
	try {
		// Check if a user with given email exists in base
		const user = await User.findOne({ email: req.body.email });

		if (user === null) {
			return res.status(401).send('Wrong email or password');
		}

		// Comparing password
		const passwordIsCorrect = await passwordHasher.compare(
			req.body.password,
			user.password
		);

		if (passwordIsCorrect === false) {
			return res.status(401).send('Wrong email or password');
		}

		if (passwordIsCorrect === true) {

			if (user.isVerified === true) {

				if (req.body['resend-verification-link'] === true) {
					return res.status(409).send('User profile is already verified');
				};

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
					message: 'Login successfully completed',
					'access-token': user.accessToken,
					'refresh-token': user.refreshToken,
				});
			};

			if (user.isVerified === false) {

				// Send new verification link to email
				if (req.body['resend-verification-link'] === true) {
					try {
						console.log('aaa')
						// Create new verification token
						const verificationToken = await JWTHandler.createVerificationToken(
							user._id
						);
						user.verificationToken = verificationToken;
						await user.save();

						// Reading verify.pug file
						let htmlText;
						if (process.env.NODE_ENV === 'development') {
							htmlText = await convertPugToHTML('verify.pug', {
								name: user.firstName,
								token: verificationToken,
								host: 'http://127.0.0.1:3000'
							});
						} else {
							htmlText = await convertPugToHTML('verify.pug', {
								name: user.firstName,
								token: verificationToken,
								host: `${process.env.HOST}:${process.env.PORT}`
							});
						};			

						// Send verification link to user's email address
						if (process.env.NODE_ENV === 'development') {
							await sendVerificationMail(htmlText, 'aca_node_group3@mail.ru');
						} else {
							await sendVerificationMail(htmlText, req.body.email);
						};		

						return res.status(200).send('New verification link is sent to your email address');
					} catch(e) {
						return res.status(500).send('Failed to send verification link');
					}
				};

				return res
					.status(401)
					.send(
						'User is not verified. Please make verification via email'
					);
			};			
		};

		return res.status(500).send('Authentication failed due to an error on the server');
	} catch (e) {
		return res.status(500).send('Authentication failed due to an error on the server');
	}
};
