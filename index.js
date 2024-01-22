const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler")
const app = express();
const cors = require('cors');
const connectDb = require('./config/dbConnection')
const port = process.env.PORT || 3000;


//using middleware
app.use(express.json())
app.use(cors());
//connect to db
connectDb();

app.get('/',(req,res)=>{res.send("hey")});
const equityRoute = require('./routes/equityRoutes');
app.use('/api/stocks',equityRoute)
const favouriteRoute = require('./routes/favouriteRoutes');
app.use('/api/fav',favouriteRoute)
const userRoute = require("./routes/userRoutes");
app.use('/api/users',userRoute)

/**Your error handler should always be at the end of 
 * your application stack. Apparently it means not only after all
 *  app.use() but also after all your app.get() and app.post() 
 * calls. */
app.use(errorHandler);
app.listen(port,()=>{console.log(`Server is runnning on port ${port}`)})