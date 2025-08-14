import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import {
  addService, listServices, getService, editService, removeService
} from '../controllers/serviceControllers.js';

const router = Router();

router.get('/', listServices);


router.get('/:id', verifyToken, getService);
router.post('/', verifyToken, addService);
router.put('/:id', verifyToken, editService);
router.delete('/:id', verifyToken, removeService);

export default router;
