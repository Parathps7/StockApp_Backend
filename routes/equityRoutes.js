const express = require("express");
const router = express.Router();
const {getTop10,getOne,getHistory} = require("../controllers/equityController");


router.get('/top10', getTop10);

router.get("/",getOne);

router.get("/history",getHistory);


module.exports = router;
