import express from "express";
import { contactSupport } from "../controllers/support.controller.js";

const router = express.Router();

router.post("/contact", contactSupport);

export default router;
