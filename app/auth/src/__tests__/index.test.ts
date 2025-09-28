import request, { Response } from "supertest";
import app from "../index";

// Describe block for App
describe("App", () => {
  it("should return health check with DB connected", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("database", "Connected");
    expect(res.body).toHaveProperty("message", "Server is running");
  });

  it("should return root endpoint", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Welcome to Express auth Backend API");
    expect(res.body).toHaveProperty("database", "PostgreSQL");
    expect(res.body).toHaveProperty("endpoints", {
      health: "/api/health",
      auth: '/api/auth',
      oauth: '/api/oauth'
    });
  });
});
