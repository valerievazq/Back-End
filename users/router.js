const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./model");
const restricted = require("../middleware/restricted");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { jwtSecret } = require("../database/secret");

//REGISTER
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);

  Users.AddUser({ firstName, lastName, email, password: hash })
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((err) => res.json({ error: err.message }));
});

router.get("/", async (req, res, next) => {
  try {
    const users = await Users.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", restricted, async (req, res, next) => {
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

//LOGIN
router.post("/login", (req, res) => {
  let { email, password } = req.body;

  Users.getUserByUserName({ email })
    .first()
    .then((user) => {
      // const user = users[0];
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user);
        const token = generateToken(user);
        res.status(201).json({
          message: `Welcome ${user.email}! Here's your token:`,
          token,
        });
      } else {
        res.status(401).json({ error: "Sorry, you're up to no good!" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});
//UPDATE
router.put("/update/:id", restricted, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const id = req.params.id;
    if (!email || !password) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const newUser = await Users.updateUser(id, {
      email,

      password: await bcrypt.hash(password, 10),
    });
    const user = await Users.getUserById(id);
    const userInfo = { id: user.id, email: user.email };
    res.status(201).json(userInfo);
  } catch (err) {
    next(err);
  }
});

router.delete("/delete/:id", restricted, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Users.deleteUser(id);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

//LOGOUT
router.get("/logout", async (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.json({
          message: "You can check out anytime, but you can never leave",
        });
      } else {
        res.status(200).json({ message: "goodbye!" });
      }
    });
  } else {
    res.status(200).json({ message: "you were nevere here to begin with" });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
  };

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, jwtSecret, options); // this method is synchronous
}

module.exports = router;
