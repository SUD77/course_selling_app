const { Router } = require("express");
const express = require("express");
const userRouter = Router();

const { userModel } = require("../db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_USER_SECRET = "jaiswalsudhanshu20User";

const { z } = require("zod");

userRouter.use(express.json());

function userAuthMiddleware(req, res, next) {

  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_USER_SECRET);

  if (decodedData) {
    //check here again for userId values
    req.userId = decodedData.id;
    next();
  } else {
    res.status(403).json({
      message: "Invalid token"
    })
  }
}

userRouter.post("/sign-up",async function (req, res) {
  
  //input validation using zod
  const requiredBody = z.object({
    email: z.string().min(5).max(100).email(),
    password: z.string().min(5).max(100),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
  });


  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  //checking if this admin already exists. 
  const doesUserExist = await userModel.findOne({
    email: email
  });

  if (doesUserExist) {
    return res.status(403).json({
      message: "User already exists"
    })
  }

  //hashing the password
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error"
    });
  }

  res.json({
    message: "User created"
  })


});

userRouter.post("/sign-in", function (req, res) {
  res.json({
    message: "singin endpoint"
  })
});

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "my purchased courses"
  })
})


module.exports = {
  userRouter: userRouter
}
