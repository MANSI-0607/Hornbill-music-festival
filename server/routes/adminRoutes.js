// routes/adminRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import BandUser from "../models/BandUser.js";

dotenv.config();
const router = express.Router();

// ----------------------------------------------------
// Security: In-Memory Rate Limiter for Login Protection
// ----------------------------------------------------
const loginAttempts = new Map(); // ip -> { count: number, firstAttempt: number, lockedUntil: number }
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

const checkLoginRateLimit = (ip) => {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  // Check if currently locked
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSecs = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      message: `Too many failed login attempts. Please wait ${Math.ceil(remainingSecs / 60)} minute(s) before trying again.`,
      retryAfter: remainingSecs,
    };
  }

  // If window expired, reset
  if (now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    return {
      allowed: false,
      message: "Too many failed login attempts. Account temporarily locked for 15 minutes.",
      retryAfter: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  return { allowed: true };
};

const recordFailedAttempt = (ip) => {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now, lockedUntil: null });
  } else {
    record.count += 1;
    if (record.count >= MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }
};

const clearFailedAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// Constant-time string comparison to prevent timing attacks
const safeStringCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Perform dummy timing safe compare on bufA to maintain constant execution time
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
};

// SECURE ADMIN LOGIN
router.post("/login", (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const rateLimitStatus = checkLoginRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    res.set("Retry-After", String(rateLimitStatus.retryAfter || 900));
    return res.status(429).json({ message: rateLimitStatus.message });
  }

  const { email, password } = req.body || {};

  // Strict input validation
  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    recordFailedAttempt(ip);
    return res.status(400).json({ message: "Email and password are required" });
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length > 255 || password.length > 255) {
    recordFailedAttempt(ip);
    return res.status(400).json({ message: "Invalid credentials format" });
  }

  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET;

  if (!expectedEmail || !expectedPassword || !jwtSecret) {
    console.error("[CRITICAL AUTH ERROR] Admin credentials or JWT_SECRET are missing in environment variables.");
    return res.status(500).json({ message: "Authentication service misconfigured" });
  }

  const isEmailMatch = safeStringCompare(trimmedEmail.toLowerCase(), expectedEmail.toLowerCase());
  const isPassMatch = safeStringCompare(password, expectedPassword);

  if (isEmailMatch && isPassMatch) {
    clearFailedAttempts(ip);
    const token = jwt.sign(
      {
        email: expectedEmail,
        isAdmin: true,
        role: "admin",
      },
      jwtSecret,
      { expiresIn: "24h" }
    );
    return res.json({ token, message: "Authentication successful" });
  } else {
    recordFailedAttempt(ip);
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// GET all auditions
router.get("/auditions", verifyAdminToken, async (req, res) => {
  try {
    const auditions = await BandUser.find().sort({ createdAt: -1 });
    return res.json(auditions);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE single audition
router.delete("/auditions/:id", verifyAdminToken, async (req, res) => {
  try {
    await BandUser.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE bulk auditions
router.delete("/auditions", verifyAdminToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ message: "No IDs provided" });
    await BandUser.deleteMany({ _id: { $in: ids } });
    return res.json({ message: `Deleted ${ids.length} records` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH update audition status
router.patch("/auditions/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await BandUser.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
