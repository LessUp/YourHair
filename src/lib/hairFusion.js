/**
 * 发型融合模块
 * 使用深度学习分割结果进行智能发型融合
 */

/**
 * 智能发型融合
 * @param {HTMLCanvasElement} canvas - 目标画布
 * @param {HTMLImageElement} userImage - 用户照片
 * @param {HTMLImageElement} hairstyleImage - 发型图片
 * @param {Object} faceData - 人脸检测数据
 * @param {ImageData} hairMask - 头发区域掩码
 * @param {Object} options - 融合选项
 */
export function fuseHairstyle(canvas, userImage, hairstyleImage, faceData, hairMask, options = {}) {
    const ctx = canvas.getContext('2d');
    const {
        opacity = 0.9,
        blendMode = 'normal',
        colorAdjust = { hue: 0, saturation: 0, brightness: 0 },
        featherRadius = 10,
        autoAlign = true,
    } = options;

    const width = canvas.width;
    const height = canvas.height;

    // 1. 绘制原始用户照片
    ctx.drawImage(userImage, 0, 0, width, height);

    if (!faceData) {
        // 如果没有人脸数据，使用简单叠加
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = blendMode;
        ctx.drawImage(hairstyleImage, 0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        return;
    }

    // 2. 计算发型位置和变换
    const transform = calculateHairstyleTransform(faceData, hairstyleImage, width, height, autoAlign);

    // 3. 创建临时画布用于发型处理
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // 4. 绘制变换后的发型
    tempCtx.save();
    tempCtx.translate(transform.x, transform.y);
    tempCtx.rotate((transform.rotation * Math.PI) / 180);
    tempCtx.scale(transform.scaleX, transform.scaleY);
    tempCtx.drawImage(
        hairstyleImage,
        -hairstyleImage.width / 2,
        -hairstyleImage.height / 2
    );
    tempCtx.restore();

    // 5. 应用颜色调整
    if (colorAdjust.hue !== 0 || colorAdjust.saturation !== 0 || colorAdjust.brightness !== 0) {
        applyColorAdjustment(tempCtx, width, height, colorAdjust);
    }

    // 6. 应用掩码（如果有）
    if (hairMask) {
        applyMaskToCanvas(tempCtx, hairMask, width, height, featherRadius);
    }

    // 7. 将发型融合到原图
    ctx.globalAlpha = opacity;
    ctx.globalCompositeOperation = blendMode;
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
}

/**
 * 计算发型变换参数
 */
function calculateHairstyleTransform(faceData, hairstyleImage, canvasWidth, canvasHeight, autoAlign) {
    const { box, faceAngle, foreheadCenter, hairRegion } = faceData;

    // 计算缩放比例
    const targetWidth = hairRegion.width * 1.2;
    const scaleX = targetWidth / hairstyleImage.width;
    const scaleY = scaleX; // 保持比例

    // 计算位置（发型中心对齐到额头中心）
    const x = foreheadCenter.x;
    const y = hairRegion.y + hairRegion.height * 0.3;

    // 计算旋转角度
    const rotation = autoAlign ? faceAngle : 0;

    return {
        x,
        y,
        scaleX,
        scaleY,
        rotation,
    };
}

/**
 * 应用颜色调整
 */
function applyColorAdjustment(ctx, width, height, colorAdjust) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue; // 跳过透明像素

        // RGB to HSL
        let r = data[i] / 255;
        let g = data[i + 1] / 255;
        let b = data[i + 2] / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        // 应用调整
        h = (h + colorAdjust.hue / 360 + 1) % 1;
        s = Math.max(0, Math.min(1, s + colorAdjust.saturation / 100));
        l = Math.max(0, Math.min(1, l + colorAdjust.brightness / 100));

        // HSL to RGB
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        data[i] = Math.round(r * 255);
        data[i + 1] = Math.round(g * 255);
        data[i + 2] = Math.round(b * 255);
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * 应用掩码到画布
 */
function applyMaskToCanvas(ctx, mask, width, height, featherRadius) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const maskData = mask.data;

    // 创建羽化掩码
    const featheredMask = featherMaskData(maskData, width, height, featherRadius);

    for (let i = 0; i < data.length; i += 4) {
        const maskAlpha = featheredMask[i + 3] / 255;
        data[i + 3] = Math.round(data[i + 3] * maskAlpha);
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * 羽化掩码数据
 */
function featherMaskData(maskData, width, height, radius) {
    const result = new Uint8ClampedArray(maskData);

    // 简化的高斯模糊
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4 + 3;

            // 只处理边缘像素
            if (maskData[idx] > 0 && maskData[idx] < 255) {
                let sum = 0;
                let count = 0;

                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;

                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nidx = (ny * width + nx) * 4 + 3;
                            const weight = Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius));
                            sum += maskData[nidx] * weight;
                            count += weight;
                        }
                    }
                }

                result[idx] = Math.round(sum / count);
            }
        }
    }

    return result;
}

/**
 * 高级泊松融合（简化版）
 * 用于更自然的边缘融合
 */
export function poissonBlend(targetCanvas, sourceCanvas, mask, iterations = 100) {
    const width = targetCanvas.width;
    const height = targetCanvas.height;

    const targetCtx = targetCanvas.getContext('2d');
    const sourceCtx = sourceCanvas.getContext('2d');

    const targetData = targetCtx.getImageData(0, 0, width, height);
    const sourceData = sourceCtx.getImageData(0, 0, width, height);
    const maskData = mask.data;

    const result = new Uint8ClampedArray(targetData.data);

    // 简化的泊松融合迭代
    for (let iter = 0; iter < iterations; iter++) {
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                const maskAlpha = maskData[idx + 3];

                if (maskAlpha > 0) {
                    const blend = maskAlpha / 255;

                    for (let c = 0; c < 3; c++) {
                        // 计算拉普拉斯算子
                        const laplacian =
                            sourceData.data[idx + c] * 4 -
                            sourceData.data[((y - 1) * width + x) * 4 + c] -
                            sourceData.data[((y + 1) * width + x) * 4 + c] -
                            sourceData.data[(y * width + x - 1) * 4 + c] -
                            sourceData.data[(y * width + x + 1) * 4 + c];

                        // 更新结果
                        const neighbors =
                            result[((y - 1) * width + x) * 4 + c] +
                            result[((y + 1) * width + x) * 4 + c] +
                            result[(y * width + x - 1) * 4 + c] +
                            result[(y * width + x + 1) * 4 + c];

                        const newValue = (neighbors + laplacian) / 4;
                        result[idx + c] = Math.round(
                            result[idx + c] * (1 - blend) +
                            Math.max(0, Math.min(255, newValue)) * blend
                        );
                    }
                }
            }
        }
    }

    targetData.data.set(result);
    targetCtx.putImageData(targetData, 0, 0);
}

/**
 * 边缘检测（用于更精确的融合）
 */
export function detectEdges(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const result = new Uint8ClampedArray(data.length);

    // Sobel 算子
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4;
                    const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                    const ki = (ky + 1) * 3 + (kx + 1);
                    gx += gray * sobelX[ki];
                    gy += gray * sobelY[ki];
                }
            }

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * width + x) * 4;
            result[idx] = result[idx + 1] = result[idx + 2] = Math.min(255, magnitude);
            result[idx + 3] = 255;
        }
    }

    return new ImageData(result, width, height);
}
