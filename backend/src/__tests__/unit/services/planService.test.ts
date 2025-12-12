import { Plan } from "../../../models/plan";
import { IPlanRepository } from "../../../repositories/interfaces/plan.repository.interface";
import { PlanService } from "../../../services/planService";

describe('PlanService', () => {
  let repository: jest.Mocked<IPlanRepository>;
  let service: PlanService;

 const mockPlans: Plan[] = [
  { id: 1, name: "Plano 1", operator: 'Vivo', city: 'São Paulo', speed: '100Mbps', price: 99.9, dataCap: 200 },
  { id: 2, name: "Plano 2", operator: 'Claro', city: 'Rio', speed: '200Mbps', price: 129.9, dataCap: 300 },
  { id: 3, name: "Plano 3", operator: 'Vivo', city: 'São Paulo', speed: '1Gbps', price: 199.9, dataCap: 500 },
];


  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      exists: jest.fn(),
      count: jest.fn(),
      search: jest.fn(),
      findByOperator: jest.fn(),
      findByCity: jest.fn(),
      findByPriceRange: jest.fn()
    } as jest.Mocked<IPlanRepository>;

    service = new PlanService(repository);
  });

  test('getAll deve retornar todos os planos', () => {
    repository.findAll.mockReturnValue(mockPlans);

    const result = service.getAll();

    expect(result).toEqual(mockPlans);
    expect(repository.findAll).toHaveBeenCalled();
  });

  test('getById deve retornar plano por ID', () => {
    repository.findById.mockReturnValue(mockPlans[0]);
    expect(service.getById(1)).toEqual(mockPlans[0]);
  });

  test('getById deve lançar erro se ID inválido', () => {
    expect(() => service.getById(0)).toThrow('ID do plano inválido');
  });

  test('exists deve delegar para o repositório', () => {
    repository.exists.mockReturnValue(true);
    expect(service.exists(1)).toBe(true);
    expect(repository.exists).toHaveBeenCalledWith(1);
  });

  test('count deve retornar quantidade', () => {
    repository.count.mockReturnValue(10);
    expect(service.count()).toBe(10);
  });


  test('filterBySpeedAndPrice deve filtrar por velocidade mínima', () => {
    const result = service.filterBySpeedAndPrice(mockPlans, 150);
    expect(result.length).toBe(2);
  })

  test('filterBySpeedAndPrice deve filtrar por preço máximo', () => {
    const result = service.filterBySpeedAndPrice(mockPlans, undefined, 120);

    expect(result.length).toBe(1);
    expect(result[0].operator).toBe('Vivo');
  });

  test('filterBySpeedAndPrice deve lançar erro se input não for array', () => {
    // @ts-ignore
    expect(() => service.filterBySpeedAndPrice(null)).toThrow('Plans deve ser um array');
  });


  test('searchWithPagination deve retornar resultados paginados', () => {
    repository.search.mockReturnValue(mockPlans);

    const result = service.searchWithPagination({}, 1, 2);

    expect(result.plans.length).toBe(2);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(2);
  });

  test('searchWithPagination deve validar paginação', () => {
    expect(() => service.searchWithPagination({}, 0, 10))
      .toThrow('Número da página deve ser maior que 0');

    expect(() => service.searchWithPagination({}, 1, 0))
      .toThrow('Tamanho da página deve ser maior que 0');
  });

  test('findByOperator deve chamar repository', () => {
    repository.findByOperator.mockReturnValue([mockPlans[0]]);
    const result = service.findByOperator('Vivo');

    expect(result.length).toBe(1);
    expect(repository.findByOperator).toHaveBeenCalledWith('Vivo');
  });

  test('findByOperator deve exigir operador', () => {
    expect(() => service.findByOperator('')).toThrow('Operadora não informada');
  });

  test('findByCity deve chamar repository', () => {
    repository.findByCity.mockReturnValue([mockPlans[0]]);
    const result = service.findByCity('São Paulo');

    expect(result.length).toBe(1);
    expect(repository.findByCity).toHaveBeenCalledWith('São Paulo');
  });

  test('findByCity deve exigir cidade', () => {
    expect(() => service.findByCity('')).toThrow('Cidade não informada');
  });


  test('findByPriceRange deve validar range', () => {
    expect(() => service.findByPriceRange(-1, 50)).toThrow('Preços não podem ser negativos');
    expect(() => service.findByPriceRange(100, 50)).toThrow('Preço mínimo não pode ser maior que o máximo');
  });

  test('findByPriceRange deve chamar repository', () => {
    repository.findByPriceRange.mockReturnValue([mockPlans[0]]);
    const result = service.findByPriceRange(50, 200);

    expect(result.length).toBe(1);
    expect(repository.findByPriceRange).toHaveBeenCalledWith(50, 200);
  });


  test('extractSpeedInMbps deve converter Gbps para Mbps', () => {
    expect(service.extractSpeedInMbps('1 Gbps')).toBe(1000);
  });

  test('extractSpeedInMbps deve converter Mbps corretamente', () => {
    expect(service.extractSpeedInMbps('200 Mbps')).toBe(200);
  });

  test('extractSpeedInMbps deve retornar 0 se formato inválido', () => {
    expect(service.extractSpeedInMbps('Velocidade Turbo')).toBe(0);
  });

  test('getPlansStatistics deve retornar estatísticas corretas', () => {
    const stats = service.getPlansStatistics(mockPlans);

    expect(stats.count).toBe(3);
    expect(stats.minPrice).toBe(99.9);
    expect(stats.maxPrice).toBe(199.9);
    expect(stats.averagePrice).toBe(143.23);
    expect(stats.operators).toEqual(['Claro', 'Vivo']);
    expect(stats.cities).toEqual(['Rio', 'São Paulo']);
  });

  test('getPlansStatistics deve retornar valores zerados para lista vazia', () => {
    expect(service.getPlansStatistics([])).toEqual({
      count: 0,
      averagePrice: 0,
      minPrice: 0,
      maxPrice: 0,
      operators: [],
      cities: []
    });
  });
});
