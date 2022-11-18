import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import {} from "@/controllers";
import { createPaymentSchema } from "@/schemas";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/payments", () => {
    let a = 2;
    a = a + 2;
    return a;
  })
  .post("/payments/process", validateBody(createPaymentSchema), () => {
    let a = 2;
    a = a + 2;
    return a;
  });

export { paymentsRouter };
