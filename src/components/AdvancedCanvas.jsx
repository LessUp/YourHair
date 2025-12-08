import React, { useRef, useEffect, useState } from 'react';
import { Upload, Image as ImageIcon, Move, Wand2 } from 'lucide-react';

export function AdvancedCanvas({
    userImage,
    selectedHairstyle,
    transform,
    onTransformChange,
    onUpload,
    canvasRef,
    useAdvancedMode = false
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const internalCanvasRef = useRef(null);
    const userImageRef = useRef(null);
    const hairstyleImageRef = useRef(null);

    // Load images
    useEffect(() => {
        if (userImage) {
            const img = new Image();
            img.onload = () => {
                userImageRef.current = img;
                renderCanvas();
            };
            img.src = userImage;
        }
    }, [userImage]);

    useEffect(() => {
        if (selectedHairstyle) {
            const img = new Image();
            img.onload = () => {
                hairstyleImageRef.current = img;
                renderCanvas();
            };
            img.src = selectedHairstyle.src;
        }
    }, [selectedHairstyle]);

    useEffect(() => {
        if (useAdvancedMode) {
            renderCanvas();
        }
    }, [transform, useAdvancedMode]);

    const renderCanvas = () => {
        if (!useAdvancedMode || !internalCanvasRef.current || !userImageRef.current) return;

        const canvas = internalCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const userImg = userImageRef.current;
        const hairstyleImg = hairstyleImageRef.current;

        // Set canvas size to match container
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // 2x for retina
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw user image (background)
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

        // Draw hairstyle with transforms
        if (hairstyleImg) {
            ctx.save();

            // Set blend mode and opacity
            ctx.globalCompositeOperation = transform.blendMode || 'normal';
            ctx.globalAlpha = transform.opacity || 1;

            // Calculate hairstyle dimensions
            const hairWidth = rect.width * 0.8 * transform.scale;
            const hairHeight = (hairstyleImg.height / hairstyleImg.width) * hairWidth;

            // Apply transforms
            const centerX = rect.width / 2 + transform.x;
            const centerY = rect.height / 2 + transform.y;

            ctx.translate(centerX, centerY);
            ctx.rotate((transform.rotate * Math.PI) / 180);
            if (transform.flip) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                hairstyleImg,
                -hairWidth / 2,
                -hairHeight / 2,
                hairWidth,
                hairHeight
            );

            ctx.restore();
        }
    };

    const handleMouseDown = (e) => {
        if (!selectedHairstyle) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - transform.x,
            y: e.clientY - transform.y
        });
    };

    const handleTouchStart = (e) => {
        if (!selectedHairstyle) return;
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({
            x: touch.clientX - transform.x,
            y: touch.clientY - transform.y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            onTransformChange({ ...transform, x: newX, y: newY });
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            const newX = touch.clientX - dragStart.x;
            const newY = touch.clientY - dragStart.y;
            onTransformChange({ ...transform, x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, dragStart, transform, onTransformChange]);

    if (useAdvancedMode) {
        return (
            <div className="bg-zinc-900 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center h-full relative overflow-hidden">
                <div
                    ref={canvasRef}
                    className="relative w-full max-w-[500px] aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border-2 border-dashed border-zinc-700 flex items-center justify-center shadow-inner group"
                >
                    {!userImage ? (
                        <div className="text-center text-zinc-500 flex flex-col items-center p-8">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <ImageIcon size={48} className="opacity-50" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-300 mb-2">上传你的照片</h3>
                            <p className="text-sm text-zinc-500 mb-8 max-w-xs">
                                建议使用正脸照片，光线充足，效果最佳。
                            </p>
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
                </div>

                {userImage && selectedHairstyle && (
                    <div className="absolute bottom-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white/80 pointer-events-none flex items-center gap-2">
                        <Wand2 size={12} /> 高级融合模式 · 拖动调整位置
                    </div>
                )}
            </div>
        );
    }

    // Fallback to simple CSS-based rendering
    return (
        <div className="bg-zinc-900 p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center h-full relative overflow-hidden">
            <div
                ref={canvasRef}
                className="relative w-full max-w-[500px] aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border-2 border-dashed border-zinc-700 flex items-center justify-center shadow-inner group"
            >
                {!userImage ? (
                    <div className="text-center text-zinc-500 flex flex-col items-center p-8">
                        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <ImageIcon size={48} className="opacity-50" />
                        </div>
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">上传你的照片</h3>
                        <p className="text-sm text-zinc-500 mb-8 max-w-xs">
                            建议使用正脸照片，光线充足，效果最佳。
                        </p>
                        <button
                            onClick={onUpload}
                            className="px-8 py-3 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-500 transition-all shadow-lg hover:shadow-pink-500/30 flex items-center gap-2"
                        >
                            <Upload size={20} />
                            选择照片
                        </button>
                    </div>
                ) : (
                    <>
                        <img
                            src={userImage}
                            alt="User"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />

                        {selectedHairstyle && (
                            <div
                                className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
                                style={{
                                    mixBlendMode: transform.blendMode,
                                    opacity: transform.opacity,
                                }}
                            >
                                <div
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleTouchStart}
                                    className={`
                    pointer-events-auto cursor-move touch-none
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                  `}
                                    style={{
                                        transform: `
                      translate(${transform.x}px, ${transform.y}px) 
                      rotate(${transform.rotate}deg) 
                      scaleX(${transform.flip ? -transform.scale : transform.scale})
                      scaleY(${transform.scale})
                    `,
                                        width: '80%',
                                        height: 'auto',
                                        position: 'relative',
                                    }}
                                >
                                    <img
                                        src={selectedHairstyle.src}
                                        alt="Hairstyle"
                                        className="w-full h-auto drop-shadow-2xl"
                                        style={{ pointerEvents: 'none' }}
                                    />

                                    <div className={`
                    absolute inset-0 border-2 border-pink-500/50 rounded-lg transition-opacity
                    ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}
                  `}></div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {userImage && selectedHairstyle && (
                <div className="absolute bottom-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-white/80 pointer-events-none">
                    <Move size={12} className="inline mr-1" /> 拖动发型调整位置
                </div>
            )}
        </div>
    );
}
