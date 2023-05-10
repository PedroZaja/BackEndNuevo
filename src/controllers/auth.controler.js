import passport from 'passport';
import { createHash, isValidPassword, generateJwtToken } from '../util.js';
import { passportCall } from '../util.js';
import UserManager from '../dao/db/user.dao.js';

const userManager = new UserManager();

export const register = passportCall('register', async (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'Success',
            redirectUrl: '/users/login'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message, message: 'Error registering user' });
    }
});


export const login = passportCall('login', async (req, res, next) => {
    try {

        const user = req.user;

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };

        const access_token = generateJwtToken(tokenUser);
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 180000,
            httpOnly: true
        });
        return res.status(200).redirect('/products');

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "Error login user." });
    }
});


export const getCurrent = async (req, res) => {
    try {

        res.json({ payload: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "Can't get current user" });
    }

}


export const logout = async (req, res) => {
    req.session.destroy();
    res.clearCookie('jwtCookieToken');
    res.redirect('/users/login');
    console.log("User logout");
    res.send({ message: "Success!", payload: "logout" });
}

export const restorePass = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.findOne( {email: email} );

        if (!user) {
            return res.status(401).json({ status: 'error', error: "Can't find user." });
        }

        const newUser = {
            email: email,
            password: createHash(password)
        }

        const result = await userManager.updateOne({ email: email }, newUser);

        res.status(200).json({ status: "success", message: `Password restored` })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Password could not be restored' });
    }

}

export const gitHubLogin = passport.authenticate('github', { scope: ['user:email'] });

export const gitHubCallback = passport.authenticate('github', { failureRedirect: '/github/error' }, async (req, res) => {
    const user = req.user;

    tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: "admin"
    };

    const access_token = generateJwtToken(tokenUser);
    console.log(access_token);

    res.cookie('jwtCookieToken', access_token, {
        maxAge: 180000,
        httpOnly: true
    });

    res.redirect("/github");
});