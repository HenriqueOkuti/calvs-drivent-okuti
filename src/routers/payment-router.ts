import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postPaymentSchema } from "@/schemas";
import { getPayment, postTicket } from "@/controllers";

const paymentRouter = Router();

paymentRouter
  .all("/*", authenticateToken)
  .get("/payments", getPayment)
  .post("/payments/process", validateBody(postPaymentSchema), postTicket);

export { paymentRouter };

//TODO: POST: token is valid -> set ticket status as PAID
//TODO: POST: token is valid -> insert new payment in the database
//TODO: POST: token is valid -> 200 + payment data
//TODO: POST: token is valid -> 401 if user does not own given ticket
//TODO: POST: token is valid -> 404 if ticket does not exist
//OK: TODO: POST: token is valid -> 400 if body param cardData is missing
//OK: TODO: POST: token is valid -> 400 if body param ticketId is missing
//OK: TODO: POST: token is valid -> 401 if there's no session for given token
//OK: TODO: POST: token is valid -> 401 if token is not valid
//OK: TODO: POST: token is valid -> 400 if no token is given

//TODO: GET: token is valid -> 200 + payment data
//TODO: GET: token is valid -> 401 if does not own given ticket
//TODO: GET: token is valid -> 404 if ticket does not exist
//TODO: GET: token is valid -> 400 if query param ticketId is missing
//OK: TODO: GET: token is valid -> 401 if there is no session for given token
//OK: TODO: GET: token is valid -> 401 if token is not valid
//OK: TODO: GET: token is valid -> 404 if no token is given
