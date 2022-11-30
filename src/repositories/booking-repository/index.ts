import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({ where: { userId } });
}

async function findRoom(id: number) {
  return prisma.room.findFirst({ where: { id } });
}

async function findBookedRoom(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function insertNewBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function findUserBooking(id: number) {
  return prisma.booking.findFirst({
    where: { id },
  });
}

async function updateUserBooking(bookingId: number, newRoomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      roomId: newRoomId,
    },
  });
}

export const bookingRepository = {
  findBooking,
  findRoom,
  findBookedRoom,
  insertNewBooking,
  findUserBooking,
  updateUserBooking,
};
