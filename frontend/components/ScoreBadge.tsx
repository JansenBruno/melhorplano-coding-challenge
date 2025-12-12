import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
  animate?: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ 
  score, 
  size = 'medium',
  showRating = true,
  animate = false
}) => {
  
  const getColor = (score: number): string => {
    if (score >= 80) return '#10b981'; 
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b'; 
    if (score >= 20) return '#ef4444'; 
    return '#6b7280'; 
  };

  const getRatingText = (score: number): string => {
    if (score >= 80) return 'EXCELENTE';
    if (score >= 60) return 'BOM';
    if (score >= 40) return 'ADECUADO';
    if (score >= 20) return 'REGULAR';
    return 'RUIM';
  };

  const sizeStyles = {
    small: {
      width: 80,
      height: 80,
      fontSize: 24,
      textSize: 10,
      strokeWidth: 6,
    },
    medium: {
      width: 100,
      height: 100,
      fontSize: 32,
      textSize: 12,
      strokeWidth: 8,
    },
    large: {
      width: 120,
      height: 120,
      fontSize: 40,
      textSize: 14,
      strokeWidth: 10,
    },
  };

  const style = sizeStyles[size];
  const color = getColor(score);
  const ratingText = getRatingText(score);
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {}
      <svg 
        width={style.width} 
        height={style.height} 
        viewBox="0 0 100 100"
        style={{
          animation: animate ? 'rotate 2s linear infinite' : 'none',
          transformOrigin: 'center center',
        }}
      >
        {/* Anel cinza de fundo */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={style.strokeWidth}
        />
        {/* Anel colorido baseado no score */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth={style.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          style={{
            transition: animate ? 'stroke-dashoffset 1s ease-out' : 'none',
          }}
        />
      </svg>
      
      {/* Texto no centro */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: style.fontSize,
          fontWeight: 'bold',
          color: color,
          lineHeight: 1,
          fontFamily: 'Arial, sans-serif',
        }}>
          {score}
        </div>
        {showRating && (
          <div style={{
            fontSize: style.textSize,
            color: '#6b7280',
            fontWeight: 600,
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {ratingText}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScoreBadge;