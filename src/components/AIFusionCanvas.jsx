import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { loadFaceDetectionModels, detectFace, isModelsLoaded } from '../lib/faceDetection';
import { loadSegmentationModel, segmentPerson, createHairMask, isSegmenterLoaded } from '../lib/segmentation';
import { fuseHairstyle } from '../lib/hairFusion';

// AI 处理状态
const AI_STATUS = {
    IDLE: 'idle',
    LOADING_MODELS: 'loading_models',
    DETECTING_FACE: 'detecting_face',
    SEGMENTING: 'segmenting',
    FUSING: 'fusing',
    COMPLETE: 'complete',
    ERROR: 'error',
};

export function AIFusionCanvas({
    userImage,
    selectedHairstyle,
    transform,
    onTransformChange,
    onUpload,
    canvasRef,
    onFaceDetected,
    aiEnabled = true,
}) {
    const [aiStatus, setAiStatus] = useState(AI_STATUS.IDLE);
    const [statusMessage, setStatusMessage] = useState('');
    const [faceData, setFaceData] = useState(null);
    const [hairMask, setHairMask] = useState(null);
    const [modelsReady, setModelsReady] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const internalCanvasRef = useRef(null);
    const userImageRef = useRef(null);
    const hairstyleImageRef = useRef(null);
    const containerRef = useRef(null);

    // 加载 AI 模型
    useEffect(() => {
        if (!aiEnabled) return;

        const loadModels = async () => {
            setAiStatus(AI_STATUS.LOADING_MODELS);
            setStatusMessage('正在加载 AI 模型...');

            try {
                await Promise.all([
                    loadFaceDetectionModels(),
                    loadSegmentationModel(),
                ]);
                setModelsReady(true);
                setAiStatus(AI_STATUS.IDLE);
                setStatusMessage('AI 模型加载完成');
            } catch (error) {
                console.error('Failed to load AI models:', error);
                setAiStatus(AI_STATUS.ERROR);
                setStatusMessage('AI 模型加载失败，将使用普通模式');
            }
        };

        loadModels();
    }, [aiEnabled]);

    // 加载用户图片
    useEffect(() => {
        if (!userImage) {
            userImageRef.current = null;
            setFaceData(null);
            setHairMask(null);
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
            userImageRef.current = img;

            if (aiEnabled && modelsReady) {
                await processUserImage(img);
            } else {
                renderCanvas();
            }
        };
        img.src = userImage;
    }, [userImage, aiEnabled, modelsReady]);

    // 加载发型图片
    useEffect(() => {
        if (!selectedHairstyle) {
            hairstyleImageRef.current = null;
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            hairstyleImageRef.current = img;
            renderCanvas();
        };
        img.onerror = () => {
            console.error('Failed to load hairstyle image:', selectedHairstyle.src);
        };
        img.src = selectedHairstyle.src;
    }, [selectedHairstyle]);

    // 处理用户图片（AI 分析）
    const processUserImage = async (img) => {
        try {
            // 1. 人脸检测
            setAiStatus(AI_STATUS.DETECTING_FACE);
            setStatusMessage('正在检测人脸...');

            const face = await detectFace(img);
            if (face) {
                setFaceData(face);
                onFaceDetected?.(face);

                // 自动调整发型位置
                if (face.hairRegion) {
                    const autoTransform = calculateAutoTransform(face, img);
                    onTransformChange?.({
                        ...transform,
                        ...autoTransform,
                    });
                }
            } else {
                setStatusMessage('未检测到人脸，将使用手动模式');
            }

            // 2. 人像分割
            setAiStatus(AI_STATUS.SEGMENTING);
            setStatusMessage('正在分析头发区域...');

            const personMask = await segmentPerson(img);
            if (personMask && face) {
                const mask = createHairMask(personMask, face, img.width, img.height);
                setHairMask(mask);
            }

            setAiStatus(AI_STATUS.COMPLETE);
            setStatusMessage('AI 分析完成');

            // 渲染结果
            renderCanvas();
        } catch (error) {
            console.error('AI processing error:', error);
            setAiStatus(AI_STATUS.ERROR);
            setStatusMessage('AI 处理出错，使用普通模式');
            renderCanvas();
        }
    };

    // 计算自动变换参数
    const calculateAutoTransform = (face, img) => {
        if (!face || !face.hairRegion) return {};

        const { hairRegion, faceAngle } = face;
        const canvas = internalCanvasRef.current;
        if (!canvas) return {};

        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;

        return {
            x: (hairRegion.x + hairRegion.width / 2) * scaleX - canvas.width / 2,
            y: (hairRegion.y + hairRegion.height / 2) * scaleY - canvas.height / 2,
            rotate: faceAngle || 0,
            scale: (hairRegion.width / img.width) * 2,
        };
    };

    // 渲染画布
    const renderCanvas = useCallback(() => {
        const canvas = internalCanvasRef.current;
        if (!canvas || !userImageRef.current) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        // 设置画布尺寸
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        const userImg = userImageRef.current;
        const hairstyleImg = hairstyleImageRef.current;

        // 清空画布
        ctx.clearRect(0, 0, rect.width, rect.height);

        // 绘制用户图片
        const aspectRatio = userImg.width / userImg.height;
        const canvasAspect = rect.width / rect.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (aspectRatio > canvasAspect) {
            drawHeight = rect.height;
            drawWidth = drawHeight * aspectRatio;
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = rect.width;
            drawHeight = drawWidth / aspectRatio;
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }

        ctx.drawImage(userImg, offsetX, offsetY, drawWidth, drawHeight);

        // 绘制人脸检测框（调试用）
        if (faceData && faceData.box) {
            const scaleX = drawWidth / userImg.width;
            const scaleY = drawHeight / userImg.height;

            // 绘制人脸框
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                offsetX + faceData.box.x * scaleX,
                offsetY + faceData.box.y * scaleY,
                faceData.box.width * scaleX,
                faceData.box.height * scaleY
            );

            // 绘制头发区域
            if (faceData.hairRegion) {
                ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(
                    offsetX + faceData.hairRegion.x * scaleX,
                    offsetY + faceData.hairRegion.y * scaleY,
                    faceData.hairRegion.width * scaleX,
                    faceData.hairRegion.height * scaleY
                );
                ctx.setLineDash([]);
            }
        }

        // 绘制发型
        if (hairstyleImg) {
            ctx.save();

            // 应用混合模式和透明度
            ctx.globalCompositeOperation = transform.blendMode || 'normal';
            ctx.globalAlpha = transform.opacity || 0.85;

            // 计算发型尺寸和位置
            const hairWidth = rect.width * 0.8 * transform.scale;
            const hairHeight = (hairstyleImg.height / hairstyleImg.width) * hairWidth;

            const centerX = rect.width / 2 + transform.x;
            const centerY = rect.height * 0.3 + transform.y;

            // 应用变换
            ctx.translate(centerX, centerY);
            ctx.rotate((transform.rotate * Math.PI) / 180);
            if (transform.flip) {
                ctx.scale(-1, 1);
            }

            // 绘制发型
            ctx.drawImage(
                hairstyleImg,
                -hairWidth / 2,
                -hairHeight / 2,
                hairWidth,
                hairHeight
            );

            ctx.restore();
        }
    }, [transform, faceData]);

    // 监听变换变化
    useEffect(() => {
        renderCanvas();
    }, [transform, renderCanvas]);

    // 拖拽处理
    const handleMouseDown = (e) => {
        if (!selectedHairstyle) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - transform.x,
            y: e.clientY - transform.y,
        });
    };

    const handleTouchStart = (e) => {
        if (!selectedHairstyle) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - transform.x,
            y: touch.clientY - transform.y,
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            onTransformChange({
                ...transform,
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            onTransformChange({
                ...transform,
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y,
            });
        };

        const handleEnd = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, dragStart, transform, onTransformChange]);

    // 渲染 AI 状态指示器
    const renderStatusIndicator = () => {
        if (!aiEnabled) return null;

        const statusConfig = {
            [AI_STATUS.IDLE]: { icon: null, color: 'text-zinc-400' },
            [AI_STATUS.LOADING_MODELS]: { icon: Loader2, color: 'text-blue-400', animate: true },
            [AI_STATUS.DETECTING_FACE]: { icon: Loader2, color: 'text-purple-400', animate: true },
            [AI_STATUS.SEGMENTING]: { icon: Loader2, color: 'text-pink-400', animate: true },
            [AI_STATUS.FUSING]: { icon: Loader2, color: 'text-orange-400', animate: true },
            [AI_STATUS.COMPLETE]: { icon: CheckCircle, color: 'text-green-400' },
            [AI_STATUS.ERROR]: { icon: AlertCircle, color: 'text-red-400' },
        };

        const config = statusConfig[aiStatus];
        if (!config.icon && aiStatus === AI_STATUS.IDLE) return null;

        const Icon = config.icon;

        return (
            <div className={`absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full text-xs ${config.color}`}>
                {Icon && <Icon size={14} className={config.animate ? 'animate-spin' : ''} />}
                <span>{statusMessage}</span>
            </div>
        );
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center h-full relative overflow-hidden">
            <div
                ref={(el) => {
                    containerRef.current = el;
                    if (canvasRef) canvasRef.current = el;
                }}
                className="relative w-full max-w-[500px] aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border-2 border-dashed border-zinc-700 flex items-center justify-center shadow-inner group"
            >
                {!userImage ? (
                    <div className="text-center text-zinc-500 flex flex-col items-center p-8">
                        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <ImageIcon size={48} className="opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">上传你的照片</h3>
                        <p className="text-sm text-zinc-500 mb-4 max-w-xs">
                            AI 将自动检测人脸并智能融合发型
                        </p>
                        {aiEnabled && (
                            <div className="flex items-center gap-2 text-xs text-purple-400 mb-6">
                                <Sparkles size={14} />
                                <span>AI 智能融合已启用</span>
                            </div>
                        )}
                        <button
                            onClick={onUpload}
                            className="px-8 py-3 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-500 transition-all shadow-lg hover:shadow-pink-500/30 flex items-center gap-2"
                        >
                            <Upload size={20} />
                            选择照片
                        </button>
                    </div>
                ) : (
                    <canvas
                        ref={internalCanvasRef}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    />
                )}

                {renderStatusIndicator()}
            </div>

            {/* AI 功能提示 */}
            {userImage && selectedHairstyle && aiEnabled && (
                <div className="absolute bottom-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white/80 pointer-events-none flex items-center gap-2">
                    <Sparkles size={12} className="text-purple-400" />
                    {faceData ? 'AI 已检测到人脸，智能融合中' : '拖动发型调整位置'}
                </div>
            )}
        </div>
    );
}
