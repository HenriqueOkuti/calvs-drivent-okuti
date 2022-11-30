import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    await preBookingVerification(userId);
    const booking = await bookingService.getUserBooking(userId);
    return res.status(httpStatus.OK).send({ id: booking.booking.id, Room: booking.roomInfo });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "NotPresentialError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "PaymentNotFound") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    await preBookingVerification(userId);
    const booking = await bookingService.postUserBooking(userId, roomId);
    return res.status(200).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "NotPresentialError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "PaymentNotFound") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "RoomFull") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body; // NEW ROOM ID
  const { bookingId } = req.params; // USER BOOKING

  try {
    await preBookingVerification(userId);
    const booking = await bookingService.putUserBooking(userId, roomId, +bookingId);
    return res.status(200).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "NotPresentialError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "InvalidRoom") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "RoomFull") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    if (error.name === "PaymentNotFound") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

async function preBookingVerification(userId: number) {
  return bookingService.isUserValidForBooking(userId);
}
