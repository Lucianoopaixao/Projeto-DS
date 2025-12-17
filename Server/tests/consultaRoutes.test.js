import request from "supertest";
import { jest } from "@jest/globals";

//MOCK DO MODEL 
await jest.unstable_mockModule("../models/consultaModel.js", () => ({
  default: {
    listarConsultas: jest.fn().mockResolvedValue([])
  }
}));

//Importa do index.js
const app = (await import("../index.js")).default;

describe("Consulta API (Black Box)", () => {
  test("GET /api/consultas retorna 200", async () => {
    const res = await request(app).get("/api/consultas");

    expect(res.statusCode).toBe(200);
  });
});