import express from "express";
import { mailController } from "../controllers/mailController.js";

const router = express.Router();
router.use(express.json());

router.post("/send-mail", mailController);

export default router;