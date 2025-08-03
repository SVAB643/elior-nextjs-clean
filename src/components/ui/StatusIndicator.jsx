"use client";

export const StatusIndicator = ({ text, type = "default" }) => {
  const getStyles = () => {
    switch (type) {
      case 'recording':
        return {
          dot: 'animate-pulse',
          dotBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
          text: 'text-red-600'
        };
      case 'processing':
        return {
          dot: 'animate-bounce',
          dotBg: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
          text: 'text-gray-700'
        };
      default:
        return {
          dot: '',
          dotBg: '#e5e7eb',
          text: 'text-gray-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div 
        className={`w-2 h-2 rounded-full ${styles.dot} shadow-sm`}
        style={{ background: styles.dotBg }}
      />
      <span className={`font-light ${styles.text}`}>{text}</span>
    </div>
  );
};