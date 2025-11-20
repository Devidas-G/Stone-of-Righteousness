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

const app = express();

connectDB();

// Request logger middleware
app.use(logger);

// Rate limiting (apply before parsers/routes)
app.use(rateLimiter);

// Capture raw body for signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Mount API routes with signed-request verification
app.use("/api", signedRequest, routes);

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