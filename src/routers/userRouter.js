const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   access-token:      
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 *  schemas:
 *   ProfileDataSchema:
 *     type: object
 *     properties:
 *      firstName:
 *       type: string
 *       example: Mike
 *      lastName:
 *       type: string
 *       example: Owen
 *      country:
 *       type: string
 *       example: England
 *      email:
 *       type: string
 *       example: mikeowen@gmail.com
 *      coins:
 *       type: number
 *       example: 1000
 *   TokensUpdatedSchema:
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
 *      "message": "access-token and refresh-token successfully updated",
 *      "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlLWlkIjoiNjIzNzFiMGEyMTM3ZTE5Mzg5NWExZDdkIiwiaWF0IjoxNjQ3Nzc4NzUxLCJleHAiOjE2NDc3ODU5NTF9.9rs_o-A1qK0sTmjpMkr_Q1UiCwInmKmjfJ6okILyVjQ",
 *      "refresh-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlLWlkIjoiNjIzNzFiMGEyMTM3ZTE5Mzg5NWExZDdkIiwiaWF0IjoxNjQ3Nzc4NzI2LCJleHAiOjE2NTgxNDY3MjZ9.lMP1VgoIqObUC6Dgs1ddEwZEDW399RFM4Hvsj30uUKg"
 *     }
 */

 /**
 * @swagger
 * /profile:
 *	 get:
 *	  tags: [User profile]
 *   security:
 *    - access-token: []
 *	  description: Get user profile data
 *	  responses:
 *    200:
 *	    description: OK
 *	    content:
 *	     application/json:
 *       schema:
 *        oneOf:
 *	        - $ref: '#/components/schemas/ProfileDataSchema'
 *	        - $ref: '#/components/schemas/TokensUpdatedSchema'
 *    400:
 *	    description: Bad request
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *	       example: Request must contain authorization header
 *    401:
 *	    description: Unauthorized
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *	        - type: string
 *           example: Wrong authorization token
 *	        - type: string
 *           example: Authorization token date is expired
 *	        - type: string
 *           example: Authorization token is not valid
 *    500:
 *	    description: Internal server error
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *	        - type: string
 *           example: Failed to response profile data
 *	        - type: string
 *           example: Failed to verify authorization token
 *	        - type: string
 *           example: Failed to update access-token and refresh-token
 */

router.route('/').get(userController.getProfileData);

 /**
 * @swagger
 * /profile/logout:
 *	 get:
 *	  tags: [User profile]
 *   security:
 *    - access-token: []
 *	  description: Logout from user profile
 *	  responses:
 *    200:
 *	    description: OK
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *	       example: Logout successfully completed
 *	     application/json:
 *       schema:
 *	       $ref: '#/components/schemas/TokensUpdatedSchema'
 *    400:
 *	    description: Bad request
 *	    content:
 *	     text/plain:
 *       schema:
 *	       type: string
 *	       example: Request must contain authorization header
 *    401:
 *	    description: Unauthorized
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *	        - type: string
 *           example: Wrong authorization token
 *	        - type: string
 *           example: Authorization token date is expired
 *	        - type: string
 *           example: Authorization token is not valid
 *    500:
 *	    description: Internal server error
 *	    content:
 *	     text/plain:
 *       schema:
 *        oneOf:
 *	        - type: string
 *           example: Failed to logout
 *	        - type: string
 *           example: Failed to verify authorization token
 *	        - type: string
 *           example: Failed to update access-token and refresh-token
 */

router.route('/logout').get(userController.logout);

module.exports = router;
