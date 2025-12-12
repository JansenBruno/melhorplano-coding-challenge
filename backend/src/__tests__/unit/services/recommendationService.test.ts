import { allPlansMock } from "../../../data";
import { RecommendationService } from "../../../services/recommendationService";
import { UserPreferences } from "../../../types/planSearchFilters.type";


describe('RecommendationService', () => {
  let service: RecommendationService;

  beforeEach(() => {
    service = new RecommendationService();
  });

  it('deve lançar erro se a cidade não for informada', () => {
    expect(() =>
      service.recommend({ city: '' } as UserPreferences)
    ).toThrow('Cidade é obrigatória para recomendações');
  });

  it('deve lançar erro se não houver planos na cidade', () => {
    expect(() =>
      service.recommend({ city: 'CidadeQueNaoExiste' })
    ).toThrow('Nenhum plano encontrado para a cidade: CidadeQueNaoExiste');
  });

  it('deve retornar recomendações ordenadas por score', () => {
    const city = allPlansMock[0].city;

    const recs = service.recommend({
      city,
      usageProfile: 'basic',
      maxBudget: 200
    });

    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].score).toBeGreaterThanOrEqual(recs[1]?.score ?? 0);
  });


  it('deve aumentar score quando o plano está dentro do orçamento', () => {
    const city = allPlansMock[0].city;

    const recs = service.recommend({
      city,
      maxBudget: 9999
    });

    const hasBudgetReason = recs.some(r =>
      r.reasons.some(reason => reason.includes('Dentro do orçamento'))
    );

    expect(hasBudgetReason).toBe(true);
  });

  it('deve registrar warning para planos acima do orçamento', () => {
    const city = allPlansMock[0].city;

    const recs = service.recommend({
      city,
      maxBudget: 10
    });

    const hasBudgetWarning = recs.some(r =>
      r.warnings?.some(w => w.includes('Acima do orçamento'))
    );

    expect(hasBudgetWarning).toBe(true);
  });

  it('deve considerar velocidade mínima do perfil de uso', () => {
    const city = allPlansMock[0].city;

    const recs = service.recommend({
      city,
      usageProfile: 'gaming'
    });

    const hasSpeedReason = recs.some(r =>
      r.reasons.some(reason => reason.includes('Velocidade'))
    );

    expect(hasSpeedReason).toBe(true);
  });

  it('deve registrar warning quando a velocidade é insuficiente', () => {
    const city = allPlansMock[0].city;

    const recs = service.recommend({
      city,
      usageProfile: 'gaming'
    });

    const hasWarning = recs.some(r =>
      r.warnings?.some(w => w.includes('abaixo do mínimo recomendado'))
    );

    expect(hasWarning).toBe(true);
  });

  it('deve considerar operadora preferida', () => {
    const city = allPlansMock[0].city;
    const preferredOperator = allPlansMock[0].operator;

    const recs = service.recommend({
      city,
      preferredOperators: [preferredOperator]
    });

    const hasPreferredReason = recs.some(r =>
      r.reasons.some(reason => reason.includes('está entre suas preferidas'))
    );

    expect(hasPreferredReason).toBe(true);
  });


  it('deve converter velocidade Gbps corretamente no scoring', () => {
    const result = (service as any).extractSpeedMbps('1 Gbps');
    expect(result).toBe(1000);
  });

  it('deve extrair velocidade correta em Mbps', () => {
    const result = (service as any).extractSpeedMbps('350 Mbps');
    expect(result).toBe(350);
  });

  
  it('deve retornar cidades disponíveis ordenadas e sem repetição', () => {
    const cities = service.getAvailableCities();
    const sorted = [...cities].sort();

    expect(cities).toEqual(sorted);
    expect(new Set(cities).size).toBe(cities.length);
  });

  it('deve retornar operadoras disponíveis ordenadas e sem repetição', () => {
    const operators = service.getAvailableOperators();
    const sorted = [...operators].sort();

    expect(operators).toEqual(sorted);
    expect(new Set(operators).size).toBe(operators.length);
  });
});
