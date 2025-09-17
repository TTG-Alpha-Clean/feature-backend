import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import { addInformation, editInformation } from "../controllers/informationControllers";

const router = Router();

// criar nova informação para um service
router.post("/", verifyToken, addInformation);

// editar informação existente
router.put("/:id", verifyToken, editInformation);

export default router;
