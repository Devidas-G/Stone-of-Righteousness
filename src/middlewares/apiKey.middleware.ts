import { Request, Response, NextFunction } from "express";

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({
      success: false,
      message: "API key missing",
    });
  }

  if (clientKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key",
    });
  }

  next();
};
