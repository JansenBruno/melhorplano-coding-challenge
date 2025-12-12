import { PlanService } from '../../../services/planService';
import { IPlanRepository } from '../../../repositories/interfaces/plan.repository.interface';

describe('PlanService', () => {
  // Em vez de usar jest.Mocked, criamos um mock manualmente
  let mockRepository: any;
  let service: PlanService;

  beforeEach(() => {
    // Mock manual do repositório
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      search: jest.fn(),
      findByOperator: jest.fn(),
      findByCity: jest.fn(),
      findByPriceRange: jest.fn(),
      exists: jest.fn(),
      count: jest.fn()
    };

    service = new PlanService(mockRepository);
  });

  describe('handleThing', () => {
    const mockPlans = [
      { 
        id: 1, 
        name: 'Plano 100', 
        speed: '100Mbps', 
        price: 100, 
        operator: 'Vivo', 
        city: 'SP', 
        dataCap: 200 
      },
      { 
        id: 2, 
        name: 'Plano 200', 
        speed: '200Mbps', 
        price: 150, 
        operator: 'Claro', 
        city: 'SP', 
        dataCap: 300 
      },
      { 
        id: 3, 
        name: 'Plano 300', 
        speed: '300Mbps', 
        price: 200, 
        operator: 'TIM', 
        city: 'RJ', 
        dataCap: 400 
      }
    ];

    it('deve filtrar por velocidade mínima', () => {
      const result = service.handleThing(mockPlans, 200);
      expect(result).toHaveLength(2);
      expect(result.map((p: any) => p.speed)).toEqual(['200Mbps', '300Mbps']);
    });

    it('deve filtrar por preço máximo', () => {
      const result = service.handleThing(mockPlans, undefined, 150);
      expect(result).toHaveLength(2);
      expect(result.map((p: any) => p.price)).toEqual([100, 150]);
    });

    it('deve filtrar por velocidade e preço simultaneamente', () => {
      const result = service.handleThing(mockPlans, 200, 200);
      expect(result).toHaveLength(2);
      expect(result.map((p: any) => p.speed)).toEqual(['200Mbps', '300Mbps']);
    });

    it('deve retornar cópias dos objetos', () => {
      const result = service.handleThing(mockPlans);
      expect(result[0]).not.toBe(mockPlans[0]); // Não é a mesma referência
      expect(result[0]).toEqual(mockPlans[0]); // Mas tem os mesmos valores
    });
  });

  describe('getById', () => {
    it('deve retornar plano por ID', () => {
      const mockPlan = { 
        id: 1, 
        name: 'Plano Teste', 
        speed: '100Mbps', 
        price: 100, 
        operator: 'Vivo', 
        city: 'SP', 
        dataCap: 200 
      };
      
      mockRepository.findById.mockReturnValue(mockPlan);
      
      const result = service.getById(1);
      expect(result).toEqual(mockPlan);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar undefined para ID não existente', () => {
      mockRepository.findById.mockReturnValue(undefined);
      
      const result = service.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('search', () => {
    it('deve pesquisar planos com filtros', () => {
      const mockFilteredPlans = [
        { 
          id: 1, 
          name: 'Plano Teste', 
          speed: '100Mbps', 
          price: 100, 
          operator: 'Vivo', 
          city: 'SP', 
          dataCap: 200 
        }
      ];
      
      mockRepository.search.mockReturnValue(mockFilteredPlans);
      
      const filters = { city: 'SP', maxPrice: 150 };
      const result = service.search(filters, 1, 10);
      
      expect(result.plans).toEqual(mockFilteredPlans);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(mockRepository.search).toHaveBeenCalledWith(filters);
    });
  });
});