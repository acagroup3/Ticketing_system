const { Router } = require('express');
const { getAllTickets } = require('../controllers/ticketsController');

const router = Router();
router.get('/', getAllTickets);

module.exports = router;
