import express from "express";
import "dotenv/config";




const app = express();

app.use(express.json());
const PORT =process.env.PORT || 5000;



import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/book.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀🚀🚀`);
    connectDB();
});