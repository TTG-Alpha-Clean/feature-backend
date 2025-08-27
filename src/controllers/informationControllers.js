import {
  createInformation,
  updateInformation
} from "../services/informationServices.js";

export async function addInformation(req, res) {
  try {
    const { id_service, description } = req.body;
    if (!id_service || !description) {
      return res.status(400).json({ error: "id_service e description são obrigatórios" });
    }
    const info = await createInformation(id_service, description);
    res.status(201).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function editInformation(req, res) {
  try {
    const { id } = req.params;
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "description é obrigatório" });
    }
    const info = await updateInformation(id, description);
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
