import ProductDao from "../dao/db/products.dao.js";
import CartsDao from "../dao/db/carts.dao.js";
import TicketDao from "../dao/db/tickets.dao.js";
import UserDao from "../dao/db/users.dao.js";

import ProductRepository from './products.repository.js';
import CartsRepository from './carts.repository.js';
import TicketsRepository from './ticket.repository.js';
import UserRepository from './users.repository.js';

const productDao = new ProductDao()
const cartsDao = new CartsDao()
const ticketDao = new TicketDao()
const userDao = new UserDao()

export const ProductRepositoryWithDao = new ProductRepository(productDao);
export const CartsRepositoryWithDao = new CartsRepository(cartsDao);
export const TicketsRepositoryWithDao = new TicketsRepository(ticketDao);
export const UserRepositoryWithDao = new UserRepository(userDao);
