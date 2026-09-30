---
title: Build a SaaS on Microsoft Azure
description: A practical, opinionated Azure reference stack for a small SaaS, from AI-assisted development to identity, compute, data, deployment, security, and operations.
---

# Build a SaaS on Microsoft Azure

Azure can run nearly every part of a modern SaaS product, but that does not mean a small application should use every Azure service.

This guide defines a **small, understandable Azure reference architecture** for a SaaS application and shows how it can grow. The goal is not to catalog Azure. It is to answer a more useful question:

> If I have an application and want to turn it into a real SaaS on Azure, what is the smallest sensible stack I can start with, what should I add later, and what should I deliberately leave out?

The reference stack is intentionally conventional:

- one web application rather than a fleet of microservices;
- managed PostgreSQL rather than a cloud-specific database by default;
- a managed identity provider rather than home-built authentication;
- managed platform hosting rather than Kubernetes;
- infrastructure as code rather than manual portal configuration;
- built-in monitoring from the start;
- separate AI development tooling from the production hosting stack.

This is a **code-first Azure guide**. Microsoft Power Platform, Dataverse, Power Apps, and Copilot Studio are useful tools for other kinds of applications, but they are not the focus here.

---

## 1. Separate the development tool from the hosting stack

One of the most important ideas in modern AI-assisted development is that **the tool that writes the application is not the platform that has to host it**.

A developer could build the same Azure-hosted application with:

- GitHub Copilot
- Claude Code
- Codex
- Cursor
- Gemini CLI
- OpenCode
- another coding agent
- or no AI coding agent at all

The production application can still use the same Azure services.

This distinction matters because AI development tools change quickly. A hosting architecture should not be unnecessarily tied to whichever coding agent happens to be popular this year.

### The three layers

It is useful to think about the workflow as three separate layers.

#### Layer 1: Development environment

This is where code is created and changed.

Examples:

- Visual Studio Code
- Visual Studio
- Cursor
- a terminal
- GitHub Codespaces

An AI coding agent may run inside or alongside that environment.

#### Layer 2: Azure-aware development and deployment tools

These tools help a human or an AI agent understand and operate Azure.

Examples:

- Azure Agent Skills
- Azure MCP Server
- Azure CLI (`az`)
- Azure Developer CLI (`azd`)
- Bicep
- Terraform
- Aspire
- GitHub Actions
- Azure Pipelines

These tools are not the production application. They are interfaces for describing, provisioning, deploying, and operating the infrastructure.

#### Layer 3: The production Azure stack

These are the services that actually serve users and store application data.

For the reference architecture in this guide:

- Azure App Service
- Azure Database for PostgreSQL Flexible Server
- Microsoft Entra External ID
- Azure Blob Storage
- Azure Key Vault
- managed identities
- Application Insights and Azure Monitor

Once the application is running, Azure does not care whether the source code was written by GitHub Copilot, Claude Code, Codex, Cursor, or a human developer.

---

## 2. Where Microsoft's AI development tools have an advantage

The Azure stack should remain usable from many coding agents, but Microsoft's own tooling still has a legitimate advantage: **first-party integration**.

GitHub Copilot for Azure is designed specifically to help with Azure development and management. It can work with Azure-aware skills and tools to reason about Azure services, prepare infrastructure, inspect resources, assist with deployment, and troubleshoot problems.

That is a meaningful convenience if a developer already uses GitHub Copilot.

However, Azure's agent story is becoming more portable than a simple "Copilot only" model would suggest.

Microsoft publishes **Azure Agent Skills** using the Agent Skills open standard, and Microsoft documents support for assistants including Claude Code, Gemini CLI, Codex CLI, GitHub Copilot, Cursor, OpenCode, and others. Azure MCP Server exposes Azure capabilities through the open Model Context Protocol.

The practical lesson is:

> GitHub Copilot can provide the most integrated Microsoft-first experience, but Azure itself does not require GitHub Copilot as the development agent.

A developer can reasonably choose the coding agent they prefer while still using Microsoft's Azure-native deployment and operations tooling.

### Three Azure agent building blocks

Microsoft now has several similarly named pieces that solve different problems.

