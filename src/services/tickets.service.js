import TicketManager from "../dao/db/tickets.dao.js";

const ticketManager = new TicketManager();

export default class TicketService {
    
    createTicket(data){
        const { total, purchaser } = data;

        return ticketManager.createTicket({amount: total, purchaser: purchaser});
    }

};