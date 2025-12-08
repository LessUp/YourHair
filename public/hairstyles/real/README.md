# 真实发型资源目录

此目录用于存放真实的发型图片资源。

## 图片要求

### 格式要求
- **格式**: PNG（必须支持透明背景）
- **分辨率**: 建议 800x1000 像素以上
- **背景**: 必须是透明背景
- **内容**: 只包含发型部分，不要包含脸部

### 命名规范
```
[长度]-[样式]-[颜色].png

示例:
- short-bob-black.png      # 黑色波波头
- long-straight-brown.png  # 棕色长直发
- medium-wavy-blonde.png   # 金色中长波浪
```

### 缩略图
- 放置在 `thumbs/` 子目录
- 格式: JPG 或 PNG
- 尺寸: 200x200 像素
- 命名与主图相同

## 目录结构

```
real/
├── README.md
├── thumbs/                    # 缩略图目录
│   ├── short-bob-black.jpg
│   ├── long-straight-brown.jpg
│   └── ...
├── short-bob-black.png        # 短发
├── short-pixie-brown.png
├── medium-wavy-brown.png      # 中长发
├── medium-straight-black.png
├── long-straight-black.png    # 长发
├── long-curly-brown.png
├── male-short-classic.png     # 男士发型
├── male-undercut.png
└── colorful-rainbow.png       # 个性发型
```

## 如何添加新发型

1. **准备图片**
   - 使用 Photoshop 或在线工具去除背景
   - 确保边缘平滑，无白边
   - 保存为 PNG 格式

2. **创建缩略图**
   - 缩放到 200x200 像素
   - 保存到 `thumbs/` 目录

3. **更新配置**
   - 编辑 `src/lib/realHairstyles.js`
   - 添加新发型的配置信息

## 推荐资源

### 免费资源
- Freepik: https://www.freepik.com/
- Pngtree: https://pngtree.com/
- Remove.bg: https://www.remove.bg/ (去背景工具)

### AI 生成
- Stable Diffusion
- Midjourney
- DALL-E

### 提示词模板
```
professional [发型类型] hairstyle, transparent background,
ultra high quality, detailed hair texture, natural hair color,
studio lighting, front view, isolated on transparent background,
8k resolution, photorealistic
```

## 注意事项

1. **版权问题**
   - 确保有权使用图片
   - 商业使用需购买版权
   - 个人学习可使用免费资源

2. **图片质量**
   - 高清晰度
   - 边缘平滑
   - 透明背景干净
   - 保留发丝细节

3. **AI 融合效果**
   - 发型图片质量直接影响融合效果
   - 建议使用专业抠图的发型素材
   - 保留自然的阴影和高光

## 示例配置

```javascript
// src/lib/realHairstyles.js
{
  id: 'real-short-bob-black',
  name: '经典黑色波波头',
  src: '/hairstyles/real/short-bob-black.png',
  thumbnail: '/hairstyles/real/thumbs/short-bob-black.jpg',
  category: ['short'],
  color: 'black',
  gender: 'female',
  tags: ['波波头', '短发', '黑色', '经典'],
  description: '经典的黑色波波头',
  popularity: 95,
}
```

## 联系方式

如有问题，请在 GitHub 提交 Issue。
