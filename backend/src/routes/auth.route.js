import express from "express";
import { login , register ,verifyEmail} from "../Controllers/auth.controller.js";
import e from "express";


const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify").post(verifyEmail);



export default router;