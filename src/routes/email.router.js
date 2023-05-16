import { Router } from "express";
import { sendEmail } from "../controllers/email.controller.js";
import { passportCall } from "../util.js";

const router = Router();

router.get("/", passportCall('jwt'), sendEmail);

export default router;