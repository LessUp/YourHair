import React, { useState, useRef, useCallback } from 'react';
import { Download, Upload, Wand2, Layers, Sparkles, Brain } from 'lucide-react';
import { toPng } from 'html-to-image';
import { hairstyles } from './lib/hairstyles';
import { realHairstyles, getHairstylesWithFallback } from './lib/realHairstyles';
import { AIFusionCanvas } from './components/AIFusionCanvas';
import { AdvancedCanvas } from './components/AdvancedCanvas';
import { AdvancedHairstyleSelector } from './components/AdvancedHairstyleSelector';
import { HairstyleSelector } from './components/HairstyleSelector';
import { AIControls } from './components/AIControls';
import { Controls } from './components/Controls';
import { TipsPanel } from './components/TipsPanel';

function App() {
  const [userImage, setUserImage] = useState(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState(
    hairstyles.length > 0 ? hairstyles[0] : null
  );
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    flip: false,
    opacity: 0.85,
    blendMode: 'normal',
    colorAdjust: { hue: 0, saturation: 0, brightness: 0 },
    featherRadius: 10,
    autoAlign: true,
  });

  const [aiEnabled, setAiEnabled] = useState(true);
  const [faceData, setFaceData] = useState(null);
  const [useRealHairstyles, setUseRealHairstyles] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // 当前使用的发型库（真实发型库使用备用图片）
  const currentHairstyles = useRealHairstyles ? getHairstylesWithFallback() : hairstyles;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setUserImage(evt.target?.result || null);
      setFaceData(null);
      setTransform({
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        flip: false,
        opacity: 0.85,
        blendMode: 'normal',
        colorAdjust: { hue: 0, saturation: 0, brightness: 0 },
        featherRadius: 10,
        autoAlign: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'yourhair-ai-preview.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image', error);
    }
  };

  const resetTransform = () => {
    setTransform({
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      flip: false,
      opacity: 0.85,
      blendMode: 'normal',
      colorAdjust: { hue: 0, saturation: 0, brightness: 0 },
      featherRadius: 10,
      autoAlign: true,
    });
  };

  const handleFaceDetected = useCallback((data) => {
    setFaceData(data);
  }, []);

  const toggleAI = useCallback(() => {
    setAiEnabled((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/80 backdrop-blur-sm bg-zinc-950/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/30">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight flex items-center gap-2">
                YourHair AI
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
                  智能版
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                AI 人脸检测 + 深度学习分割 + 智能发型融合
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* AI 状态指示 */}
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${aiEnabled ? 'bg-purple-500 animate-pulse' : 'bg-zinc-600'
                  }`}
              />
              <span className={aiEnabled ? 'text-purple-400' : 'text-zinc-500'}>
                {aiEnabled ? 'AI 智能融合已启用' : 'AI 已关闭'}
              </span>
            </div>

            <div className="h-4 w-px bg-zinc-700" />

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>本地运行 · 隐私安全</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-[1.7fr,1.1fr] gap-6 lg:gap-8">
        {/* Left Panel - Canvas */}
        <section className="space-y-4 lg:space-y-5">
          {aiEnabled ? (
            <AIFusionCanvas
              userImage={userImage}
              selectedHairstyle={selectedHairstyle}
              transform={transform}
              onTransformChange={setTransform}
              onUpload={triggerUpload}
              canvasRef={canvasRef}
              onFaceDetected={handleFaceDetected}
              aiEnabled={aiEnabled}
            />
          ) : (
            <AdvancedCanvas
              userImage={userImage}
              selectedHairstyle={selectedHairstyle}
              transform={transform}
              onTransformChange={setTransform}
              onUpload={triggerUpload}
              canvasRef={canvasRef}
              useAdvancedMode={true}
            />
          )}

          {/* Control Bar */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg shadow-black/40">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={triggerUpload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-white transition-colors"
              >
                <Upload size={16} />
                {userImage ? '更换照片' : '上传照片'}
              </button>

              <button
                onClick={handleDownload}
                disabled={!userImage || !selectedHairstyle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/40 disabled:border-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed bg-emerald-500/90 hover:bg-emerald-400 text-zinc-950"
              >
                <Download size={16} />
                导出
              </button>

              <button
                onClick={toggleAI}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${aiEnabled
                  ? 'border-purple-500/40 bg-purple-500/90 hover:bg-purple-400 text-white'
                  : 'border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
              >
                {aiEnabled ? <Sparkles size={16} /> : <Layers size={16} />}
                {aiEnabled ? 'AI 模式' : '普通模式'}
              </button>

              {/* 发型库切换 */}
              <button
                onClick={() => setUseRealHairstyles(!useRealHairstyles)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${useRealHairstyles
                  ? 'border-pink-500/40 bg-pink-500/20 text-pink-300'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400'
                  }`}
              >
                {useRealHairstyles ? '真实发型库' : '示例发型库'}
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed">
              {aiEnabled
                ? 'AI 自动检测人脸并智能融合发型'
                : '手动调整发型位置和融合效果'}
            </p>
          </div>
        </section>

        {/* Right Panel - Selector & Controls */}
        <aside className="space-y-4 lg:space-y-6">
          {/* Hairstyle Selector */}
          {useRealHairstyles ? (
            <AdvancedHairstyleSelector
              hairstyles={currentHairstyles}
              selectedHairstyle={selectedHairstyle}
              onSelect={(style) => setSelectedHairstyle(style)}
              showFilters={true}
            />
          ) : (
            <HairstyleSelector
              hairstyles={currentHairstyles}
              selectedHairstyle={selectedHairstyle}
              onSelect={(style) => setSelectedHairstyle(style)}
            />
          )}

          {/* Controls */}
          {userImage && selectedHairstyle ? (
            aiEnabled ? (
              <AIControls
                transform={transform}
                onUpdate={setTransform}
                onReset={resetTransform}
                faceData={faceData}
                aiEnabled={aiEnabled}
                onAIToggle={toggleAI}
              />
            ) : (
              <Controls
                transform={transform}
                onUpdate={setTransform}
                onReset={resetTransform}
              />
            )
          ) : (
            <TipsPanel />
          )}
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>YourHair AI v2.0</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">
              技术栈: TensorFlow.js + face-api.js + MediaPipe
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={12} className="text-purple-400" />
            <span>AI 驱动的智能发型融合</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
