import { AuthenticatedRequest } from "@/middlewares";
import paymentService from "@/services/payment-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId } = req.query;
  try {
    const paymentInfo = await paymentService.getPaymentWithUserIdAndTicketId(userId, +ticketId);

    return res.status(httpStatus.OK).send(paymentInfo);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedError") {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const paymentInfo = req.body as postPaymentType;
  const { userId } = req;

  try {
    const something = await paymentService.postPaymentWithUserIdAndPaymentInfo(userId, paymentInfo);

    return res.status(httpStatus.OK).send(something);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.send(httpStatus.NOT_FOUND);
    }
    if (error.name === "UnauthorizedError") {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

type postPaymentType = {
  ticketId: number;
  cardData: cardData;
};

type cardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};
