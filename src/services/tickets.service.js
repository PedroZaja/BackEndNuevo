import { TicketsRepositoryWithDao } from "../repository/index.repository.js";

export default class TicketService {
    
    async createTicket(data){
        const { total, purchaser } = data;

        return TicketsRepositoryWithDao.createTicket({amount: total, purchaser: purchaser});
    }

    async getTickets() {

        const tickets = await TicketsRepositoryWithDao.getTickets();
        return tickets;
    }

    async getTicketById(tid) {

        if (!tid) throw new Error('Ticket ID is required.');

        const tickets = await TicketsRepositoryWithDao.getTicketById(tid);
        return tickets;
    }
};