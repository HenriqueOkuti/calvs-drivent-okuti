import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.query;
  const { userId } = req;

  try {
    await hotelsService.isUserAbleToChooseHotel(userId);

    if (!hotelId) {
      const hotels = await hotelsService.getHotels();
      return res.status(httpStatus.OK).send(hotels);
    }
    const hotelRooms = await hotelsService.getHotelRooms(+hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "InvalidDataError") {
      if (error.details[0] === "User has no enrollment") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      if (error.details[0] === "User has no ticket") {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      if (error.details[0] === "Ticket info does not allow hotel access") {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
      }
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
