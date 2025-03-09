const jwt=require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../config");


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

module.exports={
  userAuthMiddleware : userAuthMiddleware
}