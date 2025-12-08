import React from 'react';
import { Maximize, RotateCw, FlipHorizontal, RotateCcw, Blend, Droplet } from 'lucide-react';

export function Controls({ transform, onUpdate, onReset }) {
  const handleChange = (key, value) => {
    onUpdate({ ...transform, [key]: parseFloat(value) });
  };

  const handleBlendModeChange = (mode) => {
    onUpdate({ ...transform, blendMode: mode });
  };

  const toggleFlip = () => {
    onUpdate({ ...transform, flip: !transform.flip });
  };

  const blendModes = [
    { value: 'normal', label: '正常' },
    { value: 'multiply', label: '正片叠底' },
    { value: 'screen', label: '滤色' },
    { value: 'overlay', label: '叠加' },
    { value: 'darken', label: '变暗' },
    { value: 'lighten', label: '变亮' },
    { value: 'color-dodge', label: '颜色减淡' },
    { value: 'color-burn', label: '颜色加深' },
    { value: 'soft-light', label: '柔光' },
    { value: 'hard-light', label: '强光' },
  ];

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
          <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
          精细调整
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} /> 重置参数
        </button>
      </div>

      <div className="space-y-6">
        {/* Size */}
        <div className="space-y-3">
          <label className="flex justify-between text-sm font-medium text-zinc-400">
            <span className="flex items-center gap-2"><Maximize size={16} /> 缩放大小</span>
            <span className="text-white font-mono">{Math.round(transform.scale * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            value={transform.scale}
            onChange={(e) => handleChange('scale', e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <label className="flex justify-between text-sm font-medium text-zinc-400">
            <span className="flex items-center gap-2"><RotateCw size={16} /> 旋转角度</span>
            <span className="text-white font-mono">{transform.rotate}°</span>
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={transform.rotate}
            onChange={(e) => handleChange('rotate', e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-3">
          <label className="flex justify-between text-sm font-medium text-zinc-400">
            <span className="flex items-center gap-2"><Droplet size={16} /> 透明度</span>
            <span className="text-white font-mono">{Math.round(transform.opacity * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={transform.opacity}
            onChange={(e) => handleChange('opacity', e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
        </div>

        {/* Blend Mode */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
            <Blend size={16} /> 混合模式
          </label>
          <select
            value={transform.blendMode}
            onChange={(e) => handleBlendModeChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {blendModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        {/* Extra Tools */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={toggleFlip}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
              ${transform.flip ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
            `}
          >
            <FlipHorizontal size={18} />
            水平翻转
          </button>
        </div>
      </div>
    </div>
  );
}
