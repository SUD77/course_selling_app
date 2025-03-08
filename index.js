const express = require('express');
const mongoose = require("mongoose");


const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);


async function startServer() {

  await mongoose.connect("mongodb+srv://jaiswalsudhanshu20:w4J93K3dfaEebq3m@cluster0.xy7jo.mongodb.net/course-selling-app");
  app.listen(3000);
}

startServer();

