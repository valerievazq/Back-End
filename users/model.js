const db = require("../database/dbConfig");

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUserName,
  AddUser,
  updateUser,
  deleteUser,
};

function getAllUsers() {
  return db("users").select("*");
}

function getUserById(id) {
  return db("users").select("id", "username").where({ id }).first();
}

function getUserByUserName(filter) {
  return db("users").select("id", "username", "password").where(filter);
}

async function AddUser(user) {
  const [id] = await db("users").insert(user);
  return getUserById(id);
}

function updateUser(id, changes) {
  return db("users").where({ id }).update(changes);
}

function deleteUser(id) {
  return db("users").where("id", id).del();
}
