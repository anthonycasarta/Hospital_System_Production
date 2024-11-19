import { SELECT_PATIENT_SERVICES } from "../../queries/constants/selectQueries.js";
import pool from "../../database.js";

export async function getPatientServices(req, res) {
  try {
    const [rows] = await pool.query(SELECT_PATIENT_SERVICES);
    const services = rows.map((row) => ({
      patientName: `${row.patientFirstName} ${row.patientLastName}`,
      doctorFirstName: row.doctorFirstName,
      doctorLastName: row.doctorLastName,
      medicalRecords: {
        allergy: row.allergy,
        disability: row.disability,
        surgery: row.surgery,
        surgeryDateTime: row.surgeryDateTime,
      },
      medicine: {
        name: row.medicineName,
        dateIssued: row.prescriptionDateIssued,
      },
      insurance: {
        providerName: row.insuranceProvider,
      },
    }));
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching patient services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
