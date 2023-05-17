import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from './config/config.js';
import { fakerES as faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {

    return bcrypt.compareSync(password, user.password);
}

//JSON Web Tokens JWT functinos:
export const generateJwtToken = (user) => {
    return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: '20m'});
};

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


export const generateMockProduct = () => {
    let product = {
        _id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(7),
        title: faker.commerce.productName(),
        description: faker.lorem.text(),
        price: parseInt(faker.string.numeric(3)),
        stock: parseInt(faker.string.numeric(2)),
        category: faker.commerce.department(),
        thumbnail: faker.image.url()
    }
    product.available = product.stock > 0 ? true : false;
    return product;
};

export default __dirname;