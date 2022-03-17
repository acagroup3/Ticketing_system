const express = require('express');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const morgan = require('morgan');

const myOrdersRouter = require("./routes/myOrders");
const myTicketsRouter = require("./routes/myTickets")

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

app.use("/app-docs", swaggerUi.serve, swaggerUi.setup(SwaggerOptions));

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/profile/my-orders", myOrdersRouter);
app.use("/profile/my-tickets", myTicketsRouter);

module.exports = app;
