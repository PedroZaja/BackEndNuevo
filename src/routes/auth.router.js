import { Router } from 'express';
import { register, login, gitHubCallback, getCurrent, logout, restorePass } from '../controllers/auth.controler.js';
import { passportCall } from '../util.js';

const router = Router();

router.post("/register", passportCall('register'), register);
router.post("/login", passportCall('login'), login);
router.get("/github", passportCall('github', { scope: ['user:email'] }));
router.get("/githubcallback", passportCall('github', { failureRedirect: '/github/error' }), gitHubCallback);

router.get("/current", passportCall('jwt'), getCurrent)  
router.post("/logout", logout);
router.post("/restore", restorePass);



export default router;