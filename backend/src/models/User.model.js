import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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


//hash paswarod before saving to database and if update password then hash password and if update othar fild then no chege password

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getRfrshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.JWT_SECRET_REFRESH_TOKEN_EXPARY,
    });
};

userSchema.methods.getAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_ACSSES_TOKEN, {
        expiresIn: process.env.JWT_SECRET_ACSSES_TOKEN_EXPARY,
    });
};



export default mongoose.model("User", userSchema);