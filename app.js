import express from "express";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

connectDB(); // connect to MongoDB


app.use(express.json());
// app.use((req, res, next) => {
//   console.log("Incoming Request:", req.method, req.url);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   next();
// });

app.use("/api/tasks", taskRoutes); 
app.use("/api/auth", authRoutes); 

app.get("/", (_req, res) => {
  res.send("Node Task API running");
});

export default app;
