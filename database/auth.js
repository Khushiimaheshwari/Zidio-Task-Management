import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BlacklistedToken from "./blacklistModel.js"

dotenv.config();

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, required: true }
});

// export const User = mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Users_info";

async function ensureDBConnection() {
    if (mongoose.connection.readyState !== 1) { // 1 = Connected
        console.log("🔄 Reconnecting to MongoDB...");
        await mongoose.connect(MONGO_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }).catch(err => {
            console.error("❌ MongoDB reconnection failed:", err);
        });
    }
}

// async function waitForMongoConnection(timeout = 5000) {
//     console.log("Checking MongoDB connection state...");

//     if (mongoose.connection.readyState === 1) {
//         console.log("✅ MongoDB is already connected!");
//         return;
//     }

//     console.log("⏳ Waiting for MongoDB connection...");
    
//     // Create a timeout to prevent infinite waiting
//     return new Promise((resolve, reject) => {
//         const timer = setTimeout(() => {
//             console.error("❌ MongoDB connection timeout!");
//             reject(new Error("MongoDB connection timeout"));
//         }, timeout);

//         mongoose.connection.once("open", () => {
//             clearTimeout(timer);
//             console.log("🎉 MongoDB connection established!");
//             resolve();
//         });

//         mongoose.connection.once("error", (err) => {
//             clearTimeout(timer);
//             console.error("❌ MongoDB connection failed:", err);
//             reject(err);
//         });
//     });
// }

export class AuthService {
    
    async createAccount({Name, Email, Password }) {

        console.log("🛠 Starting account creation...");

        await ensureDBConnection(); 
    
        // await waitForMongoConnection();  
        
        console.log("✅ MongoDB connection confirmed, proceeding...");

        try {

            if (!Name || !Email || !Password) {
                throw new Error("Missing required fields: Email, Password, or Name");
            }

            let existingUser = await User.findOne({ Email });
            if (existingUser){
                console.log("❌ User already exists");
                throw new Error("User already exists");
            }

            console.log("✅ Valid input, proceeding with password hashing...");

            const saltRounds = 10;
            const hashedpassword = await bcrypt.hash(Password, saltRounds);

            console.log("✅ User saved successfully");

            console.log("🚀 Creating user:", { Name, Email, Password: hashedpassword });
            const newUser = new User({ Name, Email, Password: hashedpassword });
            await newUser.save();

            console.log("Completed");

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user: newUser };
            
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new Error("Invalid Credentials");

            const isMatch = await bcrypt.compare(password, user.password);
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
            const user = await User.findById(decoded.id).select("-password");

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

export const authService = new AuthService();
export { User };

// const authService = new AuthService();
// export default authService;
