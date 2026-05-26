---
title: "Why I Study Intelligent Software Engineering in the LLM Era"
date: 2026-05-20
permalink: /posts/2026/05/why-intelligent-software-engineering-llm-era/
categories:
  - Research
tags:
  - Intelligent Software Engineering
  - Large Language Models
  - Multi-Agent Systems
excerpt: "Why the LLM era makes software engineering more important, not less important."
---

Chinese title: 为什么我关注大语言模型时代的智能软件工程

Large language models have changed how we write code, read documents, and prototype software systems. A student can now ask a model to generate a function, explain an unfamiliar library, or draft a test case within seconds. This change is real and useful. But it also creates a misunderstanding: if a model can generate code, maybe software engineering becomes less important. My view is the opposite. The LLM era makes software engineering more important because the bottleneck shifts from typing code to understanding intent, managing evidence, diagnosing failures, and building reliable systems.

Software engineering has never been only about producing lines of code. It is about transforming human goals into artifacts that can be reviewed, executed, tested, maintained, and evolved. Requirements, design decisions, code, tests, logs, traces, bug reports, and user feedback are all part of the same technical conversation. LLMs can participate in this conversation, but they do not automatically make it coherent. They may generate plausible code that misses a requirement, satisfies a weak test while failing a real scenario, or repairs one bug by introducing another. This is why intelligent software engineering needs to treat generated artifacts as evidence, not as final answers.

The research problem I care about is how to build AI-driven software systems that can close the loop from requirements to code, from code to execution traces, from traces to debugging, and from debugging to self-repair. In this loop, a model is only one component. We also need structured requirements, traceability, test design, runtime observation, causal analysis, historical memory, and mechanisms for human review. A good intelligent software engineering system should know what it is trying to satisfy, what evidence it has observed, where uncertainty remains, and when it should ask for help.

Multi-agent systems are useful here because complex software tasks naturally involve different roles. A requirements analyst does not think exactly like a developer. A tester does not focus on the same evidence as a debugger. A reviewer may ask whether the whole solution still matches the original intent. In a multi-agent framework, these roles can be modeled as specialized agents that communicate through shared artifacts. The important point is not to create many agents for visual complexity. The important point is to make responsibilities explicit, preserve intermediate evidence, and allow different forms of reasoning to check each other.

This is also why I am interested in trace-driven debugging and intelligent requirements engineering. Requirements are where human intent first becomes technical. Execution traces are where generated code meets reality. Between these two ends, many failures become visible: missing assumptions, ambiguous specifications, incomplete tests, incorrect control flow, and fragile repairs. If we can connect requirements, code, tests, and traces, we can make AI-assisted development more inspectable and more reliable.

For students, this area is demanding but rewarding. It requires reading papers, understanding software systems, writing code, designing experiments, and communicating results clearly. It is not enough to call an API and report that a model performs well. We need to ask where the model fails, why it fails, which evidence reveals the failure, and how a system can improve after observing the failure. That kind of work builds research ability and engineering judgment at the same time.

The LLM era gives us powerful tools, but it also exposes harder questions. How should AI understand stakeholder intent? How should generated software be evaluated beyond pass/fail results? How can agents collaborate without losing consistency? How can a system repair itself while remaining accountable to humans? These questions are central to intelligent software engineering, and they are the reason I believe this field will remain one of the most important intersections between AI and real-world computing.
