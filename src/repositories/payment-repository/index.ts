import { prisma } from "@/config";

async function findTicketWithTicketId(id: number) {
  return prisma.ticket.findFirst({
    where: { id },
  });
}

async function findEnrollmentWithUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
  });
}

async function findPaymentWithTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPayment(paymentInfo: postPaymentType, value: number) {
  return prisma.payment.create({
    data: {
      ticketId: paymentInfo.ticketId,
      value: value,
      cardIssuer: paymentInfo.cardData.issuer,
      cardLastDigits: paymentInfo.cardData.number,
    },
  });
}

async function findTicketInfoWithId(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

async function updateTicketReserveStatus(id: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      status: "PAID",
    },
  });
}

const paymentRepository = {
  findEnrollmentWithUserId,
  findPaymentWithTicketId,
  findTicketWithTicketId,
  createPayment,
  findTicketInfoWithId,
  updateTicketReserveStatus,
};

export default paymentRepository;

export type postPaymentType = {
  ticketId: number;
  cardData: cardData;
};

export type cardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
};