| Tool | What it provides | What it does not mean |
| --- | --- | --- |
| **Azure Agent Skills** | Microsoft-authored `SKILL.md` knowledge modules grounded in Microsoft Learn. They follow the open Agent Skills standard and can be used by compatible assistants including GitHub Copilot, Claude Code, Codex CLI, Cursor, Gemini CLI, OpenCode, and others. | They are primarily guidance and knowledge. Installing a skill does not by itself give an agent permission to change Azure resources. |
| **Azure Skills** | Higher-level Azure workflows such as `azure-prepare`, `azure-validate`, and `azure-deploy`. They help an agent analyze an app, prepare infrastructure, validate it, deploy it, diagnose problems, and perform other Azure-specific workflows. | They are not a hosting service. They orchestrate development and operations work. |
| **Azure MCP Server** | MCP tools that let a compatible agent interact with Azure services and resources. Azure Skills use these tools underneath for many live Azure operations. | MCP is an agent-to-tool interface, not the application's runtime architecture. |

The **Microsoft Learn MCP Server** is another related but different piece: it retrieves current Microsoft Learn documentation. Azure Agent Skills can use it to fetch authoritative documentation, while Azure MCP Server is focused on interacting with Azure services.

The practical distinction is:

> **Agent Skills provide knowledge. Azure Skills provide workflows. Azure MCP Server provides Azure tools. Azure services run the application.**

### Why this distinction matters

This creates an important architectural boundary:

**Coding agent**

writes and edits the application.

**Azure Agent Skills and MCP**

give the agent current Azure-specific knowledge and tools.

**`azd`, Azure CLI, Bicep, and CI/CD**

turn the desired architecture into provisioned infrastructure and deployments.

**Azure services**

run the production application.

Do not collapse those four responsibilities into one product.

---

## 3. The v1 Azure reference architecture

For a small conventional SaaS, start here:

![Azure reference architecture: a customer signs in with Entra External ID and uses an App Service application over a custom domain with HTTPS. App Service owns SaaS tenant authorization, uses managed identity to access PostgreSQL, Blob Storage, and Key Vault, and sends telemetry to Application Insights and Azure Monitor. GitHub, a coding agent, Azure Agent Skills, Azure Skills and Azure MCP Server, plus azd, Bicep, and GitHub Actions form the development and deployment path.](/azure-reference-architecture.svg)

This is not the only valid Azure architecture. It is the **default teaching architecture** for this guide.

The point is to give a small builder a known starting point before introducing alternatives.

---

## 4. What is included in the default stack

| Responsibility | Azure v1 default | Why |
| --- | --- | --- |
| Web application and API | Azure App Service | Fully managed web hosting without introducing container or Kubernetes complexity |
| Primary relational database | Azure Database for PostgreSQL Flexible Server | Managed PostgreSQL keeps the application relatively portable while offloading backups and database operations |
| Customer authentication | Microsoft Entra External ID | Azure-native customer identity and access management |
| Workload authentication | Managed identities | Lets Azure workloads authenticate to supported Azure resources without application-managed credentials |
| File/object storage | Azure Blob Storage | Durable object storage for uploads, generated files, media, exports, and similar content |
| Secrets and certificates | Azure Key Vault | Central place for secrets that cannot be replaced by managed identity |
| Infrastructure as code | Bicep | Native Azure infrastructure definition with strong Azure coverage |
| Developer deployment workflow | Azure Developer CLI (`azd`) | Connects application code, infrastructure, environments, provisioning, and deployment |
| CI/CD | GitHub Actions | Natural fit for a GitHub-hosted project and well integrated with Azure |
| Application telemetry | Application Insights | Application-level request, dependency, exception, and performance telemetry |
| Platform monitoring | Azure Monitor | Broader Azure monitoring, alerts, logs, and resource telemetry |

A small SaaS does **not** need every possible supporting Azure service on day one.

---

## 5. Why App Service is the default compute choice

Azure offers many ways to run code. That flexibility can make the first decision look more complicated than it needs to be.

For a conventional small SaaS application, **Azure App Service is the default in this reference architecture**.

App Service is optimized for managed web applications and web APIs and can run applications deployed as code or as containers. It removes most operating-system and server-management work from the application developer.

That is usually enough for:

- a server-rendered web application;
- a web API;
- a conventional monolith;
- a small application with background tasks that do not yet require a separate worker platform.

### When to use Azure Container Apps instead

Choose **Azure Container Apps** when containers are a meaningful part of the architecture rather than merely a packaging preference.

Good signals include:

- multiple independently deployed services;
- containerized workers;
- event-driven scaling;
- jobs that should run separately from the main web application;
- scale-to-zero requirements;
- revisions and traffic splitting;
- a desire for Kubernetes-style capabilities without directly managing Kubernetes.

