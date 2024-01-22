const asyncHandler = require("express-async-handler")
require('dotenv').config();
const Equity = require('../models/equityModel')

const getTop10 = asyncHandler(async(req,res)=>{
    //adding date field in sort to get the recent csv files data
    const topStocks = await Equity.find().sort({ DATE: -1,HIGH: -1 }).limit(10);
    res.status(200).json(topStocks);
});

const getOne = asyncHandler(async(req,res)=>{
    const SC_NAME = req.query.SC_NAME;
    console.log(SC_NAME)
    const stock = await Equity.find({SC_NAME: SC_NAME}).sort({DATE: -1}).limit(1);
    if(!stock){
        res.status(404)
        throw new Error("Stock Not Found")
    }
    res.status(200).json(stock);
});

const getHistory = asyncHandler(async(req,res)=>{
    const SC_NAME = req.query.SC_NAME;
    console.log(SC_NAME);
    const stocks = await Equity.find({SC_NAME: SC_NAME}).sort({DATE: -1}).select("SC_NAME HIGH LOW CLOSE DATE -_id");
    if(stocks.length===0){
        res.status(404);
        throw new Error("Stock Not Found");
    }
    res.status(200).json(stocks);
})

module.exports = {getTop10,getOne,getHistory}