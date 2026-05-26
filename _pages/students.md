---
layout: single
title: "Prospective Students"
permalink: /students/
author_profile: true
---

{% assign profile = site.data.profile %}

Highly motivated students interested in AI, LLMs, multi-agent systems, intelligent software engineering, code generation and self-repair, intelligent requirements engineering, and intelligent robotics are welcome to contact me.

{{ profile.prospective_students.chinese_summary }}

## Admissions Programs

{% for program in profile.prospective_students.programs %}
* {{ program }}
{% endfor %}

## Research Topics

{% for topic in profile.prospective_students.topics %}
* {{ topic }}
{% endfor %}

## Research Fit

The group is suitable for students who want to work on real research problems, build systems, run rigorous experiments, write papers, and develop long-term research habits. It is especially suitable for students who hope to improve their research ability, engineering ability, academic writing, and presentation skills, and who may later pursue Ph.D. study or advanced R&D positions.

{% for item in profile.prospective_students.fit %}
* {{ item }}
{% endfor %}

## Student Supervision

{% for item in profile.students.highlights %}
* {{ item }}
{% endfor %}

<div class="student-data-list">
{% for student in profile.students.people %}
  <article class="student-data-item">
    <h2>{{ student.name }}</h2>
    <p><strong>Topic:</strong> {{ student.project }}</p>
    <p><strong>Period:</strong> {{ student.period }}</p>
    <p><strong>Note:</strong> {{ student.note }}</p>
    <p><strong>Outcome:</strong> {{ student.outcome }}</p>
  </article>
{% endfor %}
</div>

## Contact

Email: [{{ profile.contact.email }}](mailto:{{ profile.contact.email }})

WeChat: {{ profile.contact.wechat }}（添加好友时请注明来意）