Container Apps runs on Kubernetes underneath, but the developer does not manage the Kubernetes control plane.

### When to use Azure Functions

Use **Azure Functions** for event-driven units of work such as:

- reacting to a queue message;
- handling a webhook;
- processing a blob after upload;
- executing a scheduled job;
- performing a small task that should scale independently.

Do not decompose a straightforward application into dozens of functions merely because the service exists.

### When to use AKS

Azure Kubernetes Service should not be the default for a small SaaS.

Use AKS when the application has a real Kubernetes requirement: direct Kubernetes APIs, specialized orchestration, complex multi-service platform needs, existing Kubernetes operational expertise, or other requirements that justify owning more infrastructure complexity.

A useful progression is:

> **App Service → Container Apps / Functions when justified → AKS only when Kubernetes itself is required**

---

## 6. Keep PostgreSQL as the default relational database

A Microsoft-hosted application does not need to use a Microsoft-specific database engine.

For this reference stack, the default database is **Azure Database for PostgreSQL Flexible Server**.

That choice preserves one of the broader defaults of SaaS Explained: PostgreSQL is a strong general-purpose relational database with a large ecosystem and good portability.

Azure's managed PostgreSQL service adds operational features that a small team would otherwise need to manage itself, including backups and point-in-time recovery.

### Why not Azure SQL by default?

Azure SQL Database is also an excellent managed relational database.

Choose it when:

- the application is already built around SQL Server;
- the team has strong SQL Server experience;
- SQL Server-specific features matter;
- the wider Microsoft data ecosystem provides a clear benefit.

The point is not that PostgreSQL is universally better. The point is that a SaaS architecture does not need to become proprietary merely because it is deployed to Azure.

### Why not Cosmos DB by default?

Cosmos DB solves different problems.

It can be appropriate for globally distributed or non-relational workloads with requirements that justify its data model and operational characteristics.

It should not replace a normal relational database merely because it is an Azure-native service.

---

## 7. Customer identity: Microsoft Entra External ID

A SaaS normally has at least two different identity problems:

1. **Who are the customers using the application?**
2. **How does the application itself authenticate to Azure services?**

Those should not be confused.

For customer accounts, the Azure reference stack uses **Microsoft Entra External ID**.

External ID is Microsoft's current customer identity and access management platform for applications serving consumers or business customers.

Azure AD B2C is no longer available for purchase by new customers as of May 1, 2025. Microsoft positions External ID as its next-generation CIAM platform, with new customer-identity capabilities being developed there.

### Customer identity versus workforce identity

Keep these identity domains conceptually separate:

**Developer and administrator accounts**

Use a normal Microsoft Entra workforce tenant.

**SaaS customer accounts**

Use a Microsoft Entra external tenant through External ID.

**Application/workload identity**

Use managed identities for Azure resources where possible.

These are three different identity jobs.

### Authentication is not SaaS tenant authorization

There is an important naming collision in SaaS architecture: an **application tenant** and a **Microsoft Entra tenant** are not necessarily the same thing.

For a B2B SaaS, an application tenant normally represents one customer organization. That customer can have many users. Entra External ID can establish who a user is, but the SaaS still needs to decide:

- which customer organization or tenant the user belongs to;
- whether the user belongs to more than one tenant;
- what role or permissions the user has inside each tenant;
- which tenant-owned records the user may read or change.

For a simple shared-database SaaS, a reasonable starting model is:

```text
User
  │
  └── Membership ──> Organization / SaaS tenant
                         │
                         └── tenant-owned application data
```

The application should enforce this authorization on the server side. In a shared-table design, tenant-owned records should be scoped by a tenant or organization identifier, and data access should consistently enforce that boundary.

External ID can participate in role-based authorization, but it does not remove the application's responsibility to model its customers and prevent cross-tenant data access.

> **Identity provider:** "Who is this user?"
>
> **SaaS authorization model:** "Which customer data and actions may this user access?"

---

## 8. Passkeys in Entra External ID

External ID supports **FIDO2 passkeys** for customer authentication.

A registered passkey can be used for passwordless sign-in and can also satisfy multifactor authentication requirements. Supported passkey approaches include device-bound credentials such as Windows Hello and hardware security keys as well as synced passkeys from providers such as iCloud Keychain, Google Password Manager, 1Password, and Bitwarden.

