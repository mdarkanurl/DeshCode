import supertest from "supertest";
import dotenv from 'dotenv';
import { problemsData } from "../data/problems-data";
import app from "../../src/index";
dotenv.config({ path: '.env' });

describe('Problems routes', () => {
  it('Should return 404 "No problems found"', async () => {
    const response = await supertest(app)
      .get('/api/v1/problems')
      expect(response.body.Success).toEqual(false);
      expect(response.body.Message).toEqual("No problems found");
      expect(response.status).toEqual(404);
  });

  it('Should create a problems', async () => {
    const response = await supertest(app)
      .post('/api/v1/problems')
      .send(problemsData.nQueens)
      expect(response.body.Success).toEqual(true);
      expect(response.body.Message).toEqual("Problem created successfully");
      expect(response.status).toEqual(201);
  });
});