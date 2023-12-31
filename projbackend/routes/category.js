const express = require("express")
const router = express.Router()

const {getCategoryById, createCategory, getCategory,getCategories, updateCategory, removeCategory  }= require("../controllers/category")
const {getUserById}= require("../controllers/user")
const {isAdmin, isAuthenticated, isSignedIn}= require("../controllers/auth")

//params
router.param("userId", getUserById )
router.param("categoryId", getCategoryById)


//actual routes

//create
router.post("/category/create/:userId" , isSignedIn, isAuthenticated, isAdmin ,createCategory )


//read
router.get("/category/:categoryId", getCategory)
router.get("/categories", getCategories)


//update
router.put("/category/:categoryId/:userId" , isSignedIn, isAuthenticated, isAdmin ,updateCategory )

//delete
router.delete("/category/:categoryId/:userId" , isSignedIn, isAuthenticated, isAdmin ,removeCategory )




module.exports= router