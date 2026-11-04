# Nexora production deployment

## Render SQLite demo deployment

1. Push this project to a GitHub repository.
2. In Render, choose **New > Blueprint** and select the repository.
3. Render will read `render.yaml` and create a free Node web service.
4. Confirm the generated `ADMIN_KEY` environment variable is present. Keep it private; it unlocks product and dashboard administration.
5. After the first deploy, open the generated `https://...onrender.com` URL. The app and API are served from the same origin.
6. Check `https://...onrender.com/healthz`; it should report `{"status":"ok","database":{"engine":"sqlite","durable":false}}` for the free temporary-storage demo.

The free service uses `DATABASE_PATH=/tmp/nexora.sqlite`. It is suitable for demos only: the service may sleep, and SQLite data is not durable across redeploys or instance replacement. Do not use it for real production orders or customer data.

## Optional single-instance production blueprint

`render.production.yaml` is a separate, paid Render blueprint. It attaches a persistent disk at `/var/data` and stores SQLite at `/var/data/nexora.sqlite`; it is designed for one app instance only. Creating it incurs hosting and disk charges according to Render's current pricing. The ordinary `render.yaml` remains the free demo configuration.

Before accepting real orders, deploy the production blueprint, verify `/healthz` reports `database.durable: true`, configure and test payment webhooks, configure a signed shipping-status adapter, and verify database backups and a restore. COD remains disabled in the blueprint until you explicitly enable it after those checks. This deployment uses the application's current SQLite runtime; `DATABASE_URL` and `postgres-schema.sql` do not switch the server to PostgreSQL.

SQLite uses WAL journaling, a 5-second lock wait, bounded page cache, and indexed catalog/account lookups. WAL mode creates adjacent `-wal` and `-shm` files, so the database directory must be writable and kept together on the same local persistent volume. Do not place a live SQLite database on a network filesystem or share it between app instances. Seller-uploaded photos also use local disk by default; configure durable object storage or a persistent volume before production use.

The storefront supports authenticated COD orders, but the current free deployment still stores data on ephemeral SQLite. `render.yaml` therefore sets `COD_ENABLED=false`; the API rejects production COD orders until durable storage is configured. Do not enable COD until the runtime is switched to durable storage and a successful deployment is verified. COD delivery is ₹40 below ₹899 and free at or above ₹899; Razorpay pricing remains unchanged. COD order cancellation before seller processing restores reserved stock.

Optional order-confirmation email uses `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL`. Set these in Render's environment settings and verify the sender identity with SendGrid first. Persistent in-app order notifications work without SendGrid. Email provider failures are logged and surfaced in the checkout response without discarding the order.

## Authorized supplier catalog feeds

The Admin Panel can issue a one-time, per-supplier API key. Share it only with a supplier whose data feed and product images you are authorized to use, over a secure channel. The supplier posts batches to `POST /api/supplier/feed` with `x-supplier-key`; production accepts this endpoint only over HTTPS. Keys are stored hashed, can be rotated immediately, and can be paused or revoked. Do not put supplier keys in the browser, repository, CSV files, or public support tickets.

The feed accepts up to 5,000 JSON product records per request and updates matching rows by supplier external ID (then safe SKU/catalog matching). Admin can see the latest attempt, outcome, and create/update counts. Failed imports are reported and do not partially write a batch. Rate limiting is in-process; multi-instance deployments need a shared rate-limit store. A specific third-party supplier API is not preconfigured: obtain that supplier's API documentation, authorization and credentials, then have its system push this Nexora feed contract or implement its documented adapter.

For the included authorized sample catalog, create a supplier named `Nexora` in the Admin Panel and keep the one-time key in `NEXORA_SUPPLIER_KEY` (never in the CSV or source code). Set `NEXORA_API_BASE` to the API origin if it is not running locally, then run `npm run import:supplier-catalog`; pass a CSV path to import another compatible file. The importer maps the sample's Wearables and Accessories values to Electronics subcategories and accepts HTTPS image URLs only. The storefront loads imported listings and their supplied product images from `GET /api/products`.

## Preparing a 5,000-listing catalog

The current supplier endpoint supports up to 5,000 records **per request**; this is a batch limit, not a 5,000-product catalog cap. A local regression test imports 5,000 synthetic supplier listings and verifies that the catalog returns distinct cursor-paginated pages. This validates the code path, not production throughput or the accuracy/authorization of any real supplier dataset.

For a real 5,000-listing deployment:

