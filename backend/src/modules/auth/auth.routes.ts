import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signupHandler, loginHandler, refreshHandler, logoutHandler, meHandler } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

// Throttle auth endpoints to slow down brute-force attempts
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authRateLimiter, signupHandler);
router.post("/login", authRateLimiter, loginHandler);
router.post("/refresh", authRateLimiter, refreshHandler);
router.post("/logout", requireAuth, logoutHandler);
router.get("/me", requireAuth, meHandler);

export default router;
