import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const { userId } = req;

  try {
    await hotelsService.isUserAbleToChooseHotel(userId);

    if (!hotelId) {
      const hotels = await hotelsService.getHotels();
      return res.status(httpStatus.OK).send(hotels);
    }
    const hotelRooms = await hotelsService.getHotelRooms(+hotelId);

    if (!hotelRooms[0].Rooms[0]) {
      return res.status(httpStatus.OK).send([]);
    }

    return res.status(httpStatus.OK).send(
      hotelRooms.map((hotel) => {
        return {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: {
            id: hotel.Rooms[0].id,
            name: hotel.Rooms[0].name,
            capacity: hotel.Rooms[0].capacity,
            hotelId: hotel.Rooms[0].hotelId,
            createdAt: hotel.Rooms[0].createdAt.toISOString(),
            updatedAt: hotel.Rooms[0].updatedAt.toISOString(),
          },
        };
      }),
    );
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
