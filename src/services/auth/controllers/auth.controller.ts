import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { User } from "../models/user.model";
import { created, success, error as respError } from "../../../core/utils/responseWrapper";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "../validation/auth.schema";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) return respError(res, result.error.issues[0]?.message || "Validation error", 400);
    const { email, password, name } = result.data;

    const exists = await User.findOne({ email }).lean();
    if (exists) return respError(res, "User already exists", 409);

    const passwordHash = await authService.hashPassword(password);
    const user = await User.create({ email, passwordHash, name });

    const accessToken = authService.generateAccessToken({ id: user._id.toString(), email: user.email });
    const refreshToken = authService.generateRefreshToken(user._id.toString());
    await authService.saveRefreshToken(user._id.toString(), refreshToken);

    return created(res, { accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) return respError(res, result.error.issues[0]?.message || "Validation error", 400);
    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) return respError(res, "Invalid credentials", 401);

    const ok = await authService.comparePassword(password, user.passwordHash);
    if (!ok) return respError(res, "Invalid credentials", 401);

    const accessToken = authService.generateAccessToken({ id: user._id.toString(), email: user.email });
    const refreshToken = authService.generateRefreshToken(user._id.toString());
    await authService.saveRefreshToken(user._id.toString(), refreshToken);

    return success(res, { accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = refreshSchema.safeParse(req.body);
    if (!result.success) return respError(res, result.error.issues[0]?.message || "Validation error", 400);
    const { refreshToken } = result.data;

    let payload: any;
    try {
      payload = await authService.verifyRefreshToken(refreshToken);
    } catch (e) {
      return respError(res, "Invalid refresh token", 401);
    }

    const user = await authService.findByRefreshToken(refreshToken);
    if (!user) return respError(res, "Invalid refresh token", 401);

    // rotate: revoke old, issue new
    await authService.revokeRefreshToken(refreshToken);
    const newRefresh = authService.generateRefreshToken(user._id.toString());
    await authService.saveRefreshToken(user._id.toString(), newRefresh);

    const accessToken = authService.generateAccessToken({ id: user._id.toString(), email: user.email });
    return success(res, { accessToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = logoutSchema.safeParse(req.body);
    if (!result.success) return respError(res, result.error.issues[0]?.message || "Validation error", 400);
    const { refreshToken } = result.data;
    await authService.revokeRefreshToken(refreshToken);
    return success(res, { ok: true });
  } catch (err) {
    next(err);
  }
};

export const anonymous = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.createAnonymousUser();
    const accessToken = authService.generateAccessToken({ id: user._id.toString(), email: user.email, role: "anonymous" });
    const refreshToken = authService.generateRefreshToken(user._id.toString());
    await authService.saveRefreshToken(user._id.toString(), refreshToken);
    return created(res, { accessToken, refreshToken, user: { id: user._id, email: user.email, isAnonymous: true } });
  } catch (err) {
    next(err);
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) return respError(res, "Unauthorized", 401);
    await authService.deleteUserById(userId);
    return success(res, { ok: true });
  } catch (err) {
    next(err);
  }
};
