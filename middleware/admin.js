const jwt=require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require("../config");


function adminAuthMiddleware(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_ADMIN_SECRET);

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
  adminAuthMiddleware : adminAuthMiddleware
}