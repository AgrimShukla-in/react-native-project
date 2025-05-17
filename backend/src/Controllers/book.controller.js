import { Book } from "../models/book.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'
import User from "../models/user.model.js";



const createBook = async (req, res) => {
  try {
    const { title, caption, rating, category } = req.body;
    if (!title || !caption || !rating || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reqUser = req.user;         // ← no await
    console.log("authenticated user:", reqUser);

    const user = await User.findById(reqUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("received file:", req.file);
    if (!req.file?.path) {
      return res.status(400).json({ message: "Image is required" });
    }

    // uploadOnCloudinary should take a local path
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (!uploadedImage?.secure_url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const book = await Book.create({
      title,
      caption,
      Image: uploadedImage.secure_url,
      rating,
      category,
      user: user._id,
      imagePublicId: uploadedImage.public_id,
    });

    return res.status(201).json({ success: true, message: "Book created", book });
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const search = req.query.search;

        let query = Book.find();

        if (category) {
            query = query.where('category').equals(category);
        }

        if (search) {
            query = query.where('title').regex(new RegExp(search, 'i'));
            // Optionally, extend to search caption too:
            query.or([{ title: new RegExp(search, 'i') }, { caption: new RegExp(search, 'i') }]);
        }

        const books = await query
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .populate("uaer", "username prfileImage");

        const totalBooks = await Book.countDocuments(query.getQuery());

        res.status(200).json({
            message: "Books fetched successfully",
            books,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks,
        });
    } catch (error) {
        console.error("Error getting books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getSingleBook = async (req, res) => {
    try {


        const book = await Book.findById(req.params.id).select("-password", "-refreshToken");
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const user = req.user._id;

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== user.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            if (book.imagePublicId) {
                await deleteFromCloudinary(book.imagePublicId);
            }

            // Upload new image
            const imageLocalPath = req.file.path;
            const uploadedImage = await uploadOnCloudinary(imageLocalPath);

            if (!uploadedImage?.secure_url) {
                return res.status(500).json({ message: "Failed to upload new image" });
            }

            book.Image = uploadedImage.secure_url;
            book.imagePublicId = uploadedImage.public_id; // update new public ID
        }

        // Update other fields
        book.title = req.body.title || book.title;
        book.caption = req.body.caption || book.caption;
        book.rating = req.body.rating || book.rating;
        book.category = req.body.category || book.category;

        const updatedBook = await book.save();
        res.status(200).json({ message: "Book updated successfully", book: updatedBook });

    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const user = req.user._id;
        const book = await Book.findById(req.params.id);

        if (book.user.toString() !== user.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Delete image from Cloudinary
        if (book.imagePublicId) {
            await deleteFromCloudinary(book.imagePublicId);
        }

        await book.remove();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const yourBooks=async(req,res)=>{
    try {
        const user = req.user._id;
        const books = await Book.find({user:user}).sort({ createdAt: -1 });
        res.status(200).json({ message: "Your books fetched successfully", books });
    } catch (error) {
        console.error("Error getting your books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export { createBook, getAllBooks,yourBooks, getSingleBook, updateBook, deleteBook };