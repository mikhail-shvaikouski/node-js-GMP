import { Request, Response } from "express";
import { user, UserEntity } from "../entities/user.entity";
import { getResponse } from "../services/resp.service";

export const loginUser = (
  req: Request<{}, any, any, UserEntity>,
  res: Response
) => {
  const { email }: UserEntity = req.body;

  if (user.email !== email) {
    return res
      .status(400)
      .json(getResponse(null, { message: "Email is not valid" }));
  }

  return res.status(200).json(getResponse<UserEntity>(user, null));
};
