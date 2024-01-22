
const mongoose = require('mongoose')

const favouriteSchema = mongoose.Schema({
    equity_id:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Equity"
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    SC_CODE:{
        type: Number,
        required: true,
    },
    SC_NAME: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("Favourites", favouriteSchema)