// Configurações simplificadas para cada perfil
export const PROFILE_CONFIG = {
  basic: {
    name: "Uso Básico",
    description: "Email, redes sociais, navegação leve",
    minSpeed: 50,    // Mbps
    minData: 100     // GB
  },
  medium: {
    name: "Uso Médio",
    description: "Streaming HD, home office, downloads moderados",
    minSpeed: 100,
    minData: 200
  },
  heavy: {
    name: "Uso Pesado",
    description: "Streaming 4K, downloads grandes, múltiplos dispositivos",
    minSpeed: 300,
    minData: 500
  },
  family: {
    name: "Família",
    description: "Múltiplos usuários, vários dispositivos simultâneos",
    minSpeed: 200,
    minData: 500
  },
  gaming: {
    name: "Gaming",
    description: "Jogos online, baixa latência, atualizações frequentes",
    minSpeed: 300,
    minData: 300
  }
};

// Pesos para cálculo do score (podem ser ajustados)
export const SCORE_WEIGHTS = {
  CITY_MATCH: 30,          // Plano está na cidade solicitada
  BUDGET_MATCH: 25,        // Plano está dentro do orçamento
  SPEED_PROFILE_MATCH: 20, // Velocidade adequada ao perfil
  DATA_PROFILE_MATCH: 15,  // Franquia adequada ao perfil
  OPERATOR_PREFERENCE: 10  // Operadora é preferida
};

// Limites para classificação
export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40
};