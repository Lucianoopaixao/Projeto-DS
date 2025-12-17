import { jest } from "@jest/globals";

//MOCK DO AXIOS
await jest.unstable_mockModule("axios", () => ({
  default: {
    post: jest.fn(),
    get: jest.fn()
  }
}));

//MOCK DO PRISMA
await jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      upsert: jest.fn()
    }
  }))
}));

const axios = (await import("axios")).default;
const { login } = await import("../controllers/loginController.js");

describe("Login Controller (White Box)", () => {
  test("retorna 500 quando API externa falha", async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error_description: "Credenciais inválidas" }
      }
    });

    const req = {
      body: {
        username: "teste",
        password: "errada"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });
});
