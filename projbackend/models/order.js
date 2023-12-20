const mongoose= require("mongoose")
const { count } = require("./user")

const { ObjectId }= mongoose.Schema

const ProductCartSchema= new mongoose.Schema({
        product:{
            type: ObjectId,
            ref: "Product"
        },
        name: String,
        count: Number,
        price:Number
})

const ProductCart= mongoose.model( "ProductCart", ProductCartSchema )


const orderSchema= new mongoose.Schema(
    {
        products: [ProductCartSchema],
        transaction_id: {},
        amount: Number ,
        status: {
            type: String,
            default: "Recieved",
            enum: [ "Cancelled", "Delivered", "Shipped", "Processing", "Recieved" ]
        },
        address: String,
        updated: Date,
        user:{
            type: ObjectId,
            ref: "User"
        },


    },
    { timestamps: true }
)

const Order= mongoose.model( "Order", orderSchema )

module.exports= {Order, ProductCart}