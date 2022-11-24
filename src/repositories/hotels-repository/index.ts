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

async function findEnrollmentWithUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: {
      userId,
    },
  });
}

async function findTicketWithInfo(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

export type HotelParams = Omit<Hotel, "id" | "createdAt" | "updatedAt">;
export type RoomParams = Omit<Room, "id" | "createdAt" | "updatedAt">;

const hotelsRepository = {
  findHotels,
  findHotelRooms,
  findEnrollmentWithUserId,
  findTicketWithInfo,
};

export default hotelsRepository;
