const { Router } = require("express");
const express = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");

const { z } = require("zod");
const { adminAuthMiddleware } = require("../middleware/admin");

adminRouter.use(express.json());


adminRouter.post("/sign-up", async function (req, res) {

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
  const doesAdminExist = await adminModel.findOne({
    email: email
  });

  if (doesAdminExist) {
    return res.status(403).json({
      message: "Admin already exists"
    })
  }


  //hashing the password
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    await adminModel.create({
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
    message: "Admin created"
  })

});

adminRouter.post("/sign-in", async function (req, res) {

  const email = req.body.email;
  const password = req.body.password;

  const admin = await adminModel.findOne({
    email: email
  });

  if (!admin) {
    res.status(403).json({
      message: "No user found with this email and password"
    })
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  console.log(admin);

  if (passwordMatch) {
    const token = jwt.sign({
      id: admin._id.toString()
    }, JWT_ADMIN_SECRET);

    res.json({
      token: token
    });

  } else {
    res.status(403).json({
      message: "No user found with this email and password"
    });
  }

});

adminRouter.post("/add-course", adminAuthMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId
  })


  res.json({
    message: "Course created",
    courseId: course._id
  })
})

adminRouter.put("/course", adminAuthMiddleware, async function (req, res) {
  const adminId=req.userId;  // this is req.userId bcoz, we are setting the same in middleWare. Check.

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne({
    _id: courseId,
    creatorId: adminId
  }, {
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price
  }
  )

  res.json({
    message:"Course updated",
    courseId: course._id
  })


})

adminRouter.get("/course/bulk", adminAuthMiddleware, async function (req, res) {
  const adminId=req.userId;
  
  const courses = await courseModel.find({
    creatorId: adminId
  });

  res.json({
    message:"Courses",
    courses
  })

})

module.exports = {
  adminRouter: adminRouter
}