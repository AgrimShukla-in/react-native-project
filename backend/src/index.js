import express from "express";
import "dotenv/config";
import cors from "cors";





const app = express();

app.use(express.json());
app.use(cors());
const PORT =process.env.PORT || 5000;
app.use(express.json(
    {
        limit: '16mb',
    }
));



import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/book.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀🚀🚀`);
    connectDB();
});