// const orders = require("../models/order");

async function getMyOrders(req, res) {
	try {
		res.send('myorders list');
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'something went wrong' });
	}
}

async function getMyOrder(req, res) {
	try {
		res.send(req.params);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'something went wrong' });
	}
}

async function cancelTicket(req, res) {
	try {
		res.send(req.params);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: 'something went wrong' });
	}
}

module.exports = { getMyOrders, getMyOrder, cancelTicket };
