const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://devbasanta:JamunTech123@jamuntech.omyzdj7.mongodb.net/todo-app?retryWrites=true&w=majority"
);

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

const Todo = mongoose.model("todo", {
  name: String,
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find({
    name: {
      $regex: req.query?.query ?? "",
    },
  });
  res.render("todos", { todos });
});

app.post("/todos", async (req, res) => {
  await Todo.create(req.body);
  const todos = await Todo.find();
  res.render("todos", { todos });
});

app.post("/todos/delete/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id });
  const todos = await Todo.find();
  res.render("todos", { todos });
});

app.get("/todos/edit/:id", async (req, res) => {
  const todos = await Todo.find();
  const todo = await Todo.findOne({ _id: req.params.id });
  res.render("todos", {
    todos,
    action: `/todos/edit/${req.params.id}`,
    value: todo.name,
  });
});

app.post("/todos/edit/:id", async (req, res) => {
  await Todo.updateOne({ _id: req.params.id }, req.body);
  const todos = await Todo.find();
  res.render("todos", {
    todos,
    action: "/todos",
    oldTodoValue: "",
  });
});



app.listen(4000, () => {
  console.log("Server is up and running.");
});
