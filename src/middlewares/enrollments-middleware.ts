import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { invalidDataError } from "@/errors";
import { request } from "@/utils/request";

export async function validateCEP(req: Request, res: Response, next: NextFunction) {
  const result = await request.get(`https://viacep.com.br/ws/${req.body.address.cep}/json/`);
  if (!result.data.erro) {
    next();
  } else {
    res.status(httpStatus.BAD_REQUEST).send(invalidDataError(["error"].map((d) => d)));
  }
}
