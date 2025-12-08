import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export function TipsPanel() {
    const tips = [
        '使用正脸照片效果最佳，避免侧脸或低头',
        '确保照片光线充足，面部清晰可见',
        '调整透明度可以看到发型与原发的融合效果',
        '尝试不同的混合模式获得最自然的效果',
        '使用"正片叠底"模式可以保留头发的阴影细节',
        '使用"叠加"模式可以让发型颜色更自然',
    ];

    return (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-yellow-400" />
                <h3 className="text-sm font-semibold text-zinc-100">使用技巧</h3>
            </div>
            <ul className="space-y-2.5">
                {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
