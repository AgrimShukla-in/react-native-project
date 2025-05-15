import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host} 📡📡📡`);
    } catch (error) {
        console.log("Error: ❌❌❌❌ " + error.message);
        process.exit(1);
    }
};