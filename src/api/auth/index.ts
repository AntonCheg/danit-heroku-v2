import { authMiddleware } from './auth.middleware';
import { Router } from 'express';
import { registration, login, checkIsRefreshTokenAvailable } from './post';
import { IRequest } from '../../types';

const router = Router();

router.post('/registration', registration);
router.post('/login', login);
router.post('/refreshToken', checkIsRefreshTokenAvailable);

export default router;
