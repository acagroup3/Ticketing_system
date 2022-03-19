const { Router } = require("express");
const myTicketsController = require("../controllers/myTicketsController");
const validateTicketData = require("../middlewares/ticketDataValidation");

const router = Router();

router
	.get("/", myTicketsController.getMyTickets)
	.post("/", validateTicketData.validateName,
			   validateTicketData.validateDescription,
			   validateTicketData.validateDate,
	 		   myTicketsController.createTicket);

module.exports = router;
