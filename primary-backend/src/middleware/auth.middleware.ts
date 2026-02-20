import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request{
    user? :{
        id : number,
        role : "USER" | "ADMIN"
    }
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        message: "Please login",
      });
    }
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: number;
      role: "USER" | "ADMIN";
    };

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("AUTHENTICATION ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}