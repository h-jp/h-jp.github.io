---
layout: single
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% assign profile = site.data.profile %}

## Profile

{% for paragraph in profile.about.english %}
{{ paragraph }}

{% endfor %}

## Positions and Education

{% for item in profile.about.positions %}
* {{ item }}
{% endfor %}

## Research Interests

{% for area in profile.research_areas %}
* **{{ area.title }}:** {{ area.keywords | join: ", " }}
{% endfor %}

## Selected Recent Publications

{% for publication in profile.selected_publications %}
* **{{ publication.title }}**. {{ publication.venue }}, {{ publication.year }}.{% if publication.tag %} {{ publication.tag }}.{% endif %}
{% endfor %}

## Teaching

{% for course in profile.teaching %}
* **{{ course.title }}**, {{ course.audience }}, {{ course.period }}, {{ course.role }}.
{% endfor %}

## Student Supervision

{% for student in profile.students.people %}
* **{{ student.name }}**, {{ student.project }}, {{ student.note }}, {{ student.period }}. Outcome: {{ student.outcome }}.
{% endfor %}

## Awards

{% for award in profile.awards %}
* {{ award }}
{% endfor %}

## Professional Service

{% for item in profile.service %}
* {{ item }}
{% endfor %}

## Contact

Email: [{{ profile.contact.email }}](mailto:{{ profile.contact.email }})

WeChat: {{ profile.contact.wechat }}（添加好友时请注明来意）

Research Group: [{{ profile.contact.research_group }}]({{ profile.contact.research_group }})
