import { IPlanRepository } from './interfaces/plan.repository.interface';
import { Plan } from '../models/plan';
import { PlanSearchFilters } from '../types/planSearchFilters.type'; 
import { allPlansMock } from '../data';

export class MemoryPlanRepository implements IPlanRepository {
  private plans: Plan[];

  constructor(initialData: Plan[] = allPlansMock) {
    this.plans = [...initialData];
  }

  findAll(): Plan[] {
    return [...this.plans]; 
  }

  findById(id: number): Plan | undefined {
    return this.plans.find((plan) => plan.id === id);
  }

  search(filters: PlanSearchFilters): Plan[] {
    const filtered = this.plans.filter((plan) => {
      
      if (filters.minPrice !== undefined && plan.price < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== undefined && plan.price > filters.maxPrice) {
        return false;
      }

      if (filters.minDataCap !== undefined && plan.dataCap < filters.minDataCap) {
        return false;
      }

      if (filters.maxDataCap !== undefined && plan.dataCap > filters.maxDataCap) {
        return false;
      }

      if (filters.operator?.trim()) {
        const operatorFilter = filters.operator.toLowerCase().trim();
        if (!plan.operator.toLowerCase().includes(operatorFilter)) {
          return false;
        }
      }

      if (filters.city?.trim()) {
        const cityFilter = filters.city.toLowerCase().trim();
        if (!plan.city.toLowerCase().includes(cityFilter)) {
          return false;
        }
      }

      if (filters.name?.trim()) {
        const nameFilter = filters.name.toLowerCase().trim();
        if (!plan.name.toLowerCase().includes(nameFilter)) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (a.price !== b.price) {
        return a.price - b.price;
      }

      return a.id - b.id;
    });
  }

  findByOperator(operator: string): Plan[] {
    return this.plans.filter(
      (plan) => plan.operator.toLowerCase() === operator.toLowerCase()
    );
  }

  findByCity(city: string): Plan[] {
    return this.plans.filter(
      (plan) => plan.city.toLowerCase() === city.toLowerCase()
    );
  }

  findByPriceRange(min: number, max: number): Plan[] {
    return this.plans.filter((plan) => plan.price >= min && plan.price <= max);
  }

  exists(id: number): boolean {
    return this.plans.some((plan) => plan.id === id);
  }

  count(): number {
    return this.plans.length;
  }
}