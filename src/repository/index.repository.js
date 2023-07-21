import ProductDao from "../dao/db/products.dao.js";
import CartsDao from "../dao/db/carts.dao.js";
import MessageDao from "../dao/db/message.dao.js";
import TicketDao from "../dao/db/tickets.dao.js";
import UserDao from "../dao/db/user.dao.js";

import ProductRepository from './products.repository.js';
import CartsRepository from './carts.repository.js';
import MessagesRepository from './messages.repository.js';
import TicketsRepository from './ticket.repository.js';
import UserRepository from './users.repository.js';

const productDao = new ProductDao()
const cartsDao = new CartsDao()
const messageDao = new MessageDao()
const ticketDao = new TicketDao()
const userDao = new UserDao()

export const ProductService = new ProductRepository(productDao);
export const CartService = new CartsRepository(cartsDao);
export const MessageService = new MessagesRepository(messageDao);
export const TicketsService = new TicketsRepository(ticketDao);
export const UserService = new UserRepository(userDao);
