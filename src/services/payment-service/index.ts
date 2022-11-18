import { notFoundError, unauthorizedError } from "@/errors";
import paymentRepository, { postPaymentType } from "@/repositories/payment-repository";

async function getPaymentWithUserIdAndTicketId(userId: number, ticketId: number) {
  const ticketInfo = await paymentRepository.findTicketWithTicketId(ticketId);
  if (!ticketInfo) {
    throw notFoundError();
  }

  const enrollmentInfo = await paymentRepository.findEnrollmentWithUserId(userId);
  if (!enrollmentInfo) {
    throw notFoundError();
  }

  if (enrollmentInfo.id !== ticketInfo.enrollmentId) {
    throw unauthorizedError();
  }

  const paymentInfo = await paymentRepository.findPaymentWithTicketId(ticketId);
  if (!paymentInfo) {
    throw notFoundError();
  }

  return paymentInfo;
}

async function postPaymentWithUserIdAndPaymentInfo(userId: number, paymentInfo: postPaymentType) {
  const ticketInfo = await paymentRepository.findTicketWithTicketId(paymentInfo.ticketId);
  if (!ticketInfo) {
    throw notFoundError();
  }

  const enrollmentInfo = await paymentRepository.findEnrollmentWithUserId(userId);
  if (!enrollmentInfo) {
    throw notFoundError();
  }

  if (enrollmentInfo.id !== ticketInfo.enrollmentId) {
    throw unauthorizedError();
  }

  const ticketTypeInfo = await paymentRepository.findTicketInfoWithId(ticketInfo.ticketTypeId);

  const value = ticketTypeInfo.price;

  const cardDigitsLength = paymentInfo.cardData.number.length;
  const cardLastDigits = paymentInfo.cardData.number
    .split("")
    .slice(cardDigitsLength - 4, cardDigitsLength)
    .join("");
  paymentInfo.cardData.number = cardLastDigits;

  const insertedPayment = await paymentRepository.createPayment(paymentInfo, value);
  await paymentRepository.updateTicketReserveStatus(ticketInfo.id);

  return insertedPayment;
}

const paymentService = {
  getPaymentWithUserIdAndTicketId,
  postPaymentWithUserIdAndPaymentInfo,
};

export default paymentService;
