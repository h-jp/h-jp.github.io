# Jiangping Huang · 黄江平

最近定稿版本：**v1.1（2026-10-14）**。站点：[h-jp.github.io](https://h-jp.github.io/)。由 `main` 分支发布后续内容更新，`v1.1` 标签保留该定稿快照，`v1.0` 标签保留上一正式版本。

基于 Jekyll 的中英文个人学术主页。默认显示英文，根地址 `/` 为英文首页；语言入口只显示目标语言：英文页显示 `ZH`，中文页显示 `EN`。完整中文源码保留。当前以 `chinese_blog_enabled: true` 单独开放中文博客及其列表、归档；其余中文页面显示“正在建设中，敬请期待。”。将 `_config.yml` 的 `chinese_enabled` 改为 `true` 并重新构建即可开放全部中文页面。

导航：Home · News · Research · Projects · Publications · Teaching · Students · Blog · About。

2026-10-13 已确认整体架构与布局；2026-10-14 完成中英文文案、联系说明及正文排版修订，定稿为 v1.1，作为后续维护基线。后续内容更新保持中英文同步，继续遵循既定公开范围与项目脱敏要求。

## 本地预览

```bash
bash scripts/preview.sh
```

打开 `http://127.0.0.1:4000/` 或 `http://127.0.0.1:4000/zh/`。脚本优先使用本机已有的 Ruby 3.3.6，检查锁定依赖后启动 Jekyll；不安装或升级依赖。可通过 `HJP_PREVIEW_PORT` 指定其他端口。按 Ctrl+C 停止服务。

## 构建与检查

在配置好 Ruby 与 Bundler 的终端运行：

```bash
bundle exec jekyll build --safe --trace
bundle exec ruby scripts/verify_site.rb
git diff --check
```

检查涵盖生成页面、语言配对、内部链接、代表论文、项目脱敏、课程介绍及公开信息范围。浏览器响应式和交互验证需要另行进行。

## 内容维护

入口与数据结构见 [维护说明](docs/site-maintenance.md)。博客原有 URL 和保留的历史别名继续可用；CV、Contact 及 `/resume` 已停止生成。个人信息组件只保留姓名、Email、研究组和 Weibo。

Students 紧接 Teaching，分为本科生、硕士生及科研机会与招生三个部分。学生成果在 `_data/students.yml` 按学位和成果类别维护，共 25 条记录。创新创业训练计划和优秀本科毕业论文各显示最近 3 项，其余通过各栏 More 进入 `/students/archive/`；主页面显示 13 条，归档显示 12 条，培养和招生说明完整展示。Teaching 专注课程教学。

首页照片使用 WebP 响应式资源和 JPEG 后备图，标签图标使用同一照片生成的 64 像素小图。原图 `images/bio-photo-new.jpg` 作为母版保留；更换照片后运行 `bash scripts/optimize-portrait.sh` 重新生成显示资源，详见维护说明。

博客在 `_data/blog.yml` 配置置顶、最新标记和展示数量，默认五篇；其余文章从 More 进入归档。Teaching 显示近期三门课，以往四门进入归档，各课程均有独立主页入口。News、Projects、Publications、Teaching、Blog 的底部采用左对齐说明与右侧 More，说明中明确引导点击右侧入口。
