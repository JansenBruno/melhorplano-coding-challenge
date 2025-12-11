import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendationService';
import { UserPreferences, RecommendationResponse } from '../types/planSearchFilters.type';

const recommendationService = new RecommendationService();

export class RecommendationController {
  /**
   * Endpoint principal de recomendações
   * Suporta tanto GET (query params) quanto POST (body)
   */
  static getRecommendedPlans(req: Request, res: Response) {
    try {
      // Suporta tanto POST quanto GET
      const params = req.method === 'POST' ? req.body : req.query;
      
      // Extrair e validar preferências
      const preferences: UserPreferences = {
        city: params.city as string,
        maxBudget: params.maxBudget ? Number(params.maxBudget) : undefined,
        usageProfile: params.usageProfile as any,
        preferredOperators: params.preferredOperators 
          ? String(params.preferredOperators).split(',').map(op => op.trim())
          : undefined
      };

      // Validação básica
      if (!preferences.city) {
        return res.status(400).json({
          error: 'Cidade é obrigatória',
          availableCities: recommendationService.getAvailableCities()
        });
      }

      // Obter recomendações
      const recommendations = recommendationService.recommend(preferences);

      if (recommendations.length === 0) {
        return res.status(404).json({
          error: 'Nenhuma recomendação encontrada',
          suggestion: 'Tente ajustar seus critérios ou escolher outra cidade'
        });
      }

      // Preparar resposta
      const response: RecommendationResponse = {
        topRecommendation: recommendations[0],
        allRecommendations: recommendations,
        totalResults: recommendations.length,
        preferencesUsed: preferences
      };

      res.json(response);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      // Tratar erros específicos
      if (errorMessage.includes('Nenhum plano encontrado')) {
        return res.status(404).json({
          error: errorMessage,
          availableCities: recommendationService.getAvailableCities()
        });
      }

      res.status(400).json({
        error: 'Erro ao gerar recomendações',
        message: errorMessage
      });
    }
  }

  /**
   * Endpoint para obter metadados (cidades e operadoras disponíveis)
   */
  static getMetadata(req: Request, res: Response) {
    try {
      res.json({
        availableCities: recommendationService.getAvailableCities(),
        availableOperators: recommendationService.getAvailableOperators(),
        totalPlans: recommendationService.getAvailableCities().length,
        profiles: [
          { id: 'basic', name: 'Uso Básico' },
          { id: 'medium', name: 'Uso Médio' },
          { id: 'heavy', name: 'Uso Pesado' },
          { id: 'family', name: 'Família' },
          { id: 'gaming', name: 'Gaming' }
        ]
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao obter metadados',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}