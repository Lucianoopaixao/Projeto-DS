import request from "supertest";
import { jest } from "@jest/globals";

/**
 * MOCK DO CONTROLLER
 * (export nomeado: login)
 */
await jest.unstable_mockModule("../controllers/loginController.js", () => ({
  login: (req, res) => {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
}));

const app = (await import("../app.js")).default;

describe("Login Routes (Black Box)", () => {
  test("POST /api/login retorna 401", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        username: "teste",
        password: "errada"
      });

    expect(response.statusCode).toBe(401);
  });
});
