import { jest } from "@jest/globals";
import checkInController from "../controllers/checkInController.js";

describe("CheckIn Controller (White Box)", () => {
  test("retorna 400 se dados incompletos", async () => {
    //Simula uma requisicao (req) com corpo vazio para forçar o erro de validacao
    const req = { body: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    //Executa o metodo injetando os objetos falsos
    await checkInController.criarMedicamento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
