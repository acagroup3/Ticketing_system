const {validationResult} = require("express-validator");
const Ticket = require("../models/ticket")

async function getMyTickets(req, res){
	try{
		Ticket.find({ userId: req.headers['profile-id']}, (err, ticketList) => {
			res.send(ticketList);
		});
	}
	catch(err){
		console.log(err);
		res.status(500).json({error: "something went wrong"});
	}
}

async function createTicket(req, res){
	try{
		const errors = validationResult(req);
    		if (!errors.isEmpty()) {
        	res.status(400).json({ errors: errors.array()}); 
    	}

		const ticket = new Ticket({
			userId: req.headers['profile-id'],
			name: req.body.name,
			description: req.body.description,
			date: req.body.date,
			price: req.body.price,
			quantity: req.body.quantity,
			initialQuantity: req.body.quantity,
			canCancel: req.body.canCancel,
			cancelDate: req.body.cancelDate,
			countries: req.body.countries,
			likeCount: 0,
			dislikeCount: 0,
		});

		await ticket.save();
		res.status(201).json({created: true});
	}
	catch(err){
		console.log(err);
		res.status(500).json({error: "Something went wrong."});
	}
}

module.exports = {getMyTickets, createTicket};