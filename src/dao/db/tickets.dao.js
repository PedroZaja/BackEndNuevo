import { ticketModel } from "./models/tickets.model.js";

export default class TicketDao {

    async createTicket(ticket) {
        const newTicket = await ticketModel.create(ticket);
        return newTicket;
    };

    async getTickets() {

        const tickets = await ticketModel.find();
        return tickets;
    };

    async getTicketById(tid) {
        return await ticketModel.findById(tid);
    };

}