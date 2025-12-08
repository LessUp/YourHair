# YourHair 项目结构

## 目录结构

```
YourHair/
├── docs/                           # 文档目录
│   ├── README.md                   # 文档中心导航
│   ├── QUICK_START.md              # 快速开始指南
│   ├── BLEND_MODES_GUIDE.md        # 混合模式使用指南
│   └── CUSTOM_HAIRSTYLES.md        # 自定义发型素材指南
│
├── public/                         # 静态资源目录
│   └── hairstyles/                 # 发型素材库
│       ├── afro-black.svg          # 爆炸头
│       ├── bob-purple.svg          # 紫色波波头
│       ├── curly-red.svg           # 红色卷发
│       ├── long-blonde.svg         # 金色长发
│       ├── long-brown.svg          # 棕色长发
│       ├── short-black.svg         # 黑色短发
│       ├── short-blue.svg          # 蓝色短发
│       └── spiky-silver.svg        # 银灰造型
│
├── src/                            # 源代码目录
│   ├── components/                 # React 组件
│   │   ├── AdvancedCanvas.jsx      # 高级画布组件（双渲染引擎）
│   │   ├── Controls.jsx            # 控制面板组件
│   │   ├── EditorCanvas.jsx        # 编辑画布组件（旧版，已被AdvancedCanvas替代）
│   │   ├── HairstyleSelector.jsx   # 发型选择器组件
│   │   ├── ImageUploader.jsx       # 图像上传组件（备用）
│   │   └── TipsPanel.jsx           # 使用技巧面板组件
│   │
│   ├── lib/                        # 工具库
│   │   └── hairstyles.js           # 发型数据配置
│   │
│   ├── App.jsx                     # 主应用组件
│   ├── index.css                   # 全局样式
│   └── main.jsx                    # 应用入口
│
├── .gitignore                      # Git 忽略配置
├── CHANGELOG.md                    # 更新日志
├── FEATURES.md                     # 功能特性文档
├── IMPLEMENTATION_SUMMARY.md       # 实现总结
├── index.html                      # HTML 模板
├── package.json                    # 项目配置和依赖
├── postcss.config.js               # PostCSS 配置
├── PROJECT_STRUCTURE.md            # 项目结构文档（本文件）
├── README.md                       # 项目说明
├── tailwind.config.js              # Tailwind CSS 配置
└── vite.config.js                  # Vite 构建配置
```

## 核心文件说明

### 应用入口

#### `src/main.jsx`
- React 应用的入口文件
- 挂载根组件到 DOM
- 导入全局样式

#### `src/App.jsx`
- 主应用组件
- 管理全局状态（照片、发型、变换参数）
- 协调各子组件
- 处理文件上传和图片导出

### 核心组件

#### `src/components/AdvancedCanvas.jsx`
**功能**: 高级画布组件，支持双渲染引擎

**特性**:
- CSS 渲染模式（快速预览）
- Canvas 渲染模式（专业融合）
- 拖拽交互处理
- 图像加载和缓存
- 实时渲染更新

**Props**:
```javascript
{
  userImage: string,           // 用户照片 Base64
  selectedHairstyle: object,   // 选中的发型对象
  transform: object,           // 变换参数
  onTransformChange: function, // 变换更新回调
  onUpload: function,          // 上传回调
  canvasRef: ref,              // Canvas 引用
  useAdvancedMode: boolean     // 是否使用 Canvas 模式
}
```

#### `src/components/Controls.jsx`
**功能**: 控制面板组件

**特性**:
- 缩放大小滑块（50%-200%）
- 旋转角度滑块（-180°-180°）
- 透明度滑块（0%-100%）
- 混合模式选择器（10种模式）
- 水平翻转按钮
- 重置参数按钮

**Props**:
```javascript
{
  transform: object,    // 当前变换参数
  onUpdate: function,   // 参数更新回调
  onReset: function     // 重置回调
}
```

#### `src/components/HairstyleSelector.jsx`
**功能**: 发型选择器组件

**特性**:
- 按分类展示发型
- 网格布局
- 选中状态高亮
- 悬停预览

**Props**:
```javascript
{
  hairstyles: array,           // 发型数组
  selectedHairstyle: object,   // 当前选中的发型
  onSelect: function           // 选择回调
}
```

#### `src/components/TipsPanel.jsx`
**功能**: 使用技巧面板

**特性**:
- 显示使用技巧
- 最佳实践建议
- 新手引导

**Props**: 无

#### `src/components/ImageUploader.jsx`
**功能**: 图像上传组件（备用）

**特性**:
- 文件选择
- 拖拽上传
- 预览和清除

**Props**:
```javascript
{
  onImageSelect: function,  // 图片选择回调
  currentImage: string,     // 当前图片
  onClear: function         // 清除回调
}
```

### 数据配置

#### `src/lib/hairstyles.js`
**功能**: 发型数据配置

**结构**:
```javascript
export const hairstyles = [
  {
    id: string,        // 唯一标识
    name: string,      // 显示名称
    src: string,       // 图片路径
    category: string,  // 分类（short/long/curly）
  },
  // ...
];
```

### 样式文件

