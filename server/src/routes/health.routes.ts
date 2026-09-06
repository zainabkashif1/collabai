import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    uptime_seconds: Math.floor(process.uptime()),
    db: dbStates[mongoose.connection.readyState] ?? "unknown",
    timestamp: new Date().toISOString(),
  });
});

export default router;
