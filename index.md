---
layout: home

hero:
  name: SaaS Explained
  text: Learn the systems behind software as a service.
  tagline: A practical, plain-English guide to the decisions that help a small SaaS start strong and grow sustainably.
  actions:
    - theme: brand
      text: Explore the architecture guide
      link: /architecture
    - theme: alt
      text: View the project on GitHub
      link: https://github.com/kylejwx/saas-explained

features:
  - icon: "01"
    title: See the whole system
    details: Understand the eight layers—from the interface people use to the infrastructure that keeps it reliable.
  - icon: "02"
    title: Choose strong defaults
    details: Learn which early decisions keep a small product simple today without creating a rewrite tomorrow.
  - icon: "03"
    title: Build with context
    details: Use real-world examples and practical tradeoffs instead of one-size-fits-all architecture advice.
---

## Start with the foundations

The [SaaS Architecture Reference](/architecture) is the core learning path. It explains the major building blocks of a modern SaaS product, why they exist, and when they matter.

You do not need to master every layer at once. Start with the simplest useful version, then let real customer needs guide what you add next.

## Build the stack on Azure

The [Microsoft Azure guide](/azure) takes the provider-neutral architecture concepts and maps them onto a practical Azure stack for a small SaaS.

It separates the AI coding tool from the production platform, then walks through App Service, PostgreSQL, Entra External ID, managed identities, Blob Storage, Key Vault, infrastructure as code, deployment, monitoring, and a path for adding more Azure services only when the application actually needs them.

## Build the stack on Google Cloud

The [Google Cloud guide](/google-cloud) maps the provider-neutral architecture concepts onto a practical Google stack for a small SaaS.

It explains how Firebase and Google Cloud fit together, then walks through Firebase Hosting and App Hosting, Cloud Run, PostgreSQL on Cloud SQL, customer identity, storage, secrets, deployment options, Google AI Studio, and a deliberate path from a small application to more advanced Google Cloud infrastructure only when real usage requires it.

## See an all-in-one platform in context

The [Replit all-in-one case study](/replit-case-study) maps a browser-based AI development platform to the responsibilities of a small SaaS. It explains what Replit can combine, what still needs deliberate product and operational ownership, and when the tradeoffs fit.

## Explore the roadmap

The [Site Expansion Roadmap](/roadmap) makes the next areas of exploration easy to find. It collects possible guides, case studies, tools, and learning paths for the site.

It is an idea bank rather than a fixed plan, so it can grow with the questions builders need answered next.
