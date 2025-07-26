// task.test.js
// ✅ Set environment vars BEFORE imports
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../app.js"; // ✅ This must come AFTER env vars
import Task from "../model/task.model.js";


let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test user "lucious"
  await request(app).post("/api/auth/signup").send({
    username: "lucious",
    password: "securepassword123",
  });

  // Login to get token
  const loginRes = await request(app).post("/api/auth/login").send({
    username: "lucious",
    password: "securepassword123",
  });

  token = loginRes.body.token; // Make sure your login route returns { token: "..." }
});

afterEach(async () => {
  await Task.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /tasks", () => {
  it("should return all tasks", async () => {
    await Task.create({ title: "Test Task", completed: "pending" });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Test Task");
  });
});

describe("POST /api/tasks", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Task", completed: "pending" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "New Task");
     expect(res.body).toHaveProperty("status", "pending");
  });
});

describe("GET /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Find me", completed: "pending" });

    const taskId = created.body._id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Find me");
  });
});
