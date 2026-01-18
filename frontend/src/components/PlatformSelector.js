import React from 'react';

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', color: 'from-blue-600 to-blue-700', icon: '💼' },
  { id: 'twitter', name: 'Twitter/X', color: 'from-sky-500 to-sky-600', icon: '🐦' },
  { id: 'instagram', name: 'Instagram', color: 'from-pink-600 to-purple-600', icon: '📸' },
  { id: 'tiktok', name: 'TikTok', color: 'from-gray-900 to-pink-600', icon: '🎵' },
  { id: 'reddit', name: 'Reddit', color: 'from-orange-600 to-red-600', icon: '🤖' },
];

function PlatformSelector({ selectedPlatform, onSelect, showAll = true }) {
  return (
    <div className="flex flex-wrap gap-3">
      {showAll && (
        <button
          onClick={() => onSelect('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedPlatform === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-dark-card text-gray-300 hover:bg-dark-hover border border-dark-border'
          }`}
        >
          🌐 All Platforms
        </button>
      )}
      {platforms.map(platform => (
        <button
          key={platform.id}
          onClick={() => onSelect(platform.id)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedPlatform === platform.id
              ? `bg-gradient-to-r ${platform.color} text-white shadow-lg transform scale-105`
              : 'bg-dark-card text-gray-300 hover:bg-dark-hover border border-dark-border'
          }`}
        >
          <span className="mr-2">{platform.icon}</span>
          {platform.name}
        </button>
      ))}
    </div>
  );
}

export default PlatformSelector;
export { platforms };