// const tickets = require("../models/ticket")

async function getMyTickets(req, res){
	try{
		res.send("all tickets created by me");
	}
	catch(err){
		console.log(err);
		res.status(500).json({error: "something went wrong"});
	}
}

async function createTicket(req, res){
	try{
		res.send("creating scrillions of tickets");
	}
	catch(err){
		console.log(err);
		res.status(500).json({error: "something went wrong"});
	}
}

module.exports = {getMyTickets, createTicket};