const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//  Atlas DB
const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);
async function startServer() {
	try {
		await mongoose
			.connect(process.env.DATABASE_LOCAL)
			// .connect(DB)
			.then(() => {});

		// start server
		const port = process.env.PORT || 8000;
		app.listen(port, () => {
			console.log(`Starting server on port ${port}...`);
		});
	} catch (err) {
		console.log('Server failed to start');
	}
}
startServer();
