const fs = require('fs');
const path = require('path');
const request = require('request');
const unzipper = require('unzipper');
const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const AdmZip = require('adm-zip');
const connectDb = require('./config/dbConnection')
const Equity = require('./models/equityModel')
const errorHandler = require("./middleware/errorHandler")


connectDb();

const downloadAndExtractZip = (zipUrl, extractPath) => {
    return new Promise((resolve, reject) => {
        request.get(zipUrl, { encoding: null }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }
            const zip = new AdmZip(body);
            zip.extractAllTo(extractPath, true);
            resolve();
        });
    });
};
const readCsvAndStoreInDatabase = async (csvPath,date) => {
    try {
        const exists = await Equity.findOne({DATE: date});
        if(exists==null){
            fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (row) => {
                let str = row.SC_NAME;
                str = str.replace(/\s/g, '')
                let data = {
                    SC_CODE: row.SC_CODE,
                    SC_NAME: str,
                    OPEN: parseFloat(row.OPEN),
                    HIGH: parseFloat(row.HIGH),
                    LOW: parseFloat(row.LOW),
                    CLOSE: parseFloat(row.CLOSE),
                    DATE: date
                }
            const equity = new Equity(data);
            equity.save();
        })
        .on("end", () => {
            console.log("Data has been inserted successfully.");
        });
        }else{
            throw new Error("Data already Inserted in db.");
        }
    }catch (error) {
        console.log(error.message);
    }
};
function convertToNormalDateFormat(numericDate) {
    // Ensure numericDate is a string
    const initial = "20";
    numericDate = String(numericDate);
    console.log("Numeric DATE: ",numericDate);
    const day = numericDate.slice(0, 2);
    let month = numericDate.slice(2, 4);
    const year = initial.concat(numericDate.slice(4)); 
    console.log(day,month,year);
    // Create a new Date object with the extracted values
    const normalDate = new Date(`${month}-${day}-${year} EDT`);
    //IMPORTANT: took from stackoverflow(date func not returning correct date otherwise)
    // Return the formatted date as a string
    return normalDate;
}
const fetchLast50DaysData = async () => {
    const end_date = new Date();
    console.log("End Date: ",end_date)
    const start_date = new Date(new Date().setDate(end_date.getDate() - 50)); // 50 days ago
    console.log("Start date: ",start_date)
    const result = await Equity.find({ DATE: { $gte: start_date, $lte: end_date } });
    return result;
};

(async () => {
    const zero = "0";
    let day = "5";
    let month = "12";
    let year = "23";
    if(parseInt(day,10)<10){
        day = zero.concat(day);
    }
    if(parseInt(month,10)<10){
        month = zero.concat(month);
    }
    const numericDate = day.concat(month,year);
    const date = convertToNormalDateFormat(numericDate);
    console.log("Converted Date: ",date);
    // const zipUrl = `https://www.bseindia.com/download/BhavCopy/Equity/EQ${numericDate}_CSV.ZIP`;

    // // Specify the path to extract the ZIP file
    // const extractPath = './';
    // await downloadAndExtractZip(zipUrl, extractPath);

    // // // Read CSV and store in MongoDB using Mongoose
    // const csvPath = path.join(extractPath, `EQ${numericDate}.CSV`);
    // await readCsvAndStoreInDatabase(csvPath,date);

    // Fetch last 50 days data
    const result= await fetchLast50DaysData();
    console.log(result);
    //Close the Mongoose connection
    // mongoose.connection.close();
})();
