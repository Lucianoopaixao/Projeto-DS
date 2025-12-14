import { jest } from "@jest/globals";
import checkInController from "../controllers/checkInController.js";

describe("CheckIn Controller (White Box)", () => {
  test("retorna 400 se dados incompletos", async () => {
    const req = { body: {} };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await checkInController.criarMedicamento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
