import { ApplicationError } from "@/protocols";

export function ticketNotPaidError(): ApplicationError {
  return {
    name: "PaymentNotFound",
    message: "Ticket is not paid!",
  };
}
