# Learn Chinese with Love - 印尼语-中文学习与翻译工具

这是一个专为印尼语-中文学习设计的综合平台，包含粉色卡通风格的学习网站和强大的翻译工具，让中文学习变得简单有趣！

## 项目组成

### 1. 中文学习网站
专为印尼女友设计的中文学习网站，采用粉色卡通风格。

### 2. LibreTranslate翻译工具
基于LibreTranslate的翻译工具，支持英语、中文和印尼语之间的互译。

## 功能特点

- **粉色卡通风格**：温馨可爱的界面设计，让学习更加愉悦
- **双语切换**：支持中文-印尼语双语显示
- **词语和句子学习**：包含常用中文词语和实用句子
- **音频发音**：每个词汇和句子都配有高质量音频，优化的发音功能帮助学习正确发音
- **便利贴展示**：内容以便利贴形式展示，增添趣味性
- **自定义添加**：可以添加自己的词语和句子

## 技术栈

- HTML5
- Tailwind CSS v3
- JavaScript
- Font Awesome 图标
- Google Fonts（Bubblegum Sans 和 Ma Shan Zheng）

## 如何使用

1. 克隆或下载本项目到本地
2. 打开 `index.html` 文件即可开始使用
3. 点击音频按钮可以听到中文发音
4. 点击「Add More Words」或「Add More Sentences」可以添加自定义内容
5. 使用语言切换按钮可以切换显示语言

## 本地开发

如需在本地启动服务器进行开发，可以使用以下方法：

### 使用 Python

```bash
# Python 2.x
python -m SimpleHTTPServer 8000

# Python 3.x
python -m http.server 8000
```

然后在浏览器中访问 `http://localhost:8000`

### 使用 Node.js

```bash
# 安装 http-server
npm install -g http-server

# 启动服务器
http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000`

## 项目结构

```
/learn Chinese for indonesian/
├── .github/workflows/gh-pages.yml  # GitHub Pages自动部署配置
├── .gitignore        # Git忽略文件配置
├── index.html        # 主页面
├── style.css         # 自定义样式
├── script.js         # JavaScript 功能
└── README.md         # 项目说明
```

## GitHub部署指南

### 1. 在GitHub上创建新仓库

1. 访问 [GitHub](https://github.com) 并登录您的账户
2. 点击右上角的 "+" 图标，选择 "New repository"
3. 输入仓库名称（建议使用 `chinese-indonesian-learning`）
4. 添加可选的描述
5. 选择公开仓库（Public）
6. **不要**勾选 "Initialize this repository with a README"
7. 点击 "Create repository"

### 2. 将本地仓库关联到GitHub

在仓库创建成功后，复制提供的远程仓库URL，然后在本地项目目录中执行以下命令：

```bash
# 替换为您的GitHub仓库URL
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 推送代码到GitHub
git push -u origin master
```

### 3. 启用GitHub Pages

1. 在GitHub仓库页面，点击 "Settings"
2. 点击左侧菜单中的 "Pages"
3. 在 "Source" 部分，从下拉菜单中选择 "GitHub Actions"
4. GitHub Actions将自动运行，部署您的网站

### 4. 访问您的网站

部署完成后，您的网站将可以在以下地址访问：
```
https://您的用户名.github.io/您的仓库名/
```

### 5. 自动部署说明

本项目已配置了GitHub Actions工作流，位于 `.github/workflows/gh-pages.yml`，它会在您推送到 `main` 或 `master` 分支时自动构建并部署您的网站到GitHub Pages。

部署完成后，您可以在GitHub仓库的 "Actions" 标签页中查看部署状态。

## 注意事项

- 优化的音频功能使用浏览器的 Web Speech API 实现，提供更清晰、更准确的中文发音，使用时请确保使用现代浏览器
- 添加的自定义内容仅保存在当前会话中，刷新页面后会丢失
- 如需实际部署使用，建议添加后端存储功能来保存用户数据

## 未来改进计划

- 添加用户账户系统，保存学习进度
- 实现更多互动学习功能，如测验、游戏等
- 增加更多学习内容和分类
- 添加学习统计和进度跟踪
- 优化移动端体验

## 翻译工具使用指南

### 功能特点

- 支持英语、中文和印尼语之间的互译
- 提供两种使用模式：公共API和本地部署
- 命令行接口，支持直接翻译和批量操作
- API密钥管理功能
- 连接状态检测和错误处理

### 使用方法

#### 1. 使用公共API

```bash
# 设置API密钥
python translate_api.py --set-key 你的API密钥

# 直接翻译文本
python translate_api.py 'Hello world' en zh
```

#### 2. 使用本地部署（推荐）

请参考translate_api.py中的部署指南获取详细说明。

### 支持的语言代码

- 英语: `en`
- 中文: `zh`
- 印尼语: `id`

## 许可证

本项目仅供个人学习和使用。

## 致谢

- 感谢 Tailwind CSS 提供的优秀 CSS 框架
- 感谢 Google Fonts 和 Font Awesome 提供的字体和图标资源
- 感谢 LibreTranslate 提供的开源翻译技术
- 特别感谢我的印尼女友，这个项目是为你而做的 ❤️