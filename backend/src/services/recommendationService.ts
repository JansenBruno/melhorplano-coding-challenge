import { Plan } from '../models/plan';
import { UserPreferences, PlanRecommendation } from '../types/planSearchFilters.type';
import { PROFILE_CONFIG, SCORE_WEIGHTS } from '../types/recommendationConfig.type';
import { allPlansMock } from '../data';

export class RecommendationService {
  private readonly plans: Plan[];

  constructor() {
    this.plans = [...allPlansMock];
  }

  recommend(preferences: UserPreferences): PlanRecommendation[] {
    if (!preferences.city) {
      throw new Error('Cidade é obrigatória para recomendações');
    }

    const cityPlans = this.plans.filter(plan =>
      plan.city.toLowerCase() === preferences.city.toLowerCase()
    );

    if (cityPlans.length === 0) {
      throw new Error(`Nenhum plano encontrado para a cidade: ${preferences.city}`);
    }

    const recommendations = cityPlans.map(plan => 
      this.calculatePlanScore(plan, preferences)
    );

    return recommendations.sort((a, b) => b.score - a.score);
  }

 
  private calculatePlanScore(plan: Plan, preferences: UserPreferences): PlanRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const warnings: string[] = [];

    score += SCORE_WEIGHTS.CITY_MATCH;
    reasons.push(`Disponível em ${plan.city}`);

    if (preferences.maxBudget) {
      if (plan.price <= preferences.maxBudget) {
        score += SCORE_WEIGHTS.BUDGET_MATCH;
        reasons.push(`Dentro do orçamento (R$ ${plan.price.toFixed(2)})`);
      } else {
        warnings.push(`Acima do orçamento (R$ ${plan.price.toFixed(2)} > R$ ${preferences.maxBudget})`);
      }
    }

    if (preferences.usageProfile) {
      const profile = PROFILE_CONFIG[preferences.usageProfile];
      const speedValue = this.extractSpeedMbps(plan.speed);

      if (speedValue >= profile.minSpeed) {
        score += SCORE_WEIGHTS.SPEED_PROFILE_MATCH;
        reasons.push(`Velocidade ${plan.speed} adequada para ${profile.name}`);
      } else {
        warnings.push(`Velocidade ${plan.speed} abaixo do mínimo recomendado para ${profile.name} (${profile.minSpeed}Mbps)`);
      }

      if (plan.dataCap >= profile.minData) {
        score += SCORE_WEIGHTS.DATA_PROFILE_MATCH;
        reasons.push(`Franquia de ${plan.dataCap}GB adequada para ${profile.name}`);
      } else {
        warnings.push(`Franquia de ${plan.dataCap}GB abaixo do mínimo recomendado para ${profile.name} (${profile.minData}GB)`);
      }
    }

    if (preferences.preferredOperators && preferences.preferredOperators.length > 0) {
      const isPreferred = preferences.preferredOperators.some(
        operator => operator.toLowerCase() === plan.operator.toLowerCase()
      );
      
      if (isPreferred) {
        score += SCORE_WEIGHTS.OPERATOR_PREFERENCE;
        reasons.push(`Operadora ${plan.operator} está entre suas preferidas`);
      }
    }

    score = Math.min(score, 100);

    return {
      plan,
      score,
      reasons,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

 
  private extractSpeedMbps(speed: string): number {
    const match = speed.match(/(\d+(?:\.\d+)?)\s*(?:Gbps|Mbps)/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    if (speed.toLowerCase().includes('gbps')) {
      return value * 1000; // Converter Gbps para Mbps
    }
    return value;
  }

 
  getAvailableCities(): string[] {
    const cities = this.plans.map(plan => plan.city);
    return [...new Set(cities)].sort();
  }


  getAvailableOperators(): string[] {
    const operators = this.plans.map(plan => plan.operator);
    return [...new Set(operators)].sort();
  }
}