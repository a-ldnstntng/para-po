import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { insertRoute, insertStep, getAllRoutes, getRouteById, confirmRoute, deleteRoute } from '../db/database.js';

const router = Router();

router.post('/', (req, res) => {
  const { origin, destination, raw_text, steps } = req.body;
  if (!origin || !destination || !raw_text || !Array.isArray(steps)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const routeId = uuidv4();
  try {
    insertRoute(routeId, origin, destination, raw_text);
    
    for (const step of steps) {
      const stepId = uuidv4();
      insertStep(
        stepId,
        routeId,
        step.step_order,
        step.mode,
        step.line_label || null,
        step.landmark,
        step.instruction,
        step.fare_estimate_php || null,
        step.notes || null
      );
    }
    
    const savedRoute = getRouteById(routeId);
    res.json(savedRoute);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ error: 'Failed to save route' });
  }
});

router.get('/', (req, res) => {
  try {
    const routes = getAllRoutes();
    res.json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ error: 'Failed to get routes' });
  }
});

router.post('/:id/confirm', (req, res) => {
  try {
    confirmRoute(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error confirming route:', error);
    res.status(500).json({ error: 'Failed to confirm route' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    deleteRoute(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

export default router;
