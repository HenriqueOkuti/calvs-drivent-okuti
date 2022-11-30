import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token is needed

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token must be valid

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //I need a session for the token

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have enrollment

    it("should respond with status 402 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be isRemote = false

    it("should respond with status 4XX when user ticket does not include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be includesHotel = true

    it("should respond with status 4XX when user hasn't paid for the ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have paid for the Ticket (Ticket status = PAID)

    describe("when everything is valid", () => {
      it("should return with status 404 when there's no booking info", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual({ expected: "answer" });
      });

      it("should return with status 200 and booking info", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual({ expected: "answer" });
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token is needed

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token must be valid

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //I need a session for the token

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have enrollment

    it("should respond with status 402 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be isRemote = false

    it("should respond with status 4XX when user ticket does not include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be includesHotel = true

    it("should respond with status 4XX when user hasn't paid for the ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have paid for the Ticket (Ticket status = PAID)

    it("should respond with status 404 when room id does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //RoomId must exist

    it("should respond with status 403 when room id has no vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //RoomId must not be completely filled

    it("should respond with status 403 when user has no YYY", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must not have booked a room yet

    describe("when everything is valid", () => {
      it("should return with status 200 and booking id", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual({ expected: "answer" });
      });
    });
  });
});

describe("PUT /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put(`/booking/${1}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token is needed

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //Token must be valid

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); //I need a session for the token

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have enrollment

    it("should respond with status 402 when user ticket is remote ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be isRemote = false

    it("should respond with status 4XX when user ticket does not include hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      //Hoteis no banco

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    }); //TicketType must be includesHotel = true

    it("should respond with status 4XX when user hasn't paid for the ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must have paid for the Ticket (Ticket status = PAID)

    it("should respond with status 404 when user hasn't booked a room", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //RoomId must exist

    it("should respond with status 404 when room id does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //RoomId must exist

    it("should respond with status 403 when room id has no vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //RoomId must not be completely filled

    it("should respond with status 403 when user is trying to re-book the same room", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must pass a different roomId from the one they have

    it("should respond with status 403 when user has no YYY", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createTicketTypeRemote();

      const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    }); //User must not have booked a room yet

    describe("when everything is valid", () => {
      it("should return with status 200 and booking id", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);
        //Hoteis no banco
        const response = await server.put(`/booking/${1}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual({ expected: "answer" });
      });
    });
  });
});
