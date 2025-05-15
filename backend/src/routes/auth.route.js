import express from "express";
import { login } from "../Controllers/auth.controller.js";
import e from "express";


const router = express.Router();

router.route("/login").post(login);


export default router;