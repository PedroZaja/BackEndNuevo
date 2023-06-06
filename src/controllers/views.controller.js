import { io } from '../websocket.js'
import ProductsService from "../services/products.service.js";
import CartsService from "../services/carts.service.js";

// Product and Cart manager initalizing
const productsService = new ProductsService();
const cartsService = new CartsService();

export const get = async (req, res) => {
        res.redirect("/users/login");
};

export const getChat = async (req, res) => {
        res.render("chat", {});
};

export const getProducts = async (req, res) => {
    try {
        const products = await productsService.getProducts(req.query);

        let user, admin = null;

        if (req.user) {
            user = req.user;
        }
        if (req.user.role === "admin") {
            admin = true;
        }

        res.render("products", {
            products,
            user,
            admin
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error "+error.message });
    }
};

export const getPaginatedCart = async (req, res) => {

    try {
        const carts = await cartsService.getPaginatedCart(req.params.cid);
        res.render("carts", {
            carts: carts.docs,
            currentPage: carts.page,
            totalPages: carts.totalPages
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error "+error.message });
    }
};

export const getRealTimeProducts = async (req, res) => {
        res.render("realTimeProducts");
};


export const createRealTimeProduct = async (req, res) => {
    try {
        let newProduct = req.body;
        let productCreated = await productsService.createProduct(newProduct);

        if (productCreated.success) {
            io.emit("update-products", await productsService.getProducts());
            res.status(201).send(productCreated.message);
        } else {
            res.status(400).send(productCreated.message);
        }

    } catch (error) {
        res.status(500).send({ error: "Error saving product."+error.message });
    }
};


export const updateRealTimeProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        let productFields = req.body;
        let productUpdated = await productsService.updateProduct(productId, productFields);

        if (productUpdated.success) {
            io.emit("update-products", await productsService.getProducts());
            res.status(201).send(productUpdated.message);
        } else {
            res.status(400).send(productUpdated.message);
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error updating product."+error.message });
    }
};

export const deleteRealTimeProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        let productDeleted = await productsService.deleteProduct(productId)

        if (productDeleted.success) {
            io.emit("update-products", await productsService.getProducts());
            res.status(201).send(productDeleted.message);
        } else {
            res.status(400).send(productDeleted.message);
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error deleting product."+error.message });
    }
};