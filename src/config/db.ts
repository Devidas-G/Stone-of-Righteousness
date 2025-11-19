import mongoose from "mongoose";
import config from "./configService";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.getMongoUri());
    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error);
    process.exit(1);
  }
};
