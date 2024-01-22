const express = require("express");
const router = express.Router();
const {getTop10,getOne,getHistory} = require("../controllers/equityController");

/**
 * @swagger
 * tags:
 *   name: Equity
 *   description: API operations related to stocks
 */

/**
 * @swagger
 * /api/stocks/top10:
 *   get:
 *     summary: Get the top 10 latest stocks.
 *     tags: [Equity]
 *     responses:
 *       '200':
 *         description: A successful response with the top 10 stocks.
 */
router.get('/top10', getTop10);
/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Get a stock by name.
 *     tags: [Equity]
 *     parameters:
 *       - in: query
 *         name: SC_NAME
 *         required: true
 *         description: Stock name to search for.
 *     responses:
 *       '200':
 *         description: A successful response with the stock details.
 *       '404':
 *         description: Stock not found.
 */
router.get("/",getOne);
/**
 * @swagger
 * /api/stocks/history:
 *   get:
 *     summary: Get stock price history list for UI graph.
 *     tags: [Equity]
 *     parameters:
 *       - in: query
 *         name: SC_NAME
 *         required: true
 *         description: Stock name to get history for.
 *     responses:
 *       '200':
 *         description: A successful response with the stock price history.
 *       '404':
 *         description: Stock not found.
 */
router.get("/history",getHistory);


module.exports = router;
