import express from "express";
import { login, register } from "../controllers/authController.js";
import { verifyToken, authorizeRole } from "../middleware/auth.js";
import adminRouter from "./users/adminRouter.js";
import doctorRouter from "./users/doctorRouter.js";
import patientRouter from "./users/patientRouter.js";

const router = express.Router();

//Registration and login
router.post("/login", login);
router.post("/register", register);

// Use specific routers for each role
router.use("/admin", verifyToken, authorizeRole(["admin"]), adminRouter);
router.use("/doctor", verifyToken, authorizeRole(["doctor"]), doctorRouter);
router.use("/patient", verifyToken, authorizeRole(["patient"]), patientRouter);

export default router;
