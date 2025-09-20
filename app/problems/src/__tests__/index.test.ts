import request from "supertest";
import app from "../index";
import { problemsData } from "./data/problems-data";
import { solutionData } from "./data/submissions-data";
const {
  textJustification,
  unformattedTextJustification,
  nQueens,
  addTwoIntegers,
  binaryTreeMaximumPathSum,
  complexNumberMultiplication,
  kthSmallestElementInABst,
  regularExpressionMatching,
  trappingRainWater,
  uniquePathsIi,
  utf8Validation,
  wildcardMatching44,
  wordLadder127,
  gameOfLife
} = problemsData;

const {
  textJustificationSolution,
  invalidProblemIdSolution,
  invalidInputSolution,
  languageNotSupportSolution,
  invalidFunctionSignature,
  incorrectProblemSolution,
  regularExpressionMatchingProblemSolution,
  failedProblemSolution,
  addTwoIntegersSolution,
  binaryTreeMaximumPathSumSolution,
  complexNumberMultiplicationSolutionSolution,
  gameOfLifeSolution,
  kthSmallestElementInABstSolution,
  trappingRainWaterSolution,
  uniquePathsIiSolution,
  utf8ValidationSolution,
  wildcardMatching44Solution,
  wordLadder127Solution
} = solutionData;

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
        email: "admin@DeshCode.com",
        password: "testingPassword"
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

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          addTwoIntegers
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(addTwoIntegers.title);
    expect(res.body.Data.description).toBe(addTwoIntegers.description);
    expect(res.body.Data.functionName).toBe(addTwoIntegers.functionName);
    expect(res.body.Data.language).toEqual(addTwoIntegers.language);
    expect(res.body.Data.difficulty).toBe(addTwoIntegers.difficulty);
    expect(res.body.Data.testCases).toEqual(addTwoIntegers.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          binaryTreeMaximumPathSum
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(binaryTreeMaximumPathSum.title);
    expect(res.body.Data.description).toBe(binaryTreeMaximumPathSum.description);
    expect(res.body.Data.functionName).toBe(binaryTreeMaximumPathSum.functionName);
    expect(res.body.Data.language).toEqual(binaryTreeMaximumPathSum.language);
    expect(res.body.Data.difficulty).toBe(binaryTreeMaximumPathSum.difficulty);
    expect(res.body.Data.testCases).toEqual(binaryTreeMaximumPathSum.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          complexNumberMultiplication
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(complexNumberMultiplication.title);
    expect(res.body.Data.description).toBe(complexNumberMultiplication.description);
    expect(res.body.Data.functionName).toBe(complexNumberMultiplication.functionName);
    expect(res.body.Data.language).toEqual(complexNumberMultiplication.language);
    expect(res.body.Data.difficulty).toBe(complexNumberMultiplication.difficulty);
    expect(res.body.Data.testCases).toEqual(complexNumberMultiplication.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          kthSmallestElementInABst
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(kthSmallestElementInABst.title);
    expect(res.body.Data.description).toBe(kthSmallestElementInABst.description);
    expect(res.body.Data.functionName).toBe(kthSmallestElementInABst.functionName);
    expect(res.body.Data.language).toEqual(kthSmallestElementInABst.language);
    expect(res.body.Data.difficulty).toBe(kthSmallestElementInABst.difficulty);
    expect(res.body.Data.testCases).toEqual(kthSmallestElementInABst.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          regularExpressionMatching
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(regularExpressionMatching.title);
    expect(res.body.Data.description).toBe(regularExpressionMatching.description);
    expect(res.body.Data.functionName).toBe(regularExpressionMatching.functionName);
    expect(res.body.Data.language).toEqual(regularExpressionMatching.language);
    expect(res.body.Data.difficulty).toBe(regularExpressionMatching.difficulty);
    expect(res.body.Data.testCases).toEqual(regularExpressionMatching.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          trappingRainWater
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(trappingRainWater.title);
    expect(res.body.Data.description).toBe(trappingRainWater.description);
    expect(res.body.Data.functionName).toBe(trappingRainWater.functionName);
    expect(res.body.Data.language).toEqual(trappingRainWater.language);
    expect(res.body.Data.difficulty).toBe(trappingRainWater.difficulty);
    expect(res.body.Data.testCases).toEqual(trappingRainWater.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          uniquePathsIi
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(uniquePathsIi.title);
    expect(res.body.Data.description).toBe(uniquePathsIi.description);
    expect(res.body.Data.functionName).toBe(uniquePathsIi.functionName);
    expect(res.body.Data.language).toEqual(uniquePathsIi.language);
    expect(res.body.Data.difficulty).toBe(uniquePathsIi.difficulty);
    expect(res.body.Data.testCases).toEqual(uniquePathsIi.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          utf8Validation
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(utf8Validation.title);
    expect(res.body.Data.description).toBe(utf8Validation.description);
    expect(res.body.Data.functionName).toBe(utf8Validation.functionName);
    expect(res.body.Data.language).toEqual(utf8Validation.language);
    expect(res.body.Data.difficulty).toBe(utf8Validation.difficulty);
    expect(res.body.Data.testCases).toEqual(utf8Validation.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          wildcardMatching44
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(wildcardMatching44.title);
    expect(res.body.Data.description).toBe(wildcardMatching44.description);
    expect(res.body.Data.functionName).toBe(wildcardMatching44.functionName);
    expect(res.body.Data.language).toEqual(wildcardMatching44.language);
    expect(res.body.Data.difficulty).toBe(wildcardMatching44.difficulty);
    expect(res.body.Data.testCases).toEqual(wildcardMatching44.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          wordLadder127
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(wordLadder127.title);
    expect(res.body.Data.description).toBe(wordLadder127.description);
    expect(res.body.Data.functionName).toBe(wordLadder127.functionName);
    expect(res.body.Data.language).toEqual(wordLadder127.language);
    expect(res.body.Data.difficulty).toBe(wordLadder127.difficulty);
    expect(res.body.Data.testCases).toEqual(wordLadder127.testCases);
  });

  it("should return 201 problem created", async () => {
    const res = await request(app)
        .post("/api/v1/problems")
        .set("Cookie", [ refreshTokenCookie]) // ✅ pass admin cookies
        .send(
          gameOfLife
        );

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem created successfully");
    expect(res.body.Data.title).toBe(gameOfLife.title);
    expect(res.body.Data.description).toBe(gameOfLife.description);
    expect(res.body.Data.functionName).toBe(gameOfLife.functionName);
    expect(res.body.Data.language).toEqual(gameOfLife.language);
    expect(res.body.Data.difficulty).toBe(gameOfLife.difficulty);
    expect(res.body.Data.testCases).toEqual(gameOfLife.testCases);
  });

  it("should return 200 and all problems", async () => {
    const res = await request(app).get("/api/v1/problems");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "All problems successfully get from Database");
    
    // Data.problems
    expect(Array.isArray(res.body.Data.problems)).toBe(true);
    expect(res.body.Data.problems).toHaveLength(10);

    // First problem
    expect(res.body.Data.problems[0].id).toBe(addTwoIntegers.id);
    expect(res.body.Data.problems[0].title).toBe(addTwoIntegers.title);
    expect(res.body.Data.problems[0].language[0]).toBe(addTwoIntegers.language[0]);
    expect(res.body.Data.problems[0].language[1]).toBe(addTwoIntegers.language[1]);
    expect(res.body.Data.problems[0].difficulty).toBe(addTwoIntegers.difficulty);

    // Second problem
    expect(res.body.Data.problems[1].id).toBe(binaryTreeMaximumPathSum.id);
    expect(res.body.Data.problems[1].title).toBe(binaryTreeMaximumPathSum.title);
    expect(res.body.Data.problems[1].language[0]).toBe(binaryTreeMaximumPathSum.language[0]);
    expect(res.body.Data.problems[1].language[1]).toBe(binaryTreeMaximumPathSum.language[1]);
    expect(res.body.Data.problems[1].difficulty).toBe(binaryTreeMaximumPathSum.difficulty);

    // Pagination
    expect(res.body.Data.pagination.totalItems).toBe(13);
    expect(res.body.Data.pagination.currentPage).toBe(1);
    expect(res.body.Data.pagination.totalPages).toBe(2);
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

  it("should return 400 unexpected end of JSON input", async () => {
    const res = await request(app)
        .put(`/api/v1/problems/${textJustification.id}`)
        .set("Cookie", [ refreshTokenCookie ]) // ✅ pass admin cookie
        .send({  });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
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

  it("should return 401 unauthorized to delete", async () => {
    const res = await request(app)
        .delete(`/api/v1/problems/${textJustification.id}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 problem not found to delete", async () => {
    const res = await request(app)
        .delete(`/api/v1/problems/DeshCode-delete`)
        .set("Cookie", [ refreshTokenCookie ]) // ✅ pass admin cookie

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Problem not found");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 Problem successfully destroyed", async () => {
    const res = await request(app)
        .delete(`/api/v1/problems/${nQueens.id}`)
        .set("Cookie", [ refreshTokenCookie ]) // ✅ pass admin cookie

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Problem successfully destroyed");
    expect(res.body.Data.id).toBe(nQueens.id);
    expect(res.body.Data.title).toBe(nQueens.title);
    expect(res.body.Data.problemsTypes).toBe(nQueens.problemsTypes);
  });
});

// Describe block for /api/v1/submissions
describe("/api/v1/submissions", () => {

  let accessTokenCookie: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {

    // Call Auth service to login as a user
    const loginRes = await request("http://localhost:3004") // or replace with Auth service URL
      .post("/api/v1/auth/login")
      .send({
        email: "user@DeshCode.com",
        password: "testingPassword",
    });

    // loginRes.headers['set-cookie'] is an array of cookie strings
    const cookies: string[] = loginRes.headers["set-cookie"] as any;

    // Find the cookies by name
    accessTokenCookie = cookies.find(c => c.startsWith("accessToken="))!;
    refreshTokenCookie = cookies.find(c => c.startsWith("refreshToken="))!;
  });

  it("should return 401 unauthorized", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .send(textJustificationSolution);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(invalidInputSolution);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input");
    expect(res.body).toHaveProperty("Data", null);

    expect(res.body.Errors[0].code).toBe("invalid_type");
    expect(res.body.Errors[0].expected).toBe("string");
    expect(res.body.Errors[0].received).toBe("undefined");
    expect(res.body.Errors[0].path[0]).toBe("language");
    expect(res.body.Errors[0].message).toBe("Required");
  })

  it('should return 404 problem not found', async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(invalidProblemIdSolution);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "The problem does not exist");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 problem doesn't support language", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(languageNotSupportSolution);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "This problem does not support ma language");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(textJustificationSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(1);
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 401 unauthorized to get solution", async () => {

    const res = await request(app).get("/api/v1/submissions/1")

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Unauthorized");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 404 solution not found", async () => {

    const res = await request(app).get("/api/v1/submissions/1000")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "The submit ID you provided it doesn't exist");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 400 invalid input, ID params missing", async () => {

    const res = await request(app).get("/api/v1/submissions/0")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("Success", false);
    expect(res.body).toHaveProperty("Message", "Invalid input, ID params missing");
    expect(res.body).toHaveProperty("Data", null);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/1")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(1);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(textJustification.id);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(invalidFunctionSignature);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(2);
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 INVALID_FUNCTION_SIGNATURE", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/2")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission has an invalid function signature.");
    expect(res.body.Data.id).toBe(2);
    expect(res.body.Data.status).toBe("INVALID_FUNCTION_SIGNATURE");
    expect(res.body.Data.problemsId).toBe(invalidFunctionSignature.problemsId);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(incorrectProblemSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(3)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 WRONG_ANSWER", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/3")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission returned wrong answer.");
    expect(res.body.Data.id).toBe(3);
    expect(res.body.Data.status).toBe("WRONG_ANSWER");
    expect(res.body.Data.problemsId).toBe(incorrectProblemSolution.problemsId);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(regularExpressionMatchingProblemSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(4)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/4")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(4);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(regularExpressionMatchingProblemSolution.problemsId);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(failedProblemSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(5)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution failed", async () => {

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const res = await request(app).get("/api/v1/submissions/5")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission failed.");
    expect(res.body.Data.id).toBe(5);
    expect(res.body.Data.status).toBe("FAILED");
    expect(res.body.Data.problemsId).toBe(regularExpressionMatchingProblemSolution.problemsId);
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(addTwoIntegersSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(6)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies
        .send(binaryTreeMaximumPathSumSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(7)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(complexNumberMultiplicationSolutionSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(8)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(gameOfLifeSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(9)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(kthSmallestElementInABstSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(10)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(uniquePathsIiSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(11)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(utf8ValidationSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(12)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(wildcardMatching44Solution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(13)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(wordLadder127Solution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(14)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 solution submitted", async () => {
    const res = await request(app).post("/api/v1/submissions")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies
        .send(trappingRainWaterSolution);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Solution submitted successfully");
    expect(res.body.Data.submissionsId).toBe(15)
    expect(res.body.Data.status).toBe("PENDING");
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/6")
        .set("Cookie", [accessTokenCookie, refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(6);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(addTwoIntegersSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/7")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(7);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(binaryTreeMaximumPathSumSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/8")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(8);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(complexNumberMultiplicationSolutionSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/9")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(9);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(gameOfLifeSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/10")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(10);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(kthSmallestElementInABstSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/11")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(11);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(uniquePathsIiSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/12")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(12);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(utf8ValidationSolution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/13")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(13);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(wildcardMatching44Solution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/14")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(14);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(wordLadder127Solution.problemsId);
  });

  it("should return 200 correct solution", async () => {

    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await request(app).get("/api/v1/submissions/15")
        .set("Cookie", [refreshTokenCookie]) // ✅ pass user cookies

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Success", true);
    expect(res.body).toHaveProperty("Message", "Submission accepted successfully.");
    expect(res.body.Data.id).toBe(15);
    expect(res.body.Data.status).toBe("ACCEPTED");
    expect(res.body.Data.problemsId).toBe(trappingRainWaterSolution.problemsId);
  });
});