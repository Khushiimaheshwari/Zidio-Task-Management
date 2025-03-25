import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Users_info?directConnection=true";

console.log("Mongo URI:", process.env.MONGO_URI);

if(!MONGO_URI){
    console.error("MONGO_URI is missing from .env file");
    process.exit(1);
} 

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully - from db.js");

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectDB;
