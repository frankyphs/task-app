/* eslint-disable */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.json());

let tasks = [];

app.post(`/tasks`, async (req, res) => {
  const { title, description, ...customData } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  const newTask = { id: tasks.length + 1, title, description, ...customData };
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

app.get("/tasks", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = tasks.slice(startIndex, endIndex);

  return res.json(results);
});

app.get(`/tasks/:id`, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  return res.json(task);
});

app.put(`/tasks/:id`, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const editedTask = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...editedTask,
  };

  return res.json(tasks[taskIndex]);
});

app.delete(`/tasks/:id`, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  return res.json(deletedTask[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
