const Product = require("../models/product")
const formidable = require("formidable")
const fs = require("fs")
const _ = require('lodash')

exports.getProductById = (req,res,next,id)=>{
    Product.findById(id).populate("category").exec( (err,product)=>{
        if(err){
            return res.status(400).json({
                err: "Product not found"
            })
        }
        req.product=product
        next();
    } )
}

exports.createProduct= (req,res)=>{
    const form = new formidable.IncomingForm()
    form.keepExtensions= true

    form.parse( req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                err: "Problem with Image!"
            })
        }

        //desctructuring of fields
        const { name, description, price, category, stock } = fields

        //restrictions
        if( !name || !description || !price || !category || !stock){
            return res.status(400).json({
                err: "Please include all fields"
            })
        }

        let product =  new Product(fields)

        //handle file below
        if(file.photo){
            if(file.photo.size > 2500000){
                return res.status(400).json({
                    err: "File size is too big!"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType= file.photo.type

        } 
        
        //saving IN DB
          product.save( (err, product)=>{
            if(err){
                return res.status(400).json({
                    err: "Product not saved in DB"
                })
            }
            res.json(product)
          } )


    } )
}

exports.getProduct= (req, res)=>{
    req.product.photo= undefined
    return res.json(req.product)
}

//middleware
exports.photo= (req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}


exports.deleteProduct = (req, res)=>{
    let product = req.product
    product.remove( (err, deletedProduct)=>{
        if(err){
            return res.status(400).json({
                err: "Not able to delete product"
            })
        }
        res.json({
            message: `${deletedProduct} was deleted`
        })
    } )
}

exports.updateProduct = (req, res)=>{
    const form = new formidable.IncomingForm()
    form.keepExtensions= true

    form.parse( req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({
                err: "Problem with Image!"
            })
        }

        let product =  req.product
        product= _.extend(product , fields)

        //handle file below
        if(file.photo){
            if(file.photo.size > 2500000){
                return res.status(400).json({
                    err: "File size is too big!"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType= file.photo.type

        } 
        
        //saving IN DB
          product.save( (err, product)=>{
            if(err){
                return res.status(400).json({
                    err: "Updation of product saved"
                })
            }
            res.json(product)
          } )


    } )
}

exports.getAllProducts= (req, res)=>{
    let limit= req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy= req.query.sortBy ? req.query.sortBy : "_id" 
    Product.find()
    .select("-photo")  // negative sign for DO NOT SELECT photo
    .limit(limit)
    .sort([[sortBy, "ascending"]])
    .exec( (err, products)=>{
        if(err){
            return res.status(400).json({
                err: "Products Not Found"
            })
        }
        res.json(products)
    } )
}


exports.updateStock= (req, res, next)=>{
    const myOperations= req.body.order.products.map( (prod)=>{
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: {$inc: {stock: -prod.count , sold: +prod.count}}
            }
        }
    } )

    Product.bulkWrite( myOperations, {}, (err, products)=>{
        if(err){
            return res.status(400).json({
                err: "Bulk Operations Failed"
            })
        }
    } )
}


exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct( "category", {}, (err, category)=>{
        if(err){
            return res.status(400).json({
                err: "No distinct categories found"
            })
        }
        res.json(category)

    } )
}