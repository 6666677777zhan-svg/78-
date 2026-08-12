# 斗罗大陆 RPG - GitHub Pages 部署指南

本项目已配置 GitHub Actions 自动部署流程，可自动构建并发布至 GitHub Pages。

## 🚀 如何在 GitHub 上启用 Pages 部署 (GitHub Setup Instructions)

1. **推送代码至 GitHub 仓库**
   将本项目的所有更改提交并推送到你的 GitHub 仓库主分支（`main` 或 `master`）：
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. **配置 GitHub Pages 构建来源**
   - 在 GitHub 打开你的仓库页面。
   - 点击顶部菜单栏的 **Settings**（设置）。
   - 在左侧边栏中找到并点击 **Pages**。
   - 在 **Build and deployment**（构建与部署）下的 **Source**（来源）下拉菜单中，选择 **GitHub Actions**。

3. **自动构建与上线**
   - 设置完成后，每次你向 `main` 或 `master` 分支推送代码，GitHub Actions 会自动触发执行 `.github/workflows/deploy.yml`。
   - 你可以在仓库的 **Actions** 标签页中实时查看构建部署进度。
   - 部署完成后，控制台将提供你的 GitHub Pages 专属访问链接（例如：`https://<your-username>.github.io/<your-repo-name>/`）。

---

## 🛠️ 配置细节说明

- **相对路径支持**: `vite.config.ts` 已配置 `base: './'`，确保无论部署在根域名还是子路径下均可正常加载静态资源。
- **绕过 Jekyll 过滤**: `public/.nojekyll` 与构建阶段自动生成的 `dist/.nojekyll` 可防止 GitHub Pages 忽略以 `_` 开头的文件。
- **单页应用 Routing (SPA Fallback)**: 构建脚本自动将 `index.html` 复制为 `404.html`，防止页面刷新时出现 404 错误。
- **Node 22 环境**: Workflow 使用 Node.js 22、`upload-pages-artifact@v3` 以及 `deploy-pages@v4` 进行自动化部署。
