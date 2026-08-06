### 2026-08-05

- **SaaS definition:** Defines SaaS by vendor-operated service delivery rather than zero installation, so native and desktop clients are not mistaken for a different architecture.
- **API versioning:** Recommends versioning before independently deployed consumers depend on an API, while allowing lockstep internal APIs to evolve without day-one version overhead.
- **Tenant isolation:** Aligns pool, bridge, silo, and hybrid terminology with AWS, adds object-level authorization, and recommends tested database-enforced isolation as defense in depth for shared data.
- **Tenant lifecycle:** Expands multi-tenancy beyond query scoping to cover provisioning, membership, quotas, operations, auditability, data rights, recovery, and movement between isolation models.
- **Message delivery:** Requires idempotent handlers, webhook verification and deduplication, bounded retries, dead-letter handling, replay procedures, explicit ordering, and an outbox when database and message state must stay aligned.
- **Billing and tax:** Separates payment processing, subscriptions, tax calculation, registration and filing, and Merchant of Record service so builders can compare the actual responsibilities delegated by each product.
- **Email and notifications:** Adds queued, idempotent delivery; domain authentication; bounce and complaint processing; suppression; preferences; secure action links; and provider-selection criteria.
- **Database networking:** Prefers private connectivity where available while defining compensating controls for managed databases that expose authenticated public TLS endpoints.
- **Edge security:** Makes Cloudflare and third-party WAF/CDN adoption conditional on hosting capabilities, measured performance, and threat needs, and clarifies that free WAF coverage is limited defense in depth.
- **Compliance posture:** Replaces broad user-location claims with common legal triggers, adds COPPA, distinguishes SOC 2 attestation from law or certification, and clarifies that payment processors reduce rather than remove PCI DSS duties.
- **Resilience:** Adds explicit timeouts, bounded retries with jitter, circuit breakers, bulkheads, graceful degradation, dependency health, SLOs, capacity tests, and controlled recovery exercises for partial failures.
- **Data lifecycle:** Adds classification, minimization, retention, deletion across derived stores and backups, portability, key management, residency, subprocessors, privacy requests, and legal holds.
