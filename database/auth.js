import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BlacklistedToken from "./blacklistModel.js"

dotenv.config();

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

export class AuthService {
    
    async createAccount({ Email, Password, Name }) {
        try {
            let existingUser = await User.findOne({ Email });
            if (existingUser) throw new Error("User already exists");

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            const newUser = new User({ Name, Email, Password: hashedPassword });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user: newUser };
            
        } catch (error) {
            throw error;
        }
    }

    async login({ Email, Password }) {
        try {
            const user = await User.findOne({ Email });
            if (!user) throw new Error("Invalid Credentials");

            const isMatch = await bcrypt.compare(Password, user.Password);
            if (!isMatch) throw new Error("Invalid Credentials");

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });

            return { token, user };
            
        } catch (error) {
            throw error;
        }
    }
    async getCurrentUser(token) {
        try {
            if (!token) return null;

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-Password");

            return user;
        } catch (error) {
            return null;
        }
    }

    async logout() {
        try {
            if (!token) throw new Error("Token is required for logout");
    
            // Decode token to get expiration date
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) throw new Error("Invalid token");
    
            // Save token in blacklist with expiration time
            const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds
            await BlacklistedToken.create({ token, expiresAt });
    
            return { message: "User logged out successfully" };
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
