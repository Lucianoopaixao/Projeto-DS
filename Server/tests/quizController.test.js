import { jest } from "@jest/globals";

//MOCK DO MODEL
await jest.unstable_mockModule("../models/quizModel.js", () => ({
  default: {
    retornarquestoes: jest.fn()
  }
}));

// IMPORTA O CONTROLLER COMO DEFAULT
const quizController = (await import("../controllers/quizController.js")).default;
const quizModel = (await import("../models/quizModel.js")).default;

describe("Quiz Controller (White Box)", () => {
  test("deve retornar lista de questões", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    quizModel.retornarquestoes.mockResolvedValue([
      { id: 1, pergunta: "Teste" }
    ]);

    await quizController.pegarperguntas(req, res);

    expect(quizModel.retornarquestoes).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, pergunta: "Teste" }
    ]);
  });
});
