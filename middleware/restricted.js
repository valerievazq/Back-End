const jwt = require("jsonwebtoken");
const users = require("../users/model");

async function restricted(req, res, next) {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const user = await users.getUserById(decoded.subject);
    if (!user) throw new Error();
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "you shall not pass!!" });
  }
}

module.exports = restricted;
