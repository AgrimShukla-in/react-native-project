import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        prfileImage: { type: String, default: "" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        rfreshToken: { type: String },
        verifieCode: { type: String, required: true },
        verifieCodeExpiry: { type: Date, required: true },

    },
    { timestamps: true }, 
);

export default mongoose.model("User", userSchema);