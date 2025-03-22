import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authService from "../database/auth.js";
import authenticateUser from "../database/authmiddleware.js";
dotenv.config();

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
  
  // SignUp User
  app.post("/signup", async (req, res) => {
      try {
          const user = await authService.createAccount(req.body);
          res.json(user);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });
  
  // Login User
  app.post("/login", async (req, res) => {
      try {
          const user = await authService.login(req.body);
          res.json(user);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });
  
  // Get Current User
  app.get("/user", authenticateUser, async (req, res) => {
      try {
          const user = await authService.getCurrentUser(req.user.id);
          res.json(user);
      } catch (error) {
          res.status(401).json({ error: "Unauthorized" });
      }
  });
  
  // Logout User
  app.post("/logout", authenticateUser, async (req, res) => {
      try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(400).json({ error: "Token is required for logout" });

        const response = await authService.logout(token);
        res.json(response);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  });
  
  app.listen(5000, () => console.log(`Server running on port ${PORT}`));
  