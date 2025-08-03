"use client";

export const AudioPulse = ({ audioLevel, isRecording, variant = "default" }) => {
  if (!isRecording) return null;

  if (variant === "minimal") {
    // Version minimaliste pour les petits espaces
    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-0.5 rounded-full transition-all duration-150"
            style={{
              height: `${8 + audioLevel * 12}px`,
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9))',
              opacity: audioLevel > 0.1 ? 1 : 0.4,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "circular") {
    // Version circulaire élégante
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-12 h-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-white/80 rounded-full transition-all duration-200"
              style={{
                height: `${6 + audioLevel * 16}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                transformOrigin: `0.125rem ${6 + audioLevel * 8}px`,
                opacity: 0.7 + audioLevel * 0.3,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Version par défaut améliorée
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-200"
            style={{
              height: `${8 + audioLevel * 24 + Math.sin(Date.now() * 0.006 + i * 0.8) * 4}px`,
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.95))',
              opacity: audioLevel > 0.1 ? 0.9 : 0.4,
              animationDelay: `${i * 0.08}s`,
              boxShadow: audioLevel > 0.3 ? '0 0 4px rgba(255, 255, 255, 0.5)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};