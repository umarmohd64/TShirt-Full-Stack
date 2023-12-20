const express = require("express")

const app= express();

const port= 8000;

app.get( "/", (req, res)=>{
    return res.send("Home page")
} )

const admindash = (req, res)=>{
    return res.send("This is the admin Dashboard")

}

const isAdmin= ( req, res, next)=>{
    console.log("isAdmin is running")
    next();
}

const isLoggedIn= ( req, res, next)=>{
    console.log("LoggedIn in running properly")
    next();
}


app.get( "/admindashboard", isLoggedIn, isAdmin, admindash )

app.get( "/login", (req, res)=>{
    return res.send("Welcome to the visiting route")
} )

app.get( "/umar", (req, res)=>{
    return res.send("umaryarrr.instagram")
} )



app.listen( port, ()=>(
    console.log("Server is up and running .....")
) )