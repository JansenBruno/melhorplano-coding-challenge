import { Request, Response } from 'express';
import { MemoryPlanRepository } from '../repositories/memoryPlan.repository';
import { PlanService } from '../services/planService';


const repository = new MemoryPlanRepository(); 
const service = new PlanService(repository);

export class PlanController {
  static getAllPlans(req: Request, res: Response) {
    try {
      const plans = service.getAll()
        .map(plan => ({
          ...plan,
          name: plan.name.toUpperCase() 
        }));
        

      res.json(plans);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch plans',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static getFilteredPlans(req: Request, res: Response) {
    try {
      const minSpeed = req.query.minSpeed
        ? parseInt(req.query.minSpeed as string)
        : undefined;

      const maxPrice = req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined;

      const plans = service.getAll();
      const filtered = service.handleThing(plans, minSpeed, maxPrice);

      res.json(filtered);
    } catch (error) {
      res.status(400).json({
        error: 'Invalid filter parameters',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static searchPlans(req: Request, res: Response) {
    try {
      const {
        minPrice,
        maxPrice,
        minDataCap,
        maxDataCap,
        operator,
        city,
        name,
        page = "1",
        pageSize = "5",
      } = req.query;

      const data = service.search(
        {
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minDataCap: minDataCap ? Number(minDataCap) : undefined,
          maxDataCap: maxDataCap ? Number(maxDataCap) : undefined,
          operator: operator ? String(operator) : undefined,
          city: city ? String(city) : undefined,
          name: name ? String(name) : undefined,
        },
        Number(page),
        Number(pageSize)
      );

      res.json(data);
    } catch (error) {
      res.status(400).json({
        error: 'Invalid search parameters',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  static getPlanById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid plan ID' });
      }

      const plan = service.getById(id);
      
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      res.json(plan);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}