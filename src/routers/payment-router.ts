import { Router } from "express";
import { authenticateToken, validateBody, validateQuery } from "@/middlewares";
import { getPaymentSchema, postPaymentSchema } from "@/schemas";
import { getPayment, postPayment } from "@/controllers";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .get("/payments", validateQuery(getPaymentSchema), getPayment)
  .post("/payments/process", validateBody(postPaymentSchema), postPayment);

export { paymentRouter };