This makes External ID attractive for a modern SaaS that wants phishing-resistant authentication.

### Important current limitation

"Supports passkeys" does not yet mean "a customer can create a brand-new account using only a passkey."

Microsoft currently requires the customer to begin with an **email + password or username + password local account** before registering a passkey. The customer must complete MFA before the passkey is registered.

Only those local password accounts can currently register passkeys; email one-time-passcode, federated, and social identity users cannot yet do so.

The application also needs to provide a credential-management experience so customers can register, view, and delete their passkeys.

Microsoft does not currently provide an out-of-box passkey registration experience for External ID external tenants. The application must build that experience with the FIDO2 provisioning APIs. Microsoft also notes that low-privilege credential-management APIs for this scenario are not yet available and are on the roadmap.

The distinction is important:

> External ID can provide passwordless sign-in after passkey registration, but the current account bootstrap process is not completely passwordless.

Because identity features change quickly, verify this behavior against current Microsoft documentation before implementing it.

---

## 9. Workload identity: use managed identities

Customer authentication is only one side of identity.

The application also needs to authenticate to services such as storage and Key Vault.

Azure **managed identities** let an Azure-hosted workload receive an identity managed by Microsoft Entra. The application can use that identity to obtain tokens for supported resources without storing a client secret or password.

For example:

```text
App Service
    │
    │ managed identity
    ▼
Azure Blob Storage
```

or:

```text
App Service
    │
    │ managed identity
    ▼
Azure Key Vault
```

This should be the preferred pattern whenever the destination supports Microsoft Entra authentication.

Azure Database for PostgreSQL Flexible Server can also use Microsoft Entra authentication. Where the application's language, driver, and connection-pooling approach support token authentication cleanly, the App Service managed identity can authenticate to PostgreSQL without a long-lived database password.

That makes the preferred v1 Azure pattern:

```text
App Service managed identity
        │
        ├── PostgreSQL Flexible Server
        ├── Blob Storage
        └── Key Vault
```

This does not mean Key Vault is unnecessary. Key Vault still stores secrets that cannot be replaced by workload identity, such as many third-party API keys and payment-provider credentials.

The principle is:

> Do not put a long-lived secret in application configuration when Azure can authenticate the workload directly.

Use role-based access control and grant only the permissions the workload needs.

---

## 10. What Key Vault is for

Managed identities reduce the number of secrets an application needs, but they do not make all secrets disappear.

An application may still need:

- a third-party API key;
- a payment-provider secret;
- a signing certificate;
- credentials for an external system that does not support Entra authentication.

Use **Azure Key Vault** for those secrets rather than committing them to source control or scattering them across deployment configuration.

A useful pattern is:

```text
App Service
   │
   │ authenticates with Managed Identity
   ▼
Key Vault
   │
   ▼
third-party secret
```

Managed identity protects access to the vault. Key Vault protects the secret that still has to exist.

---

## 11. File storage: Blob Storage

Do not put uploaded files into the application's local filesystem and assume they will behave like durable application data.

Use **Azure Blob Storage** for:

- uploads;
- images;
- generated reports;
- backups exported by the application;
- large objects;
- downloadable files;
- other content that does not belong inside the relational database.

The application can use its managed identity to access storage, avoiding a storage account key in application configuration.

---

## 12. Background work: start simple, then separate it

Many small SaaS products eventually need work that should not block a user's web request.

Examples:

- sending email;
- importing a large file;
- generating a report;
- resizing images;
- calling a slow external API;
- processing AI jobs;
- running scheduled maintenance.

Do not automatically build a complex event-driven system on day one.

### Stage 1: keep it inside the application when safe

Very small, noncritical background work can begin inside the main application if the framework and hosting model make that safe.

### Stage 2: add a queue

When work needs durability, retry behavior, load smoothing, or independent scaling, introduce a queue.

**Azure Service Bus** is the default recommendation for business-critical application messaging.

### Stage 3: add a worker

A queued task can be processed by:

- Azure Functions;
- Azure Container Apps;
- Container Apps Jobs;
- another dedicated worker process.

The architectural reason for adding these services should be the application's workload, not the desire to use more Azure products.

---

## 13. Deployment: `azd` and Bicep

Manual portal configuration is useful for exploration. It is a poor long-term source of truth.

The reference architecture uses:

- **Bicep** to describe Azure resources;
- **Azure Developer CLI (`azd`)** to connect the application, infrastructure, environments, provisioning, and deployment;
- **GitHub Actions** for repeatable CI/CD.

