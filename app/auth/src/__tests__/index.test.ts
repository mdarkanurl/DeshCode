import request, { Response } from "supertest";
import app from "../index";
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });
import { consumerEvents } from "../RabbitMQ";
import { CreateEmailResponseSuccess } from "resend";

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

// Describe block for /api/auth
describe("/api/auth", () => {

  it("should return 400 invaild input", async () => {
    const res = await request(app).post("/api/v1/auth/signup")
        .send({  });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].code).toBe("invalid_type");
    expect(res.body.Errors[0].expected).toBe("string");
    expect(res.body.Errors[0].received).toBe("undefined");
    expect(res.body.Errors[0].path).toEqual(["email"]);
    expect(res.body.Errors[0].message).toBe("Required");

    expect(res.body.Errors[1].code).toBe("invalid_type");
    expect(res.body.Errors[1].expected).toBe("string");
    expect(res.body.Errors[1].received).toBe("undefined");
    expect(res.body.Errors[1].path).toEqual(["password"]);
    expect(res.body.Errors[1].message).toBe("Required");
  });

  it("should return 201 user created", async () => {
    const waitForConsumer = new Promise<{
      status: string,
      data: CreateEmailResponseSuccess | null,
      error: unknown
    }>((resolve) => {
      consumerEvents.once("done", (result) => resolve(result));
      consumerEvents.once("error", (result) => resolve(result));
    });

    const res = await request(app).post("/api/v1/auth/signup").send({
      email: "mdarkanurl@gmail.com",
      password: "thePasswordOfThisAccountIsPassword",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", `User successfully created with this email mdarkanurl@gmail.com`);
    expect(res.body.Data.email).toBe("mdarkanurl@gmail.com");

    // Wait until consumer is done or errored
    const consumerResult = await waitForConsumer;

    if (consumerResult.status === "failure") return;
    console.log("Consumer succeeded:", consumerResult.data);
  });

  it("should return 400 user already exist under this email", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      email: "mdarkanurl@gmail.com",
      password: "thePasswordOfThisAccountIsPassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", `User already exist under this email`);
    expect(res.body).toHaveProperty("Data", null);
  });
});