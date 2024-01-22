
const mongoose = require('mongoose')

const equitySchema = mongoose.Schema({
    SC_CODE:{
        type: Number,
        required: true,
    },
    SC_NAME: {
        type: String,
        required: true
    },
    OPEN: {
        type: Number,
        required: true
    },
    HIGH: {
        type: Number,
        required: true
    },
    LOW: {
        type: Number,
        required: true
    },
    CLOSE: {
        type: Number,
        required: true
    },
    DATE:{
        type: Date,
        required: true
    }

},{
    timestamps: true
});

module.exports = mongoose.model("Equity", equitySchema)