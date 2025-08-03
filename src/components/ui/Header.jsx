import { ArrowLeft, Mic, Image, BookOpen } from "lucide-react";

export const Header = ({ currentView, onViewChange }) => {
  return (
    <div className="bg-white border-b border-gray-100 py-4 px-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo avec style uniforme */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
              }}
            >
              <BookOpen size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-900">Elior</h1>
          </div>
          
          {currentView !== 'recorder' && (
            <button
              onClick={() => onViewChange('recorder')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm font-light shadow-sm"
            >
              <ArrowLeft size={16} />
              Retour à l'enregistrement
            </button>
          )}
        </div>
        
        {/* Navigation avec style uniforme */}
        <div className="flex items-center gap-3">
          {[
            { key: 'recorder', label: 'Enregistreur', icon: Mic },
            { key: 'cover_editor', label: 'Couverture', icon: Image },
            { key: 'book_editor', label: 'Livre', icon: BookOpen }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-light text-sm ${
                currentView === key
                  ? 'text-white shadow-lg transform scale-105'
                  : 'text-gray-600 bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
              }`}
              style={{
                background: currentView === key 
                  ? 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                  : undefined
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};