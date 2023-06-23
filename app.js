const express = require("express");
const { sequelize, User, Post } = require("./models");

const app = express();

app.use(express.json());

// test api
app.get("/helloWorld", (req, res) => {
  res.json({ message: "hello world!" });
});

// create users
app.post("/users", async (req, res) => {
  try {
    const userInfo = req.body;
    const createdUser = await User.create(userInfo);

    res.json({ createdUser });
  } catch (error) {
    res.json({ message: error.message });
  }
});

// create posts
app.post("/posts", async (req, res) => {
  const postInfo = req.body;

  try {
    const createdPost = await Post.create(postInfo);

    res.json({ createdPost });
  } catch (error) {
    res.json({ message: error.message });
  }
});

// get posts by userId
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: "user", attributes: ["username", "createdAt"] },
      ],
    });

    res.json({ posts });
  } catch (error) {}
});

app.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    const postsByUser = await user.getPosts();

    res.json({ postsByUser });
  } catch (error) {}
});

app.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    await user.destroy();

    res.json({ message: `user with ${userId} deleted` });
  } catch (error) {}
});

app.listen(3000, async () => {
  console.log("server started!");
  await sequelize.authenticate();
  console.log("db authenticated!");
});
