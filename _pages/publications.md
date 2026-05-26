---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% assign profile = site.data.profile %}

Selected recent publications reflecting the current research focus on intelligent software engineering, large language models, multi-agent collaboration, and AI-driven systems are listed below. DOI, PDF, code, page numbers, and citation counts are intentionally omitted unless verified in the site data.

<div class="publication-data-list">
{% for publication in profile.selected_publications %}
  <article class="publication-data-item" id="{{ publication.id }}">
    <h2>{{ publication.title }}</h2>
    <p><strong>{{ publication.year }}</strong> · <em>{{ publication.venue }}</em>{% if publication.tag %} · {{ publication.tag }}{% endif %}</p>
    {% if publication.authors %}
      <p><strong>Authors:</strong> {{ publication.authors }}</p>
    {% endif %}
    {% if publication.item_type %}
      <p><strong>Item Type:</strong> {{ publication.item_type }}</p>
    {% endif %}
    {% if publication.proceedings %}
      <p><strong>Proceedings:</strong> {{ publication.proceedings }}</p>
    {% endif %}
    {% if publication.place %}
      <p><strong>Place:</strong> {{ publication.place }}</p>
    {% endif %}
    {% if publication.date %}
      <p><strong>Date:</strong> {{ publication.date }}</p>
    {% endif %}
    <p><strong>Focus:</strong> {{ publication.focus }}</p>
    {% if publication.tags %}
      <p><strong>Tags:</strong> {{ publication.tags | join: ", " }}</p>
    {% endif %}
  </article>
{% endfor %}
</div>

## Publication Records

{% include base_path %}
{% assign verified_publications = site.publications | sort: "date" | reverse %}
{% for post in verified_publications %}
  {% include archive-single.html %}
{% endfor %}
