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
// Passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';

// Routers
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from './routes/views.router.js';
import usersViewsRouter from './routes/user.views.router.js';
import sessionsRouter from './routes/auth.router.js';
import githubLoginRouter from './routes/github-login.views.router.js'


//Declare Express server.
const app = express();

//Prepare server settings to receive JSON objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
app.use("/users", usersViewsRouter);
app.use("/github", githubLoginRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(config.port, () => {
    console.log(`Express Server listening  on the port: ${config.port}`);
})
// Initialize websocket Server
setupWebSocket(httpServer);

// Connect to MongoDb
const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("Connection to DB Succed");
    } catch (error) {
        console.log("Error on connection to DB"+error);
    }

}
connectMongoDB();