1. Use a supplier feed only after confirming written rights to the product data and product images. Keep the supplier identity, external product IDs, and authorization records with your supplier agreement; do not treat the included sample CSV as verified live inventory.
2. Deploy on a single app instance with durable local storage for SQLite. Do not use the free Render `/tmp` database for real data. Attach a paid persistent disk and point `DATABASE_PATH` to a directory on that disk; keep SQLite WAL/SHM files alongside the database. Schedule backups and test a restore before accepting orders.
3. Keep media on an authorized HTTPS supplier CDN or durable object storage; application-local seller uploads are not durable across instance replacement unless their directory is also on persistent storage.
4. Import in batches of no more than 5,000 rows and within the server's 10 MB JSON request limit. Verify create/update counts and check sample listings, images, stock, and prices in Admin/storefront after each feed.
5. Keep one app instance while using the in-process authentication/supplier rate limiter and SQLite. Before running multiple app instances, move runtime data to a shared database and rate-limit state to a shared store; do not share a SQLite WAL database between instances.

The 5,000-listing path does not require PostgreSQL by itself, but production persistence and backups are required. No authorized real supplier dataset or production load test is included here.

## PostgreSQL schema and one-time data migration

The repository includes a PostgreSQL schema with composite catalog/filter indexes, generated full-text search plus a GIN index, and a materialized popularity counter maintained from order items. SQLite local/demo mode uses FTS5, matching product indexes, popularity-maintenance triggers, and cursor/keyset listing pages. The migration command creates the PostgreSQL tables and indexes if needed, then requires all destination application tables to be empty. It locks those tables and checks them in the same transaction before copying rows in dependency order, preserving explicit IDs and updating generated-ID sequences. A populated destination is refused and the transaction is rolled back; the SQLite source remains unchanged:

```powershell
$env:DATABASE_URL = "postgresql://..."
$env:DATABASE_PATH = ".\nexora.sqlite"
npm run migrate:postgres
```

This only prepares and migrates a PostgreSQL database; the Express server still uses SQLite and is not ready to serve requests from PostgreSQL. Migration rows are sent in bounded multi-row batches to reduce round trips, but the migration still holds an exclusive lock and a single transaction across the copy. It is intended for controlled small/medium migrations—not a 200-million-row bulk load or zero-downtime cutover. Do not point a production deployment at PostgreSQL or treat a successful migration as a completed runtime cutover. The server's synchronous SQLite query usage, PostgreSQL runtime integration, and corresponding end-to-end validation still need to be completed.

Demo products are disabled by default in every environment. Set `SEED_DEMO_DATA=true` only for an empty development database; demo seeding inserts products only when the products table is empty and never updates existing listings.

## Scale-out readiness for a large authorized catalog

The PostgreSQL schema now includes filter-and-sort composite indexes alongside the full-text GIN index. These are schema foundations only: the running API still uses synchronous SQLite, the supplier endpoint processes bounded requests in-process, and no production PostgreSQL workload or large-scale load test has been run. This repository is **not currently ready to serve 200 million listings**.

Before that target, plan and verify the following in a staging environment:

1. **Managed PostgreSQL runtime:** move catalog and transaction APIs to an async PostgreSQL data layer; provision a managed, highly available cluster with connection pooling, backups, point-in-time recovery, monitoring, and tested restore procedures. Keep the existing SQLite database unchanged until a verified cutover plan and rollback window exist.
2. **Catalog storage and query shape:** benchmark representative search, category/facet, sort, detail, and seller-update workloads with realistic skew. Use `EXPLAIN (ANALYZE, BUFFERS)` to validate plans. Choose partition keys only from measured access/update patterns; add partitions, replicas, or catalog sharding when measured thresholds require them. Do not treat index presence as proof of capacity.
3. **Search at scale:** evaluate a dedicated search index (such as OpenSearch) for high-volume text, typo-tolerant search, and faceting. Define an outbox/CDC sync path, replay/reconciliation, and acceptable search-index lag before making it the storefront search source.
4. **Ingestion:** replace synchronous request-bound bulk imports with authenticated, durable queued jobs and bounded workers. Use PostgreSQL `COPY`/staging plus validated, idempotent upserts, per-source quotas, retry/dead-letter handling, and import observability. The current supplier push API (5,000 rows/request) is not a 200-million-row ingestion pipeline.
5. **Images and provenance:** store media in durable object storage/CDN rather than application disks. Retain supplier/source ID, authorization or license reference, source image URL, ingestion/update timestamps, and takedown status for each listing. Ingest only supplier-authorized feeds and images; preserve attribution and honor revocation/removal requests.
6. **Capacity gate:** run repeatable load tests at projected concurrency and catalog size, including ingestion/search contention and failover. Set explicit latency/error-rate targets and test database restore, queue replay, and index rebuild before production rollout. No 200-million capacity claim is made until these tests pass on the selected production infrastructure.

## Local production check

Render generates a private `ADMIN_KEY` from `render.yaml`; do not add the generated value to the repository. For a local production-mode check, generate a fresh 256-bit key in the current PowerShell session and start the server:

```powershell
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$env:ADMIN_KEY = [Convert]::ToBase64String($bytes)
$rng.Dispose()
$env:NODE_ENV = "production"
npm ci
npm start
```

Then open `http://localhost:3000`.
