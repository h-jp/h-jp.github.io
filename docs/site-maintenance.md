# 主页维护说明

2026-10-14 确认 **v1.1 正式定稿版**。Jekyll、GitHub Pages 依赖与既有博客路径保持兼容，发布分支为 `main`，由 GitHub Pages 自动构建；`v1.1` 标签保留本次定稿，`v1.0` 标签保留 2026-10-13 的正式版本。

v1.1 纳入已确认的项目题名脱敏、浏览器标签页图标、国际学生科研邀请与 CCF 目录链接、中英文页面及博客文案修订、Email 联系入口、About 研究组与网站反馈说明，以及自然字距优先的正文对齐和末行控制。后续维护以此版本为基线，正文排版与公开范围继续遵循下文约定。

## 已确认的维护基线

2026-10-13 用户确认：“整体架构和布局就按这样确定，具体内容后续再完善。”原有八项导航、首页区块顺序、内页版式、中英文页面对应关系和手机布局作为架构与布局基线。2026-10-14 在 v1.1 定稿后，按后续要求在 Teaching 右侧新增 Students，形成九项导航；学生培养和招生说明迁至 Students，Teaching 专注课程教学。

后续默认完善各栏目文字、资料和链接，中英文同步更新，沿用当前结构与视觉风格。具体文案仍可继续修订；既定个人信息公开范围、删除项与项目脱敏要求持续适用。结构或版式的进一步调整以用户后续要求为依据。

2026-10-13 按用户要求进行轻量视觉微调：保留白底与现有结构，标题使用墨蓝色 `#1d3543`，链接和主按钮使用低饱和度蓝绿色 `#246c78`，正文及辅助文字使用分层灰蓝色。姓名与主要栏目标题采用 Georgia／宋体类系统字体，正文及条目标题继续使用系统无衬线字体；中文主要标题单独增加少量字距。桌面首页姓名为 50 像素，栏目标题在 24–28 像素间自适应，新闻正文为 15.5 像素，研究与教学简介为 15 像素；手机保留适合窄屏的字号。照片仅增加轻微阴影，尺寸和比例保持不变。字体与颜色集中在 `assets/css/academic.css` 的变量中维护，不新增外部字体请求。

正文对齐按后续要求调整：宽度大于 680 像素时，论文摘要、博客正文、课程介绍、研究说明、较长简介，以及 News 内页正文和 Blog 列表摘要采用两端对齐，末行自然左对齐；英文不自动拆词。正文保持连续段落，普通源码换行由浏览器折叠为空格，不插入强制换行或块级片段来凑末行比例。孤行控制不覆盖段落的对齐方式，且以自然字距为优先。手机窄屏保持自然左对齐。标题按下文均衡换行，导航、日期等紧凑元素保留原有排版。

栏目页的页头分隔线、主体列表及条目分隔线统一使用页面容器的完整宽度（桌面端最大 1100 像素）。News 正文、Research 的 01–03 说明、Research group 正文、Projects、Publications、Blog、Teaching 和 About 不再各自设置较窄的内层宽度。日期、序号仍独立成列，正文右边界与分隔线对齐；独立博客文章和论文详情保留 840 像素阅读宽度。

顶部英文标识按最新要求使用单行 `HOMEPAGE`，中文为“学术主页”，不设副标题，链接回到当前语言的首页。文案在 `_data/labels.yml` 的 `brand_title` 中维护。

首页首屏的 Selected publications 与 Research interests 共用 `primary-link` 按钮样式：蓝绿色背景、白色文字、相同圆角与内边距；中文对应“代表论文／研究方向”同步。窄屏空间不足时自然换行。

首页照片由用户指定的 `images/bio-photo-new.jpg` 生成显示资源，保持原图 1214∶1295 的宽高比，不裁切、不拉伸。宽度大于 980 像素时，照片高 360 像素，宽度约 337.5 像素，左侧文字区与照片上下边缘对齐；平板宽 200 像素，手机宽 104 像素，高度随原比例计算。窄屏姓名字号随视口适当调整，避免英文名字从词中间断行。

