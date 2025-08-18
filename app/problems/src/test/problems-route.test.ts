import app from "../index";
import request from "supertest";


request(app)
  .get('/api/v1/problems')
  .expect('Content-Type', /json/)
  .expect(404)
  .end(function(err, res) {
    if (err) throw err;
  });