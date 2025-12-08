/**
 * 人脸检测模块
 * 使用 face-api.js 进行人脸检测和关键点定位
 */

import * as faceapi from 'face-api.js';

let modelsLoaded = false;
let loadingPromise = null;

// 模型路径 - 使用 CDN
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

/**
 * 加载人脸检测模型
 */
export async function loadFaceDetectionModels() {
    if (modelsLoaded) return true;

    if (loadingPromise) {
        return loadingPromise;
    }

    loadingPromise = (async () => {
        try {
            console.log('Loading face detection models...');

            // 加载必要的模型
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);

            modelsLoaded = true;
            console.log('Face detection models loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load face detection models:', error);
            loadingPromise = null;
            return false;
        }
    })();

    return loadingPromise;
}

/**
 * 检测人脸并获取关键点
 * @param {HTMLImageElement|HTMLCanvasElement} input - 输入图像
 * @returns {Promise<Object|null>} 人脸检测结果
 */
export async function detectFace(input) {
    if (!modelsLoaded) {
        await loadFaceDetectionModels();
    }

    try {
        const detection = await faceapi
            .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        if (!detection) {
            console.log('No face detected');
            return null;
        }

        const { detection: faceDetection, landmarks } = detection;
        const box = faceDetection.box;

        // 提取关键点
        const jawOutline = landmarks.getJawOutline();
        const leftEyeBrow = landmarks.getLeftEyeBrow();
        const rightEyeBrow = landmarks.getRightEyeBrow();
        const nose = landmarks.getNose();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const mouth = landmarks.getMouth();

        // 计算头部区域（用于发型定位）
        const foreheadTop = Math.min(...leftEyeBrow.map(p => p.y), ...rightEyeBrow.map(p => p.y));
        const foreheadHeight = box.height * 0.4; // 估计额头高度

        const hairRegion = {
            x: box.x - box.width * 0.2,
            y: foreheadTop - foreheadHeight,
            width: box.width * 1.4,
            height: foreheadHeight + box.height * 0.3,
        };

        return {
            box,
            landmarks: {
                jawOutline,
                leftEyeBrow,
                rightEyeBrow,
                nose,
                leftEye,
                rightEye,
                mouth,
            },
            hairRegion,
            foreheadCenter: {
                x: (leftEyeBrow[0].x + rightEyeBrow[rightEyeBrow.length - 1].x) / 2,
                y: foreheadTop - foreheadHeight * 0.5,
            },
            faceCenter: {
                x: box.x + box.width / 2,
                y: box.y + box.height / 2,
            },
            faceAngle: calculateFaceAngle(leftEye, rightEye),
        };
    } catch (error) {
        console.error('Face detection error:', error);
        return null;
    }
}

/**
 * 计算人脸角度
 */
function calculateFaceAngle(leftEye, rightEye) {
    const leftCenter = {
        x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
        y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length,
    };
    const rightCenter = {
        x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
        y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length,
    };

    const angle = Math.atan2(rightCenter.y - leftCenter.y, rightCenter.x - leftCenter.x);
    return (angle * 180) / Math.PI;
}

/**
 * 检查模型是否已加载
 */
export function isModelsLoaded() {
    return modelsLoaded;
}

export { faceapi };
