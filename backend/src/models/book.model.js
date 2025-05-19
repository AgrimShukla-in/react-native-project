import mongoose from "mongoose";


const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    caption: { type: String, required: true },
    Image: { type: String, required: true },
    rating: { type: Number, required: true },
    category: { type: String, required: true },
    imagePublicId: { type: String },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

} , { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);