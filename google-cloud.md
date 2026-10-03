---
title: Build a SaaS on Google Cloud
description: A practical, opinionated Google Cloud reference stack for a small SaaS, from AI-assisted development to frontend hosting, compute, PostgreSQL, identity, deployment, security, and growth.
---

# Build a SaaS on Google Cloud

Google Cloud can run everything from a tiny web application to some of the largest distributed systems in the world. A small SaaS should not begin by pretending it already has the problems of the latter.

This guide defines a **small, understandable Google Cloud reference architecture** for a SaaS application and shows how it can grow.

The goal is not to catalog Google Cloud. It is to answer a more useful question:

> If I have an application and want to turn it into a real SaaS on Google Cloud, what is the smallest sensible stack I can start with, what should I add later, and what should I deliberately leave out?

The reference architecture follows a few principles:

- start with managed services rather than servers or Kubernetes;
- keep PostgreSQL as the default relational database;
- use managed customer authentication rather than building authentication yourself;
- keep the web delivery layer efficient without prematurely designing a global distributed system;
- protect the database from unconstrained serverless scaling;
- keep source code in GitHub;
- separate the AI coding tool from the production architecture;
- add queues, private networking, larger database tiers, and distributed services only when measured requirements justify them.

This guide is intentionally about a **small SaaS first**.

The architecture should have a clear growth path, but the first version should not pay the financial or operational cost of infrastructure intended for a much larger product.

---

## 1. Separate the development tool from the hosting stack

One of the most important ideas in AI-assisted software development is that **the tool that writes an application does not have to be the platform that hosts it**.

A Google Cloud application could be built with:

- Codex
- Claude Code
- Cursor
- Google Antigravity
- Google AI Studio
- Gemini CLI
- Visual Studio Code
- another coding agent
- or no AI coding tool at all

The production application can still use exactly the same Google Cloud services.

That distinction matters because AI development tools change quickly. Production infrastructure should not be unnecessarily coupled to whichever coding agent happens to be popular this year.

A useful mental model has three layers.

### Layer 1: Development

This is where the source code is created and changed.

Examples include an IDE, terminal, coding agent, Google AI Studio, or another development environment.

### Layer 2: Source control and deployment

GitHub stores the source code and history.

Deployment can then be managed by:

- Firebase App Hosting's managed GitHub pipeline;
- Google Cloud Build;
- GitHub Actions;
- or another CI/CD system.

### Layer 3: Production

These are the services actually serving customers and storing data.

For this guide, the important production building blocks are:

- Firebase Hosting or Firebase App Hosting
- Cloud Run
- Cloud SQL for PostgreSQL
- Firebase Authentication / Identity Platform
- Cloud Storage
- Secret Manager
- Cloud Logging and Cloud Monitoring

Once the application is running, Google Cloud does not care whether the code was written by Codex, Claude, Gemini, or a human developer.

---

## 2. Understand the relationship between Firebase and Google Cloud

Google's naming can make its application platform look like two separate worlds:

**Google Cloud** includes services such as Cloud Run, Cloud SQL, Cloud Storage, IAM, Secret Manager, Cloud Build, and Vertex AI.

**Firebase** provides developer-friendly application services such as Hosting, App Hosting, Authentication, Firestore, and app-focused SDKs and tooling.

But these are not separate clouds.

