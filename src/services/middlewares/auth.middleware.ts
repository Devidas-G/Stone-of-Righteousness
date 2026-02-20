import { Request, Response, NextFunction } from "express";
import authService from "../auth/services/auth.service";
import { error as respError } from "../../core/utils/responseWrapper";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization as string | undefined;
    if (!header || !header.startsWith("Bearer ")) return respError(res, "Unauthorized", 401);
    const token = header.replace(/^Bearer\s+/, "");
    let payload: any;
    try {
      payload = await authService.verifyAccessToken(token);
    } catch (e) {
      return respError(res, "Invalid token", 401);
    }
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
};
