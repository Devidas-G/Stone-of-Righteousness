import { Response } from "express";

export function success(res: Response, data: any, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created(res: Response, data: any) {
  return success(res, data, 201);
}

export function list(res: Response, data: any[], meta?: Record<string, any>, status = 200) {
  return res.status(status).json({ success: true, data, meta });
}

export function error(res: Response, message: string, status = 500, details?: any) {
  const payload: any = { success: false, message };
  if (details !== undefined) payload.details = details;
  return res.status(status).json(payload);
}
