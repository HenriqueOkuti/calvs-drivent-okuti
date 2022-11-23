import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelsRepository.findHotels();

  if (!hotels) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelRooms(hotelId: number) {
  const rooms = await hotelsRepository.findHotelRooms(hotelId);
  if (!rooms) {
    throw notFoundError();
  }
  return rooms;
}
const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
