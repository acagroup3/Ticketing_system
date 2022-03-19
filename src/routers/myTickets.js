const { Router } = require("express");
const myTicketsController = require("../controllers/myTicketsController");

const router = Router();

router
	.get("/", myTicketsController.getMyTickets)
	.post("/", myTicketsController.createTicket);

module.exports = router;
