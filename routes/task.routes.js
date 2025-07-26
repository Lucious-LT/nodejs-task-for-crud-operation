import express from "express";
import { auth } from "../middleware/auth.middleware.js";


import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";



const router = express.Router();




router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", auth, createTask);
router.patch("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

export default router;
