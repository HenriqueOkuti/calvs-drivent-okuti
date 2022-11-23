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

export function createHotelRoomInfo(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId: hotelId,
    },
  });
}

export function getHotelRoomInfo(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId },
  });
}

export function getHotelList() {
  return prisma.hotel.findMany({});
}
