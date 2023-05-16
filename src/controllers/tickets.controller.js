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
/* 
        const { username, products } = req.body;
        const resultUser = await userService.getUserByUsername(username);
        const resultProducts = await fetch(config.endpoint + config.port + '/api/products/?limit=999')
            .then((response) => response.json());
        let actualTickets = products.filter(product => {
            let flag = false;
            resultProducts.payload.forEach(element => {
                if (element._id == product.product._id) {
                    flag = true
                }
            });
            return flag;
        })
        let sum = actualTickets.reduce((acc, prev) => {
            acc += prev.product.price * prev.quantity
            return acc;
        }, 0)
        let ticketNumber = Date.now() + Math.floor(Math.random() * 10000 + 1)

        let ticket = {
            code: ticketNumber,
            purchaser: username,
            purchase_datetime: new Date(),
            products: actualTickets.map(product => product.product._id),
            amount: sum,
        }

        const ticketResult = await ticketService.createTicket(ticket);
        resultUser.orders.push(ticketResult._id)
        await userService.updateUser({ username }, resultUser)
        res.send({ status: 200, payload: ticketResult }); */

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error creating the ticket. " + error.message });
    }
}