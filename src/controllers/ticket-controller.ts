import { AuthenticatedRequest } from "@/middlewares";
import ticketService, { fullTicketInfoType } from "@/services/ticket-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const userTickets = (await ticketService.getTicketWithUserID(userId)) as fullTicketInfoType;
    return res.status(httpStatus.OK).send(userTickets);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTicketType(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketService.getTicketType();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;

  try {
    const ticketTypeInfo = await ticketService.insertTicketWithTicketTypeId(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(ticketTypeInfo);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
