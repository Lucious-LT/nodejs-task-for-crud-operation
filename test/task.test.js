import request from "supertest";
import app from "../app.js"; 

describe("GET /tasks", () => {
  it("should return all tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); 
  });
});

describe("POST /api/tasks", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "New Task", completed: false });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "New Task");
  });
});

describe("GET /api/tasks/:id", () => {
  it("should return task by ID", async () => {
    const create = await request(app)
      .post("/api/tasks")
      .send({ title: "Find me", completed: false });

    const taskId = create.body._id;

    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Find me");
  });
});
