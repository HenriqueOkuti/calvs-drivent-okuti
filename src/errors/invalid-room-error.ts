import { ApplicationError } from "@/protocols";

export function invalidRoomError(): ApplicationError {
  return {
    name: "InvalidRoom",
    message: "Selected room is invalid!",
  };
}
