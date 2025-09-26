import { Request, Response } from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../services/serviceServices';
import { createInformation } from '../services/informationServices';
import { pool } from '../config/db';


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

    console.log('=== EDIT SERVICE BACKEND ===');
    console.log('ID:', id);
    console.log('Body recebido:', req.body);
    console.log('File recebido:', req.file);

    // Atualizar o serviço principal
    const updated = await updateService(id, req.body, req.file);
    if (!updated) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    console.log('Serviço principal atualizado:', updated);

    // Processar informações se existirem
    if (req.body.informations) {
      let informations = [];
      try {
        // Se já é um array, usar direto, senão parsear JSON
        informations = typeof req.body.informations === 'string' 
          ? JSON.parse(req.body.informations) 
          : req.body.informations;
          
        console.log('Informations parseadas:', informations);
      } catch (error) {
        console.error('Erro ao parsear informations:', error);
        return res.status(400).json({ error: 'Formato inválido para informations' });
      }

      if (Array.isArray(informations)) {
        console.log(`Processando ${informations.length} informações`);
        
        // Deletar todas as informações existentes deste serviço
        const deleteResult = await pool.query(
          'DELETE FROM informations WHERE id_service = $1', 
          [id]
        );
        console.log(`${deleteResult.rowCount} informações antigas deletadas`);
        
        // Inserir as novas informações
        let createdCount = 0;
        for (const info of informations) {
          if (info && info.description && info.description.trim() !== '') {
            const created = await createInformation(id, info.description.trim());
            console.log('Nova informação criada:', created);
            createdCount++;
          }
        }
        console.log(`${createdCount} novas informações criadas`);
      }
    } else {
      console.log('Nenhuma informação enviada para processar');
    }

    return res.json({ 
      message: 'Serviço atualizado com sucesso', 
      service: updated 
    });
    
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro no editService:', err);
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
