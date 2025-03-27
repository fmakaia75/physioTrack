import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

// Cache connection globally to prevent multiple instances
global.mongoose = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  if (global.mongoose.conn) {
    console.log("✅ Using existing MongoDB connection");
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    console.log("🌍 Creating a new MongoDB connection...");
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("🔥 Connected to MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
};

export const closeDB = async () => {
  if (global.mongoose.conn) {
    await mongoose.connection.close();
    console.log("🔴 MongoDB connection closed");
    global.mongoose.conn = null;
    global.mongoose.promise = null;
  }
};
