const { Router } = require("express");
const express = require("express");
const userRouter = Router();

const { userModel } = require("../db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config");

const { z } = require("zod");

userRouter.use(express.json());

userRouter.post("/sign-up", async function (req, res) {

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

userRouter.post("/sign-in", async function (req, res) {

  const email = req.body.email;
  const password = req.body.password;

  const user = await userModel.findOne({
    email: email
  });

  if (!user) {
    res.status(403).json({
      message: "No user found with this email and password"
    })
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  console.log(user);

  if (passwordMatch) {
    const token = jwt.sign({
      id: user._id.toString()
    }, JWT_USER_SECRET);

    res.json({
      token: token
    });

  } else {
    res.status(403).json({
      message: "No user found with this email and password"
    });
  }

});

userRouter.get("/purchases", function (req, res) {
  res.json({
    message: "my purchased courses"
  })
})


module.exports = {
  userRouter: userRouter
}
