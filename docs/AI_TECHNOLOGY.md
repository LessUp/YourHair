# YourHair AI 技术说明

## 概述

YourHair AI 使用深度学习和计算机视觉技术实现智能发型融合。本文档详细介绍所使用的 AI 技术和算法。

## 技术栈

### 核心库

1. **TensorFlow.js** (`@tensorflow/tfjs`)
   - 版本: ^4.17.0
   - 用途: 深度学习推理引擎
   - 特点: 浏览器端运行，无需服务器

2. **face-api.js** (`face-api.js`)
   - 版本: ^0.22.2
   - 用途: 人脸检测和关键点定位
   - 模型: TinyFaceDetector, FaceLandmark68Net

3. **Body Segmentation** (`@tensorflow-models/body-segmentation`)
   - 版本: ^1.0.2
   - 用途: 人像分割
   - 模型: MediaPipe Selfie Segmentation

4. **MediaPipe** (`@mediapipe/selfie_segmentation`)
   - 版本: ^0.1.1675465747
   - 用途: 高性能人像分割

## AI 功能模块

### 1. 人脸检测 (Face Detection)

#### 技术实现
```javascript
// 使用 TinyFaceDetector 进行人脸检测
const detection = await faceapi
  .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks();
```

#### 检测结果
- **人脸边界框** (Bounding Box): 人脸的位置和大小
- **68个关键点** (Landmarks): 眼睛、眉毛、鼻子、嘴巴、下巴轮廓
- **人脸角度**: 基于眼睛位置计算的旋转角度

#### 关键点分布
```
眉毛: 左眉(17-21), 右眉(22-26)
眼睛: 左眼(36-41), 右眼(42-47)
鼻子: 27-35
嘴巴: 48-67
下巴轮廓: 0-16
```

### 2. 人像分割 (Person Segmentation)

#### 技术实现
```javascript
// 使用 MediaPipe Selfie Segmentation
const segmenter = await bodySegmentation.createSegmenter(
  bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
  { runtime: 'tfjs', modelType: 'general' }
);

const segmentation = await segmenter.segmentPeople(input);
```

#### 分割结果
- **二值掩码**: 人物区域为白色(255)，背景为黑色(0)
- **概率图**: 每个像素属于人物的概率值

### 3. 头发区域提取 (Hair Region Extraction)

#### 算法流程
1. 获取人像分割掩码
2. 获取人脸检测结果
3. 从人像掩码中移除脸部区域
4. 保留头发区域

#### 实现代码
```javascript
function createHairMask(personMask, faceData, width, height) {
  // 使用椭圆形状近似脸部
  const faceCenterX = box.x + box.width / 2;
  const faceCenterY = box.y + box.height / 2;
  const faceRadiusX = box.width / 2 * 0.9;
  const faceRadiusY = box.height / 2 * 0.85;

  // 移除脸部区域
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - faceCenterX) / faceRadiusX;
      const dy = (y - faceCenterY) / faceRadiusY;
      const inFace = (dx * dx + dy * dy) < 1;
      
      if (inFace) {
        // 设置为透明
        data[idx + 3] = 0;
      }
    }
  }
}
```

### 4. 智能发型融合 (Intelligent Hair Fusion)

#### 融合算法

##### 4.1 自动对齐
```javascript
function calculateHairstyleTransform(faceData, hairstyleImage) {
  const { hairRegion, faceAngle, foreheadCenter } = faceData;
  
  // 计算缩放比例
  const targetWidth = hairRegion.width * 1.2;
  const scaleX = targetWidth / hairstyleImage.width;
  
  // 计算位置（对齐到额头中心）
  const x = foreheadCenter.x;
  const y = hairRegion.y + hairRegion.height * 0.3;
  
  // 计算旋转角度
  const rotation = faceAngle;
  
  return { x, y, scaleX, scaleY: scaleX, rotation };
}
```

##### 4.2 混合模式
支持 10 种专业混合模式：

| 模式 | 算法 | 效果 |
|------|------|------|
| normal | 直接覆盖 | 完全替换 |
| multiply | 正片叠底 | 保留暗部 |
| screen | 滤色 | 提亮效果 |
| overlay | 叠加 | 增强对比 |
| darken | 变暗 | 保留暗部 |
| lighten | 变亮 | 保留亮部 |
| color-dodge | 颜色减淡 | 高光效果 |
| color-burn | 颜色加深 | 增加饱和度 |
| soft-light | 柔光 | 柔和融合 |
| hard-light | 强光 | 强烈对比 |

