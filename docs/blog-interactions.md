# Blog interactions: giscus + GoatCounter

本仓库为博客文章集成了三类静态站点友好的交互能力：

- 评论：giscus
- 点赞 / reactions：giscus reactions
- 阅读量：GoatCounter

实现原则：不自建点赞数据库，不扩展 Cloudflare Worker，不修改已有文章内容，不改变已有 permalink。当前配置在 `repo_id`、`category_id`、`code` 仍为占位符时会静默跳过外部脚本，避免本地或线上页面报错。

## 1. 开启 GitHub Discussions

1. 打开仓库 `h-jp/h-jp.github.io` 的 GitHub 页面。
2. 进入 `Settings` -> `General`。
3. 找到 `Features`。
4. 勾选 `Discussions`。
5. 进入仓库顶部的 `Discussions` 标签页，确认已有 `General` 分类；如果没有，创建一个 `General` 分类。

## 2. 安装或启用 giscus

1. 打开 <https://github.com/apps/giscus>。
2. 点击 `Install` 或 `Configure`。
3. 选择只安装到 `h-jp/h-jp.github.io` 仓库。
4. 确认仓库是 public，且 Discussions 已开启。

## 3. 获取 repo_id 和 category_id

1. 打开 <https://giscus.app>。
2. 在 `Repository` 中填写：

   ```text
   h-jp/h-jp.github.io
   ```

3. 在页面配置项中选择：

   ```text
   Page <-> Discussion Mapping: pathname
   Discussion Category: General
   Enable reactions: yes
   ```

4. 页面底部会生成一段 `<script>`。从里面复制：

   ```html
   data-repo-id="..."
   data-category-id="..."
   ```

5. 不要手写或猜测这两个值。

## 4. 填写 _config.yml

把 `_config.yml` 中的占位字段替换为 giscus 生成值：

```yaml
comments:
  provider: giscus
  enabled: true
  giscus:
    repo: "h-jp/h-jp.github.io"
    repo_id: "REPLACE_WITH_GISCUS_REPO_ID"
    category: "General"
    category_id: "REPLACE_WITH_GISCUS_CATEGORY_ID"
    mapping: "pathname"
    strict: "0"
    reactions_enabled: "1"
    emit_metadata: "0"
    input_position: "bottom"
    theme: "light"
    lang: "zh-CN"
    loading: "lazy"
```

如果 `repo_id` 或 `category_id` 仍是 `REPLACE_WITH...`，页面不会加载 giscus script。

## 5. 关闭某篇文章评论

在某篇博客文章的 front matter 中加入：

```yaml
comments: false
```

只影响该文章。不要为了关闭评论修改 layout 或全局配置。

## 6. 注册 GoatCounter

1. 打开 <https://www.goatcounter.com>。
2. 注册并创建一个站点。
3. 选择一个 site code。例如统计地址为：

   ```text
   https://example.goatcounter.com
   ```

   则 code 通常是：

   ```text
   example
   ```

## 7. 填写 GoatCounter code

把 `_config.yml` 中的占位字段替换为 GoatCounter code：

```yaml
analytics:
  provider: goatcounter
  goatcounter:
    enabled: true
    code: "REPLACE_WITH_GOATCOUNTER_CODE"

post_views:
  enabled: true
  provider: goatcounter
```

如果 `code` 仍是 `REPLACE_WITH_GOATCOUNTER_CODE`，页面不会加载 GoatCounter tracking script，也不会请求阅读量 JSON。

## 8. 开启 GoatCounter visitor counts

GoatCounter 默认可能不允许网站公开显示 visitor counts。要显示文章阅读量，需要在 GoatCounter 后台开启公开计数：

1. 登录 GoatCounter。
2. 进入站点设置。
3. 找到 visitor counter / visitor counts 相关选项。
4. 开启 `Allow adding visitor counts on your website`。
5. 保存设置。

本仓库已经集成 tracking script，并在博客文章标题下方预留 `Views` 显示位置。若 GoatCounter 未配置、visitor counts 未开启、或该路径还没有统计数据，前端会显示 `Views: unavailable`。

参考：<https://www.goatcounter.com/help/visitor-counter>

## 9. 本地测试

运行：

```bash
bundle exec jekyll serve
```

然后打开本地地址，例如：

```text
http://127.0.0.1:4000/
```

检查：

- 首页正常显示，且不出现评论区。
- 博客列表正常显示，且不出现评论区。
- 博客文章正常显示文章内容、meta 信息和底部评论插入位置。
- `repo_id` / `category_id` 未填写时，不加载 giscus script，不报错。
- `code` 未填写时，不加载 GoatCounter script，不报错。
- 给某篇文章设置 `comments: false` 后，该文章不显示 giscus 评论区。

注意：giscus 和 GoatCounter 的真实线上行为依赖 GitHub Discussions、giscus app 和 GoatCounter 后台配置；本地测试主要验证页面结构、Jekyll 构建、脚本占位保护和浏览器控制台错误。

## 10. 提交并部署到 GitHub Pages

1. 确认本地构建通过：

   ```bash
   bundle exec jekyll build
   ```

2. 查看变更：

   ```bash
   git status
   git diff
   ```

3. 提交：

   ```bash
   git add _config.yml _includes _layouts _sass assets/js docs/blog-interactions.md
   git commit -m "Add blog comments reactions and views"
   ```

4. 推送分支并创建 Pull Request：

   ```bash
   git push -u origin feature/blog-interactions-giscus-goatcounter
   ```

5. 合并后由 GitHub Pages 自动部署。