`azd` templates can include application code, Bicep or Terraform infrastructure, deployment configuration, and CI/CD workflows.

A simplified developer flow looks like:

```text
Application source
      +
Bicep infrastructure
      +
azure.yaml
      │
      ▼
     azd
      │
      ├── provision Azure resources
      └── deploy application
```

Common commands include:

```bash
azd init
azd up
azd provision
azd deploy
```

The exact workflow can vary, but the larger principle should not:

> The production architecture should be reproducible from code.

---

## 14. What Aspire does — and what it does not do

**Aspire** is useful when a local application consists of multiple projects, services, databases, caches, containers, or other dependencies that need to be described and run together.

Aspire can model the application's distributed components and help coordinate local development. Its deployment tooling can also participate in deploying applications to Azure.

But Aspire is not the same thing as Azure itself.

A useful mental model is:

```text
Coding agent
    ↓
writes the application

Aspire
    ↓
describes and orchestrates application components

azd + Bicep
    ↓
provision and deploy infrastructure

Azure
    ↓
runs the production system
```

A single, simple App Service application may not need Aspire at first.

Add it when its application-model and orchestration benefits solve a real problem.

---

## 15. CI/CD with GitHub Actions

For a project hosted on GitHub, GitHub Actions is the natural default CI/CD system.

A typical pipeline should:

1. check out the code;
2. restore/install dependencies;
3. run tests;
4. build the application;
5. authenticate to Azure;
6. deploy;
7. optionally run post-deployment checks.

Where supported, prefer **federated identity / OpenID Connect** for GitHub-to-Azure authentication rather than storing a long-lived Azure client secret in GitHub.

The repository should remain the source of truth for both application changes and infrastructure changes.

Azure Pipelines is a legitimate alternative, particularly for organizations already standardized on Azure DevOps.

---

## 16. Observability: Application Insights and Azure Monitor

A production application needs to answer questions such as:

- Are requests succeeding?
- How long do they take?
- Which dependencies are slow?
- What exceptions are occurring?
- Is the database causing latency?
- Did a deployment make the application worse?
- Are Azure resources approaching limits?

Use **Application Insights** for application telemetry and **Azure Monitor** for the wider monitoring system around Azure resources, logs, alerts, metrics, and operational data.

Prefer OpenTelemetry-compatible instrumentation where practical so telemetry is not unnecessarily coupled to one monitoring vendor.

Monitoring should exist before the first serious production incident, not after it.

---

## 17. Networking: do not start with the most complex topology

Azure supports sophisticated private networking, private endpoints, application gateways, firewalls, Front Door, VPNs, ExpressRoute, and other enterprise networking patterns.

A small SaaS should not adopt all of them by default.

Start with the minimum secure internet-facing architecture that meets the application's needs.

Add private networking when the threat model, compliance requirements, organizational policies, or sensitive service boundaries justify it.

### Start with a custom domain and HTTPS

A small production SaaS normally needs a custom hostname such as `app.example.com`, but it does not need Azure Front Door just to get one.

App Service can map a custom domain and use an **App Service managed certificate** for HTTPS. The managed certificate is free and automatically renewed. The DNS zone can remain with an external provider such as Cloudflare or the domain registrar; using Azure DNS is optional.

One practical cost detail matters: Microsoft's current App Service guidance requires the **Basic tier or higher** to use the App Service managed certificate path. That can create part of the minimum monthly cost floor even for a very small production application.

So the basic path is:

```text
customer
   │
   ▼
app.example.com
   │ DNS
   ▼
Azure App Service
   │
   └── App Service managed TLS certificate
```

Add Front Door later when the application actually needs edge routing, WAF, multi-region routing, or similar capabilities.

### Azure Front Door

Add **Azure Front Door Standard or Premium** when the product needs capabilities such as:

- global HTTP routing;
- edge acceleration;
- centralized TLS;
- web application firewall;
- multi-region routing;
- private connectivity to origins in supported architectures.

Do not assume every early-stage SaaS needs Front Door.

It belongs in the growth path, not the mandatory v1 stack.

---

## 18. AI is an optional capability: Microsoft Foundry

If AI is part of the product, **Microsoft Foundry** is Azure's platform for models, agents, and related AI tooling.

Foundry can provide access to Microsoft and partner models and can add capabilities such as agent hosting, evaluation, tracing, and governance.

