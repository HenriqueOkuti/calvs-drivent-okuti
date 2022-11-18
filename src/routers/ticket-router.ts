import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { postTicketSchema } from "@/schemas";
import { getTicket, getTicketType, postTicket } from "@/controllers";
const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/tickets/types", getTicketType)
  .get("/tickets", getTicket)
  .post("/tickets", validateBody(postTicketSchema), postTicket);

export { ticketRouter };
