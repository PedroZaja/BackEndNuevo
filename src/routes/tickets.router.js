import { Router } from "express";
import { getTickets, getTicketById, createTicket } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:tid", getTicketById);

export default router;