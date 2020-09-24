const express = require("express");
const router = express.Router();
const Stories = require("./model");
// const Users = require("../users/usersModel");
const restricted = require("../middleware/restricted");

router.get("/", restricted, async (req, res, next) => {
  try {
    const stories = await Stories.getAllStories();
    res.status(200).json(stories);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", restricted, async (req, res, next) => {
  try {
    const id = req.params.id;

    const stories = await Stories.getStoryById(id);
    if (!stories) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json(stories);
  } catch (err) {
    next(err);
  }
});

router.get("/userid/:id", restricted, async (req, res, next) => {
  try {
    const story = await Stories.getStoryByUserId(req.params.id);

    if (!story) {
      return res
        .status(404)
        .json({ message: "no stories found for this user" });
    }

    res.status(200).json(story);
  } catch (err) {
    next(err);
  }
});

router.post("/add", restricted, async (req, res, next) => {
  try {
    const story = req.body;

    if (!story.user_id || !story.storyAdded || !story.story) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const newStory = await Stories.AddStory(story);
    res.status(201).json(newStory);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", restricted, async (req, res, next) => {
  try {
    const id = req.params.id;
    const changes = req.body;
    if (!changes.id || !changes.story) {
      return res.status(400).json({
        message:
          "required field(s) missing. Please try again with all required fields.",
      });
    }
    const newStory = await Stories.updateStory(id, changes);
    res.status(202).json(newStory);
  } catch (err) {
    next(err);
  }
});

router.delete("/delete/:id", restricted, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Stories.deleteStory(id);
    res.status(202).json({ message: "Story is gone" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