##### 4.3 边缘羽化
```javascript
function featherMask(mask, radius = 5) {
  // 高斯模糊实现边缘羽化
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0;
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          // 高斯权重
          const weight = Math.exp(-(dx*dx + dy*dy) / (2*radius*radius));
          sum += maskData[idx] * weight;
          count += weight;
        }
      }
      
      result[idx] = sum / count;
    }
  }
}
```

##### 4.4 颜色调整
```javascript
function applyColorAdjustment(ctx, colorAdjust) {
  // RGB to HSL
  // 应用色调、饱和度、亮度调整
  h = (h + colorAdjust.hue / 360 + 1) % 1;
  s = Math.max(0, Math.min(1, s + colorAdjust.saturation / 100));
  l = Math.max(0, Math.min(1, l + colorAdjust.brightness / 100));
  // HSL to RGB
}
```

### 5. 泊松融合 (Poisson Blending)

#### 原理
泊松融合是一种高级图像融合技术，通过求解泊松方程实现无缝融合。

#### 简化实现
```javascript
function poissonBlend(targetCanvas, sourceCanvas, mask, iterations = 100) {
  for (let iter = 0; iter < iterations; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // 计算拉普拉斯算子
        const laplacian = 
          source[idx] * 4 -
          source[idx - width] -
          source[idx + width] -
          source[idx - 1] -
          source[idx + 1];
        
        // 更新结果
        const neighbors = 
          result[idx - width] +
          result[idx + width] +
          result[idx - 1] +
          result[idx + 1];
        
        result[idx] = (neighbors + laplacian) / 4;
      }
    }
  }
}
```

## 性能优化

### 1. WebGL 加速
```javascript
// TensorFlow.js 自动使用 WebGL 后端
import '@tensorflow/tfjs-backend-webgl';
```

### 2. 模型缓存
```javascript
let modelsLoaded = false;
let loadingPromise = null;

export async function loadModels() {
  if (modelsLoaded) return true;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    await loadAllModels();
    modelsLoaded = true;
    return true;
  })();
  
  return loadingPromise;
}
```

### 3. 图像缓存
```javascript
const userImageRef = useRef(null);
const hairstyleImageRef = useRef(null);

// 只在图像变化时重新加载
useEffect(() => {
  if (userImage) {
    const img = new Image();
    img.onload = () => {
      userImageRef.current = img;
      processImage();
    };
    img.src = userImage;
  }
}, [userImage]);
```

## 模型详情

### TinyFaceDetector
- **输入**: 任意尺寸图像
- **输出**: 人脸边界框和置信度
- **模型大小**: ~190KB
- **推理速度**: ~30ms (GPU)

### FaceLandmark68Net
- **输入**: 人脸区域图像
- **输出**: 68个关键点坐标
- **模型大小**: ~350KB
- **推理速度**: ~20ms (GPU)

### MediaPipe Selfie Segmentation
- **输入**: 256x256 图像
- **输出**: 256x256 分割掩码
- **模型大小**: ~200KB
- **推理速度**: ~15ms (GPU)

## 浏览器兼容性

### WebGL 支持
- Chrome 90+: ✅ 完全支持
- Firefox 88+: ✅ 完全支持
- Safari 14+: ✅ 完全支持
- Edge 90+: ✅ 完全支持

### 性能要求
- **最低**: 4GB RAM, 集成显卡
- **推荐**: 8GB RAM, 独立显卡
- **最佳**: 16GB RAM, NVIDIA GPU

## 隐私安全

### 本地处理
- ✅ 所有 AI 推理在浏览器本地完成
- ✅ 图像不上传到任何服务器
- ✅ 模型从 CDN 加载后缓存在本地
- ✅ 不收集任何用户数据

### 数据流
```
用户图像 → 浏览器内存 → TensorFlow.js → AI 推理 → 结果渲染
                ↓
            刷新页面后清空
```

## 未来改进

### 短期计划
- [ ] 添加更多人脸关键点（106点）
- [ ] 优化头发分割精度
- [ ] 支持多人脸检测
- [ ] 添加发型推荐 AI

### 长期计划
- [ ] 3D 人脸重建
- [ ] 实时视频处理
- [ ] GAN 发型生成
- [ ] 发型迁移学习

## 参考资料

### 论文
1. "Face Detection with the Faster R-CNN" - Ren et al.
2. "Semantic Image Segmentation with Deep Convolutional Nets" - Chen et al.
3. "Poisson Image Editing" - Pérez et al.

### 开源项目
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js](https://github.com/tensorflow/tfjs)
- [MediaPipe](https://github.com/google/mediapipe)

### 文档
- [TensorFlow.js 官方文档](https://www.tensorflow.org/js)
- [face-api.js 文档](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
- [MediaPipe 文档](https://google.github.io/mediapipe/)

---

**文档版本**: v2.0.0  
**最后更新**: 2024-12-08
