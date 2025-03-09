const { Router } = require("express");
const userRouter = Router();

const express = require("express");
const { userModel } = require("../db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_USER_SECRET = "jaiswalsudhanshu20User";

const { z } = require("zod");

function userAuthMiddleware(req, res, next) {

 
}

userRouter.post("/sign-up", function (req, res) {
  res.json({
    message: "singup endpoint"
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
