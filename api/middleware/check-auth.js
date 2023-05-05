const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const decoded = jwt.verify(request.body.token, process.env.KEY);
    request.userData = decoded;
    next();
  } catch (error) {
    return response.status(401).json({
      message: "Authentication failed.",
    });
  }
};
