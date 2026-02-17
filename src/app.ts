import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import routes from "./routes";
import logger from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import rateLimiter from "./middleware/rateLimiter";
import config from "./config/configService";
const swaggerUi = require("swagger-ui-express");
import swaggerSpec from "./swagger";
import signedRequest from "./middleware/signedRequest";
import cors from "cors";

const app = express();

connectDB();

// Request logger middleware
app.use(logger);

// Rate limiting (apply before parsers/routes)
app.use(rateLimiter);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Capture raw body for signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Mount API routes with signed-request verification
app.use("/api", routes);

// Swagger UI (API docs)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript API!");
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

const PORT = config.getPort();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*

client code example for signing requests:

import crypto from 'crypto';
const secret = process.env.SIGNING_SECRET;
const body = JSON.stringify({ name: 'hello' });
const ts = Math.floor(Date.now()/1000);
const payload = `${ts}.${body}`;
const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
// send headers x-signature-timestamp: ts, x-signature: sig

*/