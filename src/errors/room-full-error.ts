import { ApplicationError } from "@/protocols";

export function roomFullError(): ApplicationError {
  return {
    name: "RoomFull",
    message: "No vacancy on selected room!",
  };
}
