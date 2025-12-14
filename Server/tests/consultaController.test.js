import { jest } from "@jest/globals";

/**
 * MOCK DO MODEL
 * (inclui default porque o controller usa import default)
 */
await jest.unstable_mockModule("../models/consultaModel.js", () => ({
  __esModule: true,
  default: {
    listarConsultas: jest.fn()
  },
  listarConsultas: jest.fn()
}));

// imports APÓS o mock
const { listar } = await import("../controllers/consultaController.js");
const consultaModel = (await import("../models/consultaModel.js")).default;

describe("Consulta Controller (White Box)", () => {
  test("listar retorna 200", async () => {
    consultaModel.listarConsultas.mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await listar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });
});
