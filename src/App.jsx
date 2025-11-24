import React, { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Move, Maximize, RotateCw, X, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { hairstyles } from './lib/hairstyles';

function App() {
  const [userImage, setUserImage] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(hairstyles[0]);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const workAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target.result);
        // Reset transforms when new image loads
        setTransform({ x: 0, y: 0, scale: 1, rotate: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (workAreaRef.current) {
      try {
        const dataUrl = await toPng(workAreaRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = 'new-hairstyle.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image', err);
      }
    }
  };

  const updateTransform = (key, value) => {
    setTransform(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const resetTransform = () => {
    setTransform({ x: 0, y: 0, scale: 1, rotate: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ AI 虚拟发型屋 ✨</h1>
        <p className="text-gray-600">上传照片，一键试戴，找到最适合你的发型</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area (2 columns) */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-lg w-full flex flex-col items-center">
            {/* Canvas Container */}
            <div 
              ref={workAreaRef}
              className="relative w-full max-w-[500px] aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              {!userImage ? (
                <div className="text-center text-gray-400 flex flex-col items-center">
                  <ImageIcon size={64} className="mb-4 opacity-50" />
                  <p>请上传一张清晰的正脸照片</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    选择照片
                  </button>
                </div>
              ) : (
                <>
                  {/* User Photo Layer */}
                  <img 
                    src={userImage} 
                    alt="User" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                  />
                  
                  {/* Hairstyle Overlay Layer */}
                  {selectedHairstyle && (
                    <div 
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    >
                      <img 
                        src={selectedHairstyle.src} 
                        alt="Hairstyle"
                        style={{
                          transform: `
                            translate(${transform.x}px, ${transform.y}px) 
                            rotate(${transform.rotate}deg) 
                            scale(${transform.scale})
                          `,
                          width: '80%', // Initial relative size
                          height: 'auto',
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                        }}
                        className="transition-transform duration-75 cursor-move origin-center"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex gap-4">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                <Upload size={18} />
                {userImage ? '更换照片' : '上传照片'}
              </button>
              
              {userImage && (
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download size={18} />
                  保存结果
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Area (1 column) */}
        <div className="flex flex-col gap-6">
          {/* Hairstyle Selector */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              选择发型
            </h3>
            <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {hairstyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedHairstyle(style)}
                  className={`
                    p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                    ${selectedHairstyle.id === style.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-100 hover:border-purple-200'}
                  `}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={style.src} alt={style.name} className="w-10 h-10 object-contain" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Adjustment Controls */}
          {userImage && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  调整位置
                </h3>
                <button 
                  onClick={resetTransform}
                  className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <RotateCcw size={12} /> 重置
                </button>
              </div>

              <div className="space-y-6">
                {/* Size */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Maximize size={14} /> 大小</span>
                    <span>{Math.round(transform.scale * 100)}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.05" 
                    value={transform.scale}
                    onChange={(e) => updateTransform('scale', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2"><RotateCw size={14} /> 旋转</span>
                    <span>{transform.rotate}°</span>
                  </label>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    value={transform.rotate}
                    onChange={(e) => updateTransform('rotate', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Position X */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Move size={14} /> 水平位置</span>
                    <span>{transform.x}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="-200" 
                    max="200" 
                    value={transform.x}
                    onChange={(e) => updateTransform('x', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Position Y */}
                <div className="space-y-2">
                  <label className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Move size={14} className="rotate-90" /> 垂直位置</span>
                    <span>{transform.y}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="-200" 
                    max="200" 
                    value={transform.y}
                    onChange={(e) => updateTransform('y', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
