const express = require("express");
const router = express.Router();
const {getFavourites,createFavourites,deleteFavourites} = require("../controllers/favouriteController");
const validateToken = require("../middleware/validateTokenHandler");

router.get('/',validateToken,getFavourites);

router.post("/",validateToken,createFavourites);

router.delete("/:id",validateToken,deleteFavourites);

module.exports = router;
