import React, { useState } from 'react';
import {
    Maximize, RotateCw, FlipHorizontal, RotateCcw,
    Blend, Droplet, Palette, Sun, Contrast,
    Sparkles, Settings2, ChevronDown, ChevronUp
} from 'lucide-react';

export function AIControls({
    transform,
    onUpdate,
    onReset,
    faceData,
    aiEnabled = true,
    onAIToggle,
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showColorAdjust, setShowColorAdjust] = useState(false);

    const handleChange = (key, value) => {
        onUpdate({ ...transform, [key]: parseFloat(value) });
    };

    const handleColorChange = (key, value) => {
        onUpdate({
            ...transform,
            colorAdjust: {
                ...transform.colorAdjust,
                [key]: parseFloat(value),
            },
        });
    };

    const toggleFlip = () => {
        onUpdate({ ...transform, flip: !transform.flip });
    };

    const handleBlendModeChange = (mode) => {
        onUpdate({ ...transform, blendMode: mode });
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

    // 颜色调整默认值
    const colorAdjust = transform.colorAdjust || { hue: 0, saturation: 0, brightness: 0 };

    return (
        <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-xl space-y-4">
            {/* 标题栏 */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    精细调整
                </h3>
                <button
                    onClick={onReset}
                    className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                    <RotateCcw size={12} /> 重置
                </button>
            </div>

            {/* AI 状态指示 */}
            {aiEnabled && faceData && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Sparkles size={16} className="text-purple-400" />
                        <span className="text-purple-300">AI 已检测到人脸</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                        <div>人脸角度: {faceData.faceAngle?.toFixed(1)}°</div>
                        <div>置信度: 高</div>
                    </div>
                </div>
            )}

            {/* 基础控制 */}
            <div className="space-y-5">
                {/* 缩放 */}
                <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-2">
                            <Maximize size={16} /> 缩放大小
                        </span>
                        <span className="text-white font-mono">{Math.round(transform.scale * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0.3"
                        max="2.5"
                        step="0.01"
                        value={transform.scale}
                        onChange={(e) => handleChange('scale', e.target.value)}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* 旋转 */}
                <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-2">
                            <RotateCw size={16} /> 旋转角度
                        </span>
                        <span className="text-white font-mono">{transform.rotate}°</span>
                    </label>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={transform.rotate}
                        onChange={(e) => handleChange('rotate', e.target.value)}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* 透明度 */}
                <div className="space-y-2">
                    <label className="flex justify-between text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-2">
                            <Droplet size={16} /> 透明度
                        </span>
                        <span className="text-white font-mono">{Math.round(transform.opacity * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={transform.opacity}
                        onChange={(e) => handleChange('opacity', e.target.value)}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                {/* 混合模式 */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-400">
                        <Blend size={16} /> 混合模式
                    </label>
                    <select
                        value={transform.blendMode}
                        onChange={(e) => handleBlendModeChange(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        {blendModes.map((mode) => (
                            <option key={mode.value} value={mode.value}>
                                {mode.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 颜色调整（可折叠） */}
            <div className="border-t border-zinc-800 pt-4">
                <button
                    onClick={() => setShowColorAdjust(!showColorAdjust)}
                    className="w-full flex items-center justify-between text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Palette size={16} /> 颜色调整
                    </span>
                    {showColorAdjust ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showColorAdjust && (
                    <div className="mt-4 space-y-4">
                        {/* 色调 */}
                        <div className="space-y-2">
                            <label className="flex justify-between text-xs text-zinc-500">
                                <span>色调</span>
                                <span className="font-mono">{colorAdjust.hue}°</span>
                            </label>
                            <input
                                type="range"
                                min="-180"
                                max="180"
                                step="1"
                                value={colorAdjust.hue}
                                onChange={(e) => handleColorChange('hue', e.target.value)}
                                className="w-full h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* 饱和度 */}
                        <div className="space-y-2">
                            <label className="flex justify-between text-xs text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Contrast size={12} /> 饱和度
                                </span>
                                <span className="font-mono">{colorAdjust.saturation}%</span>
                            </label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={colorAdjust.saturation}
                                onChange={(e) => handleColorChange('saturation', e.target.value)}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        {/* 亮度 */}
                        <div className="space-y-2">
                            <label className="flex justify-between text-xs text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Sun size={12} /> 亮度
                                </span>
                                <span className="font-mono">{colorAdjust.brightness}%</span>
                            </label>
                            <input
                                type="range"
                                min="-100"
                                max="100"
                                step="1"
                                value={colorAdjust.brightness}
                                onChange={(e) => handleColorChange('brightness', e.target.value)}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                        </div>

                        {/* 重置颜色 */}
                        <button
                            onClick={() => onUpdate({
                                ...transform,
                                colorAdjust: { hue: 0, saturation: 0, brightness: 0 },
                            })}
                            className="w-full text-xs text-zinc-500 hover:text-zinc-400 py-1"
                        >
                            重置颜色调整
                        </button>
                    </div>
                )}
            </div>

            {/* 高级选项（可折叠） */}
            <div className="border-t border-zinc-800 pt-4">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Settings2 size={16} /> 高级选项
                    </span>
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                    <div className="mt-4 space-y-3">
                        {/* 羽化半径 */}
                        <div className="space-y-2">
                            <label className="flex justify-between text-xs text-zinc-500">
                                <span>边缘羽化</span>
                                <span className="font-mono">{transform.featherRadius || 10}px</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={transform.featherRadius || 10}
                                onChange={(e) => handleChange('featherRadius', e.target.value)}
                                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>

                        {/* 自动对齐 */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-500">自动对齐人脸</span>
                            <button
                                onClick={() => onUpdate({ ...transform, autoAlign: !transform.autoAlign })}
                                className={`w-10 h-5 rounded-full transition-colors ${transform.autoAlign !== false ? 'bg-blue-500' : 'bg-zinc-700'
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transition-transform ${transform.autoAlign !== false ? 'translate-x-5' : 'translate-x-0.5'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* AI 融合 */}
                        {onAIToggle && (
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-500 flex items-center gap-1">
                                    <Sparkles size={12} className="text-purple-400" />
                                    AI 智能融合
                                </span>
                                <button
                                    onClick={onAIToggle}
                                    className={`w-10 h-5 rounded-full transition-colors ${aiEnabled ? 'bg-purple-500' : 'bg-zinc-700'
                                        }`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full transition-transform ${aiEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 快捷操作 */}
            <div className="pt-4 border-t border-zinc-800">
                <button
                    onClick={toggleFlip}
                    className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
            ${transform.flip
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
          `}
                >
                    <FlipHorizontal size={18} />
                    水平翻转
                </button>
            </div>

            {/* 快捷预设 */}
            <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-2">快捷预设</p>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => onUpdate({
                            ...transform,
                            opacity: 0.85,
                            blendMode: 'multiply',
                        })}
                        className="px-2 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        深色发
                    </button>
                    <button
                        onClick={() => onUpdate({
                            ...transform,
                            opacity: 0.8,
                            blendMode: 'screen',
                        })}
                        className="px-2 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        浅色发
                    </button>
                    <button
                        onClick={() => onUpdate({
                            ...transform,
                            opacity: 0.9,
                            blendMode: 'overlay',
                        })}
                        className="px-2 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        自然效果
                    </button>
                </div>
            </div>
        </div>
    );
}
