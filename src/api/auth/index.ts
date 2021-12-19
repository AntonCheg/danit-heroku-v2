import { Router } from 'express';
import { login, refreshToken, registration } from './post';

const router = Router();

router.post('/registration', registration);
router.post('/login', login);
router.post('/refreshToken', refreshToken);

export default router;
