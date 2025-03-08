const {Router} = require("express");
const courseRouter=Router();


courseRouter.post("/purchase", function (req, res) {
  res.json({
    message: "to buy a course"
  })
});

courseRouter.get("/preview", function (req, res) {
  res.json({
    message: "courses endpoint"
  })
});


module.exports={
  courseRouter: courseRouter
}
