export * from '../services/api';

export interface UIRecommendation {
  plan: {
    id: number;
    name: string;
    speed: string;
    price: number;
    operator: string;
    city: string;
    dataCap: number;
  };
  score: number;
  reasons: string[];
  warnings?: string[];
  formattedPrice: string;
  speedValue: number;
  speedUnit: string;
  scoreColor: string;
  ratingText: string;
}

export interface FormState {
  city: string;
  maxBudget: string;
  usageProfile: string;
  operators: string[];
  isLoading: boolean;
  error: string | null;
}

export interface RecommendationStats {
  averageScore: number;
  averagePrice: number;
  mostCommonOperator: string;
  plansWithinBudget: number;
  totalPlans: number;
}

export interface ProfileInfo {
  id: 'basic' | 'medium' | 'heavy' | 'family' | 'gaming';
  name: string;
  description: string;
  icon: string;
  minSpeed: number;
  minData: number;
}


export const PROFILES: ProfileInfo[] = [
  {
    id: 'basic',
    name: 'Uso Básico',
    description: 'Email, redes sociais, navegação leve',
    icon: '📱',
    minSpeed: 50,
    minData: 100
  },
  {
    id: 'medium',
    name: 'Uso Médio',
    description: 'Streaming HD, home office, downloads moderados',
    icon: '💻',
    minSpeed: 100,
    minData: 200
  },
  {
    id: 'heavy',
    name: 'Uso Pesado',
    description: 'Streaming 4K, downloads grandes, múltiplos dispositivos',
    icon: '🚀',
    minSpeed: 300,
    minData: 500
  },
  {
    id: 'family',
    name: 'Família',
    description: 'Múltiplos usuários, vários dispositivos simultâneos',
    icon: '👨‍👩‍👧‍👦',
    minSpeed: 200,
    minData: 500
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Jogos online, baixa latência, atualizações frequentes',
    icon: '🎮',
    minSpeed: 300,
    minData: 300
  }
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const extractSpeedValue = (speed: string): { value: number; unit: string } => {
  const match = speed.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps|mbps|gbps)/i);
  if (!match) return { value: 0, unit: 'Mbps' };
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit === 'gbps') {
    return { value: value * 1000, unit: 'Mbps' };
  }
  
  return { value, unit: 'Mbps' };
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'; 
  if (score >= 60) return '#3b82f6'; 
  if (score >= 40) return '#f59e0b';
  if (score >= 20) return '#ef4444'; 
  return '#6b7280'; 
};

export const getRatingText = (score: number): string => {
  if (score >= 80) return 'EXCELENTE';
  if (score >= 60) return 'BOM';
  if (score >= 40) return 'ADECUADO';
  if (score >= 20) return 'REGULAR';
  return 'RUIM';
};