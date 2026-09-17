import { Router } from 'express';
import { generateSection, saveSection } from './sectionService.js';

const router = Router();

// Express 4 does not catch errors thrown inside async route handlers automatically.
// Every handler needs its own try/catch and must pass the error to next().
router.post('/sections/generate', async (req, res, next) => {
  try {
    const { id, tree, meta, version } = generateSection(req.body?.prompt);
    res.status(201).json({ id, tree, meta, version });
  } catch (err) {
    next(err);
  }
});

router.put('/sections/:id', async (req, res, next) => {
  try {
    const { id, version, updatedAt } = saveSection(req.params.id, req.body?.tree);
    res.json({ id, version, updatedAt });
  } catch (err) {
    next(err);
  }
});

export default router;
