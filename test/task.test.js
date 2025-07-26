
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

  // Create test user "testuser@example.com"
  await request(app).post("/api/auth/signup").send({
    email: "testuser@example.com",
    password: "securepassword123",
  });

  // Login to get token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "securepassword123",
  });

  token = loginRes.body.token; 
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
    await Task.create({
      title: "Test Task",
      description: "Finish writing the REST API POST",
      status: "pending",
    });

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
      .send({
        title: "Find me",
        description: "Finish writing the REST API POST",
        status: "pending",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Find me");
     expect(res.body).toHaveProperty("status", "pending");
  });
});

describe("GET /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Find me", description: "Finish writing the REST API POST", status: "pending" });

    const taskId = created.body._id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Find me");
  });
});

describe("UPDATE /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Find me",
        description: "Finish writing the REST API POST",
        status: "pending"
      });

    const taskId = created.body._id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Find me");
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Find me",
        status: "pending"
      });

    const taskId = created.body._id;

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Find me");
    
  });
});
