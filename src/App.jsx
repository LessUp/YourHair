import React, { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { toPng } from 'html-to-image';
import { hairstyles } from './lib/hairstyles';
import { EditorCanvas } from './components/EditorCanvas';
import { HairstyleSelector } from './components/HairstyleSelector';
import { Controls } from './components/Controls';

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
  });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setUserImage(evt.target?.result || null);
      setTransform({ x: 0, y: 0, scale: 1, rotate: 0, flip: false });
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
      link.download = 'yourhair-preview.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image', error);
    }
  };

  const resetTransform = () => {
    setTransform({ x: 0, y: 0, scale: 1, rotate: 0, flip: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50 flex flex-col">
      <header className="border-b border-zinc-800/80 backdrop-blur-sm bg-zinc-950/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-sm font-bold shadow-lg shadow-pink-500/30">
              YH
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight">
                YourHair 虚拟发型助手
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                上传真实照片，和发型师一起快速确认发型方案
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>本地运行 · 照片不上传服务器</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-[1.7fr,1.1fr] gap-6 lg:gap-8">
        <section className="space-y-4 lg:space-y-5">
          <EditorCanvas
            userImage={userImage}
            selectedHairstyle={selectedHairstyle}
            transform={transform}
            onTransformChange={setTransform}
            onUpload={triggerUpload}
            canvasRef={canvasRef}
          />

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg shadow-black/40">
            <div className="flex items-center gap-3">
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
                导出预览图
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              建议上传正脸高清 JPG / PNG。发型图当前为示例资源，你可以在
              <span className="mx-1 font-mono">public/hairstyles</span>
              目录替换为自己的真实作品。
            </p>
          </div>
        </section>

        <aside className="space-y-4 lg:space-y-6">
          <HairstyleSelector
            hairstyles={hairstyles}
            selectedHairstyle={selectedHairstyle}
            onSelect={(style) => setSelectedHairstyle(style)}
          />

          {userImage && selectedHairstyle && (
            <Controls
              transform={transform}
              onUpdate={setTransform}
              onReset={resetTransform}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
