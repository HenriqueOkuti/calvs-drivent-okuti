import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findHotels() {
  return await prisma.hotel.findMany({ include: { Rooms: true } });
}

async function findHotelRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

export type HotelParams = Omit<Hotel, "id" | "createdAt" | "updatedAt">;
export type RoomParams = Omit<Room, "id" | "createdAt" | "updatedAt">;

const hotelsRepository = {
  findHotels,
  findHotelRooms,
};

export default hotelsRepository;