It is important to place Foundry in the correct architectural layer:

> Foundry adds AI capabilities to an application. It is not a replacement for the application's normal web hosting, database, customer identity, storage, and deployment architecture.

A SaaS that does not need AI does not need Foundry.

A SaaS that needs only a small AI feature may use Foundry or call another model provider directly.

Use Foundry when its Azure integration, model catalog, governance, observability, or agent capabilities provide a meaningful benefit.

---

## 19. Billing is deliberately outside the Azure-native core

Most SaaS products need subscription billing, but Azure does not need to supply every product responsibility.

For a normal SaaS, payment and subscription management will often use a specialist service such as Stripe, Paddle, or another payment platform.

This is a useful reminder that **"Azure-first" does not have to mean "Azure-only."**

Choose cloud-native services where they improve the application. Use specialist providers where they are a better fit.

Azure Marketplace is relevant for certain enterprise software distribution models, but it should not be treated as the default billing platform for a small general-purpose SaaS.

---

## 20. The smallest useful production stack

A builder should be able to begin with approximately this set:

```text
GitHub repository
       │
       ▼
AI coding agent of choice
       │
       ▼
azd + Bicep + GitHub Actions
       │
       ▼
Azure App Service
       │
       ├── Entra External ID
       ├── PostgreSQL Flexible Server
       ├── Blob Storage
       ├── Key Vault
       └── Application Insights / Azure Monitor
```

This is already a real production architecture.

It has:

- hosted compute;
- a managed relational database;
- external customer identity;
- durable object storage;
- workload identity;
- secret management;
- monitoring;
- repeatable infrastructure;
- repeatable deployment.

It does not require microservices, Kubernetes, a service mesh, a global CDN, a dedicated queue, Redis, or an AI platform.

---

## 21. Growth path

A healthy SaaS architecture should make growth possible without pretending that future scale already exists.

### Stage 1: small SaaS

Use:

- App Service
- PostgreSQL Flexible Server
- External ID
- Blob Storage
- managed identity
- Key Vault
- Application Insights / Azure Monitor
- `azd`
- Bicep
- GitHub Actions

### Stage 2: growing workloads

Add only where required:

- Service Bus for durable messaging;
- Functions or Container Apps Jobs for background processing;
- Redis-compatible caching when measurements justify it;
- Front Door for edge routing, WAF, or multi-region needs;
- stronger private networking;
- more formal backup and disaster-recovery procedures.

### Stage 3: more complex platform

Possible additions:

- Container Apps for independently deployed containerized services;
- API Management for a real API-product or policy-management requirement;
- multi-region architecture;
- advanced data services;
- Foundry for deeply integrated AI workloads;
- specialized security and governance controls.

### Stage 4: Kubernetes only when justified

AKS belongs here only if Kubernetes solves a real platform requirement.

Complexity should be earned by requirements.

---

## 22. Services intentionally excluded from the default

The v1 architecture deliberately does **not** require:

- Azure Kubernetes Service
- Cosmos DB
- API Management
- Event Hubs
- Azure Front Door
- Redis
- a virtual network-heavy topology
- Microsoft Foundry
- Azure Functions
- Service Bus
- microservices
- Power Platform

These services are not bad choices.

They are excluded because a default architecture should distinguish **what a small SaaS needs** from **what Azure is capable of providing**.

---

## 23. Cost: understand the floor before optimizing the ceiling

The most important Azure cost question for a small builder is not:

> How cheaply could this run at massive scale?

It is:

> What is the minimum monthly cost of the production services that stay provisioned even when almost nobody is using the application?

Serverless products can scale very cheaply when idle, while provisioned database and application tiers can create a meaningful baseline cost.

For the reference architecture, evaluate at least these categories:

- App Service plan
- the App Service tier required for the chosen custom-domain/TLS setup;
- PostgreSQL compute
- PostgreSQL storage and backups
- Blob Storage
- Key Vault operations
- Application Insights and Log Analytics ingestion/retention
- outbound network transfer
- External ID monthly active users and any paid authentication mechanisms
- optional Front Door/WAF
- optional Service Bus
- optional container or function execution
- CI/CD usage where applicable

Do not publish a single permanent "Azure costs $X per month" number. Azure pricing, regions, free grants, service tiers, and billing models change.

Instead, maintain a versioned **sample cost scenario** with:

- region;
- exact service tiers;
- expected traffic;
- storage;
- log volume;
- database size;
- backup retention;
- date checked.

