#!/usr/bin/env ruby
# Check the generated release, including pages outside the primary navigation.
require 'nokogiri'
require 'json'
require 'uri'
require 'yaml'
require 'date'
require 'pathname'
require 'digest'

source = File.expand_path('..', __dir__)
root = File.expand_path(ARGV[0] || '_site', source)
report_path = ARGV[1] && File.expand_path(ARGV[1])
load_yaml = ->(path) { YAML.safe_load(File.read(path), permitted_classes: [Date, Time], aliases: true) }
config = load_yaml.call(File.join(source, '_config.yml'))
config.merge!(load_yaml.call(ARGV[2])) if ARGV[2]
chinese_enabled = config['chinese_enabled'] == true
chinese_blog_enabled = config['chinese_blog_enabled'] == true
load_frontmatter = ->(path) { YAML.safe_load(File.read(path).split(/^---\s*$/, 3)[1], permitted_classes: [Date, Time], aliases: true) || {} }
post_data = Dir.glob(File.join(source, '_posts/*')).map { |path| load_frontmatter.call(path) }
blog_routes = post_data.map { |post| post['permalink'] }
Dir.glob(File.join(source, '_pages/**/*.{md,html}')).each do |path|
  page_data = load_frontmatter.call(path)
  blog_routes << page_data['permalink'] if page_data['section'] == 'blog'
end
errors = []
checks = 0
check = lambda do |condition, message|
  checks += 1
  errors << message unless condition
end
html = Dir.glob(File.join(root, '**', '*.html')).to_h { |path| [path, Nokogiri::HTML(File.read(path))] }
resolve = lambda do |raw, from|
  uri = URI.parse(raw)
  next nil if uri.scheme && !%w[http https].include?(uri.scheme)
  next nil if uri.host && uri.host != 'h-jp.github.io'
  path = URI::DEFAULT_PARSER.unescape(uri.path.to_s)
  candidate = if path.empty?
                from
              elsif path.start_with?('/')
                File.join(root, path)
              else
                File.expand_path(path, File.dirname(from))
              end
  target = [candidate, File.join(candidate, 'index.html'), candidate + '.html'].find { |p| File.file?(p) }
  [target, uri.fragment]
rescue URI::InvalidURIError
  [nil, nil]
end
paths = []
redirects = []
forbidden = /WeChat|微信|faculty\.cqupt\.edu\.cn|Chongqing, China|科技进步奖|Outstanding Teacher|Assistant Professor/i
# Retain the legacy privacy check without storing student names in public source.
private_name_digests = %w[
  a1b753e39b5a26a113b2cbef6d352e34d159d4f79419cb46f18d47a14bef29b6
  700a8824cbdbf150247c6295ef05f42bbe56ac9664c8062681edf9bf30f78e57
  e41f8eae50b6611412c77c5e855d70fe49d297c64ed97bfede13b321e746878d
  cae5abac7c547545507ea9c3899842226980a2f9a201c2f5d2efbb37ba312449
  3e13ae941b3e0183572b44e69fa41999a899541f8d7276dd811518e33ee85fff
].freeze
students = load_yaml.call(File.join(source, '_data/students.yml'))
student_categories = students['groups'].flat_map { |group| group['categories'] }
student_records = student_categories.flat_map { |category| category['achievements'] }
# Source-backed student names are public only on the dedicated Students pages.
public_student_digests = student_records.flat_map do |record|
  record['students']['zh'].sub(/\A主持人：/, '').split('、')
end.uniq.map { |name| Digest::SHA256.hexdigest(name) }
private_content = lambda do |text, student_page = false|
  restricted_digests = student_page ? private_name_digests - public_student_digests : private_name_digests
  text.match?(forbidden) || text.scan(/\p{Han}{3,}/).any? do |run|
    run.each_char.each_cons(3).any? { |chars| restricted_digests.include?(Digest::SHA256.hexdigest(chars.join)) }
  end
