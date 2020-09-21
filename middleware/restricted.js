const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.status(401).json({ status: 401, message: "Invalid Credentials" });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials", status: 401 });
    }
  } catch (err) {
    console.log(err);
  }
};
