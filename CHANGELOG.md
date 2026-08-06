### 2026-08-05

- **SaaS definition:** Defines SaaS by vendor-operated service delivery rather than zero installation, so native and desktop clients are not mistaken for a different architecture.
- **API versioning:** Recommends versioning before independently deployed consumers depend on an API, while allowing lockstep internal APIs to evolve without day-one version overhead.
- **Tenant isolation:** Aligns pool, bridge, silo, and hybrid terminology with AWS, adds object-level authorization, and recommends tested database-enforced isolation as defense in depth for shared data.
- **Tenant lifecycle:** Expands multi-tenancy beyond query scoping to cover provisioning, membership, quotas, operations, auditability, data rights, recovery, and movement between isolation models.
- **Message delivery:** Requires idempotent handlers, webhook verification and deduplication, bounded retries, dead-letter handling, replay procedures, explicit ordering, and an outbox when database and message state must stay aligned.
- **Billing and tax:** Separates payment processing, subscriptions, tax calculation, registration and filing, and Merchant of Record service so builders can compare the actual responsibilities delegated by each product.
