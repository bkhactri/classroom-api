const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).send("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send("You are not authenticated!");
  }
};

module.exports = { verifyToken };
