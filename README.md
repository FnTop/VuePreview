# VuePreview 项目说明

## 项目简介

（此处可补充项目的基本介绍、功能亮点、技术栈等信息）

---

# 多远程仓库配置

## 配置说明

您的项目现在已配置为同时支持 GitHub 和 Gitee 两个远程仓库：

- **GitHub**: `origin` - https://github.com/FnTop/VuePreview.git
- **Gitee**: `gitee` - https://gitee.com/FnTop/vue-preview.git

## 使用方法

### 1. 查看远程仓库
```bash
git remote -v
```

### 2. 推送代码

#### 方法一：使用 npm 脚本（推荐）
```bash
# 同时推送到两个平台
npm run push:all

# 只推送到 GitHub
npm run push:github

# 只推送到 Gitee
npm run push:gitee
```

#### 方法二：使用脚本文件
```bash
# Linux/Mac
./push-all.sh

# Windows
push-all.bat
```

#### 方法三：手动推送
```bash
# 推送到 GitHub
git push origin master

# 推送到 Gitee
git push gitee master
```

### 3. 拉取代码
```bash
# 从 GitHub 拉取
git pull origin master

# 从 Gitee 拉取
git pull gitee master
```

### 4. 添加远程仓库（如果需要重新配置）
```bash
# 添加 GitHub 远程仓库
git remote add origin https://github.com/FnTop/VuePreview.git

# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/FnTop/vue-preview.git
```

## 注意事项

1. **分支同步**: 确保两个远程仓库的分支保持同步
2. **权限设置**: 确保您有两个仓库的推送权限
3. **网络问题**: 如果某个平台网络访问较慢，可以分别推送
4. **冲突处理**: 如果两个仓库有不同步的提交，需要先解决冲突

## 常见问题

### Q: 推送失败怎么办？
A: 检查网络连接和仓库权限，可以尝试分别推送：
```bash
git push origin master
git push gitee master
```

### Q: 如何切换默认远程仓库？
A: 修改 `.git/config` 文件中的 `[branch "master"]` 部分：
```ini
[branch "master"]
    remote = origin  # 或 gitee
    merge = refs/heads/master
```

### Q: 如何删除远程仓库？
A: 使用以下命令：
```bash
git remote remove origin
git remote remove gitee
```

## 自动化建议

1. **Git Hooks**: 可以设置 pre-push hook 自动推送到两个平台
2. **CI/CD**: 在 GitHub Actions 或 Gitee Go 中配置自动同步
3. **定时同步**: 使用 cron 任务定期同步两个仓库

## 相关链接

- [GitHub 仓库](https://github.com/FnTop/VuePreview)
- [Gitee 仓库](https://gitee.com/FnTop/vue-preview) 