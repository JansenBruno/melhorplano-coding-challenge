import { useState, useEffect } from 'react';
import { 
  fetchRecommendations, 
  fetchRecommendationsMetadata, 
  UserPreferences 
} from '../services/api';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import RecommendationCard from '../components/RecommendationCard';
import RecommendationForm from '../components/RecommendationForm';
import styles from '../styles/Recommend.module.scss';

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [operators, setOperators] = useState<string[]>([]);

  useEffect(() => {
    fetchRecommendationsMetadata() 
      .then(data => {
        setCities(data.availableCities || []);
        setOperators(data.availableOperators || []);
      })
      .catch(err => {
        console.error('Erro ao carregar dados:', err);
      });
  }, []);

  const handleSubmit = async (preferences: UserPreferences) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchRecommendations(preferences);
      setRecommendations(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao buscar recomendações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Menu />
      
      <div className={styles.container}>
        <h1 className={styles.title}>🎯 Recomendação de Planos</h1>
        <p className={styles.subtitle}>Encontre o melhor plano para você</p>

        <RecommendationForm
          onSubmit={handleSubmit}
          isLoading={loading}
          availableCities={cities}
          availableOperators={operators}
          error={error}
        />

        {loading && (
          <div className={styles.loading}>Buscando recomendações...</div>
        )}

        {recommendations && (
          <div>
            <div className={styles.resultsHeader}>
              <h2>📊 Resultados</h2>
              <div className={styles.resultsStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Total de planos</div>
                  <div className={styles.statValue}>{recommendations.totalResults}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Cidade</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {recommendations.preferencesUsed.city}
                  </div>
                </div>
              </div>
            </div>

            {recommendations.topRecommendation && (
              <div style={{ marginBottom: '32px' }}>
                <h3 className={styles.sectionTitle}>⭐ Melhor Recomendação</h3>
                <RecommendationCard 
                  recommendation={recommendations.topRecommendation} 
                  isTop={true}
                />
              </div>
            )}

            <div>
              <h3 className={styles.sectionTitle}>
                📋 Todos os Planos ({recommendations.allRecommendations.length})
              </h3>
              {recommendations.allRecommendations
                .slice(1)
                .map((rec: any, index: number) => (
                  <RecommendationCard 
                    key={rec.plan.id} 
                    recommendation={rec}
                    index={index + 1}
                  />
                ))}
            </div>
          </div>
        )}

        {!loading && !recommendations && !error && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🎯</div>
            <h3>Configure suas preferências</h3>
            <p>Selecione uma cidade e clique em "Buscar Recomendações"</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}