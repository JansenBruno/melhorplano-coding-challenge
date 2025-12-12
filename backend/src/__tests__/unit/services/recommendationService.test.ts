// O jest.mock DEVE vir primeiro, antes dos imports
jest.mock("../../../data", () => ({
  allPlansMock: [
    {
      id: 1,
      name: "Plano Básico",
      speed: "100Mbps",
      price: 79.9,
      operator: "Vivo",
      city: "São Paulo",
      dataCap: 200,
    },
    {
      id: 2,
      name: "Plano Intermediário",
      speed: "300Mbps",
      price: 99.9,
      operator: "Claro",
      city: "Rio de Janeiro",
      dataCap: 400,
    },
    {
      id: 3,
      name: "Plano Premium",
      speed: "600Mbps",
      price: 149.9,
      operator: "TIM",
      city: "Belo Horizonte",
      dataCap: 800,
    },
    {
      id: 4,
      name: "Plano Família",
      speed: "500Mbps",
      price: 129.9,
      operator: "Vivo",
      city: "São Paulo",
      dataCap: 600,
    },
    {
      id: 5,
      name: "Plano Ultra",
      speed: "1Gbps",
      price: 199.9,
      operator: "Claro",
      city: "São Paulo",
      dataCap: 1000,
    },
  ],
}));

// Agora importe após o mock
import { RecommendationService } from "../../../services/recommendationService";
import { UserPreferences } from "../../../types/planSearchFilters.type";

describe("RecommendationService", () => {
  let service: RecommendationService;

  beforeEach(() => {
    service = new RecommendationService();
  });

  // Testes simplificados primeiro
  describe("Métodos básicos", () => {
    test("getAvailableCities deve retornar cidades únicas ordenadas", () => {
      const cities = service.getAvailableCities();
      // Note: O Jest ordena as strings automaticamente
      expect(cities).toEqual(["Belo Horizonte", "Rio de Janeiro", "São Paulo"]);
    });

    test("getAvailableOperators deve retornar operadoras únicas ordenadas", () => {
      const operators = service.getAvailableOperators();
      expect(operators).toEqual(["Claro", "TIM", "Vivo"]);
    });
  });

  describe("recommend - validações", () => {
    test("deve lançar erro quando cidade não for informada", () => {
      const preferences = {} as UserPreferences;
      expect(() => service.recommend(preferences)).toThrow(
        "Cidade é obrigatória para recomendações"
      );
    });

    test("deve lançar erro para cidade sem planos", () => {
      const preferences: UserPreferences = {
        city: "Curitiba",
      };
      expect(() => service.recommend(preferences)).toThrow(
        "Nenhum plano encontrado para a cidade: Curitiba"
      );
    });

    test("deve retornar planos da cidade especificada", () => {
      const preferences: UserPreferences = {
        city: "São Paulo",
      };
      const recommendations = service.recommend(preferences);

      expect(recommendations).toHaveLength(3); // IDs 1, 4, 5 estão em SP
      recommendations.forEach((rec) => {
        expect(rec.plan.city).toBe("São Paulo");
      });
    });
  });

  describe("calculatePlanScore - lógica simplificada", () => {
    test("deve calcular score mínimo para plano da cidade", () => {
      const preferences: UserPreferences = {
        city: "São Paulo",
      };
      const recommendations = service.recommend(preferences);

      // Todos devem ter pelo menos 30 pontos (CITY_MATCH)
      recommendations.forEach((rec) => {
        expect(rec.score).toBeGreaterThanOrEqual(30);
        expect(rec.reasons).toContain(`Disponível em ${rec.plan.city}`);
      });
    });

    test("deve adicionar pontos para plano dentro do orçamento", () => {
      const preferences: UserPreferences = {
        city: "São Paulo",
        maxBudget: 100,
      };
      const recommendations = service.recommend(preferences);

      const planoBarato = recommendations.find((r) => r.plan.price <= 100);
      expect(planoBarato).toBeDefined();
      expect(
        planoBarato!.reasons.some((r) => r.includes("Dentro do orçamento"))
      ).toBe(true);
    });

    test("deve adicionar warning para plano acima do orçamento", () => {
      const preferences: UserPreferences = {
        city: "São Paulo",
        maxBudget: 100,
      };
      const recommendations = service.recommend(preferences);

      const planoCaro = recommendations.find((r) => r.plan.price > 100);
      expect(planoCaro).toBeDefined();
      expect(planoCaro!.warnings?.some(w => w.includes('Acima do orçamento'))).toBe(true);
    });
  });

  describe("extractSpeedMbps", () => {
    const getPrivateMethod = (service: RecommendationService) => {
      return (service as any).extractSpeedMbps;
    };

    test("deve converter Mbps corretamente", () => {
      const extractSpeed = getPrivateMethod(service);
      expect(extractSpeed("100Mbps")).toBe(100);
      expect(extractSpeed("250 Mbps")).toBe(250);
    });

    test("deve converter Gbps para Mbps", () => {
      const extractSpeed = getPrivateMethod(service);
      expect(extractSpeed("1Gbps")).toBe(1000);
      expect(extractSpeed("2.5 Gbps")).toBe(2500);
    });
  });
});
