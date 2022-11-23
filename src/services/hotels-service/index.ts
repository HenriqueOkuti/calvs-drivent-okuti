import { notFoundError } from "@/errors";
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
  if (!rooms || !rooms[0]) {
    throw notFoundError();
  }
  return rooms;
}
const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
