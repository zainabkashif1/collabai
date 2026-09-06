import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI in MONGODB_URI.
 *
 * Design note: we set a short serverSelectionTimeoutMS so that if the
 * database is unreachable (e.g. wrong URI, DB not running yet), the app
 * fails fast with a clear log line instead of hanging silently. The
 * server itself still starts and responds to /health even if the DB
 * connection hasn't succeeded yet — useful during local dev when you
 * bring MongoDB up after the API.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not set in the environment. Check your .env file.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", (err as Error).message);
    console.error("The API will keep running, but any DB-backed route will fail until this is fixed.");
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected.");
  });
}
