import TicketService from "../services/tickets.service.js";
import UserManager from "../dao/db/user.dao.js";
import config from "../config/config.js";

const ticketService = new TicketService();
const userService = new UserManager();

export const getTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAll();
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error getting the tickets. " + error.message });
    }
}

export const getTicketById = async (req, res) => {
    try {
        const tid = req.params.tid;
        const ticket = await ticketService.getTicketById(tid);
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error getting the ticket. " + error.message });
    }
}
export const createTicket = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error creating the ticket. " + error.message });
    }
}