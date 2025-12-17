import { jest } from "@jest/globals";
import request from "supertest";

//MOCK DO MODEL DO QUIZ
await jest.unstable_mockModule("../models/quizModel.js", () => ({
  __esModule: true,
  default: {
    retornarquestoes: jest.fn().mockResolvedValue([])
  },
  retornarquestoes: jest.fn().mockResolvedValue([])
}));

//Importa do index.js
const app = (await import("../index.js")).default;

describe("Quiz API (Black Box)", () => {
  test("GET /api/quiz retorna 200", async () => {
    const res = await request(app).get("/api/quiz");

    expect(res.statusCode).toBe(200);
  });
});