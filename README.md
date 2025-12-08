# Virtual Hair Salon (YourHair)

一个基于 **React + Vite** 的虚拟发型设计应用，你可以在浏览器中尝试不同发型、颜色与样式，辅助沟通理发需求或进行创意设计。

An online **Virtual Hair Salon** built with React + Vite, allowing users to preview different hairstyles and colors directly in the browser.

---

## ✨ 特性 Features

### 🤖 AI 智能融合（v2.0 新功能）
- **人脸检测**: 使用 face-api.js 自动检测人脸位置和68个关键点
- **人像分割**: 使用 TensorFlow.js + MediaPipe 进行精确的人像分割
- **智能对齐**: AI 自动计算发型位置、角度和大小
- **头发区域提取**: 智能识别头发区域，实现精准融合
- **深度学习**: 基于深度神经网络的图像处理

### 🎨 高级图像融合功能
- **头像上传**: 支持上传真实照片，本地处理，隐私安全
- **发型融合**: 实时预览发型与照片的融合效果
- **透明度调整**: 调整发型透明度（推荐85%），查看与原发型的自然融合
- **10种混合模式**: 正片叠底、滤色、叠加、柔光等专业混合模式
- **颜色调整**: 色调、饱和度、亮度调整
- **边缘羽化**: 平滑的边缘过渡效果
- **双渲染引擎**: 
  - CSS模式：快速预览，性能优秀
  - Canvas模式：高级融合，专业级效果

### 🎯 核心功能
- ✅ AI 人脸检测和自动对齐
- ✅ 深度学习人像分割
- ✅ 拖拽调整发型位置
- ✅ 缩放、旋转、水平翻转
- ✅ 实时预览融合效果
- ✅ 导出高清预览图（2x分辨率）
- ✅ 响应式设计，支持移动端
- ✅ 本地运行，照片不上传服务器

### 🎨 发型库
- **示例发型库**: 8种示例发型（SVG格式）
- **真实发型库**: 20+种分类发型（支持自定义扩展）
  - 短发系列：波波头、精灵短发、层次短发
  - 中长发系列：波浪中长发、直发、空气刘海
  - 长发系列：黑长直、大波浪、渐变色
  - 男士发型：经典短发、侧削渐变、复古油头
  - 个性发型：彩虹渐变、粉色梦幻、蓝色海洋

---

## 技术栈 Tech Stack

### 核心框架
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3

### AI/ML 库
- **TensorFlow.js**: 深度学习推理引擎
- **face-api.js**: 人脸检测和关键点定位
- **@tensorflow-models/body-segmentation**: 人像分割
- **@mediapipe/selfie_segmentation**: MediaPipe 分割模型

### 工具库
- **lucide-react**: 图标库
- **html-to-image**: 图像导出
- **clsx, tailwind-merge**: 样式工具

---

## 快速开始 Getting Started

### 1. 克隆仓库 Clone the repo

```bash
git clone https://github.com/LessUp/YourHair.git
cd YourHair
```

### 2. 安装依赖 Install dependencies

使用你喜欢的包管理器（任选其一）：

```bash
npm install
# 或
pnpm install
# 或
yarn
```

### 3. 启动开发环境 Run dev server

```bash
npm run dev
```

根据终端提示，在浏览器中打开对应地址（通常为：`http://localhost:5173`）。

---

## 🚀 使用指南 User Guide

### 基本流程
1. **上传照片**: 点击"上传照片"按钮，选择正脸照片（建议高清、光线充足）
2. **选择发型**: 从右侧发型库中选择喜欢的发型样式
3. **调整位置**: 直接拖拽发型到合适位置
4. **精细调整**: 使用右侧控制面板：
   - 🔍 缩放大小（50% - 200%）
   - 🔄 旋转角度（-180° - 180°）
   - 💧 透明度（0% - 100%，推荐85%）
   - 🎨 混合模式（10种可选）
   - ↔️ 水平翻转
