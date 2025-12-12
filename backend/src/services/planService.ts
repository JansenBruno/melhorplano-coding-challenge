import { Plan } from '../models/plan';
import { IPlanRepository } from '../repositories/interfaces/plan.repository.interface';
import { PaginatedPlans, PlanSearchFilters } from '../types/planSearchFilters.type';


export class PlanService {
  constructor(private repository: IPlanRepository) {}

  getAll(): Plan[] {
    return this.repository.findAll();
  }


  getById(id: number): Plan | undefined { //não utilizado
    if (!id || id <= 0) {
      throw new Error('ID do plano inválido');
    }
    return this.repository.findById(id);
  }


  exists(id: number): boolean {
    return this.repository.exists(id);
  }
  
  count(): number {
    return this.repository.count();
  }
  
 
  filterBySpeedAndPrice(
    plans: Plan[],
    minSpeedMbps?: number,
    maxPrice?: number
  ): Plan[] {
    this.validatePlansInput(plans);
    
    const filteredPlans = this.applySpeedAndPriceFilters(plans, minSpeedMbps, maxPrice);
    return this.createSafeCopies(filteredPlans);
  }

 
  searchWithPagination(
    filters: PlanSearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): PaginatedPlans {
    this.validatePaginationParams(page, pageSize);
    
    const filteredPlans = this.repository.search(filters);
    return this.paginateResults(filteredPlans, page, pageSize);
  }

  findByOperator(operator: string): Plan[] {
    if (!operator?.trim()) {
      throw new Error('Operadora não informada');
    }
    return this.repository.findByOperator(operator.trim());
  }

  findByCity(city: string): Plan[] {
    if (!city?.trim()) {
      throw new Error('Cidade não informada');
    }
    return this.repository.findByCity(city.trim());
  }

  findByPriceRange(minPrice: number, maxPrice: number): Plan[] {
    this.validatePriceRange(minPrice, maxPrice);
    return this.repository.findByPriceRange(minPrice, maxPrice);
  }

  extractSpeedInMbps(speedString: string): number {
    const normalized = speedString.trim().toLowerCase();
    
    const match = normalized.match(/(\d+(?:\.\d+)?)\s*(gbps|mbps)/i);
    
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    return unit === 'gbps' ? value * 1000 : value;
  }

  getPlansStatistics(plans: Plan[]): {
    count: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    operators: string[];
    cities: string[];
  } {
    if (!plans.length) {
      return {
        count: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        operators: [],
        cities: []
      };
    }

    const prices = plans.map(p => p.price);
    const operators = [...new Set(plans.map(p => p.operator))];
    const cities = [...new Set(plans.map(p => p.city))];

    return {
      count: plans.length,
      averagePrice: parseFloat((prices.reduce((a, b) => a + b, 0) / plans.length).toFixed(2)),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      operators: operators.sort(),
      cities: cities.sort()
    };
  }

  
  private applySpeedAndPriceFilters(
    plans: Plan[],
    minSpeedMbps?: number,
    maxPrice?: number
  ): Plan[] {
    return plans.filter(plan => {
      const meetsSpeed = minSpeedMbps === undefined || 
        this.extractSpeedInMbps(plan.speed) >= minSpeedMbps;
      
      const meetsPrice = maxPrice === undefined || 
        plan.price <= maxPrice;
      
      return meetsSpeed && meetsPrice;
    });
  }

  private paginateResults(
    items: Plan[],
    page: number,
    pageSize: number
  ): PaginatedPlans {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      plans: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  private createSafeCopies(plans: Plan[]): Plan[] {
    return plans.map(plan => ({ ...plan }));
  }

  private validatePlansInput(plans: Plan[]): void {
    if (!Array.isArray(plans)) {
      throw new Error('Plans deve ser um array');
    }
  }

  private validatePaginationParams(page: number, pageSize: number): void {
    if (page < 1) {
      throw new Error('Número da página deve ser maior que 0');
    }
    if (pageSize < 1) {
      throw new Error('Tamanho da página deve ser maior que 0');
    }
  }

  private validatePriceRange(minPrice: number, maxPrice: number): void {
    if (minPrice < 0 || maxPrice < 0) {
      throw new Error('Preços não podem ser negativos');
    }
    if (minPrice > maxPrice) {
      throw new Error('Preço mínimo não pode ser maior que o máximo');
    }
  }
}