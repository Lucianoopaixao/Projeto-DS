import request from "supertest";
import app from "../app.js";

describe("CheckIn API (Black Box)", () => {
  test("POST /api/checkin retorna 400 se vazio", async () => {
    const res = await request(app)
      .post("/api/checkin")
      .send({});

    expect(res.statusCode).toBe(400);
  });
});
