const express = require("express");
const router = express.Router();
const {getFavourites,createFavourites,deleteFavourites} = require("../controllers/favouriteController");
const validateToken = require("../middleware/validateTokenHandler");

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: API operations related to favourite stocks
 */

/**
 * @swagger
 * /api/fav:
 *   get:
 *     summary: Get all favourite stocks.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the list of favourite stocks.
 */
router.get('/',validateToken,getFavourites);

/**
 * @swagger
 * /api/fav:
 *   post:
 *     summary: Add a stock to favourites.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stockName:
 *                 type: string
 *             required:
 *               - stockName
 *     responses:
 *       '201':
 *         description: A successful response with the added favourite stock.
 *       '404':
 *         description: Stock not found or already added to favourites.
 */
router.post("/",validateToken,createFavourites);

/**
 * @swagger
 * /api/fav/{id}:
 *   delete:
 *     summary: Remove a stock from favourites.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the favourite stock to be removed.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with the removed favourite stock.
 *       '400':
 *         description: Stock not found or permission issue.
 */
router.delete("/:id",validateToken,deleteFavourites);

module.exports = router;
