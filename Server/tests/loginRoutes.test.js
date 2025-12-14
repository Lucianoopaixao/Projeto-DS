import request from "supertest";
import { jest } from "@jest/globals";

/**
 * MOCK DO CONTROLLER
 */
await jest.unstable_mockModule("../controllers/loginController.js", () => ({
  login: (req, res) => {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }
}));

// CORREÇÃO: Importa do index.js
const app = (await import("../index.js")).default;

describe("Login Routes (Black Box)", () => {
  test("POST /login retorna 401", async () => {
    // CORREÇÃO: Rota simplificada (/login) para bater com o index.js
    const response = await request(app)
      .post("/login")
      .send({
        username: "teste",
        password: "errada"
      });

    expect(response.statusCode).toBe(401);
  });
});