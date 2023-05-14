import { Router } from "express";
//import of the service for Products. (You can change to file system by swapping the commented line)
// import ProductManager from "../dao/fs/ProductManager.js";
import ProductManager from "../dao/db/products.dao.js";
import { io } from '../websocket.js'
import { productsModel } from "../dao/db/models/products.model.js"
import { cartsModel } from "../dao/db/models/carts.model.js"
import { passportCall } from "../util.js";

const router = Router();

// Product manager initalizing
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.redirect("/users/login");
});

router.get('/chat', (req, res) => {
    res.render("chat", {});
})

router.get('/products', passportCall('jwt'), async (req, res) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const category = req.query.category ? req.query.category.toLowerCase() : null;
    const status = req.query.status === 'true' ? true : req.query.status === 'false' ? false : undefined;
    const sort = req.query.sort ? (req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null) : null;

    const filters = {};
    const options = {};

    if (category || status !== undefined) {
        if (category) {
            filters.category = category;
        }
        if (status !== undefined) {
            filters.status = status;
        }
    }

    options.lean = true;
    options.limit = limit;
    options.page = page;
    if (sort !== null) {
        options.sort = { price: sort };
    }

    console.log("User loggued: ");
    console.log(req.user);

    try {

        const products = await productsModel.paginate(filters, options);
        console.log(products);

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
        console.log(error.message);
        res.status(500).send({ error: "Error ", message: error });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    try {
        const carts = await cartsModel.paginate({}, { page, limit: perPage, lean: true });
        res.render("carts", {
            carts: carts.docs,
            currentPage: carts.page,
            totalPages: carts.totalPages
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: "Error ", message: error });
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        res.status(500).send({ error: "Error ", message: error });
    }
});

router.post('/realtimeproducts', async (req, res) => {
    try {
        let newProduct = req.body;
        let productCreated = await productManager.createProduct(newProduct);

        if (productCreated.success) {
            io.emit("update-products", await productManager.getProducts());
            res.status(201).send(productCreated.message);
        } else {
            res.status(400).send(productCreated.message);
        }

    } catch (error) {
        res.status(500).send({ error: "Error saving product.", message: error });
    }
});

router.put('/realtimeproducts/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        let productFields = req.body;
        let productUpdated = await productManager.updateProduct(productId, productFields);

        if (productUpdated.success) {
            io.emit("update-products", await productManager.getProducts());
            res.status(201).send(productUpdated.message);
        } else {
            res.status(400).send(productUpdated.message);
        }

    } catch (error) {
        res.status(500).send({ error: "Error saving product.", message: error });
    }
});

router.delete('/realtimeproducts/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        let productDeleted = await productManager.deleteProduct(productId)

        if (productDeleted.success) {
            io.emit("update-products", await productManager.getProducts());
            res.status(201).send(productDeleted.message);
        } else {
            res.status(400).send(productDeleted.message);
        }

    } catch (error) {
        res.status(500).send({ error: "Error saving product.", message: error });
    }
});

export default router;