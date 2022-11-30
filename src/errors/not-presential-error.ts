import { ApplicationError } from "@/protocols";

export function ticketNotPresentialError(): ApplicationError {
  return {
    name: "NotPresentialError",
    message: "No result for this search!",
  };
}
