import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body;
  //console.log(body);

  try {
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const body = req.body;
  //console.log(body);

  try {
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
