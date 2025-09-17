import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import {
  addService, listServices, getService, editService, removeService
} from '../controllers/serviceControllers';
import upload from '../middlewares/upload';
const router = Router();

router.get('/', listServices);


router.get('/:id', verifyToken, getService);
router.post('/', verifyToken, upload.single("image"), addService);
router.put('/:id', verifyToken, upload.single("image"), editService);
router.delete('/:id', verifyToken, removeService);

export default router;
