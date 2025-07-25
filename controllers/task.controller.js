import Task from "../model/task.model.js";

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const createTask = async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTask) return res.status(404).json({ message: "Task not found" });
  res.json(updatedTask);
};

export const deleteTask = async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  if (!deletedTask) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};
