import { Plan } from "../../models/plan";
import { PlanSearchFilters } from "../../types/planSearchFilters.type";


export interface IPlanRepository {
  findAll(): Plan[];
  findById(id: number): Plan | undefined;
  
  search(filters: PlanSearchFilters): Plan[];
  
  findByOperator(operator: string): Plan[];
  findByCity(city: string): Plan[];
  findByPriceRange(min: number, max: number): Plan[];
  
  exists(id: number): boolean;
  count(): number;
}