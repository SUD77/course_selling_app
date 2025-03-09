const { Router } = require("express");
const { userAuthMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db")
const courseRouter = Router();


courseRouter.post("/purchase", userAuthMiddleware, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  await purchaseModel.create({
    userId,
    courseId
  });

  res.json({
    message: "Course puchased"
  })
});

//gives the list of all the courses present 
courseRouter.get("/preview",async function (req, res) {

  const courses = await courseModel.find({});
  res.json({
    courses
  })
});


module.exports = {
  courseRouter: courseRouter
}
