import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../services/api';
import styles from '../styles/RecommendationForm.module.scss';

interface RecommendationFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
  availableCities: string[];
  availableOperators: string[];
  error?: string;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({ 
  onSubmit, 
  isLoading,
  availableCities,
  availableOperators,
  error
}) => {
  const [city, setCity] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [usageProfile, setUsageProfile] = useState('');
  const [preferredOperators, setPreferredOperators] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city) {
      alert('Por favor, selecione uma cidade');
      return;
    }

    const preferences: UserPreferences = {
      city,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      usageProfile: usageProfile as any,
      preferredOperators: preferredOperators.length > 0 ? preferredOperators : undefined,
    };

    onSubmit(preferences);
  };

  const toggleOperator = (operator: string) => {
    setPreferredOperators(prev =>
      prev.includes(operator)
        ? prev.filter(op => op !== operator)
        : [...prev, operator]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <span className={styles.formLabelIcon}>🌆</span>
            Cidade *
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={isLoading}
            className={styles.formSelect}
          >
            <option value="">Selecione sua cidade</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <span className={styles.formLabelIcon}>💰</span>
            Orçamento máximo (opcional)
          </label>
          <input
            type="number"
            placeholder="Ex: 150"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            disabled={isLoading}
            className={styles.formInput}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <span className={styles.formLabelIcon}>👤</span>
            Perfil de uso (opcional)
          </label>
          <select
            value={usageProfile}
            onChange={(e) => setUsageProfile(e.target.value)}
            disabled={isLoading}
            className={styles.formSelect}
          >
            <option value="">Selecione um perfil</option>
            <option value="basic">Básico</option>
            <option value="medium">Médio</option>
            <option value="heavy">Pesado</option>
            <option value="family">Família</option>
            <option value="gaming">Gaming</option>
          </select>
        </div>

    
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <span className={styles.formLabelIcon}>🏢</span>
            Operadoras preferidas (opcional)
          </label>
          <div className={styles.operatorsContainer}>
            {availableOperators.map(op => (
              <button
                key={op}
                type="button"
                onClick={() => toggleOperator(op)}
                disabled={isLoading}
                className={`${styles.operatorButton} ${
                  preferredOperators.includes(op) ? styles.operatorButtonActive : ''
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !city}
        className={styles.submitButton}
      >
        {isLoading ? 'Buscando...' : ' Buscar Recomendações'}
      </button>

      {error && (
        <div className="errorMessage">
           {error}
        </div>
      )}
    </form>
  );
};

export default RecommendationForm;