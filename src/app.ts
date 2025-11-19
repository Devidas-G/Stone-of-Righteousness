import "dotenv/config";
import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import routes from "./routes";

const app = express();

connectDB();

app.use(express.json());
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
