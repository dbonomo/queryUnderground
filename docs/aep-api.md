# AEP API Reference

Base URL: `https://platform.adobe.io`

All endpoints require the standard auth headers plus the `x-sandbox-name` header (defaults to `"prod"`). See [authentication.md](authentication.md).

## Common headers

```
Authorization: Bearer {access_token}
x-api-key: {client_id}
x-gw-ims-org-id: {org_id}
x-sandbox-name: prod
Content-Type: application/json
```

---

## APIs overview

| API | Base Path | Description |
|---|---|---|
| Schema Registry | `/data/foundation/schemaregistry` | XDM schema CRUD |
| Catalog Service | `/data/foundation/catalog` | Dataset metadata |
| Data Ingestion | `/data/foundation/import` | Batch ingestion |
| Query Service | `/qs/queries` | SQL queries on the data lake |
| Segmentation | `/segment` | Audience definitions and jobs |
| Real-Time Profile | `/data/core/ups` | Profile and merge policy access |
| Identity Service | `/data/core/identity` | Identity graph operations |
| Flow Service | `/data/foundation/flowservice` | Source/destination connectors |
| Sandbox Management | `/data/foundation/sandbox-management` | Sandbox CRUD |
| Access Control | `/data/foundation/access-control` | Permission checks |
| Data Governance | `/data/foundation/dulepolicy` | Usage labels and policies |

---

## Schema Registry API

Manages XDM (Experience Data Model) schemas.

### List schemas

```
GET /data/foundation/schemaregistry/tenant/schemas
```

Headers:
- `Accept: application/vnd.adobe.xed-id+json` (IDs only)
- `Accept: application/vnd.adobe.xed+json` (full schema)

### Get a schema

```
GET /data/foundation/schemaregistry/tenant/schemas/{SCHEMA_ID}
```

### Create a schema

```
POST /data/foundation/schemaregistry/tenant/schemas
```

```json
{
  "type": "object",
  "title": "My Custom Schema",
  "description": "Schema for custom events",
  "allOf": [
    { "$ref": "https://ns.adobe.com/xdm/context/experienceevent" }
  ]
}
```

### List classes, mixins, field groups

```
GET /data/foundation/schemaregistry/tenant/classes
GET /data/foundation/schemaregistry/tenant/mixins
GET /data/foundation/schemaregistry/tenant/fieldgroups
```

---

## Catalog Service API

Manages dataset metadata.

### List datasets

```
GET /data/foundation/catalog/datasets
```

Query parameters:

| Param | Type | Description |
|---|---|---|
| `limit` | int | Max results |
| `start` | int | Offset |
| `properties` | string | Comma-separated fields to return |
| `name` | string | Filter by name |
| `status` | string | Filter by status |

### Get a dataset

```
GET /data/foundation/catalog/datasets/{DATASET_ID}
```

### Create a dataset

```
POST /data/foundation/catalog/datasets
```

```json
{
  "name": "My Dataset",
  "schemaRef": {
    "id": "https://ns.adobe.com/{TENANT}/schemas/{SCHEMA_ID}",
    "contentType": "application/vnd.adobe.xed+json;version=1"
  },
  "fileDescription": {
    "format": "parquet"
  }
}
```

### List batches

```
GET /data/foundation/catalog/batches
```

---

## Query Service API

Run SQL queries against the AEP data lake.

### Create a query

```
POST /qs/queries
```

```json
{
  "dbName": "prod:all",
  "sql": "SELECT * FROM my_dataset LIMIT 10",
  "name": "Sample query",
  "description": "Test query"
}
```

### List queries

```
GET /qs/queries
```

### Get query status

```
GET /qs/queries/{QUERY_ID}
```

The query runs asynchronously. Poll the status endpoint until `state` is `SUCCESS` or `FAILED`.

### Create a query template

```
POST /qs/query-templates
```

```json
{
  "sql": "SELECT dim, COUNT(*) AS cnt FROM {dataset} WHERE _timestamp > '{start}' GROUP BY dim ORDER BY cnt DESC LIMIT {limit}",
  "name": "Top dimensions template"
}
```

---

## Segmentation Service API

### List audiences

```
GET /segment/audiences
```

### Create a segment definition

```
POST /segment/definitions
```

```json
{
  "name": "High Value Customers",
  "description": "Users with lifetime value > 1000",
  "expression": {
    "type": "PQL",
    "format": "pql/text",
    "value": "totalLifetimeValue > 1000"
  },
  "schema": {
    "name": "_xdm.context.profile"
  }
}
```

### Get a segment definition

```
GET /segment/definitions/{SEGMENT_ID}
```

### Evaluate a segment (create a segment job)

```
POST /segment/jobs
```

```json
{
  "segmentId": "{SEGMENT_ID}"
}
```

### Preview and estimate

```
POST /segment/preview
GET /segment/estimates/{PREVIEW_ID}
```

### Manage schedules

```
GET /segment/config/schedules
POST /segment/config/schedules
```

---

## Real-Time Customer Profile API

### Access a profile by identity

```
GET /data/core/ups/access/entities?schema.name=_xdm.context.profile&entityId={ID}&entityIdNS={NAMESPACE}
```

### List merge policies

```
GET /data/core/ups/config/mergePolicies
```

### Get a merge policy

```
GET /data/core/ups/config/mergePolicies/{MERGE_POLICY_ID}
```

---

## Identity Service API

### Get identity namespaces

```
GET /data/core/idnamespace/identities
```

### Get an identity cluster

```
POST /data/core/identity/cluster
```

```json
{
  "xid": "{EXPERIENCE_CLOUD_ID}"
}
```

---

## Data Ingestion API

### Batch ingestion flow

1. **Create a batch:**

```
POST /data/foundation/import/batches
```

```json
{
  "datasetId": "{DATASET_ID}",
  "inputFormat": { "format": "json" }
}
```

2. **Upload a file to the batch:**

```
PUT /data/foundation/import/batches/{BATCH_ID}/datasets/{DATASET_ID}/files/{FILE_NAME}
Content-Type: application/octet-stream
```

3. **Complete the batch:**

```
POST /data/foundation/import/batches/{BATCH_ID}?action=COMPLETE
```

---

## Flow Service API

Manage source and destination connectors.

### List connections

```
GET /data/foundation/flowservice/connections
```

### List flows

```
GET /data/foundation/flowservice/flows
```

### Create a connection

```
POST /data/foundation/flowservice/connections
```

---

## Sandbox Management

### List sandboxes

```
GET /data/foundation/sandbox-management/sandboxes
```

### Get active sandbox

```
GET /data/foundation/sandbox-management/sandboxes?property=state==active
```

---

## Error handling

AEP APIs return standard HTTP status codes with JSON error bodies:

```json
{
  "type": "https://ns.adobe.com/aep/errors/PLATFORM-123456-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "The request body is invalid."
}
```

| Code | Meaning |
|---|---|
| 200/201 | Success |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Server error |

---

## References

- [AEP API Reference](https://developer.adobe.com/experience-platform-apis/)
- [AEP API Getting Started](https://experienceleague.adobe.com/en/docs/experience-platform/landing/platform-apis/api-guide)
- [Schema Registry API](https://experienceleague.adobe.com/en/docs/experience-platform/xdm/api/schemas)
- [Segmentation Service API](https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/api/overview)
- [Query Service API](https://experienceleague.adobe.com/en/docs/experience-platform/query/api/queries)
- [Adobe Postman Collection](https://www.postman.com/adobe-dx/adobe-experience-cloud/collection/qtrc13p/adobe-experience-platform-api)
