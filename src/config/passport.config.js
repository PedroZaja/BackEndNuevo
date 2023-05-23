import passport from 'passport'
import jwtStrategy from 'passport-jwt'
import passportLocal from 'passport-local'
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../util.js'
import config from './config.js';
import UserManager from '../dao/db/user.dao.js';
import CartsService from '../services/carts.service.js';
import UserDTO from '../dao/DTO/user.dto.js';

const userManager = new UserManager();
const cartsService = new CartsService();

const LocalStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            const { first_name, last_name, age } = req.body;
            req.logger.info(`Registering user:  ${JSON.stringify(req.body)}`);
            
            try {

                const userExists = await userManager.findOne(username);

                if (userExists) {
                    req.logger.warn(`User already exist. username: ${username}`);
                    return done(null, false, { messages: 'User already exist.' });
                }

                const user = new UserDTO({
                    first_name: first_name,
                    last_name: last_name,
                    email: username,
                    age: age,
                    password: createHash(password)
                });

                if (user.email === config.adminName && password === config.adminPassword) {
                    user.role = 'admin';
                }

                const result = await userManager.createUser(user);

                return done(null, result, { messages: `User created successfully, ID: ${result.id}` });

            } catch (error) {
                return done("Error getting user: " + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {

            try {

                const user = await userManager.findOne(username);

                if (!user) {
                    req.logger.warn(`User doesn't exists with username: ${username}`);
                    return done(null, false, { messages: "Invalid credentials." });
                }

                if (!isValidPassword(user, password)) {
                    req.logger.warn(`Invalid credentials for user: ${username}`);
                    return done(null, false, { messages: "Invalid credentials." });
                }

                if (!user.cart) {
                    req.logger.info(`Creating Cart for  user: ${username}`);
                    const cart = await cartsService.createCart();

                    user.cart = cart._id;
                    await user.save();
                }


                return done(null, user, { messages: "Login Success." });

            } catch (error) {
                return done(error);
            }
        })
    );

    //Strategy to get JWT Token by Cookie:
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtPrivateKey

        }, async (jwt_payload, done) => {

            try {

                return done(null, jwt_payload.user);

            } catch (error) {
                req.logger.error(`Error in JWT strategy  ${error}`);
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
            req.logger.info(`Profile obtained from user: ${profile}`);

            try {
                const user = await userManager.findOne({
                    email: profile._json.email
                });
                
                req.logger.info(`User finded for login: ${user}`);

                if (!user) {
                    req.logger.warn(`User doesn't exists with username: ${profile._json.email}`);

                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: '',
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    };

                    const result = await userManager.createUser(newUser);
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
            let user = await userManager.findById(id);
            done(null, user);

        } catch (error) {
            console.error("Error deserializing the user: " + error);
        }
    });
}

/**
  * Utility method in case you need to extract cookies with Passport
  * @param {*} req the request object of some router.
  * @returns The token extracted from a Cookie
  */
const cookieExtractor = req => {
    let token = null;

    if (req && req.cookies) { //Validate that the request and cookies exist.
        req.logger.info(`Token from Cookie: ${req.cookies}`);
        token = req.cookies['jwtCookieToken']; //-> Keep in mind this name is that of the Cookie.
    }
    return token;
};

export default initializePassport;

