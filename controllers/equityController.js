const asyncHandler = require("express-async-handler")
require('dotenv').config();
const cache = require("memory-cache");
const Equity = require('../models/equityModel')

//@desc GET Top 10 lates stocks
//@route GET /api/stocks
//@access public
const getTop10 = asyncHandler(async(req,res)=>{
    // Check if data is available in cache
    const cachedData = cache.get("top10");

    if (cachedData) {
        console.log("Data retrieved from cache.");
        return res.status(200).json(cachedData);
    }
    //adding date field in sort to get the recent csv files data
    const topStocks = await Equity.find().sort({ DATE: -1,HIGH: -1 }).select("SC_NAME SC_CODE HIGH DATE -_id").limit(10);
    cache.put("top10", topStocks, 15 * 60 * 1000);//15min cache storage
    res.status(200).json(topStocks);
});

//@desc GET Stock by Name
//@route GET /api/stocks?SC_NAME=
//@access public
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

//@desc GET Stock Price History by Name
//@route GET /api/stocks/history?SC_NAME=
//@access public
const getHistory = asyncHandler(async(req,res)=>{
    const SC_NAME = req.query.SC_NAME;
    console.log(SC_NAME);
    //setting cachekey based on stock name 
    const cacheKey = `history_${SC_NAME}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
        console.log("Data retrieved from cache.");
        return res.status(200).json(cachedData);
    }
    const stocks = await Equity.find({SC_NAME: SC_NAME}).sort({DATE: -1}).select("SC_NAME HIGH LOW CLOSE DATE -_id");
    if(stocks.length===0){
        res.status(404);
        throw new Error("Stock Not Found");
    }
    cache.put(cacheKey,stocks,15 * 60 * 1000);
    res.status(200).json(stocks);
})

const getProfit = asyncHandler(async(req,res)=>{

    const data = await Equity.find().sort({DATE: -1}).limit(1);
    const date = data[0].DATE;
    console.log(date);
    const max = await Equity.aggregate([
        {$match: {DATE: date}},
        {
            $project: {
                _id: 0,
                SC_NAME: 1,
                maxDiff : {$subtract: ["$HIGH",  "$LOW"]},
            }
        },
        { $sort: {maxDiff: -1} },
        {$limit: 1}
    ]);
    console.log(max);
    if(!max){
        res.status(404);
        throw new Error("The database might be empty.");
    }
    res.status(200).json({max});
});

module.exports = {getTop10,getOne,getHistory,getProfit}