import request, { Response } from "supertest";
import app from "../index";
import { contestsInput } from "./data/contest-data";

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
    expect(res.body).toHaveProperty("message", "Welcome to Express contests Backend API");
    expect(res.body).toHaveProperty("database", "PostgreSQL");
    expect(res.body).toHaveProperty("endpoints", {
      health: "/api/health",
      contests: '/api/v1/contests',
      participants: '/api/v1/participants',
      submissions_contests: '/api/v1/submissions/contests'
    });
  });
});

// Describe block for /api/v1/contests
describe("/api/v1/contests", () => {

  let accessTokenCookie: string;
  let refreshTokenCookie: string;
  let accessTokenCookie2: string;
  let refreshTokenCookie2: string;

  beforeAll(async () => {

    // Call Auth service to login as user
    const loginRes = await request("http://localhost:3004") // or replace with Auth service URL
      .post("/api/v1/auth/login")
      .send({
        email: "admin@DeshCode.com",
        password: "testingPassword"
    });

    // loginRes.headers['set-cookie'] is an array of cookie strings
    const cookies: string[] = loginRes.headers["set-cookie"] as any;

    // Find the cookies by name
    accessTokenCookie = cookies.find(c => c.startsWith("accessToken="))!;
    refreshTokenCookie = cookies.find(c => c.startsWith("refreshToken="))!;
  });

  it("should return 401 unauthorized to create contests", async () => {
    const res = await request(app).post("/api/v1/contests");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input", async () => {
    const res = await request(app).post("/api/v1/contests")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie])
        .send({  });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].code).toBe("invalid_type");
    expect(res.body.Errors[0].expected).toBe("string");
    expect(res.body.Errors[0].received).toBe("undefined");
    expect(res.body.Errors[0].path[0]).toBe("name");
    expect(res.body.Errors[0].message).toBe("Required");

    expect(res.body.Errors[1].code).toBe("invalid_type");
    expect(res.body.Errors[1].expected).toBe("array");
    expect(res.body.Errors[1].received).toBe("undefined");
    expect(res.body.Errors[1].path[0]).toBe("problemsId");
    expect(res.body.Errors[1].message).toBe("Required");

    expect(res.body.Errors[2].code).toBe("invalid_type");
    expect(res.body.Errors[2].expected).toBe("string");
    expect(res.body.Errors[2].received).toBe("undefined");
    expect(res.body.Errors[2].path[0]).toBe("startTime");
    expect(res.body.Errors[2].message).toBe("Required");

    expect(res.body.Errors[3].code).toBe("invalid_type");
    expect(res.body.Errors[3].expected).toBe("string");
    expect(res.body.Errors[3].received).toBe("undefined");
    expect(res.body.Errors[3].path[0]).toBe("endTime");
    expect(res.body.Errors[3].message).toBe("Required");
  });

  it("should return 400 end time must be after start time", async () => {
    // Edit current UTC time
    contestsInput.invalidEndTimeContestInput.startTime = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();

    const res = await request(app).post("/api/v1/contests")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie])
        .send(contestsInput.invalidEndTimeContestInput);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].path[0]).toBe("endTime");
    expect(res.body.Errors[0].code).toBe("custom");
    expect(res.body.Errors[0].message).toBe("End time must be after start time");
  });

  it("should return 400 start time must be in the future", async () => {
    const res = await request(app).post("/api/v1/contests")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie])
        .send(contestsInput.invalidStartTimeContestInput);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].path[0]).toBe("startTime");
    expect(res.body.Errors[0].code).toBe("custom");
    expect(res.body.Errors[0].message).toBe("Start time must be in the future");
  });

  it("should return 400 start time must be in UTC", async () => {
    const res = await request(app).post("/api/v1/contests")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie])
        .send(contestsInput.invalidStartTimeFormateContestInput);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].path[0]).toBe("startTime");
    expect(res.body.Errors[0].code).toBe("custom");
    expect(res.body.Errors[0].message).toBe("Start time must be in UTC");
  });

  it("should return 400 end time must be in UTC", async () => {
    // Edit current UTC time
    contestsInput.invalidEndTimeFormateContestInput.startTime = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();

    const res = await request(app).post("/api/v1/contests")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie])
        .send(contestsInput.invalidEndTimeFormateContestInput);

    console.log(res);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].path[0]).toBe("endTime");
    expect(res.body.Errors[0].code).toBe("custom");
    expect(res.body.Errors[0].message).toBe("End time must be in UTC");
  });
});