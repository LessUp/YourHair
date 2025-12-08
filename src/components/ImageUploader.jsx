import React, { useCallback } from 'react';
import { Upload, Camera, X } from 'lucide-react';

export function ImageUploader({ onImageSelect, currentImage, onClear }) {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            onImageSelect(evt.target?.result || null);
        };
        reader.readAsDataURL(file);
    };

    if (currentImage) {
        return (
            <div className="relative group">
                <img
                    src={currentImage}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-lg"
                />
                <button
                    onClick={onClear}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-pink-500 transition-colors cursor-pointer bg-zinc-800/50"
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                    <Camera size={24} className="text-zinc-400" />
                </div>
                <div>
                    <p className="text-sm text-zinc-300 font-medium">点击上传或拖拽照片</p>
                    <p className="text-xs text-zinc-500 mt-1">支持 JPG, PNG 格式</p>
                </div>
            </label>
        </div>
    );
}
