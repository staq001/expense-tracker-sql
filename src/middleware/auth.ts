import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../types";
import { findUser } from "../db/reusables";

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid Token. Please Log In",
      });
    }

    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({
        status_code: 401,
        message: "Invalid Token. Please log in",
      });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const id = decoded.id;
    const user = await findUser(id);

    req.user = user;
    if (req.user) req.user.password = "-";
    next();
  } catch (e) {
    res.status(401).json({ status: 401, message: "Please Authenticate" });
  }
};
