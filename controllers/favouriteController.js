const asyncHandler =  require('express-async-handler')
const Favourites = require('../models/favouriteModel')
const Equity = require('../models/equityModel')
//@desc GET all favourites
//@route GET /api/favourites
//@access private
const getFavourites = asyncHandler(async (req,res)=>{
    const favourites = await Favourites.find({user_id: req.user.id});
    res.status(200).json(favourites);
});
//@desc Create all contacts
//@route POST /api/contacts
//@access private
const createFavourites = asyncHandler(async (req,res)=>{
    console.log("The request body is:", req.body)
    const {stockName} = req.body;
    if(!stockName){
        res.status(404);
        throw new Error("Stock name value passed as empty.");
    }
    const exists = await Favourites.findOne({SC_NAME: stockName});
    if(exists){
        res.status(403);
        throw new Error("Stock already added to Favourites.")
    }
    const stock = await Equity.findOne({SC_NAME: stockName})
    if(!stock){
        res.status(404);
        throw new Error("Stock name not found.")
    }
    const{_id,SC_NAME,SC_CODE } = stock;
    const favourite = await Favourites.create({
        equity_id: _id,
        SC_NAME: SC_NAME,
        SC_CODE: SC_CODE,
        user_id: req.user.id
    });
    res.status(201).json(favourite);
    
});

//@desc Delete one contacts
//@route DELETE /api/contacts/:id
//@access private
const deleteFavourites = asyncHandler(async (req,res)=>{
    const favourite = await Favourites.findById(req.params.id)
    if(favourite==null){
        console.log(favourite)
        res.status(400)
        throw new Error("Stock not found")
    }
    if(favourite.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("YOU DONT HAVE THE PERMISSION TO DELETE OTHER USER'S FAVOURITES!!!")
    }
    await Favourites.deleteOne({_id: req.params.id});
    res.status(200).json({message:`This stock is Deleted`, Stock: favourite});
});


module.exports = {getFavourites,createFavourites,deleteFavourites};