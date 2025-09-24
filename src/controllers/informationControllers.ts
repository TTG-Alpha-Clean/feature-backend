import { Request, Response } from 'express';
import {
  createInformation,
  updateInformation
} from '../services/informationServices';

// helper para converter e validar número
function toNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// Adicionar informação (POST)
export async function addInformation(req: Request, res: Response): Promise<Response> {
  try {
    const { id_service, description } = req.body ?? {};

    if (id_service == null || !description) {
      return res.status(400).json({
        error: 'id_service e description são obrigatórios'
      });
    }

    const idServiceNum = toNumber(id_service);
    if (idServiceNum === null) {
      return res.status(400).json({ error: 'id_service deve ser numérico' });
    }

    const info = await createInformation(idServiceNum, String(description));
    return res.status(201).json(info);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: errorMessage });
  }
}

// Editar informação (PUT ou PATCH)
export async function editInformation(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { description } = req.body ?? {};

    if (!description) {
      return res.status(400).json({ error: 'description é obrigatório' });
    }

    const idNum = toNumber(id);
    if (idNum === null) {
      return res.status(400).json({ error: 'id deve ser numérico' });
    }

    const info = await updateInformation(idNum, String(description));
    return res.json(info);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: errorMessage });
  }
}
