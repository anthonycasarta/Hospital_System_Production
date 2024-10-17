import { query } from "../../database.js";
import { SELECT_ADMIN_FROM_EMAIL_QUERY } from "../constants/selectQueries.js";

export async function getAdminByEmail(email) {
  let user = await query(SELECT_ADMIN_FROM_EMAIL_QUERY, [email]); // User stored as an array
  user = user[0]; // Get the actual user
  return user || null; // Return user if one exists, otherwise return null
}
