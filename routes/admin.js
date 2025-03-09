const { Router } = require("express");
const express=require("express");
const adminRouter = Router();
const { adminModel } = require("../db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "jaiswalsudhanshu20";

const {z}=require("zod");

adminRouter.use(express.json());

function adminAuthMiddleware(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);

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

adminRouter.post("/sign-in",async function (req, res) {

  const email=req.body.email;
  const password=req.body.password;

  const admin=await adminModel.findOne({
    email:email
  });

  if(!admin){
    res.status(403).json({
      message:"No user found with this email and password"
    })
  }

  const passwordMatch=await bcrypt.compare(password,admin.password);

  console.log(admin);

  if(passwordMatch){
    const token=jwt.sign({
      id:admin._id.toString()
    },JWT_SECRET);

    res.json({
      token:token
    });
   
  }else{
    res.status(403).json({
      message:"No user found with this email and password"
    });  
  }

});

adminRouter.post("/add-course", function (req, res) {
  res.json({
    message: "Course created by admin"
  })
})

adminRouter.put("/course", function (req, res) {
  res.json({
    message: "Course edited by admin"
  })
})

adminRouter.get("/course/bulk", function (req, res) {
  res.json({
    message: "Course by admin"
  })
})

module.exports = {
  adminRouter: adminRouter
}