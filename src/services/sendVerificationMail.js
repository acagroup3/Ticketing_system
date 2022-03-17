const nodemailer = require('nodemailer');

module.exports = async (htmlText, email) => {
	const transporter = nodemailer.createTransport(
		{
			host: 'smtp.mail.ru',
			port: 465,
			auth: {
				user: 'aca_node_group3@mail.ru',
				pass: 'g5vjH0mDTwXBDzKV1z6x',
			},
			secure: true, // true for 465, false for other ports
			tls: { rejectUnauthorized: false },
		},
		{ from: '<aca_node_group3@mail.ru>' }
	);

	const messageObj = {
		to: email,
		subject: 'Verify your Ticketing system accaunt',
		html: htmlText,
	};

	const mailer = async (message) => {
		await transporter.sendMail(message);
	};
	await mailer(messageObj);
};