end
retired = %r{/(?:zh/)?(?:cv|contact|resume)(?:/|\.html|["'<\s]|$)}
navigation = load_yaml.call(File.join(source, '_data/navigation.yml'))['main']
check.call(navigation.map { |item| item['id'] } == %w[home news research projects publications teaching students blog about], 'Primary navigation order')

html.each do |path, doc|
  rel = Pathname.new(path).relative_path_from(Pathname.new(root)).to_s
  raw = File.read(path)
  check.call(!private_content.call(raw, %w[students/index.html zh/students/index.html].include?(rel)), "Private or outdated content: #{rel}")
  check.call(!raw.match?(retired), "Retired route reference: #{rel}")
  if doc.at_css('meta[http-equiv="refresh"]')
    redirects << rel
    target = doc.at_css('body a')&.[]('href')
    check.call(target&.start_with?('/') && resolve.call(target, path)&.first, "Invalid local redirect: #{rel}")
    next
  end
  canonical = URI.parse(doc.at_css('link[rel="canonical"]')['href']).path
  paths << { path: canonical, file: rel, lang: doc.at_css('html')['lang'] }
  check.call(doc.css('h1').size == 1 && doc.css('main').size == 1, "Missing or duplicated page landmark: #{rel}")
  check.call(%w[en zh-CN].include?(doc.at_css('html')['lang']), "Missing language: #{rel}")
  check.call(doc.at_css('meta[name="description"]')['content'].to_s.size > 0, "Missing description: #{rel}")
  chinese_page_enabled = chinese_enabled || (chinese_blog_enabled && blog_routes.include?(canonical))
  notice_expected = doc.at_css('html')['lang'] == 'zh-CN' && !chinese_page_enabled
  check.call(!!doc.at_css('.language-notice') == notice_expected, "Chinese visibility setting: #{rel}")
  check.call(!!doc.at_css('link[rel="alternate"][hreflang="zh-CN"]') == chinese_page_enabled, "Chinese alternate visibility: #{rel}")
  if notice_expected
    check.call(doc.at_css('main').text.include?('正在建设中，敬请期待。') && doc.css('.hero, .section-content, .prose').empty?, "Chinese content not gated: #{rel}")
    check.call(doc.at_css('meta[name="robots"]')&.[]('content') == 'noindex,follow', "Placeholder indexing: #{rel}")
    check.call(doc.css('.desktop-nav, .mobile-menu').empty?, "Placeholder navigation: #{rel}")
  else
    language = doc.at_css('html')['lang'] == 'zh-CN' ? 'zh' : 'en'
    expected_navigation = navigation.map { |item| item['url'][language] }
    check.call(doc.css('.desktop-nav a').map { |link| link['href'] } == expected_navigation && doc.css('.mobile-menu nav a').map { |link| link['href'] } == expected_navigation, "Navigation order and links: #{rel}")
    check.call(!doc.at_css('.mobile-menu summary')&.[]('aria-label').to_s.empty?, "Missing mobile menu label: #{rel}")
  end
  language_switcher = doc.at_css('.language-switcher')
  target_language = doc.at_css('html')['lang'] == 'zh-CN' ? 'EN' : 'ZH'
  check.call(language_switcher.text.strip == target_language && language_switcher.css('a').size == 1 && language_switcher.css('[aria-current]').empty?, "Target language only: #{rel}")
  doc.css('img').each { |img| check.call(!img['alt'].to_s.empty?, "Missing image alternative: #{rel}") }
  switch = doc.at_css('[data-translation]')
  target = switch && resolve.call(switch['href'], path)&.first
  check.call(target && html.key?(target), "Missing translation: #{rel}")
  if target && html[target]
    counterpart = html[target]
    back = counterpart.at_css('[data-translation]')
    back_path = back && resolve.call(back['href'], target)&.first
    check.call(back_path == path, "Translation not reciprocal: #{rel}")
    check.call(counterpart.at_css('html')['lang'] != doc.at_css('html')['lang'], "Same-language counterpart: #{rel}")
  end
  doc.css('a[href], link[href], script[src], img[src]').each do |node|
    url = node['href'] || node['src']
    resolved = resolve.call(url, path)
    next if resolved.nil?
    dest, fragment = resolved
    check.call(!dest.nil?, "Broken link #{rel}: #{url}")
    if dest && fragment && html[dest]
      id = URI::DEFAULT_PARSER.unescape(fragment)
      check.call(html[dest].css('[id]').any? { |element| element['id'] == id }, "Broken anchor #{rel}: #{url}")
    end
  end
end

['/','/zh/','/publications/','/zh/publications/'].each do |url|
  path = resolve.call(url, File.join(root, 'index.html')).first
  doc = html.fetch(path)
  next if doc.at_css('.language-notice')
  papers = doc.css('.paper-item')
  check.call(papers.size == 2, "Representative paper count: #{url}")
  check.call(papers.first.text.include?('TraceCoder') && papers.last.text.include?('Cross-Model Collaboration'), "Representative paper order: #{url}")
  if url.include?('/publications/')
    check.call(papers.map { |p| p.at_css('.paper-doi')['href'] } == ['https://doi.org/10.1145/3744916.3773187', 'https://doi.org/10.1145/3840382'], "Representative DOI values: #{url}")
  else
    prefix = url == '/zh/' ? '/zh' : ''
    check.call(papers.map { |p| p.at_css('h3 a')&.[]('href') } == ["#{prefix}/publication/tracecoder-icse-2026", "#{prefix}/publication/cross-model-collaboration-tosem-2026"] && papers.all? { |p| p.css('a').size == 1 } && doc.css('a[href*="doi.org"]').empty?, "Homepage paper links: #{url}")
  end
end
['/','/zh/','/projects/','/zh/projects/'].each do |url|
  doc = html.fetch(resolve.call(url, File.join(root,'index.html')).first)
  projects = doc.css('.project-list li')
  next if doc.at_css('.language-notice')
  check.call(projects.size == 2, "Project count: #{url}")
  check.call(projects.map { |p| p.css('h2,h3').text.scan('[MASK]').size } == [2,3], "Project redaction: #{url}")
  check.call(projects.map { |p| p.at_css('.project-meta').text.gsub(/\s+/, '') }.zip(['2025–2028','2026–2029']).all? { |p, date| p.include?(date) }, "Project periods: #{url}")
end
['/teaching/','/zh/teaching/'].each do |url|
  doc = html.fetch(resolve.call(url, File.join(root,'index.html')).first)
  next if doc.at_css('.language-notice')
  check.call(doc.css('.course').size == 3, "Recent course count: #{url}")
  check.call(doc.css('.course').all? { |c| c.at_css('h3') && c.at_css('p').text.size > 40 && c.at_css('.course-meta').text.size > 10 }, "Incomplete course description: #{url}")
  check.call(doc.css('.supervision, .student-group, .student-admissions').empty? && doc.at_css('.section-content > section')&.[]('aria-labelledby') == 'courses-heading', "Teaching focuses on courses: #{url}")
  check.call(doc.css('.course').map { |c| c['id'] } == %w[large-models-principles-practice requirements-engineering linux-programming], "Recent course order: #{url}")
end
check.call(student_records.map { |record| record['id'] }.uniq.size == student_records.size, 'Unique student record IDs')
check.call(student_categories.map { |category| category['achievements'].size } == [3, 1, 8, 10, 2, 1], 'Verified student record counts')
check.call(student_categories.all? { |category| category['achievements'].map { |record| record['year'] } == category['achievements'].map { |record| record['year'] }.sort.reverse }, 'Student records in descending year order')
['/students/','/zh/students/'].each do |url|
  doc = html.fetch(resolve.call(url, File.join(root,'index.html')).first)
  next if doc.at_css('.language-notice')
  language = url.start_with?('/zh/') ? 'zh' : 'en'
  check.call(doc.css('.student-group').map { |group| group['id'] } == %w[undergraduates masters], "Student groups: #{url}")
  check.call(doc.css('.student-group').all? { |group| group.at_css('h2') && group.at_css('p').text.size > 30 }, "Student introductions: #{url}")
  check.call(doc.css('.student-category > h3').map { |heading| heading['id'] } == student_categories.map { |category| category['id'] + '-heading' }, "Student achievement categories: #{url}")
  check.call(doc.css('.student-achievements > li').map { |item| item['id'] } == student_records.map { |record| record['id'] }, "Student achievement coverage and order: #{url}")
  student_records.each do |record|
    item = doc.at_css("##{record['id']}")
    check.call(item && !item.at_css('.achievement-title').text.strip.empty? && item.at_css('.achievement-students').text.include?(record['students'][language]) && item.css('p').last.text.strip.size > 5, "Complete student record: #{url}##{record['id']}")
    expected_year = record.dig('year_label', language) || record['year'].to_s
    check.call(item&.at_css('.achievement-year')&.text == expected_year, "Student date precision: #{url}##{record['id']}")
    next unless record['publication_id']
    prefix = language == 'zh' ? '/zh' : ''
    check.call(item&.at_css('.achievement-title a')&.[]('href') == "#{prefix}/publication/#{record['publication_id']}" && item.at_css('.achievement-students').text.start_with?(language == 'zh' ? '共同作者：' : 'Co-author: '), "Student publication link and authorship: #{url}##{record['id']}")
  end
  admissions = doc.at_css('#admissions')
  check.call(admissions && admissions.at_css('h2') && admissions.css('p').size == 2, "Admissions section: #{url}")
  check.call(admissions&.css('p')&.last&.at_css('a[href^="mailto:"]') && admissions.css('p').last.at_css('a[href="https://www.ccf.org.cn/Academic_Evaluation/By_category/"]'), "Admissions Email in invitation paragraph: #{url}")
  check.call(doc.at_css('#shuixin-zhao-competitions-honors .achievement-year')&.text == '2024', "Student year label: #{url}")
  check.call(doc.at_css('#cross-model-collaboration-tosem-2026 p:last-child')&.text == 'TOSEM 2026 · CCF A' && doc.at_css('#tracecoder-icse-2026 p:last-child')&.text == 'ICSE 2026 · CCF A', "Consistent student publication venues: #{url}")
  check.call(admissions&.at_css('a[href="https://www.ccf.org.cn/Academic_Evaluation/By_category/"]'), "Admissions CCF directory: #{url}")
  check.call(admissions&.at_css('a[href="mailto:huangjp@cqupt.edu.cn"]')&.text == 'Email', "Admissions Email link label: #{url}")
end
['/','/zh/','/news/','/zh/news/'].each do |url|
  doc = html.fetch(resolve.call(url, File.join(root,'index.html')).first)
  next if doc.at_css('.language-notice')
  check.call(doc.css('.news-list time').map(&:text) == ['2026.08','2026.08','2026.04'], "News order: #{url}")
  check.call(doc.css('.news-list li').map(&:text).zip(['SemFaith','Cross-Model Collaboration','TraceCoder']).all? { |item, title| item.include?(title) }, "News sequence: #{url}")
end
prefixes = chinese_enabled ? ['', '/zh'] : ['']
blog_settings = load_yaml.call(File.join(source, '_data/blog.yml'))
pin_count = [[blog_settings.fetch('pinned_count', 1).to_i, 1].max, 3].min
latest_count = [[blog_settings.fetch('latest_count', 1).to_i, 1].max, 3].min
blog_limit = [[blog_settings.fetch('regular_count', 3).to_i + pin_count + latest_count, 5].max, 10].min
prefixes.each do |prefix|
  page_doc = ->(url) { html.fetch(resolve.call(prefix + url, File.join(root, 'index.html')).first) }
  %w[news projects publications teaching blogs].each do |section|
    doc = page_doc.call("/#{section}/")
    next if section == 'blogs' && post_data.count { |post| post['lang'] == (prefix.empty? ? 'en' : 'zh') } <= blog_limit
    check.call(doc.css(".archive-nav a[href='#{prefix}/#{section}/archive/']").size == 1, "Archive entry: #{prefix}/#{section}/")
  end
  check.call(page_doc.call('/').css('.home-about p > a.more-link').size == 1, "Inline About link: #{prefix}/")
  group = page_doc.call('/research/').css('.research-group .section-heading a')
  check.call(group.size == 1 && group.first['href'] == 'https://csma-research-group.github.io', "Research group More link: #{prefix}")
  news_archive = page_doc.call('/news/archive/')
  check.call(news_archive.css('.news-list li').size == 4 && news_archive.css('.news-date').map(&:text) == %w[2026 2025 2024 2024], "News archive and date precision: #{prefix}")
  paper_archive = page_doc.call('/publications/archive/')
  check.call(paper_archive.css('.paper-item').size == 6 && paper_archive.at_css('.paper-item').text.include?('SemFaith') && paper_archive.at_css('.paper-status time')&.[]('datetime') == '2026-08', "Publication archive and acceptance: #{prefix}")
  check.call(page_doc.call('/projects/archive/').at_css('.empty-note'), "Past projects pending source data: #{prefix}")
  course_archive = page_doc.call('/teaching/archive/')
  check.call(course_archive.css('.course').map { |c| c['id'] } == %w[cross-media intro-computer-science computer-networks data-structures], "Earlier course order: #{prefix}")
  [page_doc.call('/teaching/'), course_archive].each do |listing|
    listing.css('.course').each do |course|
      more = course.css('.course-heading a')
      expected = "#{prefix}/teaching/#{course['id']}/"
      check.call(more.size == 1 && more.first['href'] == expected, "Course More link: #{expected}")
      detail = html.fetch(resolve.call(expected, File.join(root,'index.html')).first)
      message = prefix.empty? ? 'Coming soon. Stay tuned.' : '即将上线，敬请期待。'
      check.call(detail.at_css('.page-header p')&.text == message, "Course placeholder: #{expected}")
      check.call(detail.at_css('.section-content a')['href'].end_with?("##{course['id']}"), "Course return anchor: #{expected}")
    end
  end
end
blog_prefixes = chinese_enabled || chinese_blog_enabled ? ['', '/zh'] : ['']
blog_prefixes.each do |prefix|
  page_doc = ->(url) { html.fetch(resolve.call(prefix + url, File.join(root, 'index.html')).first) }
  blog = page_doc.call('/blogs/')
  archive = page_doc.call('/blogs/archive/')
  current_urls = blog.css('.post-list h2 a').map { |a| a['href'] }
  archived_urls = archive.css('.post-list h2 a').map { |a| a['href'] }
  language_posts = post_data.select { |post| post['lang'] == (prefix.empty? ? 'en' : 'zh') }
  all_urls = language_posts.map { |post| post['permalink'] }
  pin_urls = blog_settings.fetch('pinned_posts', []).uniq.filter_map { |url| language_posts.find { |post| [post['permalink'], post['translation']].include?(url) } }.take(pin_count).map { |post| post['permalink'] }
  check.call(current_urls.size == [blog_limit, all_urls.size].min, "Blog page size: #{prefix}")
  check.call((current_urls & archived_urls).empty? && (current_urls + archived_urls).sort == all_urls.sort, "Blog archive coverage: #{prefix}")
  check.call(blog.css('.post-badge--pinned').size == pin_urls.size && blog.css('.post-badge--latest').size == [latest_count, all_urls.size].min, "Blog badges: #{prefix}")
  check.call(current_urls.take(pin_urls.size) == pin_urls, "Pinned post priority: #{prefix}")
  check.call((!!blog.at_css('.archive-nav')) == (all_urls.size > blog_limit), "Blog archive availability: #{prefix}")
  chronological_posts = language_posts.sort_by { |post| post['date'] }
  chronological_posts.each_with_index do |post, index|
    article = html.fetch(resolve.call(post['permalink'], File.join(root, 'index.html')).first)
    check.call(article.at_css('.prose') && !article.at_css('.prose').text.strip.empty? && article.at_css('meta[property="og:type"]')&.[]('content') == 'article', "Readable blog article: #{post['permalink']}")
    check.call(article.at_css('.article-excerpt .article-translation')&.[]('href') == post['translation'], "Blog excerpt translation: #{post['permalink']}")
    previous_url = index.positive? ? chronological_posts[index - 1]['permalink'] : nil
    next_url = chronological_posts[index + 1]&.[]('permalink')
    navigation = article.at_css('.post-navigation')
    check.call(article.at_css('.post-navigation a[rel="prev"]')&.[]('href') == previous_url && article.at_css('.post-navigation a[rel="next"]')&.[]('href') == next_url && article.css('.post-navigation a').size == [previous_url, next_url].compact.size, "Same-language chronological post navigation: #{post['permalink']}")
    if previous_url || next_url
      check.call(navigation && article.at_css('.prose').next_element == navigation && navigation.next_element&.[]('class') == 'article-footer', "Post navigation above footer divider: #{post['permalink']}")
    end
  end
end
%w[/cv/ /contact/ /resume /zh/cv/ /zh/contact/].each do |url|
  check.call(resolve.call(url, File.join(root,'index.html')).first.nil?, "Retired route still generated: #{url}")
end
%w[docs work _archive scripts talkmap markdown_generator].each do |name|
  check.call(!File.exist?(File.join(root,name)), "Private or development directory published: #{name}")
end
Dir.glob(File.join(root, '*.{xml,json,txt}')).each do |path|
  content = File.read(path)
  check.call(!private_content.call(content) && !content.match?(retired), "Forbidden content in #{File.basename(path)}")
end
profile = YAML.safe_load(File.read(File.join(source,'_data/profile.yml')), permitted_classes: [Date, Time], aliases: true)
check.call((profile.keys & %w[students prospective_students awards contact]).empty?, 'Private legacy profile fields remain')
report = { status: errors.empty? ? 'pass' : 'fail', chinese_enabled: chinese_enabled, chinese_blog_enabled: chinese_blog_enabled, checks: checks, content_pages: paths.size, redirects: redirects.size, language_pairs: paths.size / 2, routes: paths, redirect_files: redirects, errors: errors }
File.write(report_path, JSON.pretty_generate(report) + "\n") if report_path
puts JSON.pretty_generate(report.reject { |key,_| %i[routes redirect_files].include?(key) })
exit(errors.empty? ? 0 : 1)
