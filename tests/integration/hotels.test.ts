import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createUser,
  createHotel,
  createHotelRoomInfo,
  getHotelRoomInfo,
  createTicket,
  createEnrollmentWithAddress,
  createTicketTypeWithInfo,
} from "../factories";
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
    it("should respond with status 404 when user doesnt have enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketTypeWithInfo(false, true);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 if user hasn't paid for the ticket (status != PAID)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(false, true); //isRemote = false
      const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user's ticketType isRemote = true", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(true, false); //isRemote = true
      const ticket = await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user's ticketType includesHotel = false", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(false, false); // includesHotel = false , isRemote = false
      await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    describe("when everything is valid", () => {
      it("should respond with status 200 and with disponible hotels", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithInfo(false, true); // includesHotel = true , isRemote = false
        await createTicket(enrollment.id, ticketType.id, "PAID");

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
    it("should respond with status 404 when user doesnt have enrollment yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const hotel = await createHotel();
      await createHotelRoomInfo(hotel.id);
      await getHotelRoomInfo(hotel.id);

      const response = await server.get(`/hotels?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 401 if user hasn't paid for the ticket (status != PAID)", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(false, true); //isRemote = false, includesHotel = true
      await createTicket(enrollment.id, ticketType.id, "RESERVED");

      const hotel = await createHotel();
      await createHotelRoomInfo(hotel.id);
      await getHotelRoomInfo(hotel.id);

      const response = await server.get(`/hotels?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user's ticketType isRemote = true", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(true, false); //isRemote = true, includesHotel = false
      await createTicket(enrollment.id, ticketType.id, "PAID");

      const hotel = await createHotel();
      await createHotelRoomInfo(hotel.id);
      await getHotelRoomInfo(hotel.id);

      const response = await server.get(`/hotels?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if user's ticketType includesHotel = false", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(false, false); // isRemote = false, includesHotel = false
      await createTicket(enrollment.id, ticketType.id, "PAID");

      const hotel = await createHotel();
      await createHotelRoomInfo(hotel.id);
      await getHotelRoomInfo(hotel.id);

      const response = await server.get(`/hotels?hotelId=${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 404 when hotel doesnt exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotel();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithInfo(false, true); // includesHotel = true , isRemote = false
      await createTicket(enrollment.id, ticketType.id, "PAID");

      const response = await server.get(`/hotels?hotelId=${-1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    describe("when everything is valid", () => {
      it("should respond with status 200 and with hotel room data", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithInfo(false, true); // isRemote = false, includesHotel = true
        await createTicket(enrollment.id, ticketType.id, "PAID");

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
});
