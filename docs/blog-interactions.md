# 博客留言与全站访问统计

2026-10-19 接入方案：giscus 博客评论、Cloudflare Web Analytics 全站访问统计。评论出现在中英文文章底部，同一文章的两种语言共用讨论；访问统计覆盖网站的中英文栏目。

当前启用状态以 `_config.yml` 为准。外部服务尚未配置完成时，开关保持关闭；缺少必要配置时不输出留言区或统计脚本。完成代码接入不等于已经收到真实留言或统计数据。

## 留言

1. 用仓库管理账号在 `h-jp/h-jp.github.io` 的 Settings → General → Features 开启 Discussions。
2. 从 [giscus GitHub App](https://github.com/apps/giscus) 安装，只选择 `h-jp/h-jp.github.io`。权限为读取仓库元数据、读写 Discussions。
3. 在 [giscus 配置页](https://giscus.app/zh-CN) 填入仓库，选择 Announcements（公告类型）分类，取得真实的仓库 ID 与分类 ID。
4. 填写 `_config.yml` 的 `comments.giscus`，随后将 `comments.enabled` 设为 `true`。不要使用示例或其他仓库的 ID。

留言由 `_layouts/single.html` → `_includes/academic/post-comments.html` 接入，位于文章正文和文章导航之后。使用严格的特定字符串映射，评论输入框位于评论列表上方，采用浅色主题，并懒加载 iframe。去掉额外的“Join the discussion／留言与交流”标题及说明，关闭针对整篇文章的 reactions，只显示评论组件。组件提供 Markdown 输入、Write / Preview（撰写／预览）和对已有评论的回复；中英文均可使用，界面语言随文章切换。加载失败时保留 GitHub 讨论入口。

每篇文章的 front matter 使用固定 `comment_id`，例如：

```yaml
comment_id: blog/2026-10-17-shared-vision-and-long-term-thinking
```

中英文配对必须相同，不同文章必须不同。修改标题、URL 或文件名时保留原 ID。新文章配对均加入此字段。单篇关闭留言可设置 `comments: false`；全局关闭使用 `comments.enabled: false`，已有讨论仍保存在 GitHub。

读者无需登录即可阅读，发表评论或回复需要 GitHub 授权。第一条评论会由 giscus 自动建立对应讨论；初次打开时尚无讨论是正常状态。管理员在仓库 Discussions 中管理留言。不得为了测试功能代用户发送公开留言。

## 访问统计

1. 在 [Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics) 中添加 `h-jp.github.io`。
2. 选择手动插入 JavaScript，将生成代码中 `data-cf-beacon` 的 `token` 填入 `_config.yml` 的 `analytics.cloudflare.token`，保持 hostname 为 `h-jp.github.io`。
3. 将 `analytics.enabled` 设为 `true`。只需公开的 beacon token，**不要填写 Cloudflare API token、密码或其他凭证**。无需迁移 GitHub Pages 或修改 DNS。
4. 发布后通过真实网站页面访问验证，稍后到后台按 Path 查看页面流量。

统计范围是使用当前网站布局的全部中英文页面，包括首页、动态、研究、项目、论文、教学、学生、博客与关于等栏目。单页可设 `analytics: false`。仅生产构建输出加载器，且浏览器必须实际位于 `https://h-jp.github.io`；本地预览、测试域名与关闭的中文页面均不计数。历史跳转页不重复计数。全局关闭使用 `analytics.enabled: false`。

本方案在 Cloudflare 管理后台查看统计，不提供公开的累计阅读数。数据从启用后累积，不补造历史访问；浏览次数不等于独立读者人数。中英文访问按实际路径分别统计，必要时在后台汇总。

### 统计仪表盘

登录 [Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics)，选择 `h-jp.github.io`。后台由账号权限保护，无需在公开网站上放置管理入口。右上角选择时间范围，使用 Add filter 按 Path、Country、Referer、Device type 等条件查看。

| 关注的问题 | 仪表盘指标或入口 |
| --- | --- |
| 页面被阅读多少次、趋势怎样 | Page views，结合时间曲线 |
| 有多少次外部或直接访问进入网站 | Visits；一次进入可以产生多次页面浏览，不等同于去重人数 |
| 哪篇文章或哪个栏目受欢迎 | Path 页面排行或筛选；中英文路径分别列出 |
| 访问从哪里来 | Referer 来源、Country 国家或地区 |
| 读者使用什么设备 | Device type、Browser、Operating system |
| 页面是否加载慢、操作是否卡顿 | Page load time、Core Web Vitals（LCP、INP、CLS） |
| 评论与回复 | [GitHub Discussions](https://github.com/h-jp/h-jp.github.io/discussions) |
| 最新发布是否成功 | [GitHub Pages 构建记录](https://github.com/h-jp/h-jp.github.io/actions) |

Visits 和 Page views 的口径见 [Cloudflare 指标说明](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/)，筛选项见 [Dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)。这些数据用于观察访问与性能趋势；不能据此识别读者身份，也不代表已经测量阅读完成率、停留时长或所有链接点击。刚启用时也会包含管理员正常访问及人工验收访问，应结合时间范围解读。博客之外的栏目从本次扩展上线后开始积累数据。

## 构建与验收

使用项目已有 Ruby / Bundler 环境：

```bash
JEKYLL_ENV=production bundle exec jekyll build --safe --trace
JEKYLL_ENV=production bundle exec ruby scripts/verify_site.rb
git diff --check
```

检查覆盖全站链接、双语配对、讨论 ID 一致性、留言与统计的范围、单篇关闭、语言关闭状态、生产域名保护。服务启用后还需在浏览器检查桌面与手机的真实留言 iframe；统计需在 Cloudflare 后台确认数据到达。

`_includes/academic/utility.html` 根据实际配置同步生成中英文隐私与使用说明。旧模板保留的 GoatCounter / Staticman 等源码不属于当前接入方案，不应同时启用。