> **A [Firebase project is a Google Cloud project](https://firebase.google.com/docs/projects/learn-more) with additional Firebase configuration and services enabled.**

The same project can be viewed and managed through both the Firebase console and the Google Cloud console.

That makes Firebase especially useful for understanding Google's small-application story:

```text
                 Google Cloud project
                        │
        ┌───────────────┴───────────────┐
        │                               │
    Firebase layer                Google Cloud layer
        │                               │
        ├── Hosting                     ├── Cloud Run
        ├── App Hosting                 ├── Cloud SQL
        ├── Authentication              ├── Secret Manager
        └── app SDKs                    ├── Cloud Storage
                                        └── IAM
```

Firebase is not an alternative cloud provider sitting beside Google Cloud.

It is a developer-oriented application layer within the Google Cloud ecosystem.

---

## 3. The v1 Google Cloud reference architecture

For a small conventional SaaS, start here:

![Google Cloud reference architecture: a customer reaches a Firebase-hosted web application over HTTPS, the application uses managed authentication, Cloud Run for application or API compute where needed, Cloud SQL for PostgreSQL, Cloud Storage for files, and Secret Manager for secrets. GitHub is the source of truth and can deploy through Firebase App Hosting, Cloud Build, or GitHub Actions. Cloud Run scaling is deliberately bounded so the application cannot overwhelm the database.](/google-cloud-reference-architecture.svg)

This is not the only valid Google Cloud architecture.

It is the **default teaching architecture** for this guide.

The goal is to give a small builder a known starting point before introducing alternatives.

---

## 4. What is included in the default stack

| Responsibility | Google Cloud v1 default | Why |
| --- | --- | --- |
| Source control | GitHub | Keeps application history independent of the hosting platform and works with Google's managed deployment options |
| Static or SPA frontend | Firebase Hosting | Secure global CDN delivery without spending application compute on static assets |
| Full-stack / SSR frontend | Firebase App Hosting when the framework fits | Managed GitHub deployment backed by Cloud Build, Artifact Registry, Cloud Run, and Cloud CDN |
| General application/API compute | Cloud Run | Fully managed application platform that scales without requiring server or cluster management |
| Primary relational database | Cloud SQL for PostgreSQL | Managed PostgreSQL with a familiar relational model and relatively portable application architecture |
| Customer authentication | Firebase Authentication initially; Identity Platform when its additional capabilities are needed | Managed application identity without building password storage and authentication infrastructure |
| File/object storage | Cloud Storage | Durable storage for uploads, media, exports, generated files, and similar objects |
| Secrets | Secret Manager | Keeps credentials and API keys out of source control |
| CI/CD | App Hosting's managed pipeline, Cloud Build, or GitHub Actions | Lets the application choose the deployment workflow appropriate to the project |
| Application/platform telemetry | Cloud Logging and Cloud Monitoring | Central Google Cloud logs, metrics, dashboards, and alerts |
| Infrastructure as code | Terraform as the Google Cloud footprint becomes substantial | Makes intentionally owned infrastructure reproducible rather than dependent on console configuration |

A small SaaS does **not** need every Google Cloud service on day one.

---

## 5. Choose the frontend hosting model that matches the application

There is no reason to force every frontend through application compute.

Google provides two useful Firebase hosting models.

### Static sites and single-page applications: Firebase Hosting

Use **Firebase Hosting** when the deployable frontend primarily consists of static assets such as:

- HTML
- CSS
- JavaScript bundles
- images
- fonts
- client-side SPA assets

Firebase Hosting serves this content through a [global CDN with HTTPS](https://firebase.google.com/docs/hosting).

A common architecture is:

```text
Browser
   │
   ▼
Firebase Hosting
   │
   │ API request
   ▼
Cloud Run
   │
   ▼
Cloud SQL
```

This keeps static web delivery at the edge while reserving application compute for actual application logic.

### Full-stack and server-rendered applications: Firebase App Hosting

If the application uses a [supported modern full-stack framework](https://firebase.google.com/docs/app-hosting/frameworks-tooling), **Firebase App Hosting** can remove even more deployment plumbing.

App Hosting connects to GitHub and manages the deployment flow.

Behind the abstraction, [Google uses](https://firebase.google.com/docs/app-hosting/about-app-hosting):

```text
GitHub
   │
   ▼
Cloud Build
   │
   ▼
Artifact Registry
   │
   ▼
Cloud Run
   │
   ▼
Cloud CDN
```

That is an important architectural lesson.

App Hosting is not a mysterious proprietary runtime replacing Google Cloud. It is a managed application layer orchestrating Google Cloud services underneath.

For a small SaaS using a framework App Hosting supports well, this can be an excellent default.

### Do not create two services when one will do

A full-stack application hosted by App Hosting does not automatically need a second standalone Cloud Run API.

Keep the application together when that remains the simplest architecture.

Add a separate Cloud Run service when there is an actual reason to separate a component, such as:

- an independently deployed API;
- a worker with different scaling requirements;
- a service written in another runtime;
- a public integration API;
- a workload that should have a different security or resource boundary.

The goal is not microservices.

The goal is clean responsibility boundaries when they become useful.

---

## 6. Use Cloud Run as the general-purpose compute layer

**[Cloud Run](https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run)** is Google's fully managed application platform for running application code and containers.

It can run:

- APIs;
- web applications;
- backend services;
- workers;
- jobs;
- webhook handlers;
- containerized applications.

You do not manage a Kubernetes cluster or virtual machines.

Cloud Run can also [build supported application source into a container automatically](https://docs.cloud.google.com/run/docs/deploying-source-code), so learning Docker is not a prerequisite for deploying a first application.

Cloud Run's ability to scale down to zero is particularly attractive for a small application with intermittent traffic.

That does not mean every Cloud Run service should be allowed to scale without limits.

Autoscaling compute can easily create more pressure on a database or external service than that dependency can absorb.

For a new small SaaS, set an intentional **maximum instance count** rather than accepting effectively unconstrained growth.

As of October 3, 2026, [Google's Cloud Run guidance](https://docs.cloud.google.com/run/docs/configuring/max-instances-limits) suggests beginning with a maximum of **3 instances** as a cost safeguard and increasing it as actual usage requires.

That is a good small-SaaS starting point.

The principle is:

> Let the application scale, but do not let one automatically scaling component accidentally overwhelm a component that scales differently.

---

## 7. Keep PostgreSQL as the default relational database

For this reference architecture, the primary database is **[Cloud SQL for PostgreSQL](https://docs.cloud.google.com/sql/docs/postgres/introduction)**.

That preserves one of the broader defaults of SaaS Explained: PostgreSQL is a strong general-purpose relational database with a large ecosystem and good portability.

Cloud SQL removes much of the infrastructure work involved in operating PostgreSQL while preserving the familiar database model.

For a conventional SaaS, relational data often includes:

- users;
- organizations or SaaS tenants;
- memberships;
- permissions;
- subscriptions;
- invoices and billing references;
- application records;
- relationships between records;
- audit metadata.

A relational database is usually the least surprising default for that data.

### Why not Firestore by default?

Firestore is a useful document database and integrates deeply with Firebase.

Use it when its data model, realtime client behavior, or serverless document access patterns are a strong fit for the application.

Do not choose it merely because the project uses Firebase.

Using Firebase for hosting or authentication does not require using Firestore as the primary database.

### Why not Spanner by default?

Spanner solves database problems at a dramatically different scale.

A small SaaS should not pay for global distributed database architecture before it has global distributed database requirements.

Start with PostgreSQL.

Move only when measured constraints demonstrate that PostgreSQL is no longer the appropriate solution.

---

## 8. Protect Cloud SQL from serverless connection growth

Cloud Run and PostgreSQL scale differently.

That matters.

Suppose the application has this architecture:

```text
Cloud Run
   │
   ▼
Cloud SQL
```

If one Cloud Run instance has a database pool of 10 connections and Cloud Run suddenly creates 50 instances, the application could attempt to create hundreds of database connections.

The correct lesson is not that Cloud Run and PostgreSQL should never be used together.

The correct lesson is that **serverless compute needs deliberate database connection management**.

For the small reference architecture:

1. use an [application database connection pool](https://docs.cloud.google.com/sql/docs/postgres/connect-run#connection-pools);
2. keep that pool deliberately small;
3. set a [Cloud Run maximum instance count](https://docs.cloud.google.com/run/docs/configuring/max-instances);
4. monitor database connections and utilization;
5. increase capacity only when traffic requires it.

Conceptually:

```text
Cloud Run
max instances: small
      │
      │ small application pool
      ▼
Cloud SQL
PostgreSQL
```

This gives the database a predictable connection budget for capacity planning, rather than a guaranteed hard upper bound. [Cloud Run can briefly exceed its maximum instance setting](https://docs.cloud.google.com/run/docs/configuring/max-instances), and deployments or other database clients can add connections. Leave database headroom and monitor total connection usage.

### Managed connection pooling comes later

Google Cloud also provides **[Managed Connection Pooling](https://docs.cloud.google.com/sql/docs/postgres/managed-connection-pooling)** for Cloud SQL.

It can become useful when a larger serverless or microservice deployment creates many short-lived or bursty database connections.

It should not be treated as a mandatory day-one component.

As of October 3, 2026, Managed Connection Pooling requires Cloud SQL Enterprise Plus, which is another reason not to make it part of the minimum small-SaaS stack.

A sensible progression is:

```text
Small SaaS
Cloud Run
   │
application connection pool
   ▼
Cloud SQL


Growing SaaS
more Cloud Run capacity
   │
carefully tuned connection limits
   ▼
larger Cloud SQL instance


Connection-heavy workload
Cloud Run fleet
   │
managed connection pooling
   ▼
appropriately sized Cloud SQL
```

Solve the problem when you actually have the problem.

---

## 9. Customer identity: Firebase Authentication and Identity Platform

A SaaS should normally use a managed identity system rather than building password storage, account recovery, federation, and authentication infrastructure from scratch.

Google's application identity products have overlapping names.

A useful way to understand them is:

**Firebase Authentication**

The straightforward Firebase application-authentication experience.

It supports common sign-in methods and integrates naturally with Firebase client SDKs.

**Identity Platform**

Google Cloud's customer identity platform. [Firebase Authentication can be upgraded to use Identity Platform capabilities](https://firebase.google.com/docs/auth#identity-platform).

Identity Platform adds features useful for more demanding SaaS products, including capabilities such as:

- multi-tenancy;
- SAML;
- OpenID Connect providers;
- additional enterprise identity functionality;
- enhanced operational support.

For a small consumer or simple SaaS application, Firebase Authentication may be enough.

For a B2B SaaS that needs separate identity silos for different customers or enterprise federation, Identity Platform becomes more important.

### Identity Platform tenants and SaaS tenants are not automatically the same thing

[Identity Platform supports tenants](https://docs.cloud.google.com/identity-platform/docs/multi-tenancy) that can maintain separate users, identity providers, and authentication configurations. Google specifically identifies B2B applications as a common use case.

But authentication tenancy does not remove the application's authorization responsibilities.

A SaaS still needs to model:

```text
User
  │
  └── Membership ──> Organization / SaaS tenant
                         │
                         └── tenant-owned application data
```

The application must decide:

- which customer organization a user belongs to;
- whether the user can belong to multiple organizations;
- which role the user has;
- what data the user may read or change;
- how tenant boundaries are enforced in database access.

The identity provider answers:

> Who is this user?

The SaaS authorization model answers:

> Which customer data and actions may this user access?

Do not confuse the two.

---

## 10. Store files in Cloud Storage

Do not store persistent user uploads on the local filesystem of a Cloud Run container.

Application instances are disposable.

Use **[Cloud Storage](https://docs.cloud.google.com/storage/docs/introduction)** for persistent objects such as:

- uploaded files;
- profile images;
- generated PDFs;
- exports;
- media;
- backups created by application workflows;
- other large binary objects.

The relational database should normally store the metadata and ownership relationship.

For example:

```text
PostgreSQL
File record
- id
- tenant_id
- owner_id
- object_key
- content_type
- created_at
        │
        ▼
Cloud Storage
actual file bytes
```

This keeps application records relational while storing file content in the service designed for object storage.

---

## 11. Keep secrets in Secret Manager

API keys, third-party credentials, signing secrets, and other sensitive values should not be committed to GitHub.

Use **Secret Manager**.

Examples include:

- Stripe secret keys;
- external API credentials;
- signing secrets;
- credentials for systems that cannot use Google IAM;
- other sensitive configuration.

Cloud Run can [integrate directly with Secret Manager](https://docs.cloud.google.com/run/docs/configuring/services/secrets).

Secrets can be exposed to an application through supported mechanisms such as mounted secret volumes or environment-variable integration.

Mounted secret volumes work particularly well when secret rotation matters because the application can access updated secret material.

Environment-variable integration can be convenient for a small application, but pin the secret to a specific version and understand that process environments can be exposed by poorly configured diagnostics or application code.

The broader rule is simple:

> Keep secret material out of the repository, minimize who and what can access it, and prefer workload identity over long-lived credentials when Google Cloud IAM can solve the authentication problem directly.

---

## 12. GitHub is the source of truth; deployment has several valid paths

Do not confuse source control with CI/CD.

GitHub stores the code.

A deployment system still needs to build, test, package, and release that code.

Google Cloud offers several reasonable workflows.

### Option 1: Firebase App Hosting

For supported full-stack applications, this is the lowest-operations path.

A GitHub commit can trigger the managed App Hosting deployment flow.

Google handles the underlying Cloud Build, Artifact Registry, Cloud Run revision, rollout, and CDN integration.

### Option 2: Cloud Build

Cloud Build can [connect directly to GitHub and trigger builds from pushes or pull requests](https://docs.cloud.google.com/build/docs/automating-builds/github/build-repos-from-github).

This is a good Google-native CI/CD option when the application needs a deployment pipeline that is more explicit than App Hosting.

### Option 3: GitHub Actions

A project already centered heavily on GitHub may prefer GitHub Actions.

GitHub Actions can authenticate to Google Cloud using **[Workload Identity Federation and OIDC](https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines)**, avoiding long-lived Google Cloud service-account keys stored as GitHub secrets.

That produces a flow such as:

```text
GitHub
   │
GitHub Actions
   │
Workload Identity Federation
   │
   ├── build
   ├── push image to Artifact Registry
   └── deploy Cloud Run revision
```

None of these options is universally correct.

The useful distinction is:

> **GitHub is source control. App Hosting, Cloud Build, and GitHub Actions are deployment choices.**

Do not add multiple CI/CD systems to the same simple application without a reason.

---

## 13. Artifact Registry stores deployable artifacts

When the application is packaged as a container, use **Artifact Registry** for the container image.

[Artifact Registry](https://docs.cloud.google.com/artifact-registry/docs/overview) is Google's current recommended container registry.

A conventional direct Cloud Run pipeline looks like:

```text
GitHub
   │
   ▼
Cloud Build or GitHub Actions
   │
   ▼
Artifact Registry
   │
   ▼
Cloud Run
```

With Firebase App Hosting, much of this happens automatically behind the abstraction.

That is another useful example of the relationship between Firebase and the underlying Google Cloud platform.

---

## 14. Google AI Studio is a development path, not a separate hosting architecture

Google AI Studio has evolved beyond being only a prompt playground.

As of October 3, 2026, its [Build mode can create full-stack web applications, work with GitHub, and deploy applications to Cloud Run](https://ai.google.dev/gemini-api/docs/aistudio-build-mode).

That makes it relevant to the same "vibe coding" category as products designed to turn natural-language instructions into working applications.

A simplified flow is:

```text
Prompt
   │
   ▼
Google AI Studio
   │
   ├── frontend code
   ├── server-side code
   └── project files
            │
            ▼
          GitHub
            │
            ▼
        deployment
            │
            ▼
         Cloud Run
```

AI Studio currently supports importing a GitHub repository and two-way synchronization so changes can move between AI Studio and the repository.

It can also deploy directly to Cloud Run.

That is useful for prototypes and small applications, but clicking **Publish** is not the complete definition of production readiness.

As an application becomes important, the normal engineering controls still matter:

- source control;
- tests;
- database migrations;
- backups;
- deployment review;
- authorization testing;
- observability;
- rollback plans;
- repeatable infrastructure;
- separation of development and production credentials.

The right lesson is:

> AI Studio can accelerate application development and deployment, but it does not eliminate software engineering and operational responsibilities.

### What about Firebase Studio?

Do not start a new guide or workflow around Firebase Studio.

As of October 3, 2026, [Google has announced](https://firebase.google.com/support/release-notes/firebase-studio) that Firebase Studio will shut down on **March 22, 2027**, and creation of new workspaces and new user signups was disabled on **June 22, 2026**.

Google currently directs new development toward:

- **Google AI Studio** for browser-based rapid prototyping and prompt-driven development;
- **Google Antigravity** for a more code-first agentic development environment.

Firebase as an application platform is not being retired.

The product being retired is the Firebase Studio development environment.

---

## 15. Add background work only when the request cycle is no longer enough

A first version may be able to perform most work inside the application itself.

Eventually, some operations should happen asynchronously.

Examples include:

- sending email;
- generating a large report;
- processing an uploaded file;
- calling a slow external API;
- retrying a webhook;
- running an AI task that takes too long for a normal request;
- performing scheduled maintenance.

Two Google Cloud services become useful here.

### Cloud Tasks

Use **[Cloud Tasks](https://docs.cloud.google.com/tasks/docs/dual-overview)** when the application needs to enqueue a specific piece of work for a handler to execute later.

Think:

> Do this job outside the customer's web request.

### Pub/Sub

Use **[Pub/Sub](https://docs.cloud.google.com/pubsub/docs/overview)** when a published event may need to be consumed independently by one or more systems.

Think:

> This event happened. Interested systems can react to it.

For a small SaaS, Cloud Tasks is often easier to reason about for background jobs.

Do not introduce a distributed event architecture simply because Pub/Sub exists.

---

## 16. Add AI without making the entire architecture an AI platform

A SaaS that uses Gemini does not need to redesign every layer around AI.

The application can call Gemini from normal server-side application code.

Keep model credentials and privileged calls on the server side rather than exposing them in browser code.

AI Studio can help prototype Gemini-powered application features.

For applications that need Google's broader managed AI platform and its operational controls, **Vertex AI** provides the Google Cloud platform for building and operating AI workloads.

Treat AI as another application capability with its own:

- cost controls;
- authorization rules;
- observability;
- evaluation;
- fallback behavior;
- data-handling decisions.

Do not allow model output to bypass the application's normal authorization and business rules.

---

## 17. Start small, then scale deliberately

The most important architecture decision may be deciding what **not** to build yet.

### Stage 1: Small SaaS

Start with something like:

```text
GitHub
   │
   ▼
Firebase Hosting or App Hosting
   │
   ▼
Cloud Run where application/API compute is needed
   │
   │ small connection pool
   ▼
Cloud SQL PostgreSQL

+ Firebase Authentication / Identity Platform
+ Cloud Storage
+ Secret Manager
+ Logging and Monitoring
```

Keep Cloud Run's maximum instance count conservative.

Keep the database small.

Keep the application together unless separation is clearly useful.

### Stage 2: Growing application

As measured traffic increases:

- tune Cloud Run concurrency;
- increase maximum instances carefully;
- increase the Cloud SQL instance size;
- monitor database connections;
- improve indexes and queries;
- add Cloud Tasks for asynchronous work;
- add caching when measurements justify it;
- improve alerts and dashboards;
- introduce staging environments;
- formalize Terraform and deployment controls.

### Stage 3: Larger SaaS

When actual requirements justify them, consider:

- Cloud SQL read replicas;
- managed connection pooling;
- additional Cloud Run services;
- Pub/Sub;
- dedicated workers;
- more advanced networking;
- load balancing and security controls;
- regional or multi-region architecture;
- stronger disaster-recovery design.

### Stage 4: Specialized scale

Only specialized requirements should push the architecture toward services such as:

- Google Kubernetes Engine;
- Spanner;
- complex service meshes;
- large event-driven microservice fleets;
- extensive private networking;
- custom compute infrastructure.

Those tools are valuable.

They are not proof that an application is mature.

Complexity should be purchased with a requirement.

---

## 18. Services you probably do not need yet

Google Cloud has a very large service catalog.

A first SaaS usually does not need:

### Google Kubernetes Engine

Cloud Run or App Hosting is dramatically simpler unless Kubernetes itself solves a real requirement.

### Compute Engine

Do not manage virtual machines for a conventional web application when a managed platform can run it.

### Spanner

Use PostgreSQL until the application's scale or distribution requirements demonstrate that a globally distributed relational database is necessary.

### BigQuery as the transactional database

BigQuery is an analytics data warehouse, not the normal transactional database for a SaaS application.

It may become extremely useful for analytics later.

### Pub/Sub everywhere

A monolith making ordinary function calls is easier to understand than an unnecessary event-driven distributed system.

### Redis / Memorystore

Add a cache when measurements show that caching solves an actual performance or coordination problem.

A cache is another system whose invalidation and failure behavior must be understood.

### Private networking everywhere

Private networking can be valuable for security and larger production architectures.

Do not build a complicated network topology merely because enterprise architecture diagrams contain one.

### Managed connection pooling on day one

Start with a small application pool and bounded Cloud Run scaling.

Move to more advanced pooling when connection pressure justifies the additional database tier and complexity.

---

## 19. A practical first-production checklist

Before calling the application a real SaaS, verify the fundamentals.

### Application

- [ ] Source code is stored in GitHub
- [ ] Production deploys come from a known branch or release process
- [ ] Database schema changes use repeatable migrations
- [ ] The application has a tested rollback or recovery path

### Identity and tenancy

- [ ] Authentication uses Firebase Authentication, Identity Platform, or another managed identity provider
- [ ] SaaS tenant membership is modeled separately from authentication
- [ ] Server-side authorization prevents cross-tenant access
- [ ] Administrative permissions are explicit and tested

### Data

- [ ] PostgreSQL is backed up
- [ ] Tenant-owned records contain a clear tenant/organization boundary
- [ ] File uploads use Cloud Storage rather than application-local disk
- [ ] Restore procedures are understood before they are needed

### Secrets and permissions

- [ ] Secrets are not committed to Git
- [ ] Secret Manager stores production secrets
- [ ] Google Cloud IAM follows least privilege
- [ ] CI/CD does not depend on long-lived Google Cloud service-account keys when Workload Identity Federation can be used

### Scaling

- [ ] The application uses a bounded database connection pool
- [ ] Cloud Run has an intentional maximum instance count
- [ ] Database connection usage is monitored
- [ ] Scaling limits are increased deliberately rather than automatically assuming infinite backend capacity

### Operations

- [ ] Application errors are visible in centralized logging
- [ ] Important service and database metrics are monitored
- [ ] Billing budgets and alerts are configured
- [ ] Production and development credentials are separated

---

## 20. The simplest useful mental model

Google Cloud can look enormous from its product catalog.

A small SaaS does not need an enormous architecture.

Remember this:

```text
Build
Codex / Claude / Gemini / human developer
                │
                ▼
              GitHub

Deliver
Firebase Hosting or App Hosting
                │
                ▼
            Cloud Run
          when compute is needed

Store
Cloud SQL PostgreSQL
Cloud Storage

Identify
Firebase Authentication
or Identity Platform

Protect
Secret Manager
IAM

Observe
Cloud Logging
Cloud Monitoring
```

Then grow each layer only when the application gives you a reason.

> **The goal is not to design the architecture that a hypothetical million-user SaaS might need someday. The goal is to launch the smallest production-worthy architecture with a clear path to becoming that larger system if the business succeeds.**