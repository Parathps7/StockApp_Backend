const express = require('express')
const {registerUser,loginUser,currentUser} = require('../controllers/userController');
const validate = require('../middleware/validateTokenHandler')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to user management
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: A successful response with the registered user details.
 *       '400':
 *         description: User data not valid or user already registered.
 */
router.post('/register',registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: A successful response with the access token.
 *       '401':
 *         description: Email or password not valid.
 */
router.post('/login',loginUser);

/**
 * @swagger
 * /api/users/current:
 *   get:
 *     summary: Get current user information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the current user details.
 */
router.get('/current',validate,currentUser);

module.exports = router;