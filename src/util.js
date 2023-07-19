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

export const generateJwtToken = (user, expiresIn = '20m') => {
    return jwt.sign({user}, config.jwtPrivateKey, {expiresIn: expiresIn});
};

export const publicRouteMiddleware = (req, res, next) => {
    if (req.user) {
        req.logger.info(`Already logged in, redirect`);
        return res.redirect('/products');
    }
    next();
};

export const privateRouteMiddleware = (req, res, next) => {
    if (!req.user) {
        req.logger.info(`Redirect to log in`);
        return res.redirect('/users/login');
    }
    next();
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {

        req.logger.info(`Calling strategy: ${strategy}`);

        passport.authenticate(strategy, function (error, user, info) {

            if (error) return next(error);
            if (!user) {
                req.logger.warn('Token expired or invalid');
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }

            req.logger.info(`User obtained from the strategy: ${JSON.stringify(user)}`);

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
        description: faker.commerce.productDescription(),
        price: parseInt(faker.string.numeric(3)),
        stock: parseInt(faker.string.numeric(2)),
        category: faker.commerce.department(),
        thumbnail: faker.image.url()
    }
    product.available = product.stock > 0 ? true : false;
    return product;
};

export default __dirname;