import request from "supertest";
import app from "../index";
import { problemsData } from "./data/problems-data";
const { textJustification, unformattedTextJustification, nQueens } = problemsData;

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
    expect(res.body).toHaveProperty("message", "Welcome to Express problems Backend API");
    expect(res.body).toHaveProperty("database", "PostgreSQL");
    expect(res.body).toHaveProperty("endpoints", {
      health: "/api/health",
      problem: "/api/v1/problems",
      submit: "/api/v1/submissions",
    });
  });
});

// Describe block for /api/v1/problems
describe("/api/v1/problems", () => {

  let accessTokenCookie: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {

    // Call Auth service to login as admin
    const loginRes = await request("http://localhost:3004") // or replace with Auth service URL
      .post("/api/v1/auth/login")
      .send({
        email: "mdarkanurl@gmail.com",
        password: "DeshCode.com",
    });

    // loginRes.headers['set-cookie'] is an array of cookie strings
    const cookies: string[] = loginRes.headers["set-cookie"] as any;

    // Find the cookies by name
    accessTokenCookie = cookies.find(c => c.startsWith("accessToken="))!;
    refreshTokenCookie = cookies.find(c => c.startsWith("refreshToken="))!;
  });

  it("should return 404 problems not found", async () => {
    const res = await request(app).get("/api/v1/problems");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "No problems found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 401 unauthorized to create problem", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .send(
          problemsData.textJustification
        );

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          unformattedTextJustification
        );

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    // Check first error
    expect(res.body.Errors[0].code).toBe("too_small");
    expect(res.body.Errors[0].minimum).toBe(1);
    expect(res.body.Errors[0].type).toBe("array");
    expect(res.body.Errors[0].inclusive).toBe(true);
    expect(res.body.Errors[0].exact).toBe(false);
    expect(res.body.Errors[0].message).toBe("Array must contain at least 1 element(s)");
    expect(res.body.Errors[0].path).toEqual(["language"]);

    // Check second error
    expect(res.body.Errors[1].received).toBe("");
    expect(res.body.Errors[1].code).toBe("invalid_enum_value");
    expect(res.body.Errors[1].options).toEqual([
      "NORMAL_PROBLEM",
      "Arrays_and_Strings",
      "Linked_Lists",
      "Trees_and_Graphs",
      "Dynamic_Programming",
      "Sorting_and_Searching",
    ]);
    expect(res.body.Errors[1].path).toEqual(["problemsTypes"]);
    expect(res.body.Errors[1].message).toBe(
      "Invalid enum value. Expected 'NORMAL_PROBLEM' | 'Arrays_and_Strings' | 'Linked_Lists' | 'Trees_and_Graphs' | 'Dynamic_Programming' | 'Sorting_and_Searching', received ''"
    );
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          textJustification
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(textJustification.title);
    expect(res.body.Data.description).toBe(textJustification.description);
    expect(res.body.Data.functionName).toBe(textJustification.functionName);
    expect(res.body.Data.language).toEqual(textJustification.language);
    expect(res.body.Data.difficulty).toBe(textJustification.difficulty);
    expect(res.body.Data.testCases).toEqual(textJustification.testCases);
  });

  it("should return 400 Bad Request problem already exist", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          textJustification
        );

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "The problem id text-justification already taken");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          nQueens
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(nQueens.title);
    expect(res.body.Data.description).toBe(nQueens.description);
    expect(res.body.Data.functionName).toBe(nQueens.functionName);
    expect(res.body.Data.language).toEqual(nQueens.language);
    expect(res.body.Data.difficulty).toBe(nQueens.difficulty);
    expect(res.body.Data.testCases).toEqual(nQueens.testCases);
  });

  it("should return 200 and all problems", async () => {
    const res = await request(app).get("/api/v1/problems");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "All problems successfully get from Database");
    
    // Data.problems
    expect(Array.isArray(res.body.Data.problems)).toBe(true);
    expect(res.body.Data.problems).toHaveLength(2);

    // First problem
    expect(res.body.Data.problems[0].id).toBe(nQueens.id);
    expect(res.body.Data.problems[0].title).toBe(nQueens.title);
    expect(res.body.Data.problems[0].language[0]).toBe(nQueens.language[0]);
    expect(res.body.Data.problems[0].language[1]).toBe(nQueens.language[1]);
    expect(res.body.Data.problems[0].difficulty).toBe(nQueens.difficulty);

    // Second problem
    expect(res.body.Data.problems[1].id).toBe(textJustification.id);
    expect(res.body.Data.problems[1].title).toBe(textJustification.title);
    expect(res.body.Data.problems[1].language[0]).toBe(textJustification.language[0]);
    expect(res.body.Data.problems[1].language[1]).toBe(textJustification.language[1]);
    expect(res.body.Data.problems[1].difficulty).toBe(textJustification.difficulty);

    // Pagination
    expect(res.body.Data.pagination.totalItems).toBe(2);
    expect(res.body.Data.pagination.currentPage).toBe(1);
    expect(res.body.Data.pagination.totalPages).toBe(1);
    expect(res.body.Data.pagination.pageSize).toBe(10);
  });

  it("should return 404 problem not found", async () => {
    const res = await request(app).get("/api/v1/problems/DeshCode");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Problem not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 and get one problem", async () => {
    const res = await request(app).get(`/api/v1/problems/${textJustification.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem get successfully");

    expect(res.body.Data.title).toBe(textJustification.title);
    expect(res.body.Data.description).toBe(textJustification.description);
    expect(res.body.Data.functionName).toBe(textJustification.functionName);
    expect(res.body.Data.language).toEqual(textJustification.language);
    expect(res.body.Data.difficulty).toBe(textJustification.difficulty);
    expect(res.body.Data.testCases).toEqual(textJustification.testCases);
  });

  it("should return 401 unauthorized to update", async () => {
    const res = await request(app)
        .put(`/api/v1/problems/${textJustification.id}`)
        .send(
          { "title": "Max Chunks To Make Sorted II test" }
        );

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 problem not found to update", async () => {
    const res = await request(app)
        .put("/api/v1/problems/DeshCode-update")
        .set("Cookie", [ refreshTokenCookie ]) // ✅ pass admin cookie
        .send({ "title": "Max Chunks To Make Sorted II test" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Problem not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 problem updated", async () => {
    const res = await request(app)
        .put(`/api/v1/problems/${textJustification.id}`)
        .set("Cookie", [ refreshTokenCookie ]) // ✅ pass admin cookie
        .send({ "title": "This is the title of textJustification after update the title" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem successfully updated");
    expect(res.body.Data.id).toBe(textJustification.id);
    expect(res.body.Data.title).toBe("This is the title of textJustification after update the title");
    expect(res.body.Data.problemsTypes).toBe(textJustification.problemsTypes);
  });
});