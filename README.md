# Adobe CJA & AEP API Research Repo

Reference repository for AI agents that need to interact with Adobe Customer Journey Analytics (CJA) and Adobe Experience Platform (AEP) APIs.

## What's in this repo

```
├── docs/
│   ├── authentication.md      # OAuth Server-to-Server auth guide
│   ├── cja-api.md             # CJA endpoint reference & examples
│   ├── aep-api.md             # AEP endpoint reference & examples
│   ├── python-cjapy.md        # cjapy Python wrapper reference
│   ├── python-aepp.md         # aepp Python wrapper reference
│   └── python-launchpy.md     # launchpy Python wrapper reference
├── src/
│   ├── auth.js                # Reusable auth client (token generation)
│   ├── cja-client.js          # CJA API client with helper methods
│   └── aep-client.js          # AEP API client with helper methods
├── examples/
│   ├── cja-report.js          # Pull a ranked report from CJA
│   ├── cja-dataviews.js       # List and inspect data views
│   ├── aep-schemas.js         # Query the Schema Registry
│   └── aep-segments.js        # Work with segmentation
├── .env.example               # Required environment variables
└── package.json
```

## Quick start

```bash
npm install
cp .env.example .env
# Fill in your Adobe Developer Console credentials in .env
node examples/cja-report.js
```

## Authentication

All Adobe APIs use **OAuth Server-to-Server** credentials (the JWT method is deprecated). See [docs/authentication.md](docs/authentication.md) for the full setup guide.

You need these values from your Adobe Developer Console project:

| Variable | Description |
|---|---|
| `ADOBE_CLIENT_ID` | OAuth client ID (also used as `x-api-key`) |
| `ADOBE_CLIENT_SECRET` | OAuth client secret |
| `ADOBE_ORG_ID` | IMS Organization ID (`xxxxx@AdobeOrg`) |
| `ADOBE_SCOPES` | Comma-separated scopes for your integration |

## Key API surfaces

### CJA APIs (`https://cja.adobe.io`)

| Endpoint | Description |
|---|---|
| `POST /reports` | Ranked reports (same data as Analysis Workspace) |
| `GET /reports/topItems` | Top items for a dimension |
| `GET /data/dataviews` | List data views |
| `GET /data/dataviews/{id}/metrics` | Metrics for a data view |
| `GET /data/dataviews/{id}/dimensions` | Dimensions for a data view |
| `GET /calculatedmetrics` | Calculated metrics CRUD |
| `GET /data/connections` | Connections |
| `GET /segments` | Segments (filters) CRUD |
| `GET /auditlogs` | Audit logs |

### AEP APIs (`https://platform.adobe.io`)

| Endpoint | Description |
|---|---|
| Schema Registry | XDM schema management |
| Catalog Service | Dataset metadata |
| Query Service | Run SQL against the data lake |
| Segmentation Service | Audience definitions and jobs |
| Real-Time Customer Profile | Merge policies and profile access |
| Data Ingestion | Batch and streaming ingest |
| Identity Service | Identity graphs and namespaces |
| Flow Service | Source/destination connectors |

## Python wrappers (community)

These excellent community Python libraries wrap the Adobe APIs and are great for agents working in Python:

| Library | Wraps | Install | Docs |
|---|---|---|---|
| [**cjapy**](https://github.com/pitchmuc/cjapy) | CJA API | `pip install cjapy` | [python-cjapy.md](docs/python-cjapy.md) |
| [**aepp**](https://github.com/pitchmuc/aepp) | AEP API (all services) | `pip install aepp` | [python-aepp.md](docs/python-aepp.md) |
| [**launchpy**](https://github.com/pitchmuc/launchpy) | Launch / Data Collection API | `pip install launchpy` | [python-launchpy.md](docs/python-launchpy.md) |

All three follow the same pattern: generate a config file, import it, instantiate a class, and call methods. See each doc for full method references and usage examples.

## Resources

- [CJA API Docs](https://developer.adobe.com/cja-apis/docs/)
- [CJA API Reference (OpenAPI)](https://developer.adobe.com/cja-apis/docs/api/)
- [CJA Endpoint Guides](https://developer.adobe.com/cja-apis/docs/endpoints/)
- [AEP API Reference](https://developer.adobe.com/experience-platform-apis/)
- [AEP Authentication Guide](https://experienceleague.adobe.com/en/docs/experience-platform/landing/platform-apis/api-authentication)
- [AEP Getting Started](https://experienceleague.adobe.com/en/docs/experience-platform/landing/platform-apis/api-guide)
- [Adobe Postman Collection](https://www.postman.com/adobe-dx/adobe-experience-cloud/collection/qtrc13p/adobe-experience-platform-api)
