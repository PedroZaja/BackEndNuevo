import { Router } from "express";
import { swapUserClass } from '../controllers/users.controller.js';
import { passportCall } from '../util.js';

const router = Router();

router.post('/premium/:uid', passportCall('jwt'), swapUserClass);

export default router;