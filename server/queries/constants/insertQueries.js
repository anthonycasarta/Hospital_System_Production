// Remove emergencyPhoneNumber and emergencyEmail from the query
// insertQueries.js
export const INSERT_PATIENT_QUERY = `
  INSERT INTO patient 
  (firstName, lastName, dateOfBirth, gender, phoneNumber, email, password, lastLogin, createdBy, createdAt, updatedBy, updatedAt, addressID)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

export const INSERT_ADDRESS_QUERY = `
        INSERT INTO address (addrStreet, addrZip, addrCity, addrState)
        VALUES (?, ?, ?, ?);
    `;

export const INSERT_ALLERGY_QUERY =
  "INSERT INTO allergy (allergen, reaction, severity, patientID) VALUES ?";

export const INSERT_DISABILITY_QUERY =
  "INSERT INTO disability (disabilityType, patientID) VALUES ?";

export const INSERT_VACCINE_QUERY =
  "INSERT INTO vaccine (vaccineName, dateAdministered, patientID, doctorID) VALUES ?";

export const INSERT_SURGERY_QUERY =
  "INSERT INTO vaccine (surgeryType, surgeryDateTime, patientID, doctorID) VALUES ?";

export const INSERT_EMERGENCY_CONTACT_QUERY = `
  INSERT INTO emergency_contact 
  (firstName, lastName, relationship, emergencyPhoneNumber, emergencyEmail, patientID)
  VALUES (?, ?, ?, ?, ?, ?);
`;