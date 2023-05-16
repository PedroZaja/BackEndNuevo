import { createHash, isValidPassword, generateJwtToken } from '../util.js';
import UserManager from '../dao/db/user.dao.js';
import UserDTO from '../dao/DTO/user.dto.js';


const userManager = new UserManager();

export const register = async (req, res) => {
    try {
        console.log(req.user);
        res.status(201).json({
            message: 'Success',
            redirectUrl: '/users/login'
        });
    } catch (error) {
        console.error(error);
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
    console.log("User logout");
    res.redirect('/users/login');
}

export const restorePass = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userManager.findOne(email);
        console.log("Restoring pass for: " + email);

        if (!user) {
            return res.status(401).json({ status: 'error', error: "Can't find user." });
        }

        const newUser = {
            email: email,
            password: createHash(password)
        }

        const result = await userManager.updateUser({ email: email }, newUser);

        console.log("Password restored");
        res.status(200).json({ status: "success", message: `Password restored` })

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
    console.log(access_token);

    res.cookie('jwtCookieToken', access_token, {
        maxAge: 900000,
        httpOnly: true
    });

    res.redirect("/github");
};