import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../services/serviceServices.js';

// CREATE
export async function addService(req, res) {
  try {
    const newService = await createService(req.body);
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
}

// READ - todos
export async function listServices(req, res) {
  try {
    const services = await getAllServices();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
}

// READ - por ID
export async function getService(req, res) {
  try {
    const service = await getServiceById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
}

// UPDATE
export async function editService(req, res) {
  try {
    const updated = await updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
}

//DELETE
export async function removeService(req, res) {
  try {
    const deleted = await deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json({ message: 'Serviço excluído com sucesso', service: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir serviço' });
  }
}

