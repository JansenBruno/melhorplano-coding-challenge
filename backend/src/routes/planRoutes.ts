import { Router } from 'express';
import { PlanController } from '../controllers/planController';

const router = Router();

router.get('/', PlanController.getAllPlans);
router.get('/filtered', PlanController.getFilteredPlans);
router.get('/search', PlanController.searchPlans);

export default router;