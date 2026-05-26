---
layout: home
permalink: /
title: "Jiangping Huang"
excerpt: "Academic homepage of Jiangping Huang"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

{% assign profile = site.data.profile %}
{% include base_path %}

<section class="pi-hero" id="home">
  <div class="pi-container pi-hero__grid">
    <div class="pi-hero__copy">
      <p class="pi-eyebrow">Academic Homepage</p>
      <h1>{{ profile.hero.name }}</h1>
      <p class="pi-hero__credentials">{{ profile.hero.credentials }}</p>
      <p class="pi-hero__role">{{ profile.hero.role }}</p>
      <p class="pi-hero__tagline">{{ profile.hero.tagline }}</p>

      <div class="pi-tag-row">
        {% for area in profile.hero.research_areas %}
          <span>{{ area }}</span>
        {% endfor %}
      </div>

      <div class="pi-action-row">
        <a class="pi-button pi-button--primary" href="{{ base_path }}/research/">Research</a>
        <a class="pi-button" href="{{ base_path }}/publications/">Publications</a>
        <a class="pi-button" href="{{ base_path }}/students/">Prospective Students</a>
        <a class="pi-button" href="{{ profile.research_group.url }}">CSMA Research Group</a>
        <a class="pi-button" href="{{ base_path }}/contact/">Contact</a>
      </div>
    </div>

    <aside class="pi-hero__panel" aria-label="Research highlights">
      <img class="pi-portrait" src="{{ base_path }}/images/{{ site.author.avatar }}" alt="Jiangping Huang">
      <div class="pi-highlight-stack">
        {% for item in profile.hero.highlights %}
          <article class="pi-highlight-card{% if forloop.first %} pi-highlight-card--accent{% endif %}">
            <div>
              <span class="pi-badge">{{ item.label }}</span>
              <span class="pi-badge pi-badge--soft">{{ item.tag }}</span>
            </div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.detail }}</p>
          </article>
        {% endfor %}
      </div>
    </aside>
  </div>
</section>

<section class="pi-section" id="about">
  <div class="pi-container pi-two-col">
    <div>
      <p class="pi-eyebrow">About</p>
      <h2>AI-driven software intelligence, multi-agent collaboration, and intelligent systems.</h2>
      <ul class="pi-clean-list pi-position-list">
        {% for item in profile.about.positions %}
          <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </div>
    <div class="pi-prose">
      {% for paragraph in profile.about.english %}
        <p>{{ paragraph }}</p>
      {% endfor %}
      {% for paragraph in profile.about.chinese %}
        <p lang="zh-CN">{{ paragraph }}</p>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section pi-section--muted" id="research-vision">
  <div class="pi-container">
    <div class="pi-section-heading">
      <p class="pi-eyebrow">{{ profile.research_vision.title }}</p>
      <h2>From requirements to code, traces, debugging, self-repair, and intelligent systems.</h2>
      <p>{{ profile.research_vision.summary }}</p>
      <p lang="zh-CN">{{ profile.research_vision.chinese_summary }}</p>
    </div>

    <div class="pi-chain" aria-label="Research lifecycle">
      {% for step in profile.research_vision.chain %}
        <span>{{ step }}</span>
      {% endfor %}
    </div>

    <div class="pi-principle-grid">
      {% for item in profile.research_vision.principles %}
        <div class="pi-principle">{{ item }}</div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section" id="research-areas">
  <div class="pi-container">
    <div class="pi-section-heading pi-section-heading--split">
      <div>
        <p class="pi-eyebrow">Research Areas</p>
        <h2>Three connected directions for current group research.</h2>
      </div>
      <a class="pi-text-link" href="{{ base_path }}/research/">View research agenda</a>
    </div>

    <div class="pi-card-grid pi-card-grid--three">
      {% for area in profile.research_areas %}
        <article class="pi-card pi-research-card">
          <h3>{{ area.title }}</h3>
          <p>{{ area.summary }}</p>
          <div class="pi-tag-row pi-tag-row--compact">
            {% for keyword in area.keywords %}
              <span>{{ keyword }}</span>
            {% endfor %}
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section pi-section--muted" id="publications">
  <div class="pi-container">
    <div class="pi-section-heading pi-section-heading--split">
      <div>
        <p class="pi-eyebrow">Selected Recent Publications</p>
        <h2>Recent work on intelligent software engineering, LLMs, multi-agent collaboration, and AI-driven systems.</h2>
      </div>
      <a class="pi-text-link" href="{{ base_path }}/publications/">Full publications</a>
    </div>

    <div class="pi-publication-list">
      {% for publication in profile.selected_publications %}
        <article class="pi-publication{% if publication.highlight %} pi-publication--featured{% endif %}">
          <div class="pi-publication__year">{{ publication.year }}</div>
          <div class="pi-publication__body">
            <h3><a href="{{ base_path }}/publications/#{{ publication.id }}">{{ publication.title }}</a></h3>
            <p><strong>{{ publication.venue }}</strong>{% if publication.tag %} · {{ publication.tag }}{% endif %}</p>
            <p>{{ publication.focus }}</p>
            {% if publication.tags %}
              <div class="pi-tag-row pi-tag-row--compact">
                {% for tag in publication.tags %}
                  <span>{{ tag }}</span>
                {% endfor %}
              </div>
            {% endif %}
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section" id="research-group">
  <div class="pi-container pi-group-band">
    <div>
      <p class="pi-eyebrow">Research Group</p>
      <h2>{{ profile.research_group.name }}</h2>
      <p>{{ profile.research_group.summary }}</p>
      <p>{{ profile.research_group.collaboration }}</p>
    </div>
    <div class="pi-group-band__side">
      <p>{{ profile.research_group.slogan }}</p>
      <a class="pi-button pi-button--primary" href="{{ profile.research_group.url }}">Visit CSMA Research Group</a>
      <a class="pi-text-link" href="{{ profile.contact.personal_homepage }}">Personal updates: {{ profile.contact.personal_homepage }}</a>
    </div>
  </div>
