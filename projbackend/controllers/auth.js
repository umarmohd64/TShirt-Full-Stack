const User = require("../models/user.js");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({ error: "DATA not stored in DB" });
    }
  });
  res.json({
    name: user.name,
    email: user.email,
    id: user._id,
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User Email does not exist",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or Password is incorrect",
      });
    }
    //Creating Token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Putting token to web cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //sending a response to frontend

    const { name, lastname, _id, email, role } = user;
    res.json({
      token,
      user: {
        name,
        lastname,
        email,
        _id,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: " USER SIGNED OUT SUCCESSFULLY!",
  });
};

//protected routes : Act as miidlewares => but we dont use next() as next() is included in express-jwt by default
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//CUSTOM middlewares

exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an Admin!",
    });
  }

  next();
};
