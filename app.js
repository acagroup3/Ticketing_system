const express = require('express');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const morgan = require('morgan');
const verifyJWT = require('./src/middlewares/verifyJWT');

const myOrdersRouter = require('./src/routers/myOrders');
const myTicketsRouter = require('./src/routers/myTickets');
// Routers
const authRouter = require('./src/routers/authRouter');
const userRouter = require('./src/routers/userRouter');

// Swagger configuration
const SwaggerOptions = swaggerJsdoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Ticketing System',
			version: '1.0.0',
		},
	},
	apis: ['routes/*.js'],
});

app.use('/app-docs', swaggerUi.serve, swaggerUi.setup(SwaggerOptions));

// Middlewares
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);
app.use('/profile', verifyJWT, userRouter);

app.use('/profile/my-orders', myOrdersRouter);
app.use('/profile/my-tickets', myTicketsRouter);

module.exports = app;
