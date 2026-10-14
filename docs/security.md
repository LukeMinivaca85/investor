# Security and reliability

- Company access comes exclusively from the authenticated server session; browser-supplied tenant IDs are not accepted. Admins ingest and connect; admins/reviewers approve evidence; viewers read.
- Passwords use salted scrypt. Sessions use random 256-bit opaque tokens, SHA-256 hashes at rest, eight-hour expiry, HttpOnly cookies, SameSite Strict and production Secure. Writes require the configured exact Origin plus a session-bound CSRF header.
- Company payloads and audit details use AES-256-GCM with an operator-managed production key. Session/user metadata remain in SQLite; infrastructure disk encryption is still required. HTTPS and HSTS are enforced in production.
- Input schemas, byte limits, per-client rate limits, timeouts and sanitized errors protect API boundaries. CSP disallows external scripts on Investor AI. The preserved IR page retains its inline-script allowance for its existing chart and filters.
- Model endpoints and connector URLs/credentials are server-configured. Connector configurations belong to one tenant, never wildcard tenants. API tokens are never serialized to the client.
- Prompt injection is mitigated by treating document text as untrusted, disabling tools, separating system policy, validating citation IDs, and displaying output as escaped text. This does not guarantee semantic factual accuracy: users must verify extracted facts and analysis against the originals.
- Financial calculations and readiness scores are generated in code, not accepted from the model. Model calculation sections are replaced with authoritative calculation output.
- Every model request requires an explicit browser consent checkbox and a backend `consent: true` assertion. Real financial data is blocked under the default synthetic-only provider policy. Documents are selected explicitly (up to four per request); the response reports omitted coverage. Document text is bounded and never interpreted as executable instructions.
- No financial record-write or filing-submission endpoint exists. Criterion approvals require an authorized human, evidence IDs, a rationale and confirmation; the decision is audited.
- Deploy a managed identity provider/MFA, distributed limiter, encrypted backups, immutable audit retention and operational alerts before handling production financial data at scale. No claim of regulatory certification is made.
