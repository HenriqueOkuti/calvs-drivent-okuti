import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter.all("*", authenticateToken).get("", getHotels).get("/:hotelId", getHotels);

export { hotelsRouter };
