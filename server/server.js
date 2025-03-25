import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { authService }  from "../database/auth.js";
import authenticateuserData from "../database/authmiddleware.js";
dotenv.config({ path: "./server/.env" });
import connectDB from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// const MONGO_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Users_info";
;

// console.log("Mongo URI:", process.env.MONGO_URI);

// if(!MONGO_URL){
//     console.error("MONGO_URI is missing from .env file");
//     process.exit(1);
// } 

// mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
// });

// async function connectDB() {
//     try {
//         await mongoose.connect(MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log("✅ MongoDB connected successfully");
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     } catch (error) {
//         console.error("❌ MongoDB connection failed:", error);
//         process.exit(1);
//     }
// }

// connectDB();

connectDB()
.then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));})
.catch(err => console.error("Failed to start server:", err));
  
  // SignUp 
  app.post("/signup", async (req, res) => {
    try {
        console.log("Server.js execution starts");

        console.log("📥 Received signup request with body:", req.body); // Debug log

        const { Name, Email, Password } = req.body;

        if (!req.body || !Name || !Email || !Password) {
        console.log("❌ Invalid request body:", req.body);
        return res.status(400).json({ error: "Missing required fields: Email, Password, or Name" });
        }

        const userData = await authService.createAccount(req.body);
        console.log("Server.js execution completed");
        res.json(userData);
    } catch (error) {
          res.status(400).json({ error: error.message });
    }
  });
  
  // Login 
  app.post("/login", async (req, res) => {
      try {
          const userData = await authService.login(req.body);
          res.json(userData);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });
  
  // Get Current user
  app.get("/userData", authenticateuserData, async (req, res) => {
      try {
          const userData = await authService.getCurrentUser(req.userData.id);
          res.json(userData);
      } catch (error) {
          res.status(401).json({ error: "Unauthorized" });
      }
  });
  
  // Logout 
  app.post("/logout", authenticateuserData, async (req, res) => {
      try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(400).json({ error: "Token is required for logout" });

        const response = await authService.logout(token);
        res.json(response);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });
    