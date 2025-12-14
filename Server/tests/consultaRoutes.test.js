import request from "supertest";
import { jest } from "@jest/globals";

/**
 * MOCK DO MODEL
 */
await jest.unstable_mockModule("../models/consultaModel.js", () => ({
  default: {
    listarConsultas: jest.fn().mockResolvedValue([])
  }
}));

const app = (await import("../app.js")).default;

describe("Consulta API (Black Box)", () => {
  test("GET /api/consulta retorna 200", async () => {
    const res = await request(app).get("/api/consulta");

    expect(res.statusCode).toBe(200);
  });
});
