const {Router}=require("express");
const adminRouter=Router();
const {adminModel}=require("../db");

function adminMiddleware(req,res,next){
  console.log("admin middleware");
  next();
}

adminRouter.post("/sign-up", function (req, res) {
  res.json({
    message: "admin singup endpoint"
  })
});

adminRouter.post("/sign-in", function (req, res) {
  res.json({
    message: "admin singin endpoint"
  })
});

adminRouter.post("/add-course", function(req,res){
  res.json({
    message: "Course created by admin"
  })
})

adminRouter.put("/course", function(req,res){
  res.json({
    message: "Course edited by admin"
  })
})

adminRouter.get("/course/bulk", function(req,res){
  res.json({
    message: "Course by admin"
  })
})

module.exports={
  adminRouter: adminRouter
}