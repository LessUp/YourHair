import React from 'react';

export function HairstyleSelector({ hairstyles, selectedHairstyle, onSelect }) {
  // Group by category
  const categories = [...new Set(hairstyles.map(h => h.category || 'other'))];

  return (
    <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-zinc-100 flex items-center gap-2">
        <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
        发型库
      </h3>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 ml-1">
              {category === 'short' ? '短发系列' : 
               category === 'long' ? '长发飘飘' : 
               category === 'curly' ? '个性卷发' : '其他'}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {hairstyles
                .filter(h => (h.category || 'other') === category)
                .map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onSelect(style)}
                    className={`
                      group relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${selectedHairstyle?.id === style.id 
                        ? 'border-pink-500 bg-zinc-800' 
                        : 'border-transparent bg-zinc-800 hover:border-zinc-600'}
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <img 
                        src={style.src} 
                        alt={style.name} 
                        className="w-full h-full object-contain drop-shadow-lg transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {style.name}
                    </div>
                  </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
