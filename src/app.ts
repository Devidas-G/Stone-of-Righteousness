import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import routes from "./routes";
import logger from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import rateLimiter from "./middleware/rateLimiter";
import config from "./config/configService";

const app = express();

connectDB();

// Request logger middleware
app.use(logger);

// Rate limiting (apply before parsers/routes)
app.use(rateLimiter);

app.use(express.json());
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript API!");
});

// Centralized error handler (must be after routes)
app.use(errorHandler);

const PORT = config.getPort();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
