

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";

import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import User from "../model/user.model.js";
import { v4 as uuidv4 } from "uuid";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Auth Routes", () => {
  it("should sign up a user with a unique email", async () => {
    const userData = {
      email: `user-${uuidv4()}@example.com`,
      password: "securepassword123",
    };

    const res = await request(app).post("/api/auth/signup").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");

    const userInDb = await User.findOne({ email: userData.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb.password).not.toBe(userData.password); // ensure password is hashed
  });

  it("should log in a user and return a token", async () => {
    const userData = {
      email: `login-${uuidv4()}@example.com`,
      password: "securepassword123",
    };

    await request(app).post("/api/auth/signup").send(userData);

    const res = await request(app).post("/api/auth/login").send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged in");
    expect(res.body.token).toBeDefined();

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBeDefined();
  });

  it("should not log in with wrong password", async () => {
    const userData = {
      email: `wrongpass-${uuidv4()}@example.com`,
      password: "correctpass",
    };

    await request(app).post("/api/auth/signup").send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should not log in if user does not exist", async () => {
    const userData = {
      email: `nonexist-${uuidv4()}@example.com`,
      password: "whatever",
    };

    const res = await request(app).post("/api/auth/login").send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
