import TicketManager from "../dao/db/tickets.dao";

class TicketService{
    createTicket(data){
        const { total, purchaser } = data;

        return TicketManager.createTicket({amount: total, purchaser: purchaser});
    }

};

export default new TicketService();