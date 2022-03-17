const bcrypt = require('bcrypt');

exports.hash = async (password) => {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

exports.compare = async (password, hashedPassword) => {
	let passwordIsCorrect = await bcrypt.compare(password, hashedPassword);
	return passwordIsCorrect;
};
