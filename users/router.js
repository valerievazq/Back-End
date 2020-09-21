const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./model");
const restrict = require("../middleware/restrict");
const jwt = require("jsonwebtoken");
// const validateUser = require("../middleware/verifyUser");
const router = express.Router();

router.get("/", restrict, async (req, res, next) => {
  try {
    const users = await Users.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", restrict, async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await Users.getUserById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const newUser = await Users.AddUser({
      username,

      password: await bcrypt.hash(password, 10),
    });
    const token = generateToken(newUser);

    res.status(201).json({ newUser, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const user = await Users.getUserByUserName(username).first();
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user);
    const userInfo = { id: user.id, username: user.username };
    res.status(200).json({
      message: `Welcome ${user.username}!`,
      userInfo,
      token,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/update/:id", restrict, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const id = req.params.id;
    if (!username || !password) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const newUser = await Users.updateUser(id, {
      username,

      password: await bcrypt.hash(password, 10),
    });
    const user = await Users.getUserById(id);
    const userInfo = { id: user.id, username: user.username };
    res.status(201).json(userInfo);
  } catch (err) {
    next(err);
  }
});

router.delete("/delete/:id", restrict, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Users.deleteUser(id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options); // this method is synchronous
}

module.exports = router;
