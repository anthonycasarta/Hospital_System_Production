import express from "express";
import { registerDoctor } from "../../api/controllers/authController.js";
import { getPrescriptionReport } from "../../api/controllers/admin/adminPrescriptionReport.js";
import {
  getAppointmentAnalytics,
  getStates,
  getCities,
  getOffices,
  getDoctors,
  getPatients,
  getAppointmentStatuses,
  getVisitTypes,
  getSpecialties,
  getServices,
} from "../../api/controllers/admin/appointmentAnalytics.js";
import adminDoctorRouter from "../subRouters/AdminDoctorRouter.js";
import {
  getAllDoctors,
  inactivateDoctor,
  reactivateDoctor,
} from "../../api/controllers/admin/doctorAdminView.js";
import {
  getAllPatients,
  inactivatePatient,
  reactivatePatient,
} from "../../api/controllers/admin/patientAdminView.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.get("/get-prescription-report", getPrescriptionReport);
router.get("/appointmentAnalytics", getAppointmentAnalytics);
router.get("/states", getStates);
router.get("/cities", getCities);
router.get("/offices", getOffices);
router.get("/doctors", getDoctors);
router.get("/patients", getPatients);
router.get("/statuses", getAppointmentStatuses);
router.get("/visitTypes", getVisitTypes);
router.get("/specialties", getSpecialties);
router.get("/services", getServices);
router.use("/adminDoctorReport", adminDoctorRouter);

router.get("/doctorManagement", getAllDoctors);
router.put("/doctors/:doctorID/inactivate", inactivateDoctor);
router.put("/doctors/:doctorID/reactivate", reactivateDoctor);

router.get("/patientManagement", getAllPatients);
router.put("/patients/:patientID/inactivate", inactivatePatient);
router.put("/patients/:patientID/reactivate", reactivatePatient);

export default router;