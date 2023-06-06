import { createHash, isValidPassword, generateJwtToken } from '../util.js';
import UserManager from '../dao/db/user.dao.js';
import UserDTO from '../dao/DTO/user.dto.js';


const userManager = new UserManager();

export const register = async (req, res) => {
    try {
        req.logger.info(`User: ${req.user}`);
        res.status(201).json({
            message: 'Success',
            redirectUrl: '/users/login'
        });
    } catch (error) {
        req.logger.console.warn(`Register user error:  ${error}`);
        res.status(500).json({ error: error.message, message: 'Error registering user' });
    }
};


export const login = async (req, res) => {
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
            maxAge: 1200000,
            httpOnly: true
        });
        res.status(200).json({success: true, redirectUrl: '/products' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: "Error login user." });
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
        const { email, password } = req.body;
        const user = await userManager.findOne(email);
        req.logger.info(`Restoring pass for: ${email}`);

        if (!user) {
            return res.status(401).json({ status: 'error', error: "Can't find user." });
        }

        const newUserPass = {
            email: email,
            password: createHash(password)
        }

        const result = await userManager.updateUser({ email: email }, newUserPass);

        req.logger.info(`Password restored`);
        res.status(200).json({ status: "success", message: `Password restored` })


/*         try {
            let email = req.user.email;
            let token = jwt.sign({email}, config.jwtKey, {expiresIn: "1h"});
            req.logger.debug("Pre nodemailer")
            try {
                transport.sendMail({from: 'aaa@gmail.com',
                to: email,
                subject: 'Reestablece tu contraseña',
                html: `
                <div style="background-color: black; color: green; display: flex; flex-direction: column; justify-content: center;  align-items: center;">
                    <h1>Para reestablecer tu contraseña haz click <a href="http://localhost:8080/recoverLanding/${token}">aqui</a></h1>
                </div>
                `});
            } catch (error) {
                return res.send({status: "error", message: "El email es inválido"})
            }
            res.send({status: "Ok", message: "email enviado"});
        } catch (error) {
            next(error)
        } */



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, message: 'Password could not be restored' });
    }

}

// export const gitHubLogin = passport.authenticate('github', { scope: ['user:email'] });

export const gitHubCallback  = async (req, res) => {

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

/* restorePass = async(req, res, next) => {
    try {
        req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`);

        let account = req.account;
        let password = req.password;

        account.password = createHash(password);

        let result = await um.editOne(account.email, account);

        if (result.acknowledged) res.send({status: "Ok", message: "Contraseña cambiada"});
    } catch(error) {
        next(error)
    }
}

postSwapUserClass = async(req, res, next) => {
    try {
        req.logger.http(`${req.method} at ${req.url} - ${new Date().toLocaleDateString()}`);

        let reqEmail = req.user.user.email;

        let email = req.params.uid;

        if (reqEmail != email) CustomError.createError({ statusCode: 401, name: "Admin users cant swap roles", cause: generateErrorInfo.unauthorized(), code: 6});

        let dbUser = await um.getOne({email});
        req.logger.debug("Consegui los datos del usuario");
        
        let user = {
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            role: dbUser.role,
            email: dbUser.email,
            cart: dbUser.cart
        }

        if (dbUser.role == "admin") CustomError.createError({ statusCode: 401, name: "Admin users cant swap roles", cause: generateErrorInfo.unauthorized(), code: 6});
        if (dbUser.role == "user") {
            dbUser.role = "premium";
            let result = await um.editOne(email, dbUser);

            user.role = dbUser.role;
            let print = await um.getOne({email});
            req.logger.debug(print);

            let token = jwt.sign({user}, config.jwtKey, {expiresIn: "24h"});
            if (result.acknowledged) return res.cookie('coderCookieToken', token, {maxAge: 1000*60*24, httpOnly: true}).send({status: "Ok", message: "Rol actualizado"});

            CustomError.createError({ statusCode: 500, name: "Couldn't swap roles", cause: generateErrorInfo.dbNotChanged(), code: 3});
        }
        if (dbUser.role == "premium") {
            dbUser.role = "user";
            let result = await um.editOne(email, dbUser);
            
            user.role = dbUser.role;
            let print = await um.getOne({email});
            req.logger.debug(print);

            let token = jwt.sign({user}, config.jwtKey, {expiresIn: "24h"});
            if (result.acknowledged) return res.cookie('coderCookieToken', token, {maxAge: 1000*60*24, httpOnly: true}).send({status: "Ok", message: "Rol actualizado"});

            CustomError.createError({ statusCode: 500, name: "Couldn't swap roles", cause: generateErrorInfo.dbNotChanged(), code: 3});
        }
    } catch (error) {
        next(error)
    }
} */