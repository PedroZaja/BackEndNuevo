export default class TicketsRepository{
    constructor(dao){
        this.dao = dao;
    }

    async createTicket(data){
        return await this.dao.createTicket(data);
    }

    async getTickets(){
        return await this.dao.getTickets();
    }

    async getTicketById(tid){
        return await this.dao.getTicketById(tid);
    }

}