母版虽然以 `.jpg` 命名，实际为约 2 MB 的 PNG，原文件保留。首页通过 `<picture>` 提供 320、680、1024 像素宽的 WebP，浏览器根据屏宽和像素密度选择；不支持 WebP 时使用 680 像素 JPEG。`sizes` 与上述 CSS 显示尺寸同步，参见 [MDN 响应式图片属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img#sizes)。当前 WebP 约为 15、43、73 KB。首屏照片使用 `fetchpriority="high"`，不延迟加载；宽高属性预留图片比例。`portrait-picture` 使用 `display: contents`，让原照片继续参与首页网格布局；其中的 `source` 显式设为 `display: none`，避免占用网格单元。

`_data/profile.yml` 的 `portrait` 记录母版，`portrait_variants`、`portrait_display`、`portrait_share`、`portrait_icon` 分别配置 WebP 候选、JPEG 后备图、分享图片和标签图标。两个 favicon 声明均引用同一照片生成的 64×64 PNG，约 9 KB，避免把母版当作图标下载。运行 `bash scripts/optimize-portrait.sh` 可用本机的 cwebp、sips、jpegtran 和 ffmpeg 重新生成资源；生成文件随源码提交，GitHub Pages 构建不依赖这些工具。更换母版尺寸时，同步检查 HTML 宽高、CSS 和 `sizes`。

详情和延伸阅读入口统一使用 `More`，中文版使用“更多”，由 `_data/labels.yml` 的 `more` 字段维护。首页各栏目扩展入口及三条动态采用该文案，链接至当前语言的站内对应内容。代表论文通过标题进入详情，条目底部不再添加重复 More。首页及 News 不直接展示 DOI；DOI 保留在 Publications 和论文详情页。首页的栏目 More 链接另有包含目的地名称的无障碍标签，便于区分。研究方向、项目与课程的标题进入对应栏目锚点，博客标题进入对应文章；研究组名称、返回导航及首页主要研究入口保留其明确名称。

首页 News、Selected publications、Research interests、Ongoing projects、Teaching 和 Blog 的栏目级 More 统一放在标题行右侧，每个栏目只保留一个此类入口。论文、研究方向、项目、课程和博客条目直接点击标题，不叠加指向同一条目的 More；News 正文不是链接，其行末 More 是唯一详情入口，因此保留。About 的单个 More 放在简介段落末尾，紧随正文；中文“更多”同步处理，文字和箭头作为整体换行。多行标题使用连续的块级点击区域。

首页的两组并排栏目按实际文字量保持视觉均衡：研究方向使用 `_data/profile.yml` 的完整 `description`，精选课程使用 `_data/courses.yml` 的完整 `description`，不再截取第一句。项目与博客保留各自的一至两句介绍；通过正文信息量缩小左右高度差，不设置固定高度、截断文字或拉大间距。后续调整内容时，同时检查 Research interests／Ongoing projects 和 Teaching／Blog 的中英文桌面与平板显示；手机端自然纵向排列。

## 末行与换行控制

正文多行段落以末行可见文字长度不低于上一行的 65% 为目标，英文末行避免只剩一个单词。2026-10-14 用户确认自然字距优先，65% 是目标，短段落允许例外；不得为满足比例而强行拉开上一行。短标题也进行均衡换行。极窄屏下若标题末尾两个词仍放不下，适度缩小该标题字号，并保持大于正文字号。单行文字不补字、不拉伸，诗词保留原有分行，每句使用 `.verse-line` 单独处理自然折行。

`academic.css` 提供自然换行与标题均衡换行，`academic.js` 在实际字体和宽度下测量行框。两端对齐段落仅在字距允许时尝试保留末尾词组或原生均衡换行；若造成明显词间空隙，就恢复自然换行，接受较短的末行。字距判断同时限制最大空格宽度与过大空格的总量，中文还检查非末行的自然文字密度。整段始终保持一个连续文本流，不再把末尾五行拆成块级片段。窗口尺寸或字体变化后重新计算，不改正文、链接地址与语义标签，也不使用固定 `<br>` 匹配某个屏宽。不支持所需浏览器功能时保留正常文本流。

验证时测量浏览器渲染后的文字行，不能只检查 CSS 属性。除记录末行比例及自然字距优先的例外外，还要检查实际空格宽度、正文非末行的左右边界对齐、末行自然左对齐、单词孤行、横向溢出、反复缩放后的文本与链接完整性，以及标题、诗词、邮箱和语言入口的实际效果。特别复查两行短段落，避免数字达标却出现大空隙。

## 内容来源

| 内容 | 文件 |
| --- | --- |
| 导航与双语地址 | `_data/navigation.yml` |
| 简介、研究方向、工作经历、个人链接 | `_data/profile.yml` |
| 本科生与硕士生培养、学生成果、招生要求 | `_data/students.yml` |
| 六门已有课程、一门计划开设课程及中英文介绍 | `_data/courses.yml` |
| 两个脱敏在研项目 | `_data/projects.yml` |
| 三条近期动态与四条历史动态 | `_data/news.yml` |
| 界面用语与栏目摘要 | `_data/labels.yml`、`_data/descriptions.yml` |
| 论文原始记录、代表作选择、中文摘要 | `_publications/` |
| 中文论文详情入口 | `_pages/zh/papers/`，通过 `pub_id` 复用论文数据 |
| 八组双语博客 | `_posts/` |
| 博客置顶、最新标记与列表数量 | `_data/blog.yml` |
| 主栏目页面 | `_pages/` 与 `_pages/zh/` |
| 版式与交互 | `_layouts/`、`_includes/academic/`、`assets/css/academic.css`、`assets/js/academic.js` |

代表论文采用 `selected: true` 与 `selected_order`，首页和 Publications 共用同一列表。当前仅 TraceCoder 与 TOSEM 两篇，顺序固定。论文作者、DOI、年份放在各自正式记录中，中文详情不重复维护这些事实。

SemFaith 已于 2026 年 8 月被 PRICAI 2026（CCF C）录用，按用户确认的时间先后排列在科研动态首位，其后依次为 TOSEM 和 TraceCoder。新增双语详情和完整摘要，通过动态中的“More / 更多”链接进入；`selected: false`，不增加代表作数量。录用时间仅精确到月，使用 `accepted_month` 与对应语言的 `acceptance`，不填补具体日期。作者、DOI、卷页信息尚未提供；录用状态的详情页不生成正式引用区块。英文摘要保留用户原文，仅转换 LaTeX 样式并分段，中文对应保留检查器依赖和人工校准限制。会议名称据[官网](https://2026.pricai.org/)，CCF C 与用户资料及[会议征稿通知](https://2026.pricai.org/files/CFP_PRICAI2026_scnu.pdf)一致。

项目题名是已经脱敏的最终文本。中英文第一项各有两处 `[MASK]`，第二项各有三处；保留字面标记，不恢复省略词，不添加能反推省略词的摘要或元信息。

两个在研项目的 `short` 为首页一句简介，`description` 为 Projects 页两句介绍，中英文同步。介绍概括多智能体协作、分析与生成的衔接，以及需求理解与代码生成的一致性；不补回脱敏词，也不添加未提供的成果或量化指标。

## 双语与路径

默认语言为英文。访问根地址 `/` 显示英文首页，页面未单独指定语言时也以英文为默认值。语言入口仅显示可切换的目标语言：英文页为 `ZH`，中文页（含建设中提示页）为 `EN`，不再显示当前语言或分隔符；`zh` 是中文语言代码，HTML 中使用 `zh-CN`。不根据浏览器语言自动跳转。

`_config.yml` 中保留 `chinese_enabled: false`，另以 `chinese_blog_enabled: true` 单独开放中文博客。所有 `section: blog` 的文章、博客列表、归档及分类／标签归档均可正常访问；其他中文栏目、论文、课程地址仍显示“正在建设中，敬请期待。”及返回对应英文页面的链接。只有这些建设中页面不输出正文并设置 `noindex,follow`，已开放的博客保留正文、摘要和双语元信息。将 `chinese_blog_enabled` 改为 `false` 可再次关闭中文博客；后续将 `chinese_enabled` 改为 `true` 可开放全部中文页面。配置修改后须重新构建。两项开关属于静态站点显示配置，不是访问控制或登录后台。

主栏目为 `/`、`/news/`、`/research/`、`/projects/`、`/publications/`、`/teaching/`、`/students/`、`/blogs/`、`/about/`，中文地址分别加 `/zh` 前缀。

每个公开正文页均配置 `lang` 和互相指向的 `translation`。博客保持原有 `-zh` 配对地址；旧论文详情也保留原 URL。语言切换直接进入同一内容，课程等共用锚点通过轻量脚本保留。新增正文时，必须同步建立对应语言页面，不能以跳回首页代替缺失翻译。

博客在标题下方的摘要末尾提供行内语言入口：英文文章显示 `[中文]`，中文文章显示 `[English]`，直接使用本篇的 `translation` 配对地址。关键词行不重复设置入口；当前 `[中文]` 可直接打开对应中文文章，由 `chinese_blog_enabled` 单独控制。

每篇博客在正文结束后、关键词上方分隔线之前靠右显示“上一篇／下一篇”（英文为 `Previous post`／`Next post`）。导航按同一语言文章的发布时间排列：上一篇较早，下一篇较新，不受置顶或列表展示数量影响；最早文章仅有下一篇，最新文章仅有上一篇。悬停提示及无障碍标签包含目标标题，手机端保留右对齐，打印时隐藏导航。逻辑集中于 `_includes/academic/post-navigation.html`，新增文章后自动更新。

`/year-archive/`、`/wordpress/blog-posts/`、`/portfolio/`、`/about.html`、`/markdown/`、`/md/`、`/markdown.html` 等旧地址可用。跳转模板使用相对站点路径，因此本地预览不会意外跳到线上旧版。

CV、Contact、`/resume` 及其对应路径不再生成。历史模板演示页改为简明阅读入口；不再输出示例地址和地图。

Students 分为本科生、硕士生及科研机会与招生三个部分。前两部分承接原 Teaching 中的科研指导、本科生推免与硕士生攻博支持说明；招生部分保留已确认的研究方向、长期科研合作要求、国际学生研究基础与 CCF A/B 类论文经历偏好，以及显示为 `Email` 的联系入口。详细招生流程待用户提供，不自行补充报名条件、名额、截止时间或选拔程序。中文页面遵循现有全站中文开关。

学生成果在 `_data/students.yml` 的 `groups → categories → achievements` 中维护，每个类别按年份倒序排列，模板沿用数据顺序。当前有 25 条记录：3 条本科生竞赛与荣誉记录、1 项大学生科研训练计划项目、8 项大学生创新创业训练计划项目、10 项优秀本科毕业论文、2 篇硕士生参与的论文及 1 项优秀硕士学位论文奖。两类训练计划分设栏目，项目立项与竞赛获奖分别展示。创新创业训练计划与优秀本科毕业论文使用 `preview_limit: 3`，各显示最近 3 项，通过各栏末尾 More 进入 `/students/archive/` 的对应位置；其余类别和招生说明完整展示。主页面合计 13 条，归档合计 12 条，共用成果模板，不重复也不遗漏记录。蓝桥杯两项全国总决赛获奖统一显示 `2024`，并附相应的优秀指导教师信息；原始获奖月份保留在本地来源记录中。

常规记录包含稳定标识 `id`、年份 `year`、双语名称 `title`、学生姓名或团队 `students`、说明 `description`。Students 日期栏统一按年显示；`year_label` 仅在需要展示项目周期时使用年份区间。赵水心的汇总记录按用户要求仅显示 `2024`，其来源仍为毕业届别，不推定各项荣誉均在该年获得。论文记录通过 `publication_id` 复用 `_publications/` 的双语题名、会刊简称、年份、CCF 分类及详情链接，不重复维护论文元数据；当前统一显示 `TOSEM 2026 · CCF A` 与 `ICSE 2026 · CCF A`。姓名及成果对应关系以用户资料和明确确认为依据，不从作者顺序推断学位身份、贡献或项目主持人。招生部分的 Email 联系句放在邀请段落末尾，不单独成段。

原始资料、识别结果及来源核对记录仅在本地保留，不提交或发布。公开页面只展示整理后的学术信息，不包含学号、手机号等身份信息。年份不足时使用资料支持的时间精度；项目清单中不属于本人指导的记录不纳入。原 `/teaching/#student-supervision` 链接自动转到 `/students/#student-supervision`，中文路径同步。

Teaching 主列表仅显示最近三门课程：大模型原理与实践、软件需求工程、Linux程序开发。页底 More 进入 `/teaching/archive/`，依次展示跨媒体信息处理技术、计算机科学导论、计算机网络、数据与算法基础。七门课程统一按最近授课年份或计划开设年份倒序，同年按开始授课年份较新者在前；顺序维护在 `_data/courses.yml` 中，近期数量在 `_config.yml` 的 `teaching_page_size` 中维护。首页仍展示新课预告与软件需求工程。

所有课程在桌面标题行右侧显示 More，手机端移到标题下方，避免挤压长课名。点击 More 进入 `/teaching/<course.id>/` 的独立主页；中文版路径加 `/zh`。课程主页目前显示 `Coming soon. Stay tuned.`／“即将上线，敬请期待。”，并提供返回原课程列表位置的链接。入口源文件为 `_pages/courses/` 与 `_pages/zh/courses/`；后续可在各文件中替换占位说明并补充课程正文，保留 permalink、lang、translation 和 course_id。中文未开放期间先显示全站建设中提示，开启后自动恢复课程页面。

“大模型原理与实践 / Large Language Models: Principles and Practice”计划于 2027 年春季开设，使用 `status: upcoming`，中英文均显示计划状态与“敬请期待 / stay tuned”。不注明面向班级；未提供的授课对象层次与授课职责不填补，模板省略缺失字段及其分隔符。后续正式开课信息由用户提供后再更新。

新增课程时，将其稳定 `id` 同步加入 `assets/js/academic.js` 的 `sharedAnchors`，确保切换语言后继续定位到该课程。

Students 的培养与招生正文使用页面内容区的完整宽度；成果列表在桌面端以左侧年份、右侧内容排列，手机端上下排列。长成果标题与其他标题共用换行控制，正文继续优先保持自然字距。

仅 Students 主页面及成果归档采用以下横线规则：每个成果子栏目的首尾横线从年份列左缘起画，只有条目之间的横线从正文列左缘起画；手机端年份与正文同列，横线自然通栏。无 More 的栏目在最后一条记录后画通栏横线；有 More 的栏目将说明和 More 放在末尾通栏横线上方，距横线 12 像素，说明左缘与年份列对齐，More 靠右并与说明末行靠齐。归档在返回入口上方使用通栏横线。学位分组与招生说明前不重复添加上一栏目已有的末尾横线。其他栏目的 More 与分隔线样式不变。

## More 与归档

- News 主列表保留最近三条，页底 More 进入 `/news/archive/`。历史四条从原目录备份恢复，原资料只有年份，继续仅显示年份，不补造月份。
- Research 的 Research group 标题行右侧放置 More，指向 `https://csma-research-group.github.io`；不再重复设置底部研究组入口。
- Projects 只展示 `state: ongoing` 的在研项目；页底 More 进入 `/projects/archive/`。历史项目尚无可用的名称、年份和状态清单，页面暂显示待补充。以后在 `_data/projects.yml` 中增加 `state: archived` 的完整双语记录即可显示；旧研究系统不直接当作已结项项目。
- Publications 使用“近期代表性会议与期刊论文”的概述，不显示作品数量。页底 More 进入 `/publications/archive/`，展示其余六项成果，SemFaith 保留录用状态和 2026 年 8 月时间，不补造 DOI 或作者。
- Teaching 和 Blog 分别使用 `/teaching/archive/`、`/blogs/archive/`。
- Students 的创新创业训练计划与优秀本科毕业论文各有一个 More，链接到 `/students/archive/` 的对应栏目；归档的返回链接和语言切换保留栏目位置。各栏说明维护在 `_data/students.yml` 的 `archive_description` 中。

News、Projects、Publications、Teaching、Blog 的底部统一使用“左侧说明＋右侧 More”：说明文字自然左对齐，与正文左边界一致；More 与正文右边界对齐，两者位于同一行，窄屏说明可自然换行。说明交代对应的历史内容，并明确引导“请点击右侧 More 访问”（中文与实际按钮一致，使用“更多”），集中维护于 `_data/descriptions.yml` 的 `archives` 字段；Projects 明确说明历史资料正在整理。归档页的返回链接放在底部左侧。

以上归档均有对应的 `/zh` 页面；各栏目共用九项主导航。

## 博客展示设置

`_data/blog.yml` 集中维护：

```yaml
pinned_count: 1
latest_count: 1
regular_count: 3
pinned_posts:
  - /posts/2026/04/ai-coding-tools/
  - /posts/2026/05/ai-automation-toolchain/
  - /posts/2026/03/openclaw-and-agent-research/
```

`pinned_count` 和 `latest_count` 各限制为 1–3。`pinned_posts` 按优先级列出英文文章地址，模板自动匹配同一文章的中文版本；默认仅第一篇生效。当前默认置顶 AI 编程工具文章，可直接替换该地址。最新标记按真实文章日期自动选择，无需手工更新。

博客主列表目标数量为 `regular_count + pinned_count + latest_count`，限制在 5–10 篇。默认 1＋1＋3＝5 篇；置顶与最新各设为 3 篇时，目标为 3＋3＋3＝9 篇；此时将 `regular_count` 改为 4，可展示最多 10 篇。文章不足时按实际数量显示，当前每种语言各有 8 篇。若某篇同时属于置顶和最新，只展示一次并同时标记，其他文章补足目标数量。

置顶文章在前，其余按时间倒序；超出数量的文章进入 More 归档，主列表与归档不重复且不丢失文章。首页 Blog 区块沿用相同排序和标记，展示两篇文章，每篇标题下使用 `excerpt` 的一至两句介绍；新增文章时保持中英文摘要长度适当。没有剩余文章时不显示主列表底部的 More。中英文使用同一份配置。

## 个人信息范围

个人信息仅保留姓名、Email、研究组、Weibo。中英文页面的邮件链接统一显示 `Email`，具体地址只用于 `mailto:` 链接，不直接显示在正文中。首页和页脚的紧凑链接共用 `_includes/academic/personal-links.html`。About 正文末尾采用“Get in touch／交流与合作”下的三段中英文说明，分别说明邮件联系（包括主页错误或不妥之处的反馈）、我们创建的研究组及微博关注入口；文案在 `_includes/academic/about.html` 中维护，链接地址继续引用 `_data/profile.yml`。微信、电话、个人地理位置、额外社交入口、单位个人主页与未经明确授权的个人荣誉不出现在公开页面或元信息中。Students 中可附用户明确提供的竞赛优秀指导教师信息，不另设个人荣誉栏目。机构名称只用于教育、任职和研究背景。

微博沿用原账号 `jiangpinghuang`，目标为 `https://weibo.com/jiangpinghuang`。2026-10-13 请求进入微博访客校验，未据此确认账号归属；不要推测替换账号。

## 本地验证

```bash
bash scripts/preview.sh
```

默认只监听 `127.0.0.1:4000`。使用本机已有的 Ruby 3.3.6；其他机器可自行配置兼容 Ruby。`bundle check` 失败时先检查锁定依赖，不要直接升级依赖。

```bash
bundle exec jekyll build --safe --trace
bundle exec ruby scripts/verify_site.rb
git diff --check
```

验证脚本还可接收构建目录与 JSON 报告路径：

```bash
bundle exec ruby scripts/verify_site.rb _site /tmp/homepage-site-audit.json
```

当前构建包含 102 个页面（51 对语言页面，含两个错误页）与 7 个历史跳转页。当前中文博客及其关联归档页正常开放，其余中文地址为建设中页面；全站中文开关开启后恢复全部内容。包含 12 个归档页面和 14 个课程页面。维护后重新检查内容数、语言对应关系、链接、脱敏及删除页面是否残留。浏览器重点检查主栏目与归档在 320、390、768、1024、1280、1440 像素下的排版，以及手机菜单、More 和语言切换；照片还需检查不同像素密度下的候选文件和 JPEG 后备图，确认未请求母版。

验证完整中文内容时，可在站点目录之外新建仅含 `chinese_enabled: true` 的 YAML 配置，再使用独立构建目录：

```bash
bundle exec jekyll build --safe --config _config.yml,/tmp/hjp-zh-preview.yml --destination /tmp/hjp-bilingual-preview
bundle exec ruby scripts/verify_site.rb /tmp/hjp-bilingual-preview /tmp/hjp-bilingual-audit.json /tmp/hjp-zh-preview.yml
```

正式本地预览继续使用 `_site` 的默认关闭状态，不要把用于完整双语检查的构建目录当作发布目录。

`docs/`、`work/`、`_archive/`、`scripts/`、旧地图和模板开发材料不进入站点构建目录。其中 `work/`、`_archive/` 与本地使用指南由 Git 忽略，不提交到公开仓库；维护说明和验证脚本作为源码提交。旧样式及工具文件保留作为历史源码，当前页面加载 `academic.css` 与 `academic.js`。样式链接使用构建时间作为 `v` 参数，同一次构建中的页面共用同一地址；部署新构建后地址随之更新，避免新页面继续复用旧版本的浏览器样式缓存。评论、访问统计和广告脚本未启用。

恢复时使用改版前的完整备份，先另存当前目录，再复制备份回原位置；不要直接覆盖现有修改。备份和本轮测试截图保存在站点目录之外。