</section>

<section class="pi-section pi-section--accent" id="students">
  <div class="pi-container pi-student-layout">
    <div>
      <p class="pi-eyebrow">Prospective Students</p>
      <h2>Openings for motivated graduate students.</h2>
      <p>{{ profile.prospective_students.summary }}</p>
      <p lang="zh-CN">{{ profile.prospective_students.chinese_summary }}</p>
      <div class="pi-contact-strip">
        <span>Email: <a href="mailto:{{ profile.contact.email }}">{{ profile.contact.email }}</a></span>
        <span>WeChat: {{ profile.contact.wechat }}（添加好友时请注明来意）</span>
      </div>
    </div>

    <div class="pi-student-panels">
      <article class="pi-card">
        <h3>Admissions Programs</h3>
        <ul class="pi-clean-list">
          {% for program in profile.prospective_students.programs %}
            <li>{{ program }}</li>
          {% endfor %}
        </ul>
      </article>
      <article class="pi-card">
        <h3>Research Topics</h3>
        <div class="pi-tag-row pi-tag-row--compact">
          {% for topic in profile.prospective_students.topics %}
            <span>{{ topic }}</span>
          {% endfor %}
        </div>
      </article>
    </div>
  </div>
</section>

<section class="pi-section" id="supervision">
  <div class="pi-container">
    <div class="pi-section-heading">
      <p class="pi-eyebrow">Student Supervision</p>
      <h2>Research training through papers, systems, experiments, and writing.</h2>
    </div>
    <div class="pi-card-grid pi-card-grid--three">
      {% for item in profile.students.highlights %}
        <article class="pi-card pi-compact-card">
          <p>{{ item }}</p>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section pi-section--muted" id="news">
  <div class="pi-container">
    <div class="pi-section-heading">
      <p class="pi-eyebrow">Recent Updates</p>
      <h2>News</h2>
    </div>
    <ol class="pi-news-list">
      {% for item in profile.news %}
        <li><span>{{ item.date }}</span>{{ item.text }}</li>
      {% endfor %}
    </ol>
  </div>
</section>

<section class="pi-section" id="blog">
  <div class="pi-container">
    <div class="pi-section-heading pi-section-heading--split">
      <div>
        <p class="pi-eyebrow">{{ profile.blog.title }}</p>
        <h2>Research, learning, mentoring, and academic reflections.</h2>
        <p>{{ profile.blog.summary }}</p>
      </div>
      <a class="pi-text-link" href="{{ base_path }}/year-archive/">All posts</a>
    </div>

    <div class="pi-card-grid pi-card-grid--three">
      {% for post in site.posts limit:3 %}
        <article class="pi-card pi-blog-card">
          <div class="pi-blog-card__meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
            {% if post.categories and post.categories.size > 0 %}
              <span>{{ post.categories | first }}</span>
            {% endif %}
          </div>
          <h3><a href="{{ base_path }}{{ post.url }}">{{ post.title }}</a></h3>
          <p>{{ post.excerpt | strip_html | truncate: 170 }}</p>
          <a class="pi-text-link" href="{{ base_path }}{{ post.url }}">Read more</a>
        </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="pi-section pi-section--contact" id="contact">
  <div class="pi-container pi-contact-grid">
    <div>
      <p class="pi-eyebrow">Contact</p>
      <h2>For prospective students and collaborators.</h2>
      <p>欢迎对人工智能、大语言模型、多智能体系统、智能软件工程、代码生成与自修复、智能需求工程、智能机器人等方向感兴趣的同学联系交流。</p>
      <p>{{ profile.contact.note }}</p>
    </div>
    <div class="pi-contact-card">
      <a href="mailto:{{ profile.contact.email }}">Email: {{ profile.contact.email }}</a>
      <span>WeChat: {{ profile.contact.wechat }} - {{ profile.contact.wechat_note }}</span>
      <a href="{{ profile.contact.institutional_homepage }}">Institutional Homepage</a>
      <a href="{{ profile.contact.research_group }}">CSMA Research Group</a>
      <a href="{{ profile.contact.github }}">GitHub</a>
    </div>
  </div>
</section>
