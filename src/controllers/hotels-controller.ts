import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.query;

  try {
    if (!hotelId) {
      const hotels = await hotelsService.getHotels();
      return res.status(httpStatus.OK).send(hotels);
    }
    const hotelRooms = await hotelsService.getHotelRooms(+hotelId);
    return res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
