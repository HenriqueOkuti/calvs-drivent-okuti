import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { invalidRoomError, notFoundError, roomFullError, ticketNotPaidError, ticketNotPresentialError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";

async function isUserValidForBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw ticketNotPresentialError(); //OR does not include HOTEL
  }

  if (ticket.status === "RESERVED") {
    throw ticketNotPaidError();
  }

  return true;
}

async function getUserBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  const roomInfo = await bookingRepository.findRoom(booking.roomId);

  return { booking, roomInfo };
}

async function postUserBooking(userId: number, roomId: number) {
  const room = await bookingRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  const booked = await bookingRepository.findBookedRoom(roomId);
  if (booked.length !== 1 ? booked.length === room.capacity : !booked[0]) {
    throw roomFullError();
  }

  const newBook = await bookingRepository.insertNewBooking(userId, roomId);
  return newBook;
}

async function putUserBooking(userId: number, newRoomId: number, bookingId: number) {
  const userBooking = await bookingRepository.findUserBooking(bookingId);
  if (!userBooking) {
    throw notFoundError();
  }
  if (userBooking.roomId === newRoomId) {
    throw invalidRoomError();
  }

  const newRoom = await bookingRepository.findRoom(newRoomId);
  if (!newRoom || !userBooking) {
    throw notFoundError();
  }

  const booked = await bookingRepository.findBookedRoom(newRoomId);
  if (booked.length !== 1 ? booked.length === newRoom.capacity : !booked[0]) {
    throw roomFullError();
  }

  const newBook = bookingRepository.updateUserBooking(bookingId, newRoomId);

  return newBook;
}

export const bookingService = {
  isUserValidForBooking,
  getUserBooking,
  postUserBooking,
  putUserBooking,
};
