import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getPaymentByTicketId, paymentProcess } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", (req, res) => {
    return res.sendStatus(207); //getBooking
  })
  .post("", (req, res) => {
    return res.sendStatus(208); //postBooking
  })
  .put("/:bookingId", (req, res) => {
    return res.sendStatus(209); //putBooking
  });

export { bookingRouter };
