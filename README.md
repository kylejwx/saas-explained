# saas-explained
A project to teach myself how SaaS works

I might try to build this with https://vitepress.dev/


# SaaS Architecture Reference
**A practical guide for builders who want good bones from day one**

*Version 1.0 — July 2026 | Authored by Kyle Wilcox*

---

## 🛗 The 30-Second Elevator Pitch

A SaaS (Software-as-a-Service) app is software you run in the cloud and charge people a subscription to use — instead of shipping them a copy to install. Every SaaS, whether it has 5 users or 5 million, is built from the same **8 structural layers**:

1. **Front End** — what users see and click
2. **Back End / API** — the brain that processes requests
3. **Database** — where all data lives
4. **Identity** — who you are and what you're allowed to do
5. **Background Jobs** — work that happens behind the scenes
6. **Billing & Observability** — how you get paid and know when something breaks
7. **Cloud Infrastructure** — the servers, networking, and security that run everything
8. **DevOps & Delivery** — how you ship updates safely and reliably

The good news: modern tools let a single developer build all 8 layers and run them cheaply. You can start simple and scale each layer independently as you grow. **You don't need to over-engineer on day one — you need to make the right foundational decisions so you never have to fully rewrite.**

---

## 👤 Who This Reference Is For

This guide is written for **tech-savvy builders** — developers, vibe coders, and technically-minded founders — who are:

- Building something real: a tool for their business, family, school, or side project
- Starting small (maybe 5 users) but not willing to paint themselves into a corner
- Not *assuming* their app will reach a million users — but want the architecture to *support* that possibility if it does
- Focused on **sustainability at any size**: cheap and simple to run at 5 users, capable of scaling without a full rewrite at 50,000

> 💡 **The core principle of this guide**: Build the simplest version that has correct structural foundations. Optimize for today's traffic, but don't make decisions that require a full rebuild tomorrow.
