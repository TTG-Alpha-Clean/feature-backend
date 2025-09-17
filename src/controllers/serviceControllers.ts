import { Request, Response } from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../services/serviceServices';

// Tipagem estendida para suportar arquivos
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// helper para converter e validar id numérico
function parseId(idParam: string): number | null {
  const n = Number.parseInt(idParam, 10);
  return Number.isNaN(n) ? null : n;
}

// CREATE
export async function addService(req: MulterRequest, res: Response): Promise<Response> {
  try {
    const newService = await createService(req.body, req.file);
    return res.status(201).json(newService);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: message });
  }
}

// READ - todos
export async function listServices(_req: Request, res: Response): Promise<Response> {
  try {
    const services = await getAllServices();
    return res.json(services);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: message });
  }
}

// READ - por ID
export async function getService(req: Request, res: Response): Promise<Response> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'ID inválido. Deve ser numérico.' });
    }

    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    return res.json(service);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: message });
  }
}

// UPDATE
export async function editService(req: MulterRequest, res: Response): Promise<Response> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'ID inválido. Deve ser numérico.' });
    }

    const updated = await updateService(id, req.body, req.file);
    if (!updated) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    return res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: message });
  }
}

// DELETE
export async function removeService(req: Request, res: Response): Promise<Response> {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ error: 'ID inválido. Deve ser numérico.' });
    }

    const deleted = await deleteService(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    return res.json({ message: 'Serviço excluído com sucesso', service: deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return res.status(500).json({ error: message });
  }
}
