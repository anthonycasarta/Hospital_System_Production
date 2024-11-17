import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fruitRouter from "./routers/edibles.js";
import authRouter from "./routers/auth.js";
import appointmentRouter from "./routers/appointment.js";

import "./sendEmails.js";

import dataFetchRouter from "./routers/dataFetch.js";

const app = express();

// CORS options configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "https://hospital-system-production.vercel.app/", // Allow your frontend's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials such as cookies or headers
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions)); // Enable CORS with options
app.use(bodyParser.json()); // Parse JSON requests
//app.options("*", cors(corsOptions)); // Handle preflight requests

// Routes
app.use("/api/edibles", fruitRouter);
app.use("/api/auth", authRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/dataFetch", dataFetchRouter);

// Export the Express app as the Vercel function handler
export default (req, res) => {
  app(req, res); // This lets Vercel handle the serverless routing for you
};

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
