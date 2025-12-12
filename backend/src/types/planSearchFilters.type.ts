import { Plan } from "../models/plan";

export interface PlanSearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minDataCap?: number;
  maxDataCap?: number;
  operator?: string;
  city?: string;
  name?: string;
}

export interface PaginatedPlans {
  plans: Plan[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserPreferences {
  city: string;                   
  maxBudget?: number;            
  usageProfile?: 'basic' | 'medium' | 'heavy' | 'family' | 'gaming';
  preferredOperators?: string[]; 
}


export interface PlanRecommendation {
  plan: Plan;
  score: number;                   
  reasons: string[];              
  warnings?: string[];            
}

export interface RecommendationResponse {
  topRecommendation: PlanRecommendation;
  allRecommendations: PlanRecommendation[];
  totalResults: number;
  preferencesUsed: UserPreferences;
}