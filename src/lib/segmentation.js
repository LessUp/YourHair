/**
 * 人像分割模块
 * 使用 TensorFlow.js 和 MediaPipe 进行人像/头发分割
 */

import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-backend-webgl';

let segmenter = null;
let loadingPromise = null;

/**
 * 加载分割模型
 */
export async function loadSegmentationModel() {
    if (segmenter) return segmenter;

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = (async () => {
        try {
            console.log('Loading segmentation model...');

            // 使用 MediaPipe Selfie Segmentation 模型
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
            const segmenterConfig = {
                runtime: 'tfjs',
                modelType: 'general', // 'general' 或 'landscape'
            };

            segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
            console.log('Segmentation model loaded successfully');
            return segmenter;
        } catch (error) {
            console.error('Failed to load segmentation model:', error);
            loadingPromise = null;
            return null;
        }
    })();

    return loadingPromise;
}

/**
 * 对图像进行人像分割
 * @param {HTMLImageElement|HTMLCanvasElement} input - 输入图像
 * @returns {Promise<ImageData|null>} 分割掩码
 */
export async function segmentPerson(input) {
    if (!segmenter) {
        await loadSegmentationModel();
    }

    if (!segmenter) {
        console.error('Segmenter not available');
        return null;
    }

    try {
        const segmentation = await segmenter.segmentPeople(input);

        if (!segmentation || segmentation.length === 0) {
            console.log('No person detected for segmentation');
            return null;
        }

        // 获取二值掩码
        const mask = await bodySegmentation.toBinaryMask(
            segmentation,
            { r: 255, g: 255, b: 255, a: 255 }, // 前景色（人物）
            { r: 0, g: 0, b: 0, a: 0 },         // 背景色
            false,                               // 不绘制轮廓
            0.5                                  // 阈值
        );

        return mask;
    } catch (error) {
        console.error('Segmentation error:', error);
        return null;
    }
}

/**
 * 创建头发区域掩码
 * 基于人脸检测结果和人像分割结果
 * @param {ImageData} personMask - 人像分割掩码
 * @param {Object} faceData - 人脸检测数据
 * @param {number} width - 图像宽度
 * @param {number} height - 图像高度
 * @returns {ImageData} 头发区域掩码
 */
export function createHairMask(personMask, faceData, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 绘制人像掩码
    ctx.putImageData(personMask, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    if (faceData && faceData.box) {
        const { box, landmarks } = faceData;

        // 移除脸部区域，只保留头发区域
        // 使用椭圆形状来近似脸部
        const faceCenterX = box.x + box.width / 2;
        const faceCenterY = box.y + box.height / 2;
        const faceRadiusX = box.width / 2 * 0.9;
        const faceRadiusY = box.height / 2 * 0.85;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;

                // 检查是否在脸部椭圆内
                const dx = (x - faceCenterX) / faceRadiusX;
                const dy = (y - faceCenterY) / faceRadiusY;
                const inFace = (dx * dx + dy * dy) < 1;

                // 如果在脸部区域内，设置为透明
                if (inFace) {
                    data[idx] = 0;
                    data[idx + 1] = 0;
                    data[idx + 2] = 0;
                    data[idx + 3] = 0;
                }
            }
        }
    }

    return imageData;
}

/**
 * 应用羽化效果到掩码边缘
 * @param {ImageData} mask - 输入掩码
 * @param {number} radius - 羽化半径
 * @returns {ImageData} 羽化后的掩码
 */
export function featherMask(mask, radius = 5) {
    const width = mask.width;
    const height = mask.height;
    const data = new Uint8ClampedArray(mask.data);
    const result = new Uint8ClampedArray(mask.data);

    // 简单的高斯模糊实现
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let sum = 0;
            let count = 0;

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4 + 3; // Alpha channel
                        sum += data[idx];
                        count++;
                    }
                }
            }

            const idx = (y * width + x) * 4 + 3;
            result[idx] = Math.round(sum / count);
        }
    }

    return new ImageData(result, width, height);
}

/**
 * 检查分割模型是否已加载
 */
export function isSegmenterLoaded() {
    return segmenter !== null;
}
