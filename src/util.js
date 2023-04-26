import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    console.log(`Validete data: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

//JSON Web Tokens JWT functinos:
export const generateJwtToken = (user) => {
    return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '120s'});
};

export const authToken = (req, res, next) => {
    //Remember that the token comes from the cookies
    const cookieToken = req.cookies.jwtCookieToken
    if (!cookieToken) return res.status(401).send({error: "Not authenticated"})

    const token = cookieToken.split(' ')[1]; //The split is made to remove the word Bearer
    jwt.verify(token, config.jwtPrivateKey, (error, credentials) => {
        //jwt checks the existing token and checks if it is a valid token or altered one
        if (error) return res.status(403).send({ error: "Token invalid - Unauthorized" })
        // Token OK
        req.user = credentials.user;
        console.log(req.user);
        next();
    })
}

// Middleware for public routes
export const publicRouteMiddleware = (req, res, next) => {
    if (req.user) {
        console.log("Already logged in, redirect");
        return res.redirect('/products');
    }
    next();
};

// Middleware for private routes
export const privateRouteMiddleware = (req, res, next) => {
    if (!req.user) {
        console.log("Redirect to log in");
        return res.redirect('/users/login');
    }
    next();
};

//Useful for more controlled calls of the Passport strategy.
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Calling strategy:");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }
            console.log("User obtained from the strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};


export default __dirname;