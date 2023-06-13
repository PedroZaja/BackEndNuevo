import express from "express";
import handlebars from 'express-handlebars';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import __dirname from './util.js';
import path from 'path';
import {setupWebSocket} from './websocket.js';
import config from "./config/config.js";
//Database
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
// Errors
import errorHandler from './middlewares/errors/index.js'
import { addLogger, customLogger } from './config/logger.js';

// Passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';
// Swagger Documentation
import swaggerDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Routers
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from './routes/views.router.js';
import usersViewsRouter from './routes/user.views.router.js';
import sessionsRouter from './routes/auth.router.js';
import githubLoginRouter from './routes/github-login.views.router.js';
import ticketsRouter from './routes/tickets.router.js'
import emailRouter from './routes/email.router.js';
import mockingRouter from './routes/mock.router.js';
import logRouter from './routes/log.router.js';

//Declare Express server.
const app = express();

//Swagger Doc
const swaggerOpts = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion Back End!",
            description: "Api docs with swagger",
            version: "1.0.0"
        }
    },
    apis: ['./src/docs/**/*.yaml']
}
const specs = swaggerDoc(swaggerOpts);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//Prepare server settings to receive JSON objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// Define logger middleware
app.use(addLogger);

// Define path for static content
app.use(express.static(path.join(__dirname +'/public')));

// Define the template engine and views
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

//Session
app.use(session(
    {
        store: MongoStore.create({
            mongoUrl: config.mongoUrl,
            mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 40,
        }),
        secret: "Codigoxxx",
        resave: false,
        saveUninitialized: true
    }
))


// COOKIES
app.use(cookieParser("Cookie$C0der"));

//MIDDLEWARE PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/api/tickets', ticketsRouter);
app.use("/users", usersViewsRouter);
app.use("/github", githubLoginRouter);
app.use("/api/mail", emailRouter);
app.use("/", viewsRouter);
app.use('/mockingproducts', mockingRouter)
app.use('/loggerTest', logRouter)


//MIDDLEWARE ERROR
app.use(errorHandler);

const httpServer = app.listen(config.port, () => {
    console.log(`Servidor activo en el puerto: ${config.port}`);
})
// Initialize websocket Server
setupWebSocket(httpServer);

// Connect to MongoDb
const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("Coneccion a la base de datos exitosa!");
    } catch (error) {
        console.log("Error al conectarse a la base de datos! "+error);
    }

}
connectMongoDB();


