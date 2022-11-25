import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.name.findName(),
    },
  });
}

export async function createHotelRoomInfo(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    },
  });
}

export async function getHotelRoomInfo(hotelId: number) {
  return prisma.hotel.findMany({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

export async function getHotelList() {
  return prisma.hotel.findMany({});
}

export async function createTicketTypeWithInfo(isRemote: boolean, includesHotel: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote,
      includesHotel: includesHotel,
    },
  });
}
