---
layout: single
title: "Research"
permalink: /research/
author_profile: true
---

{% assign profile = site.data.profile %}

My research agenda is centered on intelligent software systems in the era of large language models, multi-agent collaboration, and embodied intelligence.

## Research Vision

{{ profile.research_vision.summary }}

{{ profile.research_vision.chinese_summary }}

<div class="pi-chain">
{% for step in profile.research_vision.chain %}
  <span>{{ step }}</span>
{% endfor %}
</div>

## Research Areas

<div class="publication-data-list">
{% for area in profile.research_areas %}
  <article class="publication-data-item">
    <h2>{{ area.title }}</h2>
    <p>{{ area.summary }}</p>
    <p><strong>Keywords:</strong> {{ area.keywords | join: ", " }}</p>
  </article>
{% endfor %}
</div>

## Representative Systems

**TraceCoder** studies trace-driven multi-agent debugging and repair for LLM-generated code. The system follows an observe-analyze-repair loop and uses runtime execution traces, causal analysis, historical lessons, and rollback-based repair.

**KGMAF / ChatREQ** studies knowledge-guided multi-agent collaboration for intelligent requirements engineering. The framework coordinates role-specialized agents through shared artifacts, injected requirements knowledge, and human-in-the-loop review.

## Research Group

{{ profile.research_group.summary }} {{ profile.research_group.collaboration }}

[Visit CSMA Research Group]({{ profile.research_group.url }}){: .btn .btn--info}
