import { ticketModel } from "./models/tickets.model.js";

export default class TicketManager {

    async createTicket(ticket) {
        const newTicket = await ticketModel.create(ticket);
        return newTicket;
    };

}