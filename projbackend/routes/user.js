const express = require("express")

const router = express.Router()

const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user")
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth")

router.param("userId", getUserById )

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

router.post("/user/:userId", isSignedIn, isAuthenticated, updateUser)

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList )

router.get("/users", getAllUsers)



module.exports = router