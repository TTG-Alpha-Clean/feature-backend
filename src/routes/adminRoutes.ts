import { Router } from 'express';
import { adminLogin, adminLogout, checkAuth } from '../controllers/adminControllers';
import { verifyToken } from '../middlewares/auth';

const router = Router();
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/check', verifyToken, checkAuth);
export default router;
