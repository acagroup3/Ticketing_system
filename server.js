const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

//  Atlas DB
const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(process.env.DATABASE_LOCAL)
	// .connect(DB)
	.then(() => {});

// start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log('listening...');
});
