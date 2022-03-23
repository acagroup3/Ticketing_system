const Ticket = require('../models/ticket')

async function isTicketIdValid(req, res, next) {
	// ticket ID validation
	const { ticketId } = req.params
	const isIdValid = ticketId.length === 12 || ticketId.length === 24

	if (!isIdValid) {
		res.status(409).json({
			error: 'ID does not match rules.',
			errorMes: 'ID must be a string of 12 bytes or a string of 24 hex characters.'
		})
		next('ID does not match rules.')
		return
	}

	let ticket
	try {
		ticket = await Ticket.findById(ticketId)
	} catch {
		next('No ticket with such ID')
	}

	if (!ticket) { // ticket not exist 
		res.status(404).json({
			error: 'Non-existent ID.',
			errorMes: 'Ticket with such ID does not exist.'
		})
		next('No ticket with such ID.')
		return
	}
	// -------
	// -> ID is valid -> send ticket to controller	
	req.ticket = ticket
	next()
}

module.exports = isTicketIdValid
