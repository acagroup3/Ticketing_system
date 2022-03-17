# Ticketing_system
Create a REST API for ticketing system.

Users should be able to register and login into the system. They should verify their profile via email. After verifying they are given 1000 coins, which they can use to purchase for tickets.
Users can create tickets(with name, description, date, price, quantity, canCancel, cancelDate, countries).
Users can edit and delete the tickets(not purchased) that they created.
Users can add tickets to their shopping carts if the ticket is available and they have enough coins.
If someone adds a ticket to his shopping cart or purchases a ticket, the original quantity of the ticket decreases.
Users should be able to see their orders, get details and create an order. They can cancel an order if it is possible to do for selected tickets.
Tickets can be made only for users from certain countries.
Users should be able to like or unlike a ticket.
Users should be able to add comments on tickets.
Users can get the list of tickets filtered by ticket attributes, they can sort it by like count, date, price.




All get requests for lists should be paginated.
All create and update operations should be validated.

Create a postman collection and Swagger API documentation and deploy the api on Heroku.
