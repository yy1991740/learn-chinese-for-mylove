# Learn Chinese with Love - 印尼语-中文学习与翻译工具

这是一个专为印尼语-中文学习设计的综合平台，包含粉色卡通风格的学习网站和强大的翻译功能，让中文学习变得简单有趣！

## 项目组成

### 1. 中文学习网站
专为印尼女友设计的中文学习网站，采用粉色卡通风格，提供丰富的学习资源和互动功能。

### 2. 中文-印尼语互译系统
基于API的翻译功能，支持中文和印尼语之间的准确互译，配备专业的拼音生成系统。

## 功能特点

- **粉色卡通风格**：温馨可爱的界面设计，让学习更加愉悦
- **双语切换**：支持中文-印尼语双语显示
- **词语和句子学习**：包含常用中文词语和实用句子
- **音频发音**：每个词汇和句子都配有高质量音频，优化的发音功能帮助学习正确发音
- **便利贴展示**：内容以便利贴形式展示，增添趣味性
- **自定义添加**：可以添加自己的词语和句子
- **实时拼音生成**：集成专业拼音库，准确生成中文拼音（含声调）
- **智能翻译功能**：支持中文-印尼语互译，带本地词典加速和缓存优化
- **防抖处理**：输入时进行防抖优化，提升用户体验

## 技术栈

- HTML5
- Tailwind CSS v3
- JavaScript
- Font Awesome 图标
- Google Fonts（Bubblegum Sans 和 Ma Shan Zheng）
- pinyin-pro：专业中文拼音转换库
- 翻译API集成（支持多语言互译）

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
/learn Chinese for my lover/
├── .github/workflows/gh-pages.yml  # GitHub Pages自动部署配置
├── .gitignore        # Git忽略文件配置
├── README.md         # 项目说明
├── api/              # API服务相关文件
│   └── translate.js  # 翻译API实现
├── utils/            # 工具库
│   └── pinyin-pro.js # 专业中文拼音转换库
├── index.html        # 主页面
├── script.js         # JavaScript核心功能
└── style.css         # 自定义样式
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

## 拼音功能说明

本项目集成了专业的中文拼音转换库（pinyin-pro），可以：

- 准确生成单个汉字和词语的拼音
- 自动添加正确的声调标注
- 支持多音字处理
- 提供高性能的拼音转换服务

拼音库位于`utils/pinyin-pro.js`，通过CDN或本地引入使用。

## 翻译功能说明

项目支持中文-印尼语之间的智能翻译：

- 集成外部翻译API，确保翻译质量
- 内置常用词汇本地词典，提高响应速度
- 实现翻译结果缓存，优化性能
- 支持词语和句子级别的翻译

翻译API实现位于`api/translate.js`，包含完整的请求处理和错误管理逻辑。

## 许可证

本项目仅供个人学习和使用。

## 致谢

- 感谢 Tailwind CSS 提供的优秀 CSS 框架
- 感谢 Google Fonts 和 Font Awesome 提供的字体和图标资源
- 感谢 LibreTranslate 提供的开源翻译技术
- 特别感谢我的印尼女友，这个项目是为你而做的 ❤️
