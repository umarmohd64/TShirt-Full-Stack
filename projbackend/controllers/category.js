const Category =require("../models/category.js")


exports.getCategoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "No category was found in the database"
            })
        }
        req.category=category;
        next();
    })
}

exports.createCategory = (req, res)=>{
    const category= new Category(req.body)
    category.save( (err, category)=>{
        if(err){
            return res.status(400).json({
                err: "Category not saved in DB"
            })
        }

        res.json( {category} )
    } )

}

exports.getCategory =(req,res)=>{
    res.json(req.category)
}

exports.getCategories =(req,res)=>{
    Category.find().exec( (err,categories)=>{
        if(err){
            return res.status(400).json({
                err: "No categories found in DB"
            })
        }

        res.json(categories)

    } )
    
}


exports.updateCategory = (req,res)=>{
    Category.findOneAndUpdate (
        {name: req.category.name},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, category)=>{
            if(err || !category){
                return res.status(400).json({
                    err: "Failed to update category"
                 })
             }
             return res.json({category})
        }
    )
}

exports.removeCategory= (req,res)=>{
    const category= req.category
    category.remove( (err, category)=>{
        if(err){
            return res.status(400).json({
                err: `Failed to remove ${category}`
            })
        }
        res.json({
            message: `Successfully removed ${category}`
        })

    } )
}