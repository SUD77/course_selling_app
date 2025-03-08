const {Router} = require("express");
const userRouter=Router();

function userMiddleware(req,res,next){
  console.log("user middleware");
  next();
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


module.exports={
  userRouter: userRouter
}
