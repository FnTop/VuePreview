# VuePreview 项目说明

## 项目简介

VuePreview 是一个基于 Vue3 + Vite 的在线代码预览与演示平台，支持多种前端代码片段的实时渲染和预览。主要功能包括：

- 支持 Vue 单文件组件（.vue）、HTML、JavaScript、CSS 等多种代码格式的在线编辑与预览
- 实时渲染和热更新，所见即所得
- 代码高亮与格式化，提升代码可读性
- 支持多远程仓库同步，便于团队协作与备份
- 可扩展的插件机制，方便集成更多功能
- 简洁美观的 UI 设计，良好的用户体验

---

# GitHub Pages 发布与自动化

## 新增 npm 工具

本项目集成了 GitHub Pages 自动化部署工具，使用 `gh-pages` npm 包实现一键发布静态站点到 GitHub Pages。

### 安装依赖

```bash
npm install gh-pages --save-dev
```

### package.json 脚本配置示例

```json
"scripts": {
  "build": "vite build",
  "deploy": "npm run build && gh-pages -d dist"
}
```

- `build`：构建生产环境静态文件
- `deploy`：构建并自动发布到 gh-pages 分支

### 发布流程

1. 确保已配置好 `homepage` 字段（如有需要）到你的 `package.json`，例如：
   ```json
   "homepage": "https://你的github用户名.github.io/你的仓库名/"
   ```
2. 执行以下命令：
   ```bash
   npm run deploy
   ```
3. 首次发布后，进入 GitHub 仓库的 Settings > Pages，选择 gh-pages 分支作为发布源。
4. 稍等片刻，即可通过 `https://你的github用户名.github.io/你的仓库名/` 访问你的在线预览站点。

---


### 推送代码

```bash
# 同时推送到两个平台
npm run push:all

# 只推送到 GitHub
npm run push:github

# 只推送到 Gitee
npm run push:gitee
```
