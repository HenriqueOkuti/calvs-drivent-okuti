import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser, createHotel, createHotelRoomInfo, getHotelList, getHotelRoomInfo } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and with disponible hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();

      await createHotelRoomInfo(hotel.id);
      await createHotelRoomInfo(hotel.id);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      const HotelRoomsInfo = await getHotelRoomInfo(hotel.id);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([
        {
          ...hotel,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          totalCapacity: HotelRoomsInfo.reduce((prev, curr) => prev + curr.capacity, 0),
        },
      ]);
    });
  });
});

describe("GET /hotels?hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when hotel doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotel();

      const response = await server.get(`/hotels?hotelId=${-1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and with hotel room data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();

      await createHotelRoomInfo(hotel.id);

      const desiredHotelRoomInfo = await getHotelRoomInfo(hotel.id);

      const response = await server.get(`/hotels?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        desiredHotelRoomInfo.map((room) => {
          return {
            id: room.id,
            capacity: room.capacity,
            hotelId: room.hotelId,
            name: room.name,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          };
        }),
      );
    });
  });
});
