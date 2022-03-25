const express = require('express');
const authController = require('../controllers/authController');
const userDataValidator = require('../middlewares/userDataValidator');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   UserRegistrationSchema:
 *    type: object
 *    properties:
 *     firstName:
 *      type: string
 *      example: Mike
 *     lastName:
 *      type: string
 *      example: Owen
 *     country:
 *      type: string
 *      example: England
 *     email:
 *      type: string
 *      example: aca_node_group3@mail.ru
 *     password:
 *      type: string
 *      example: 11112222
 *   UserLoginSchema:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: aca_node_group3@mail.ru
 *     password:
 *      type: string
 *      example: 11112222
 *   ResendVerificationLinkSchema:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: aca_node_group3@mail.ru
 *     password:
 *      type: string
 *      example: 11112222
 *     resend-verification-link:
 *      type: boolean
 *      example: true
 *   RegistrationValidationErrors:
 *    type: object
 *    properties:
 *     errors:
 *      type: array
 *      items:
 *       type: string
 *    example:
 *     {
 *      "errors": [
 *       "Request body must contain firstName",
 *       "lastName must be of type string",
 *       "country name is not included in countryNames list",
 *       "email is not valid",
 *       "password must contain from 6 to 32 symbols"
 *      ]
 *     }
 *   LoginValidationErrors:
 *    type: object
 *    properties:
 *     errors:
 *      type: array
 *      items:
 *       type: string
 *    example:
 *     {
 *      "errors": [
 *       "email is not valid",
 *       "password must contain from 6 to 32 symbols"
 *      ]
 *     }
 *   loginResponseSchema:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *     access-token:
 *      type: string
 *     refresh-token:
 *      type: string
 *    example:
 *     {
 *      "message": "Login succesffully completed",
 *      "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlLWlkIjoiNjIzNzFiMGEyMTM3ZTE5Mzg5NWExZDdkIiwiaWF0IjoxNjQ3Nzc4NzUxLCJleHAiOjE2NDc3ODU5NTF9.9rs_o-A1qK0sTmjpMkr_Q1UiCwInmKmjfJ6okILyVjQ",
 *      "refresh-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlLWlkIjoiNjIzNzFiMGEyMTM3ZTE5Mzg5NWExZDdkIiwiaWF0IjoxNjQ3Nzc4NzI2LCJleHAiOjE2NTgxNDY3MjZ9.lMP1VgoIqObUC6Dgs1ddEwZEDW399RFM4Hvsj30uUKg"
 *     }
 */

/**
 * @swagger
 * /auth/register:
 *	 post:
 *	  tags: [Registration and authentication]
 *	  description: New user profile registration
 *	  requestBody:
 *	   description: User's personal data
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      $ref: '#/components/schemas/UserRegistrationSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/UserRegistrationSchema'
 *	  responses:
 *    201:
 *	    description: Created
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Account successfully registered. Verification link is sent to your email address
 *    207:
 *	    description: Multi-status
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Account successfully registered, but failed to send verification email
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/RegistrationValidationErrors'
 *    409:
 *	    description: Conflict
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: User with given email already exists
 *    500:
 *	    description: Internal server error
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Failed to register
 */

router.route('/register').post(
	userDataValidator.validateFirstName,
	userDataValidator.validateLastName,
	userDataValidator.validateCountry,
	userDataValidator.validateEmail,
	userDataValidator.validatePassword,
	userDataValidator.errorHandler,
	authController.addUser
);

/**
 * @swagger
 * /auth/verify/{verificationToken}:
 *	 get:
 *	  tags: [Registration and authentication]
 *	  description: Verify user profile
 *	  parameters:
 *	  - name: verificationToken
 *	    in: path
 *     description: verification token
 *     required: true
 *     type: string
 *     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlLWlkIjoiNjIzNzFiMGEyMTM3ZTE5Mzg5NWExZDdkIiwiaWF0IjoxNjQ3Nzc4NzUxLCJleHAiOjE2NDc3ODU5NTF9.9rs_o-A1qK0sTmjpMkr_Q1UiCwInmKmjfJ6okILyVjQ
 *	  responses:
 *    200:
 *	    description: OK
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Accaunt successfully verified
 *    207:
 *	    description: Multi-status
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Accaunt successfully verified, but failed to create order document for user
 *    401:
 *	    description: Unauthorized
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *        - type: string
 *          example: Verification token date is expired
 *        - type: string
 *          example: Verification token is not valid
 *        - type: string
 *          example: Wrong verification token
 *    404:
 *	    description: Not found
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Verification token is valid, but user data can not be found in database
 *    409:
 *	    description: Conflict
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Accaunt is already verified
 *    500:
 *	    description: Internal server error
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Verification failed due to an error on the server
 */

router.route('/verify/:verificationToken').get(authController.verifyUser);

/**
 * @swagger
 * /auth/login:
 *	 post:
 *	  tags: [Registration and authentication]
 *	  description: User login
 *	  requestBody:
 *	   description: If request body contains resend-verification-link key, it will be considered as response to resend verification link to user email address
 *	   required: true
 *	   content:
 *	    application/json:
 *	     schema:
 *	      oneOf:   
 *	       - $ref: '#/components/schemas/UserLoginSchema'   
 *	       - $ref: '#/components/schemas/ResendVerificationLinkSchema'
 *	    application/x-www-form-urlencoded:
 *	     schema:
 *	      $ref: '#/components/schemas/UserLoginSchema'
 *	  responses:
 *    200:
 *	    description: OK
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/loginResponseSchema'
 *    400:
 *	    description: Bad request
 *	    content:
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/LoginValidationErrors'
 *    401:
 *	    description: Unauthorized
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *	        - type: string
 *           example: User is not verified. Please make verification via email
 *	        - type: string
 *           example: Wrong email or password
 *    409:
 *	    description: Conflict
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: User profile is already verified
 *    500:
 *	    description: Internal server error
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *        example: Authentication failed due to an error on the server
 */

router.route('/login').post(
	userDataValidator.validateEmail,
	userDataValidator.validatePassword,
	userDataValidator.errorHandler,
	authController.login
);

module.exports = router;
