import { createHash, isValidPassword, generateJwtToken } from '../util.js';
import UserService from "../services/users.service.js";
import UserDTO from '../dao/DTO/user.dto.js';
import { transporter } from './email.controller.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';


const userService = new UserService();

export const register = async (req, res) => {
    try {
        req.logger.info(`User: ${req.user}`);
        res.status(201).json({
            message: 'Success',
            redirectUrl: '/users/login'
        });
    } catch (error) {
        req.logger.console.warn(`Error registrando el usuario:  ${error}`);
        res.status(500).json({ error: error.message, message: 'Error registrando el usuario' });
    }
};


export const login = async (req, res) => {
    try {

        const user = req.user;

        const tokenUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        };

        const access_token = generateJwtToken(tokenUser);
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 1200000,
            httpOnly: true
        });
        res.status(200).json({ success: true, redirectUrl: '/products' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: "Error de inicio." });
    }
};


export const getCurrent = async (req, res) => {

    const user = new UserDTO(req.user)
    res.send(user);
}


export const logout = async (req, res) => {
    req.session.destroy();
    res.clearCookie('jwtCookieToken');
    req.logger.info('User logout');
    res.redirect('/users/login');
}

export const recoverPass = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await userService.findOne(email);
        req.logger.info(`Creando un token de recuperacion: ${email}`);

        if (!user) {
            return res.status(401).json({ status: 'error', error: "No se encuentra el usuario." });
        }

        let restorePassToken = generateJwtToken(email, '1h')
        console.log(restorePassToken);

        await transporter.sendMail({
            from: 'pedrodavid21@gmail.com',
            to: email,
            subject: 'Restaurar contraseña!',
            html: `
            <div style="display: flex; flex-direction: column; justify-content: center;  align-items: center;">
            <h1>Para restaurar contraseña, click <a href="http://localhost:8080/users/recoverLanding/${restorePassToken}">aqui!</a></h1>
            </div>`
        });

        req.logger.info(`Token de restauracion enviado!`);
        res.status(200).json({ status: "success", message: `Token de restauracion enviado` })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'La contraseña no se puede cambiar' });
    }
}

export const restorePass = async (req, res, next) => {
    try {

        const { token, password: newPassword } = req.body;

        const decodedToken = jwt.verify(token, config.jwtPrivateKey);

        if (!newPassword || newPassword.trim() === "") {
            return res.send({ status: "error", message: "La contraseña no puede estar vacia!" });
        }

        const email = decodedToken.user;
        const user = await userService.findOne(email);
        req.logger.info(`Comprobando que el usuario exista: ${email}`);


        if (!user) {
            return res.status(401).json({ status: 'error', error: "Usuario no encontrado." });
        }

        if (isValidPassword(user, newPassword)) {
            return res.send({ status: "error", message: "La contraseña no puede ser la misma" });
        }

        const hashedPass = createHash(newPassword)
        const result = await userService.updateUser({ email: email }, { password: hashedPass });

        return res.status(200).json({ status: "success", message: "La contraseña se cambio con exito!." });

    } catch (error) {

        if (error.name == 'TokenExpiredError') {
            req.logger.warn('Token has expired.')
            return res.status(401).json({ error: 'Token has expired.' });
        }

        next(error)
    }
}


export const gitHubCallback = async (req, res) => {

    const user = req.user;

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: "admin"
    };

    const access_token = generateJwtToken(req.session.user);
    req.logger.http(`JWT Token: ${access_token}`);

    res.cookie('jwtCookieToken', access_token, {
        maxAge: 900000,
        httpOnly: true
    });

    res.redirect("/github");
};