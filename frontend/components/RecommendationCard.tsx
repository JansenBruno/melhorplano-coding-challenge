import React from 'react';
import styles from '../styles/RecommendationCard.module.scss';

interface Plan {
  id: number;
  name: string;
  speed: string;
  price: number;
  operator: string;
  city: string;
  dataCap: number;
}

interface PlanRecommendation {
  plan: Plan;
  score: number;
  reasons: string[];
  warnings?: string[];
}

interface RecommendationCardProps {
  recommendation: PlanRecommendation;
  isTop?: boolean;
  index?: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  isTop = false,
  index
}) => {
  const { plan, score, reasons, warnings } = recommendation;

  const handleSubscribe = () => {
    alert(`Você está assinando o plano ${plan.name} da ${plan.operator} por R$ ${plan.price.toFixed(2)}/mês`);

  };

  return (
    <div className={`${styles.card} ${isTop ? styles.topCard : ''}`}>
      {isTop && <div className={styles.topBadge}>⭐ Melhor Recomendação</div>}
      
      <div className={styles.cardHeader}>
        <h3 className={styles.planName}>
          {index && <span className={styles.rank}>#{index}</span>}
          {plan.name}
        </h3>
        <div className={styles.scoreBadge}>
          {score.toFixed(0)}/100
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.operatorInfo}>
          <div className={styles.operatorBadge}>{plan.operator}</div>
          <div className={styles.city}>
            <span className={styles.locationIcon}>📍</span>
            {plan.city}
          </div>
        </div>

        <div className={styles.specs}>
          <div className={styles.specItem}>
            <div className={styles.specIcon}>📶</div>
            <div>
              <div className={styles.specLabel}>Velocidade</div>
              <div className={styles.specValue}>{plan.speed}</div>
            </div>
          </div>
          
          <div className={styles.specItem}>
            <div className={styles.specIcon}>💿</div>
            <div>
              <div className={styles.specLabel}>Franquia</div>
              <div className={styles.specValue}>{plan.dataCap}GB</div>
            </div>
          </div>
        </div>

        <div className={styles.priceSection}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreValue}>{score.toFixed(0)}</div>
            <div className={styles.scoreLabel}>score</div>
          </div>
          
          <div className={styles.price}>
            <div className={styles.currency}>R$</div>
            <div className={styles.amount}>{plan.price.toFixed(2)}</div>
            <div className={styles.period}>/mês</div>
          </div>
        </div>

        <button 
          className={styles.subscribeButton}
          onClick={handleSubscribe}
          title={`Assinar plano ${plan.name}`}
        >
          <span className={styles.buttonIcon}>📝</span>
          Assinar este plano
        </button>

        <div className={styles.reasons}>
          <div className={styles.reasonsHeader}>
            <span className={styles.checkIcon}>✓</span>
            <strong>Por que este plano:</strong>
          </div>
          <ul className={styles.reasonsList}>
            {reasons.map((reason, idx) => (
              <li key={idx} className={styles.reasonItem}>{reason}</li>
            ))}
          </ul>
        </div>

        {warnings && warnings.length > 0 && (
          <div className={styles.warnings}>
            <div className={styles.warningsHeader}>
              <span className={styles.warningIcon}>⚠</span>
              <strong>Atenção:</strong>
            </div>
            <ul className={styles.warningsList}>
              {warnings.map((warning, idx) => (
                <li key={idx} className={styles.warningItem}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;