import passport from 'passport'
import jwtStrategy from 'passport-jwt'
import passportLocal from 'passport-local'
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../util.js'
import config from './config.js';
import UserService from "../services/users.service.js";
import CartsService from '../services/carts.service.js';
import UserDTO from '../dao/DTO/user.dto.js';

const userService = new UserService();
const cartsService = new CartsService();

const LocalStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            console.log(username);
            console.log(password);

            const { first_name, last_name, age } = req.body;
            req.logger.info(`Registrando usuario:  ${JSON.stringify(req.body)}`);

            try {

                const userExists = await userService.findOne(username);

                if (userExists) {
                    req.logger.warn(`El usuario ya existe:  ${username}`);
                    return done(null, false, { messages: 'Usuario existente' });
                }

                const user = new UserDTO({
                    first_name: first_name,
                    last_name: last_name,
                    email: username,
                    age: age,
                    password: createHash(password),
                    last_connection: new Date()
                });

                if (user.email === config.adminName && password === config.adminPassword) {
                    user.role = 'admin';
                }

                const result = await userService.createUser(user);

                return done(null, result, { messages: `Usuario creado, ID: ${result.id}` });

            } catch (error) {
                return done("Error obteniendo el usuario: " + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            try {

                const user = await userService.findOne(username);

                if (!user) {
                    req.logger.warn(`El usuario no existe con el nombre: ${username}`);
                    return done(null, false, { messages: "Datos inexistentes" });
                }

                if (!isValidPassword(user, password)) {
                    req.logger.warn(`Datos erroneos: ${username}`);
                    return done(null, false, { messages: "Datos invalidos" });
                }

                if (!user.cart) {
                    req.logger.info(`Creando carrito por el usuario: ${username}`);
                    const cart = await cartsService.createCart();

                    user.cart = cart._id;
                    await user.save();
                }


                return done(null, user, { messages: "Inicio exitoso." });

            } catch (error) {
                return done(error);
            }
        })
    );

    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtPrivateKey,
            passReqToCallback: true
        },
        async (req, jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user);

            } catch (error) {
                if (error.name == 'TokenExpiredError') {
                    req.logger.warn('Token expired:', error.message);

                } else {
                    req.logger.error('Error in JWT strategy:', error);
                }

                return done(error);
            }
        }
    ));


    passport.use('github', new GitHubStrategy(
        {
            clientID: config.GHclientID,
            clientSecret: config.GHClientSecret,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            req.logger.info(`Perfil obtenido: ${profile}`);

            try {
                const user = await userService.findOne({
                    email: profile._json.email
                });

                req.logger.info(`Usuario encontrado: ${user}`);

                if (!user) {
                    req.logger.warn(`El usuario no existe: ${profile._json.email}`);

                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: '',
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub",
                        last_connection: new Date()
                    };

                    const result = await userService.createUser(newUser);
                    return done(null, result);

                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user);

        } catch (error) {
            console.error("Error obteniendo el usuario: " + error);
        }
    });
}

const cookieExtractor = req => {
    let token = null;

    if (req && req.cookies) {

        req.logger.info(`Token from Cookie: ${JSON.stringify(req.cookies)}`);
        token = req.cookies['jwtCookieToken'];
    }
    return token;
};

export default initializePassport;

