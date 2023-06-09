const express = require("express");
const app = express();
const morgan = require("morgan");

require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
// set up the view engine
app.set("view engine", "ejs");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const { Post } = require("./models");

app.get("/", async (req, res) => {
  try {
    const posts = await Post.getAllPosts();

    res.render("index", { posts });
  } catch (error) {
    console.log(error);
  }
});

app.get("/generate", async (req, res) => {
  try {
    res.render("generate");
  } catch (error) {
    console.log(error);
  }
});

app.get("/single/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.getPost(id);

    res.render("single", { post });
  } catch (error) {
    console.log(error);
  }
});

app.post("/chat", async (req, res) => {
  try {
    console.log(req.body);
    const { topic, type, keywords, tone } = req.body;

    let content = `I want to write a blog post about ${topic} and`;
    if (type || type != "none")
      content += ` I want to write it as a ${type} post.`;
    if (keywords) content += ` Include the koywords: ${keywords}.`;
    if (tone) content += ` I want to write it in a ${tone} tone.`;

    console.table({ content });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You only generate high quality seo friendly blog content",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    await Post.createPost({
      topic,
      type,
      keywords,
      tone,
      data: response.data.choices[0].message.content.trim(),
    });

    console.log(response.data);

    res.json({
      success: true,
      message: response.data.choices[0].message.content.trim(),
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
