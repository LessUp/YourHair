# Virtual Hair Salon (YourHair)

一个基于 **React + Vite** 的虚拟发型设计应用，你可以在浏览器中尝试不同发型、颜色与样式，辅助沟通理发需求或进行创意设计。

An online **Virtual Hair Salon** built with React + Vite, allowing users to preview different hairstyles and colors directly in the browser.

---

## 特性 Features

- 支持虚拟发型预览
- 多种发色 / 风格组合
- 现代化单页应用体验
- 基于 React 18 与 Vite 构建，开发体验流畅

---

## 技术栈 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling / UI**: Tailwind CSS（以及其他自定义样式方案）
- **Icons & Utils**: lucide-react, clsx, tailwind-merge, html-to-image 等

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
