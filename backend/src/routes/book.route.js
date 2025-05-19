import express from "express";
import { createBook, getAllBooks,yourBooks, getSingleBook, updateBook, deleteBook } from "../Controllers/book.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();
router.route("/").post(authMiddleware,upload.single('image'),createBook).get(authMiddleware, getAllBooks);
router.route("/:id")
.patch(authMiddleware,upload.single('image'),updateBook)
.delete( authMiddleware,deleteBook);

router.get("/yourbooks",authMiddleware,yourBooks);

export default router; 