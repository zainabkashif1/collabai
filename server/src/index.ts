import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import applicationRoutes from "./routes/application.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // required for the httpOnly refresh-token cookie to be sent/received cross-origin
  })
);
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Student Collab Platform API",
    health: "/api/health",
  });
});

// Mounted as their own files under src/routes/ so each domain (auth,
// students, projects, applications, teams...) stays independent and
// gets added here as one line per checkpoint.
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);

// --- 404 handler (after all routes) ---
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Intentionally not awaited: the HTTP server should come up and answer
// /api/health immediately, independent of whether Mongo is reachable yet.
connectDB();
