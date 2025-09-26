import { Request } from "express";

enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

interface AuthRequest extends Request {
    userId?: String
}

export {
    UserRole,
    AuthRequest
}