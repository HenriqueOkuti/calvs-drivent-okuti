import { prisma } from "@/config";

async function insertTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: { ticketTypeId: ticketTypeId, enrollmentId: enrollmentId, status: "RESERVED" },
  });
}

async function findEnrollmentWithUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
  });
}

async function findTicketWithEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
  });
}

async function findTicketTypeWithTicketTypeId(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

async function findTicketType() {
  return prisma.ticketType.findMany();
}

async function findOneTicketType(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

const ticketRepository = {
  insertTicket,
  findEnrollmentWithUserId,
  findTicketWithEnrollmentId,
  findTicketTypeWithTicketTypeId,
  findTicketType,
  findOneTicketType,
};

export default ticketRepository;
