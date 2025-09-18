import { Request } from "express";

interface AuthRequest extends Request {
  user?: any;
  userId?: string;
}

export {
    AuthRequest
}