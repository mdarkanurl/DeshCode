import request, { Response } from "supertest";
import app from "../index";
import { discussionData } from "./data/discussions-data";

const {
  invalidDiscussion,
  correctDiscussion,
  correctDiscussionTwo,
  updatedDiscussion
} = discussionData;

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
    expect(res.body).toHaveProperty("message", "Welcome to Express discussions Backend API");
    expect(res.body).toHaveProperty("database", "PostgreSQL");
    expect(res.body).toHaveProperty("endpoints", {
      health: "/api/health",
      discussions: '/api/v1/discussions',
      comments: '/api/v1/v1/comments'
    });
  });
});

// Describe block for /api/v1/discussions
describe("/api/v1/discussions", () => {

  let accessTokenCookie: string;
  let refreshTokenCookie: string;
  let accessTokenCookie2: string;
  let refreshTokenCookie2: string;

  beforeAll(async () => {

    // Call Auth service to login as user
    const loginRes = await request("http://localhost:3004") // or replace with Auth service URL
      .post("/api/v1/auth/login")
      .send({
        email: "user@DeshCode.com",
        password: "testingPassword"
    });

    const loginRes2 = await request("http://localhost:3004") // or replace with Auth service URL
      .post("/api/v1/auth/login")
      .send({
        email: "user2@DeshCode.com",
        password: "testingPassword"
    });

    // loginRes.headers['set-cookie'] is an array of cookie strings
    const cookies: string[] = loginRes.headers["set-cookie"] as any;
    const cookies2: string[] = loginRes2.headers["set-cookie"] as any;

    // Find the cookies by name
    accessTokenCookie = cookies.find(c => c.startsWith("accessToken="))!;
    refreshTokenCookie = cookies.find(c => c.startsWith("refreshToken="))!;
    accessTokenCookie2 = cookies2.find(c => c.startsWith("accessToken="))!;
    refreshTokenCookie2 = cookies2.find(c => c.startsWith("refreshToken="))!;
  });

  it("should return 401 unauthorized to create discussions", async () => {
    const res = await request(app).post("/api/v1/discussions");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 discussion not found", async () => {
    const res = await request(app).get("/api/v1/discussions/DeshCode");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Discussion not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 no discussions found", async () => {
    const res = await request(app).get("/api/v1/discussions");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "No discussions found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input", async () => {
    const res = await request(app).post("/api/v1/discussions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(invalidDiscussion);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    
    expect(res.body.Errors[0].code).toBe("invalid_type");
    expect(res.body.Errors[0].expected).toBe("string");
    expect(res.body.Errors[0].received).toBe("undefined");
    expect(res.body.Errors[0].path[0]).toBe("title");
    expect(res.body.Errors[0].message).toBe("Required");
  });

  it("should return 201 discussion created", async () => {
    const res = await request(app).post("/api/v1/discussions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(correctDiscussion);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Discuss created successfully");
    expect(res.body.Data.topic).toBe(correctDiscussion.topic);
  });

  it("should return 200 and all discussions", async () => {
    const res = await request(app).get("/api/v1/discussions");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "All discussions fetched successfully");

    expect(res.body.Data.discussions[0].topic).toBe(correctDiscussion.topic);
    expect(res.body.Data.discussions[0].title).toBe(correctDiscussion.title);
    expect(res.body.Data.pagination.totalDiscussions).toBe(1);
    expect(res.body.Data.pagination.currentPage).toBe(1);
    expect(res.body.Data.pagination.totalPages).toBe(1);
    expect(res.body.Data.pagination.pageSize).toBe(10);
  });

  it("should return 201 discussion created", async () => {
    const res = await request(app).post("/api/v1/discussions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(correctDiscussionTwo);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Discuss created successfully");
    expect(res.body.Data.topic).toBe(correctDiscussionTwo.topic);
  });

  let Response: Response;
  it("should return 200 and all discussions", async () => {
    Response = await request(app).get("/api/v1/discussions");

    expect(Response.status).toBe(200);
    expect(Response.body).toHaveProperty("Success", true);
    expect(Response.body).toHaveProperty("Message", "All discussions fetched successfully");

    expect(Response.body.Data.discussions[0].topic).toBe(correctDiscussion.topic);
    expect(Response.body.Data.discussions[1].topic).toBe(correctDiscussionTwo.topic);
    expect(Response.body.Data.discussions[0].title).toBe(correctDiscussion.title);
    expect(Response.body.Data.discussions[1].title).toBe(correctDiscussionTwo.title);
    expect(Response.body.Data.pagination.totalDiscussions).toBe(2);
    expect(Response.body.Data.pagination.currentPage).toBe(1);
    expect(Response.body.Data.pagination.totalPages).toBe(1);
    expect(Response.body.Data.pagination.pageSize).toBe(10);
  });

  it("should return 200 and one discussion", async () => {
    const res = await request(app).get(`/api/v1/discussions/${Response.body.Data.discussions[1].id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Discussion fetched successfully");

    expect(res.body.Data.id).toBe(Response.body.Data.discussions[1].id);
    expect(res.body.Data.title).toBe(correctDiscussionTwo.title);
    expect(res.body.Data.topic).toBe(correctDiscussionTwo.topic);
  });

  it("should return 401 unauthorized to update discussion", async () => {
    const res = await request(app).put(`/api/v1/discussions/${Response.body.Data.discussions[1].id}`)
        .set("Cookie", [refreshTokenCookie2])
        .send(updatedDiscussion);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized to update this discussion");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input", async () => {
    const res = await request(app).put(`/api/v1/discussions/${Response.body.Data.discussions[1].id}`)
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send({  });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 discussion not found", async () => {
    const res = await request(app).put(`/api/v1/discussions/deshCode`)
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(updatedDiscussion);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Discussion not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 discussion updated", async () => {
    const res = await request(app).put(`/api/v1/discussions/${Response.body.Data.discussions[1].id}`)
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(updatedDiscussion);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Discuss updated successfully");
    expect(res.body.Data.topic).toBe(Response.body.Data.discussions[1].topic);
    expect(res.body.Data.id).toBe(Response.body.Data.discussions[1].id);
  });

  it("should return 404 discussion not found", async () => {
    const res = await request(app).delete(`/api/v1/discussions/deshcode`)
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Discussion not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 401 unauthorized to delete this discussion", async () => {
    const res = await request(app).delete(`/api/v1/discussions/${Response.body.Data.discussions[0].id}`)
        .set("Cookie", [refreshTokenCookie2]);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized to delete this discussion");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 deleted the discussion", async () => {
    const res = await request(app).delete(`/api/v1/discussions/${Response.body.Data.discussions[0].id}`)
        .set("Cookie", [refreshTokenCookie]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Discuss deleted successfully");
    expect(res.body.Data.topic).toBe(Response.body.Data.discussions[0].topic);
    expect(res.body.Data.id).toBe(Response.body.Data.discussions[0].id);
  });
});