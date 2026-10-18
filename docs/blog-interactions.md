# 博客留言与访问统计

2026-10-19 接入方案：giscus 留言与回应、Cloudflare Web Analytics 访问统计。只应用于博客，中英文文章共用讨论，其他栏目保持原样。

当前启用状态以 `_config.yml` 为准。外部服务尚未配置完成时，开关保持关闭；缺少必要配置时不输出留言区或统计脚本。完成代码接入不等于已经收到真实留言或统计数据。

## 留言

1. 用仓库管理账号在 `h-jp/h-jp.github.io` 的 Settings → General → Features 开启 Discussions。
2. 从 [giscus GitHub App](https://github.com/apps/giscus) 安装，只选择 `h-jp/h-jp.github.io`。权限为读取仓库元数据、读写 Discussions。
3. 在 [giscus 配置页](https://giscus.app/zh-CN) 填入仓库，选择 Announcements（公告类型）分类，取得真实的仓库 ID 与分类 ID。
4. 填写 `_config.yml` 的 `comments.giscus`，随后将 `comments.enabled` 设为 `true`。不要使用示例或其他仓库的 ID。

留言由 `_layouts/single.html` → `_includes/academic/post-comments.html` 接入，正文末尾显示。使用严格的特定字符串映射，评论框置顶、开启回应、采用浅色主题，并懒加载 iframe。语言随文章切换；加载失败时保留 GitHub 讨论入口。

每篇文章的 front matter 使用固定 `comment_id`，例如：

```yaml
comment_id: blog/2026-10-17-shared-vision-and-long-term-thinking
```

中英文配对必须相同，不同文章必须不同。修改标题、URL 或文件名时保留原 ID。新文章配对均加入此字段。单篇关闭留言可设置 `comments: false`；全局关闭使用 `comments.enabled: false`，已有讨论仍保存在 GitHub。

读者无需登录即可阅读，留言或回应需要 GitHub 授权。第一条留言或回应会由 giscus 自动建立对应讨论；初次打开时尚无讨论是正常状态。管理员在仓库 Discussions 中管理留言。不得为了测试功能代用户发送公开留言。

## 访问统计

1. 在 [Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics) 中添加 `h-jp.github.io`。
2. 选择手动插入 JavaScript，将生成代码中 `data-cf-beacon` 的 `token` 填入 `_config.yml` 的 `analytics.cloudflare.token`，保持 hostname 为 `h-jp.github.io`。
3. 将 `analytics.enabled` 设为 `true`。只需公开的 beacon token，**不要填写 Cloudflare API token、密码或其他凭证**。无需迁移 GitHub Pages 或修改 DNS。
4. 发布后通过真实博客页面访问验证，稍后到后台按 Path 查看文章流量。

统计范围是 `section: blog` 的列表、归档与文章。单篇可设 `analytics: false`。仅生产构建输出加载器，且浏览器必须实际位于 `https://h-jp.github.io`；本地预览、测试域名与关闭的中文页面均不计数。全局关闭使用 `analytics.enabled: false`。

本方案在 Cloudflare 管理后台查看统计，不提供公开的累计阅读数。数据从启用后累积，不补造历史访问；浏览次数不等于独立读者人数。中英文访问按实际路径分别统计，必要时在后台汇总。

## 构建与验收

使用项目已有 Ruby / Bundler 环境：

```bash
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
JEKYLL_ENV=production bundle exec ruby scripts/verify_site.rb
git diff --check
```

检查覆盖全站链接、双语配对、讨论 ID 一致性、留言与统计的范围、单篇关闭、语言关闭状态、生产域名保护。服务启用后还需在浏览器检查桌面与手机的真实留言 iframe；统计需在 Cloudflare 后台确认数据到达。

`_includes/academic/utility.html` 根据实际配置同步生成中英文隐私与使用说明。旧模板保留的 GoatCounter / Staticman 等源码不属于当前接入方案，不应同时启用。
