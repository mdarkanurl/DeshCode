import { Request } from "express";

interface AuthRequest extends Request {
    userId?: String
}

export {
    AuthRequest   
}