#### `src/index.css`
- Tailwind CSS 导入
- 全局样式定义
- 自定义滚动条样式
- 动画定义

#### `tailwind.config.js`
- Tailwind CSS 配置
- 自定义主题
- 插件配置

### 配置文件

#### `vite.config.js`
- Vite 构建配置
- React 插件配置
- 开发服务器配置

#### `postcss.config.js`
- PostCSS 配置
- Tailwind CSS 处理
- Autoprefixer 配置

#### `package.json`
- 项目元数据
- 依赖管理
- 脚本命令

## 数据流

### 状态管理

```javascript
// App.jsx 中的主要状态
const [userImage, setUserImage] = useState(null);
const [selectedHairstyle, setSelectedHairstyle] = useState(null);
const [transform, setTransform] = useState({
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  flip: false,
  opacity: 0.85,
  blendMode: 'normal',
});
const [advancedMode, setAdvancedMode] = useState(false);
```

### 数据流向

```
用户操作
   ↓
事件处理器
   ↓
状态更新（setState）
   ↓
组件重新渲染
   ↓
视觉反馈
```

### 组件通信

```
App (父组件)
├─→ AdvancedCanvas (子组件)
│   ├─ Props: userImage, selectedHairstyle, transform
│   └─ Callback: onTransformChange
│
├─→ HairstyleSelector (子组件)
│   ├─ Props: hairstyles, selectedHairstyle
│   └─ Callback: onSelect
│
└─→ Controls (子组件)
    ├─ Props: transform
    └─ Callback: onUpdate, onReset
```

## 构建流程

### 开发模式
```bash
npm run dev
```
1. Vite 启动开发服务器
2. 监听文件变化
3. 热模块替换（HMR）
4. 实时预览

### 生产构建
```bash
npm run build
```
1. Vite 构建优化
2. 代码压缩
3. 资源优化
4. 生成 dist/ 目录

### 预览构建
```bash
npm run preview
```
1. 启动静态服务器
2. 预览生产构建结果

## 依赖说明

### 核心依赖
- **react**: ^18.2.0 - React 框架
- **react-dom**: ^18.2.0 - React DOM 渲染
- **lucide-react**: ^0.344.0 - 图标库
- **html-to-image**: ^1.11.11 - 图像导出
- **clsx**: ^2.1.0 - 类名工具
- **tailwind-merge**: ^2.2.1 - Tailwind 类名合并

### 开发依赖
- **vite**: ^5.1.6 - 构建工具
- **@vitejs/plugin-react**: ^4.2.1 - React 插件
- **tailwindcss**: ^3.4.1 - CSS 框架
- **autoprefixer**: ^10.4.18 - CSS 前缀
- **postcss**: ^8.4.35 - CSS 处理

## 扩展指南

### 添加新组件
1. 在 `src/components/` 创建新文件
2. 导出 React 组件
3. 在需要的地方导入使用

### 添加新发型
1. 将图片放入 `public/hairstyles/`
2. 在 `src/lib/hairstyles.js` 添加配置
3. 刷新页面查看效果

### 添加新功能
1. 在相应组件中实现功能
2. 更新状态管理（如需要）
3. 添加 UI 控制（如需要）
4. 更新文档

### 自定义样式
1. 修改 `tailwind.config.js` 配置主题
2. 在 `src/index.css` 添加全局样式
3. 在组件中使用 Tailwind 类名

## 性能优化

### 已实现的优化
1. **图片懒加载**: 发型图片按需加载
2. **状态批量更新**: 减少重渲染
3. **事件优化**: 拖拽事件防抖
4. **GPU 加速**: CSS transform
5. **Canvas 缓存**: 图片对象复用

### 优化建议
1. 使用 React.memo 优化组件
2. 使用 useMemo 缓存计算结果
3. 使用 useCallback 缓存函数
4. 代码分割和懒加载
5. 图片压缩和优化

## 调试技巧

### 开发工具
- React DevTools - 组件调试
- Chrome DevTools - 性能分析
- Vite DevTools - 构建分析

### 常用调试方法
```javascript
// 状态调试
console.log('transform:', transform);

// 性能分析
console.time('render');
// ... 代码
console.timeEnd('render');

// 错误边界
try {
  // ... 代码
} catch (error) {
  console.error('Error:', error);
}
```

## 部署

### 静态部署
1. 运行 `npm run build`
2. 将 `dist/` 目录部署到静态服务器
3. 支持的平台：
   - Netlify
   - Vercel
   - GitHub Pages
   - Cloudflare Pages

### 环境变量
在 `.env` 文件中配置：
```
VITE_APP_TITLE=YourHair
VITE_API_URL=https://api.example.com
```

## 维护指南

### 定期维护
1. 更新依赖包
2. 修复安全漏洞
3. 优化性能
4. 更新文档

### 版本管理
- 遵循语义化版本（Semantic Versioning）
- 主版本.次版本.修订版本
- 更新 CHANGELOG.md

### 问题追踪
- 使用 GitHub Issues
- 标记优先级和类型
- 及时响应和修复

---

**文档版本**: v2.0.0  
**最后更新**: 2024-12-08
