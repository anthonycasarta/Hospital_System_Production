import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fruitRouter from "../routers/edibles.js";
import authRouter from "../routers/auth.js";
import appointmentRouter from "../routers/appointment.js";

import "../sendEmails.js";

import dataFetchRouter from "../routers/dataFetch.js";

const app = express();

// CORS options configuration
// const corsOptions = {
//   origin:
//     process.env.NODE_ENV !== "production"
//       ? "http://localhost:5173"
//       : "https://hospital-system-production.vercel.app", // Allow your frontend's origin
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//   credentials: true, // Allow credentials such as cookies or headers
//   allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
// };

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173", // Local development frontend
      "https://hospital-system-production.vercel.app", // Production frontend
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials such as cookies or headers
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

app.use(cors(corsOptions)); // Enable CORS with options
app.use(bodyParser.json()); // Parse JSON requests
//app.options("*", cors(corsOptions)); // Handle preflight requests

// Routes
app.use("/edibles", fruitRouter);
app.use("/auth", authRouter);
app.use("/appointment", appointmentRouter);
app.use("/dataFetch", dataFetchRouter);

// Export the Express app as the Vercel function handler
export default (req, res) => {
  app(req, res); // This lets Vercel handle the serverless routing for you
};

// Root Route for "/"
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hospital System API!" });
});
// Local development: Start the server
// if (process.env.NODE_ENV !== "production") {
//   app.listen(PORT, () => {
//     console.log(`Server running locally on http://localhost:3000`);
//   });
// }