5. **切换模式**: 点击"Canvas模式"体验高级融合效果
6. **导出图片**: 满意后点击"导出预览图"保存结果

### 💡 最佳实践

#### 照片要求
- ✅ 使用正脸照片，避免侧脸或低头
- ✅ 确保光线充足，面部清晰
- ✅ 推荐使用高清照片（JPG/PNG格式）
- ✅ 背景简洁效果更好

#### 融合技巧
- **透明度**: 85%左右效果最自然，可以看到原发型与新发型的融合
- **混合模式推荐**:
  - `正片叠底 (multiply)`: 保留头发阴影细节，适合深色发型
  - `叠加 (overlay)`: 让发型颜色更自然，增强对比度
  - `柔光 (soft-light)`: 柔和的融合效果
  - `正常 (normal)`: 直接覆盖，适合完全替换发型
- **调整顺序**: 先调位置和大小 → 再调透明度 → 最后选混合模式

---

## 🛠️ 技术实现 Technical Details

### 图像融合方案
本项目实现了两种图像融合方案：

1. **CSS混合模式** (`mix-blend-mode`)
   - 优点：性能好，实时预览流畅，GPU加速
   - 实现：使用CSS的`mix-blend-mode`和`opacity`属性
   - 适用：快速预览和实时调整

2. **Canvas API**
   - 优点：更精确的控制，专业级融合效果
   - 实现：使用Canvas 2D Context的`globalCompositeOperation`
   - 适用：最终效果渲染和高质量导出

### 支持的混合模式
- `normal`: 正常叠加
- `multiply`: 正片叠底，保留暗部细节
- `screen`: 滤色，提亮效果
- `overlay`: 叠加，增强对比度
- `darken`: 变暗
- `lighten`: 变亮
- `color-dodge`: 颜色减淡
- `color-burn`: 颜色加深
- `soft-light`: 柔光
- `hard-light`: 强光

### 关键技术栈
- **图像处理**: Canvas API, CSS Blend Modes
- **拖拽交互**: 原生事件处理（支持触摸）
- **图像导出**: html-to-image (2x分辨率)

### 4. 构建与预览 Build & Preview

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 项目结构（示例） Project Structure (example)

```text
YourHair/
├─ src/
│  ├─ components/      # 组件
│  ├─ assets/          # 静态资源（图片等）
│  ├─ styles/          # 全局样式 / Tailwind 配置
│  └─ main.jsx         # 应用入口
├─ index.html          # HTML 模板
├─ package.json
├─ vite.config.*       # Vite 配置
└─ README.md
```

（实际结构可能略有不同，可根据需要更新本节内容。）

---

## 📚 文档 Documentation

- 📖 [快速开始指南](./docs/QUICK_START.md) - 5分钟上手教程
- 🎨 [混合模式使用指南](./docs/BLEND_MODES_GUIDE.md) - 详细的混合模式说明和使用技巧
- 💇 [自定义发型素材指南](./docs/CUSTOM_HAIRSTYLES.md) - 如何添加和制作自己的发型素材

---

## 贡献 Contributing

欢迎 Issue 和 Pull Request！在提交之前，建议：

1. **先创建 Issue**：简单描述你的想法或问题。
2. **Fork & 新建分支**：在自己的仓库中新建特性分支进行开发。
3. **保持代码风格一致**：尽量遵守现有的代码风格和项目结构。
4. **提交 PR**：在 PR 描述中说明变更内容和动机。

---

## 许可证 License

本项目采用 **MIT License** 开源。

你可以自由地用于个人或商业项目，但请在再发布时保留原始版权和许可声明。

详细条款请参考 MIT License 原文（建议在仓库根目录添加 `LICENSE` 文件）。

---

## 致谢 Acknowledgements

- React & Vite 的优秀生态
- Tailwind CSS 与开源社区提供的设计灵感
- 所有为本项目提出建议或贡献代码的开发者
