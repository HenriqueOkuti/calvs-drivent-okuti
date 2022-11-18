import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";

async function insertTicketWithTicketTypeId(ticketTypeId: number, userId: number) {
  const enrollment = await ticketRepository.findEnrollmentWithUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticketTypeInfo = await ticketRepository.findOneTicketType(ticketTypeId);
  if (!ticketTypeInfo) {
    throw notFoundError();
  }
  //with ticket info: insert ticket
  const insertInfo = await ticketRepository.insertTicket(ticketTypeId, enrollment.id);

  const fullTicketInfo: fullTicketInfoType = {
    id: insertInfo.id,
    status: insertInfo.status,
    ticketTypeId: insertInfo.ticketTypeId,
    enrollmentId: insertInfo.enrollmentId,
    TicketType: {
      id: ticketTypeInfo.id,
      name: ticketTypeInfo.name,
      price: ticketTypeInfo.price,
      isRemote: ticketTypeInfo.isRemote,
      includesHotel: ticketTypeInfo.includesHotel,
      createdAt: ticketTypeInfo.createdAt,
      updatedAt: ticketTypeInfo.updatedAt,
    },
    createdAt: insertInfo.createdAt,
    updatedAt: insertInfo.updatedAt,
  };

  return fullTicketInfo;
}

async function getTicketWithUserID(userId: number) {
  const enrollment = await ticketRepository.findEnrollmentWithUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketWithEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  const ticketType = await ticketRepository.findTicketTypeWithTicketTypeId(ticket.ticketTypeId);

  const fullTicketInfo: fullTicketInfoType = {
    id: ticket.id,
    status: ticket.status,
    ticketTypeId: ticket.ticketTypeId,
    enrollmentId: ticket.enrollmentId,
    TicketType: {
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    },
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };

  return fullTicketInfo;
}

export type fullTicketInfoType = {
  id: number;
  status: string; //RESERVED | PAID
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

async function getTicketType() {
  const ticketTypes = await ticketRepository.findTicketType();
  return ticketTypes;
}

const ticketService = { insertTicketWithTicketTypeId, getTicketWithUserID, getTicketType };

export default ticketService;
