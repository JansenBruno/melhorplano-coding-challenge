import { Router } from 'express';
import { PlanController } from '../controllers/planController';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();

router.get('/', PlanController.getAllPlans);
router.get('/filtered', PlanController.getFilteredPlans);
router.get('/search', PlanController.searchPlans);

router.get('/recommendations/metadata', RecommendationController.getMetadata);
router.get('/recommendations', RecommendationController.getRecommendedPlans);
router.post('/recommendations', RecommendationController.getRecommendedPlans);

export default router;