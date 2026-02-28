import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { AuthenticatedRequest } from "../types";
import {
  createUser,
  findUserByEmail,
  updateUser,
  deleteUser,
} from "../db/reusables";

export class UserController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (username, email, and password) cannot be empty",
        });
        return;
      }

      const user = await createUser(username, email, password);

      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (e) {
      next(e);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: 400,
          message: "Bad Request. Fields (email, and password) cannot be empty",
        });
        return;
      }

      const user = await findUserByEmail(email);

      if (user.password !== password) {
        res.status(404).json({
          status: 404,
          message: "Wrong Email/Password Combination",
        });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN as any }
      );

      res.status(200).json({
        status: 200,
        message: "Login Successful",
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          token,
        },
      });
    } catch (e) {
      next(e);
    }
  }



  
  async getUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user)
        res.status(200).json({
          status: 200,
          message: "User fetched successfully",
          data: {
            username: req.user.username,
            email: req.user.email,
          },
        });
    } catch (e) {
      next(e);
    }
  }
  async updateUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username } = req.body;

      if (Object.keys(req.body).length === 0) {
        res.status(400).json({
          status: 400,
          message: "Bad Request. One of fields (username) cannot be empty",
        });
        return;
      }

      if (req.user) {
        const user = await updateUser(username, req.user.id);

        res.status(200).json({
          status: 200,
          message: "User Successfully Updated",
          data: {
            username: user.username,
            email: user.email,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.user) {
        const user = await deleteUser(req.user.id);

        res.status(200).json({
          status: 200,
          message: "User deleted successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  }
}
