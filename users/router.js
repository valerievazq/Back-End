const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./model");
const restricted = require("../middleware/restricted");
const jwt = require("jsonwebtoken");
// const validateUser = require("../middleware/verifyUser");
const router = express.Router();
const { jwtSecret } = require("../database/secret");
router.get("/", restricted, async (req, res, next) => {
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
// router.post("/register", async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({
//         message:
//           "required field(s) missing. Please try again with all required fields.",
//       });
//     }
//     const newUser = await Users.AddUser({
//       username,

//       password: await bcrypt.hash(password, 10),
//     });
//     const token = generateToken(newUser);

//     res.status(201).json({ newUser, token });
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 12);

  Users.AddUser({ username, password: hash })
    .then((user) => {
      res.status(201).json({ data: user });
    })
    .catch((err) => res.json({ error: err.message }));
});

// router.post("/login", async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({
//         message:
//           "required field(s) missing. Please try again with all required fields.",
//       });
//     }
//     const user = await Users.getUserByUserName(username).first();
//     console.log(user);
//     if (!user) {
//       return res.status(401).json({
//         message: "Invalid Credentials",
//       });
//     }

//     const passwordValid = await bcrypt.compare(password, user.password);

//     if (!passwordValid) {
//       return res.status(401).json({
//         message: "Invalid Credentials",
//       });
//     }

//     const token = generateToken(user);
//     const userInfo = { id: user.id, username: user.username };
//     res.status(200).json({
//       message: `Welcome ${user.username}!`,
//       userInfo,
//       token,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

//LOGIN
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.getUserByUserName({ username })
    .first()
    .then((user) => {
      // const user = users[0];
      if (user && bcrypt.compareSync(password, user.password)) {
        console.log(user);
        const token = generateToken(user);
        res.status(201).json({
          message: `Welcome ${user.username}! Here's your token:`,
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

router.delete("/delete/:id", restricted, async (req, res, next) => {
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

  return jwt.sign(payload, jwtSecret, options); // this method is synchronous
}

module.exports = router;