That turns cost into a reproducible comparison rather than an evergreen claim that will quickly become wrong.

---

## 24. Security baseline

For this reference stack:

- use Entra External ID for customer authentication rather than building a password database from scratch;
- use managed identities for Azure service-to-service authentication where supported;
- use Key Vault for secrets that still have to exist;
- use least-privilege Azure RBAC;
- prefer GitHub OIDC/federated authentication over long-lived deployment credentials;
- keep production configuration out of source control;
- use HTTPS everywhere;
- enable database backups and test restoration procedures;
- instrument the application and configure actionable alerts;
- protect production resources from casual human changes by treating Bicep as the source of truth;
- add private networking, WAF, and more advanced controls when risk or compliance justifies them.

Cloud-managed services reduce operational work. They do not remove the application's security responsibilities.

---

## 25. Portability and lock-in

This architecture intentionally mixes portable and Azure-specific choices.

### Relatively portable

- application source code;
- PostgreSQL;
- containers, if used;
- OpenTelemetry;
- Git;
- common web frameworks;
- Terraform, if selected instead of Bicep.

### Azure-specific

- Bicep;
- `azd` workflows;
- managed identities;
- Entra External ID configuration;
- App Service configuration;
- Key Vault integration;
- Application Insights/Azure Monitor setup;
- Azure RBAC and networking.

Vendor lock-in is not automatically bad.

The useful question is:

> What convenience are we receiving in exchange for dependence on this platform, and how painful would replacement actually be?

Using managed identity and App Service makes the application more Azure-aware, but it can also eliminate substantial credential-management and server-operation work.

Make the trade consciously.

---

## 26. Vibe coding on Azure

A useful way to understand modern Azure is to begin with this scenario:

> "An AI coding agent helped me create an application. How do I turn it into a real SaaS on Azure?"

The answer is not "copy the generated code into the Azure portal."

A more mature workflow is:

```text
1. AI agent helps create the application
           ↓
2. Agent uses Azure Skills / documentation / MCP
   to understand Azure choices
           ↓
3. Infrastructure is expressed in Bicep
           ↓
4. azd connects code, infrastructure,
   environment, provisioning, and deployment
           ↓
5. GitHub Actions repeats deployment
           ↓
6. Azure runs the application
           ↓
7. Azure Monitor and Application Insights
   show what the production system is doing
```

This is a different philosophy from an all-in-one prompt-to-app platform.

An all-in-one platform may intentionally hide infrastructure.

The Azure approach can let an AI agent **operate a visible conventional cloud architecture**.

That can require more concepts up front, but it also gives the builder a clearer understanding of what the application actually depends on.

---

## 27. Azure versus an all-in-one platform

A platform such as Replit or Lovable may combine development, generated code, hosting, deployment, databases, authentication, and other services into one guided experience.

Azure is different.

Azure is primarily a large cloud platform. It exposes many of the underlying architectural decisions rather than collapsing them into one product.

That creates two competing advantages.

### All-in-one platform

Potential advantages:

- faster start;
- fewer accounts and concepts;
- integrated development experience;
- less infrastructure configuration.

Potential disadvantages:

- more platform assumptions;
- less obvious infrastructure boundaries;
- potentially harder portability;
- fewer infrastructure choices.

### Azure stack

Potential advantages:

- explicit architecture;
- broad service selection;
- mature enterprise controls;
- fine-grained identity, networking, and operations;
- multiple development-agent choices;
- clear path to much larger systems.

Potential disadvantages:

- more concepts;
- more configuration;
- more opportunities to overbuild;
- potentially higher minimum production cost;
- more cloud-specific knowledge.

Neither model is automatically superior. The right choice depends on the product and the builder.

---

## 28. Future validation: build the same reference application more than once

The architecture above can be documented before a full sample application is built.

That is intentional.

Research and design should come first; hands-on validation can then reveal where the documentation is incomplete or misleading.

A future SaaS Explained project should define one small, deliberately boring reference SaaS and implement it on multiple platforms.

For example:

- customer signs up;
- customer signs in;
- customer creates projects;
- each project has tasks;
- customer uploads an attachment;
- a background process handles one job;
- the application sends one notification;
- an optional feature calls an LLM.

The same functional application could then be implemented with:

- Azure;
- AWS;
- Google Cloud;
- Replit;
- Lovable plus external services;
- Vercel;
- Railway;
- Cloudflare or other specialist platforms.

