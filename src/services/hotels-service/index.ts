import { invalidDataError, notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelsRepository.findHotels();
  if (!hotels) {
    throw notFoundError();
  }

  const hotelsWithCapacity = hotels.map((hotel) => {
    return {
      id: hotel.id,
      name: hotel.name,
      image: hotel.image,
      totalCapacity: hotel.Rooms.reduce((prev, curr) => prev + curr.capacity, 0),
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
    };
  });

  return hotelsWithCapacity;
}

async function getHotelRooms(hotelId: number) {
  const rooms = await hotelsRepository.findHotelRooms(hotelId);
  if (!rooms) {
    throw notFoundError();
  }
  return rooms;
}

async function isUserAbleToChooseHotel(userId: number) {
  const enrollment = await hotelsRepository.findEnrollmentWithUserId(userId);
  if (!enrollment) {
    throw invalidDataError(["User has no enrollment"]);
  }
  const ticketInfo = await hotelsRepository.findTicketWithInfo(enrollment.id);

  if (!ticketInfo) {
    throw invalidDataError(["User has no ticket"]);
  }

  if (isTicketInfoInvalid(ticketInfo.TicketType.isRemote, ticketInfo.TicketType.includesHotel, ticketInfo.status)) {
    throw invalidDataError(["Ticket info does not allow hotel access"]);
  }

  return;
}

function isTicketInfoInvalid(isRemote: boolean, includesHotel: boolean, status: string): boolean {
  if (isRemote || !includesHotel || status !== "PAID") {
    return true;
  }
  return false;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
  isUserAbleToChooseHotel,
};

export default hotelsService;
