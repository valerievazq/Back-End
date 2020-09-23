const db = require("../database/dbConfig");

module.exports = {
  getAllStories,
  getStoryById,
  getStoryByUserName,
  getStoryByUserId,
  AddStory,
  updateStory,
  deleteStory,
};

function getAllStories() {
  return db("stories");
}

function getStoryById(id) {
  return db("stories").select("*").where({ id }).first();
}

function getStoryByUserName(username) {
  return db("stories as s")
    .where("u.username", username)
    .join("users as u", "u.id", "s.user_id")
    .select(
      "u.username",
      "u.id as user_id",
      "s.id as story_id",
      "s.storyTitle",
      "s.storyDate",
      "s.story",
      "s.img"
    );
}
function getStoryByUserId(id) {
  return db("stories as s")
    .where("user_id", id)
    .join("users as u", "u.id", "s.user_id")
    .select(
      "u.username",
      "u.id as user_id",
      "s.id as story_id",
      "s.storyTitle",
      "s.storyDate",
      "s.story",
      "s.img"
    );
}

function AddStory(story) {
  return db("stories")
    .insert(story, "id")
    .then((ids) => {
      getStoryById(ids[0]);
    });
}

function updateStory(id, changes) {
  return db("stories").where("id", id).update(changes);
}

function deleteStory(id) {
  return db("stories").where("id", id).del();
}