The purpose would not be to declare one universal winner.

It would let readers compare equivalent responsibilities:

- what each platform provides;
- what it hides;
- what must be assembled separately;
- how deployment works;
- what the cost floor looks like;
- how much operational knowledge is required;
- how portable the application remains.

Until that experiment exists, this Azure guide should clearly identify itself as a **researched reference architecture**, not a claim that every step has already been validated through a complete production build.

---

## 29. Azure service map

| SaaS responsibility | Default | Add or substitute when justified |
| --- | --- | --- |
| AI development agent | Developer's choice | GitHub Copilot has first-party Azure integration |
| Source control | GitHub | Azure Repos if organizational requirements favor Azure DevOps |
| Local orchestration | None required | Aspire for multi-component applications |
| Infrastructure as code | Bicep | Terraform when cross-cloud portability or existing Terraform practice matters |
| Developer deployment | `azd` | Direct CLI/IaC workflows for advanced cases |
| CI/CD | GitHub Actions | Azure Pipelines |
| Web/API compute | App Service | Container Apps |
| Event compute | Not required initially | Azure Functions |
| Background jobs | In-app initially where safe | Service Bus + Functions / Container Apps Jobs |
| Kubernetes | None | AKS only when Kubernetes is actually required |
| Relational database | PostgreSQL Flexible Server | Azure SQL |
| NoSQL | None by default | Cosmos DB for workloads that justify it |
| Object storage | Blob Storage | — |
| Customer identity | Entra External ID | Third-party CIAM when its features or developer experience are a better fit |
| Workload identity | Managed identity | Service principals only where needed |
| Secrets | Key Vault | — |
| Monitoring | Application Insights + Azure Monitor | Third-party observability platform where appropriate |
| Edge/WAF | None initially | Azure Front Door |
| AI platform | None initially | Microsoft Foundry |
| SaaS billing | Specialist provider | Azure Marketplace for applicable B2B distribution |

---

## 30. The rule for the Azure stack

The Azure reference stack can be summarized in one rule:

> **Start with managed, boring services that solve one clear responsibility each. Add cloud complexity only when the application produces a requirement for it.**

Azure's strength is that the next service is probably available when the application needs it.

The danger is assuming that availability means the application needs it now.

---

## Primary sources

Use primary documentation and re-check time-sensitive capabilities before publication or major updates.

- [GitHub Copilot for Azure](https://github.com/microsoft/GitHub-Copilot-for-Azure)
- [Azure Agent Skills](https://github.com/MicrosoftDocs/Agent-Skills)
- [Azure Agent Skills on Microsoft Learn](https://learn.microsoft.com/en-us/training/support/agent-skills)
- [What is Azure Skills?](https://learn.microsoft.com/en-us/azure/developer/azure-skills/overview)
- [GitHub Copilot for Azure overview](https://learn.microsoft.com/azure/developer/github-copilot-azure/introduction)
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)
- [Compare Azure Container Apps with other Azure container options](https://learn.microsoft.com/en-us/azure/container-apps/compare-options)
- [Microsoft Entra External ID customer overview](https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam)
- [Sign in with passkeys in Microsoft Entra External ID](https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-sign-in-with-passkey)
- [Multitenancy overview](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)
- [Identity approaches for multitenant solutions](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/identity)
- [Identity and access management for SaaS](https://learn.microsoft.com/en-us/azure/well-architected/saas/identity-access)
- [Managed identities for Azure resources](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview-for-developers)
- [Connect from App Service to Azure databases with managed identity](https://learn.microsoft.com/en-us/azure/app-service/tutorial-connect-msi-azure-database)
- [Connect to PostgreSQL Flexible Server with managed identity](https://learn.microsoft.com/en-us/azure/postgresql/security/security-connect-with-managed-identity)
- [Configure Microsoft Entra authentication for PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/security/security-entra-configure)
- [Azure Database for PostgreSQL Flexible Server backup and restore](https://learn.microsoft.com/en-us/azure/postgresql/backup-restore/concepts-backup-restore)
- [Configure a custom domain for App Service](https://learn.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)
- [Secure an App Service custom domain with a managed certificate](https://learn.microsoft.com/en-us/azure/app-service/tutorial-secure-domain-certificate)
- [TLS in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/overview-tls)
- [Azure Front Door overview](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview)
- [What is Microsoft Foundry?](https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry)
