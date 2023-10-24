import { Request, Response, NextFunction } from "express";
import { user } from "../entities/user.entity";
import URL from "../router/urls";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const isUserValid = (userId: string): boolean => {
  return user.id === userId;
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const path = req.path;
  const userId = req.header("x-user-id");

  if (path === URL.LOGIN) {
    next();
  } else if (userId) {
    if (isUserValid(userId)) {
      req.userId = userId;
      next();
    } else {
      res.status(401).json({
        data: null,
        error: {
          message: "User is not authorized",
        },
      });
    }
  } else {
    res.status(403).json({
      data: null,
      error: {
        message: "You must be authorized user",
      },
    });
  }
};
