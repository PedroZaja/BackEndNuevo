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
import sessionsRouter from './routes/session.router.js';
import githubLoginRouter from './routes/github-login.views.router.js';
import ticketsRouter from './routes/tickets.router.js'
import usersRouter from './routes/users.router.js'
import emailRouter from './routes/email.router.js';
import mockingRouter from './routes/mock.router.js';
import logRouter from './routes/log.router.js';

const app = express();

const swaggerOpts = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion de mi proyecto!",
            description: "Api docs with swagger",
            version: "1.0.0"
        }
    },
    apis: ['./src/docs/**/*.yaml']
}
const specs = swaggerDoc(swaggerOpts);

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(addLogger);

app.use(express.static(path.join(__dirname +'/public')));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

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

app.use(cookieParser("Cookie$C0der"));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter);
app.use("/users", usersViewsRouter);
app.use("/github", githubLoginRouter);
app.use("/api/mail", emailRouter);
app.use("/", viewsRouter);
app.use('/mockingproducts', mockingRouter)
app.use('/loggerTest', logRouter)

app.use(errorHandler);

const httpServer = app.listen(config.port, () => {
    customLogger.http(`Servidor escuchando en el puerto: ${config.port}`);
})

setupWebSocket(httpServer);

const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        customLogger.info("Conexion a la base de datos exitosa!");
    } catch (error) {
        customLogger.fatal(`Error conectandose a la base de datos. ${error}`);
    }

}
connectMongoDB();