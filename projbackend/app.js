require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


//MY ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")


//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api", authRoutes);
app.use("/api" , userRoutes);
app.use("/api" , categoryRoutes);
app.use("/api" , productRoutes);
app.use("/api" , orderRoutes);


// PORT
const port= process.env.PORT || 5051


//START OF SERVER
app.listen( port, ()=>{
    console.log( `App is Running at port ${port}` )
} )



