const Users = require("../users/usersModel");

function validateUserId(req, res, next) {
  const id = req.params.userid;
  Users.getUserById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
}
module.export = validateUserId;
