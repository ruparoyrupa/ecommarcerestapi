import express from "express";
import { login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

// routing
router.route("/login").post(login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

// export
export default router;
