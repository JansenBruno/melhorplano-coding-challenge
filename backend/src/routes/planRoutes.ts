import { Router } from 'express';
import { PlanController } from '../controllers/planController';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();

// Rotas existentes para planos
router.get('/', PlanController.getAllPlans);
router.get('/filtered', PlanController.getFilteredPlans);
router.get('/search', PlanController.searchPlans);

// NOVAS ROTAS PARA RECOMENDAÇÕES
router.get('/recommendations/metadata', RecommendationController.getMetadata);
router.get('/recommendations', RecommendationController.getRecommendedPlans);
router.post('/recommendations', RecommendationController.getRecommendedPlans);

export default router;