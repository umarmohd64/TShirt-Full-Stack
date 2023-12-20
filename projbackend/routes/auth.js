var express = require("express");
var router = express.Router();
const bodyParser= require("body-parser")
const {validationResult, check} = require('express-validator');
const {signout, signup, signin, isSignedIn}= require("../controllers/auth")



router.post("/signup", bodyParser.json(), express.json(),
             [
                check("name").isLength({min: 3}).withMessage("name must be atleast 3 characters"),
                check("email").isEmail().withMessage("email is required"),
                check("password").isLength({min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Password must be atleast 8 characters and must include one lowercase character, one uppercase character, a number, and a special character.")
            ], 
             signup)

router.post( "/signin", bodyParser.json(), express.json(),
[
    check("email").isEmail().withMessage("email is required"),
    check("password").isLength({min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Password must be atleast 8 characters and must include one lowercase character, one uppercase character, a number, and a special character.")
], 
signin)

router.get( "/signout", signout )

//protected routes : Act as miidlewares => but we dont use next() as next() is included in express-jwt by default
router.get("/testroute", isSignedIn, (req,res)=>{
    res.json(req.auth)
} )



module.exports= router