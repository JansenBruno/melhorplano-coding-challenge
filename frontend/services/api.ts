import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export default api;

export interface PlanSearchParams {
  minPrice?: number;
  maxPrice?: number;
  minDataCap?: number;
  maxDataCap?: number;
  operator?: string;
  city?: string;
  name?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedPlans {
  plans: Plan[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Plan {
  id: number;
  name: string;
  speed: string;
  price: number;
  operator: string;
  city: string;
  dataCap: number;
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

export interface SystemMetadata {
  availableCities: string[];
  availableOperators: string[];
  totalPlans: number;
  profiles: Array<{
    id: 'basic' | 'medium' | 'heavy' | 'family' | 'gaming';
    name: string;
  }>;
}

export async function fetchFilteredPlans(params: PlanSearchParams): Promise<PaginatedPlans> {
  const { data } = await api.get('/plans/search', { params });
  return data;
}

export async function fetchRecommendations(params: UserPreferences): Promise<RecommendationResponse> {
  const { data } = await api.get('/plans/recommendations', { params });
  return data;
}

export async function fetchRecommendationsMetadata(): Promise<SystemMetadata> {
  const { data } = await api.get('/plans/recommendations/metadata');
  return data;
}

export async function postRecommendations(preferences: UserPreferences): Promise<RecommendationResponse> {
  const { data } = await api.post('/plans/recommendations', preferences);
  return data;
}

export async function fetchAllPlans(): Promise<Plan[]> {
  const { data } = await api.get('/plans');
  return data;
}

export async function fetchAvailableCities(): Promise<string[]> {
  try {
    const { data } = await api.get('/plans/recommendations/metadata');
    return data.availableCities || [];
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
}

export async function fetchAvailableOperators(): Promise<string[]> {
  try {
    const { data } = await api.get('/plans/recommendations/metadata');
    return data.availableOperators || [];
  } catch (error) {
    console.error('Erro ao buscar operadoras:', error);
    return [];
  }
}