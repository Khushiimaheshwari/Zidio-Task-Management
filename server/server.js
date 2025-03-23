import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import  authService  from "../database/auth.js";
import authenticateuserData from "../database/authmiddleware.js";
dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
  // SignUp 
  app.post("/signup", async (req, res) => {
      try {
          const userData = await authService.createAccount(req.body);
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
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  