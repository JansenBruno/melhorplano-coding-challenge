import { Plan } from '../models/plan';
import { IPlanRepository } from '../repositories/interfaces/plan.repository.interface';
import { PaginatedPlans, PlanSearchFilters } from '../types/planSearchFilters.type';


export class PlanService {
  constructor(private repository: IPlanRepository) {}

  getAll(): Plan[] {
    return this.repository.findAll();
  }

  getById(id: number): Plan | undefined {
    return this.repository.findById(id);
  }

  handleThing(plans: Plan[], minSpeed?: number, maxPrice?: number): Plan[] {
    return plans
      .filter(plan => {
        if (minSpeed !== undefined) {
          const speedValue = this.extractSpeedMbps(plan.speed);
          return speedValue >= minSpeed;
        }
        return true;
      })
      .filter(plan => {
        if (maxPrice !== undefined) {
          return plan.price <= maxPrice;
        }
        return true;
      })
      .map(plan => ({ ...plan }));
  }

  search(
    filters: PlanSearchFilters,
    page: number = 1,
    pageSize: number = 5
  ): PaginatedPlans {
    const filtered = this.repository.search(filters);
  
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const plans = filtered.slice(start, end);

    return {
      plans,
      total,
      page,
      pageSize,
      totalPages,
    };
  }


  private extractSpeedMbps(speed: string): number {
    const match = speed.match(/(\d+)\s*Mbps/i);
    return match ? parseInt(match[1], 10) : 0;
  }

 
  findByOperator(operator: string): Plan[] {
    return this.repository.findByOperator(operator);
  }

  findByCity(city: string): Plan[] {
    return this.repository.findByCity(city);
  }

  exists(id: number): boolean {
    return this.repository.exists(id);
  }

  count(): number {
    return this.repository.count();
  }
}