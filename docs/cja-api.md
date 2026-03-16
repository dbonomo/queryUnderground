# CJA API Reference

Base URL: `https://cja.adobe.io`

All endpoints require the standard auth headers (`Authorization`, `x-api-key`, `x-gw-ims-org-id`). See [authentication.md](authentication.md).

## Endpoints overview

| Endpoint | Methods | Description |
|---|---|---|
| `/reports` | POST | Create ranked/trended reports |
| `/reports/topItems` | GET | Quick top-N for a dimension |
| `/data/dataviews` | GET, POST, PUT, DELETE | Data view CRUD |
| `/data/dataviews/{id}/metrics` | GET | List metrics in a data view |
| `/data/dataviews/{id}/dimensions` | GET | List dimensions in a data view |
| `/data/connections` | GET | List connections |
| `/data/connections/{id}` | GET | Connection details |
| `/calculatedmetrics` | GET, POST, PUT, DELETE | Calculated metric CRUD |
| `/segments` | GET, POST, PUT, DELETE | Segment (filter) CRUD |
| `/dateranges` | GET, POST, PUT, DELETE | Date range CRUD |
| `/projects` | GET, POST, PUT, DELETE | Workspace project CRUD |
| `/tags` | GET, POST, PUT, DELETE | Tag CRUD |
| `/shares` | GET, POST, PUT, DELETE | Share CRUD |
| `/auditlogs` | GET | Retrieve audit logs |
| `/annotations` | GET, POST, PUT, DELETE | Annotation CRUD |

---

## Reporting API

### POST `/reports` — Ranked report

This is the primary reporting endpoint. It returns the same data that Analysis Workspace uses.

**Tip:** In Analysis Workspace, go to **Help > Enable debugger** to see the exact JSON payloads the UI sends. You can copy and adapt these for your own API calls.

#### Request body

```json
{
  "rsid": "dv_YOUR_DATAVIEW_ID",
  "globalFilters": [
    {
      "type": "dateRange",
      "dateRange": "2025-01-01T00:00:00.000/2025-02-01T00:00:00.000"
    }
  ],
  "metricContainer": {
    "metrics": [
      {
        "columnId": "0",
        "id": "metrics/pageviews",
        "sort": "desc"
      }
    ]
  },
  "dimension": "variables/page",
  "settings": {
    "countRepeatInstances": true,
    "limit": 50,
    "page": 0,
    "nonesBehavior": "return-nones"
  }
}
```

#### Response structure

```json
{
  "totalPages": 3,
  "firstPage": true,
  "lastPage": false,
  "numberOfElements": 50,
  "number": 0,
  "totalElements": 142,
  "columns": {
    "dimension": {
      "id": "variables/page",
      "type": "string"
    },
    "columnIds": ["0"],
    "columnErrors": []
  },
  "rows": [
    {
      "itemId": "123456789",
      "value": "Home Page",
      "data": [48521.0]
    },
    {
      "itemId": "987654321",
      "value": "Product Detail",
      "data": [32104.0]
    }
  ]
}
```

#### Pagination

Use `settings.limit` and `settings.page` to paginate. The response includes `totalPages`, `firstPage`, `lastPage`, and `numberOfElements` to help navigate.

#### Multiple metrics

Add more objects to the `metrics` array. Each needs a unique `columnId`. The `data` array in each row will contain values in the same order.

```json
"metrics": [
  { "columnId": "0", "id": "metrics/pageviews", "sort": "desc" },
  { "columnId": "1", "id": "metrics/visits" },
  { "columnId": "2", "id": "metrics/visitors" }
]
```

#### Filtering (segments)

Apply segment filters in `globalFilters` or per-metric via `metricContainer.metricFilters`:

```json
"globalFilters": [
  {
    "type": "dateRange",
    "dateRange": "2025-01-01T00:00:00.000/2025-02-01T00:00:00.000"
  },
  {
    "type": "segment",
    "segmentId": "s123_abc_def"
  }
]
```

### GET `/reports/topItems` — Quick top items

Simpler endpoint that returns top dimension values ranked by a metric. Does **not** return metric values — only dimension item names.

```
GET https://cja.adobe.io/reports/topItems?rsid={dataViewId}&dimension={dimensionId}&limit=10
```

---

## Data Views API

### GET `/data/dataviews`

List all data views accessible to the authenticated user.

```
GET https://cja.adobe.io/data/dataviews
```

Query parameters:

| Param | Type | Description |
|---|---|---|
| `limit` | int | Max results (default 10) |
| `page` | int | Page number (0-indexed) |
| `expansion` | string | Comma-separated expansions (e.g., `connections`) |

### GET `/data/dataviews/{dataviewId}`

Get details of a specific data view.

### GET `/data/dataviews/{dataviewId}/metrics`

List all metrics available in a data view.

Query parameters:

| Param | Type | Description |
|---|---|---|
| `limit` | int | Max results |
| `page` | int | Page number |
| `includeType` | string | Filter by type (e.g., `standard`, `custom`) |

### GET `/data/dataviews/{dataviewId}/dimensions`

List all dimensions available in a data view.

---

## Calculated Metrics API

### GET `/calculatedmetrics`

List calculated metrics. Supports filtering by `ownerId`, `dataViewId`, `name`, and expansion with `usedIn` to see which projects reference a metric.

### POST `/calculatedmetrics`

Create a calculated metric.

```json
{
  "name": "Revenue per Visit",
  "description": "Total revenue divided by visits",
  "rsid": "dv_YOUR_DATAVIEW_ID",
  "definition": {
    "formula": {
      "func": "divide",
      "col1": { "func": "metric", "name": "metrics/revenue" },
      "col2": { "func": "metric", "name": "metrics/visits" }
    }
  }
}
```

### PUT `/calculatedmetrics/{id}`

Update an existing calculated metric (full replacement).

### DELETE `/calculatedmetrics/{id}`

Delete a calculated metric.

---

## Segments (Filters) API

### GET `/segments`

List segments. Supports `dataViewId`, `ownerId`, and `expansion` query parameters.

### POST `/segments`

Create a segment.

### PUT `/segments/{id}`

Update a segment.

### DELETE `/segments/{id}`

Delete a segment.

---

## Connections API

### GET `/data/connections`

List all connections.

### GET `/data/connections/{connectionId}`

Get connection details including datasets, status, and data ingestion information.

---

## Audit Logs API

### GET `/auditlogs`

Retrieve audit log entries showing how users interact with CJA.

Query parameters:

| Param | Type | Description |
|---|---|---|
| `startDate` | string | ISO 8601 start date |
| `endDate` | string | ISO 8601 end date |
| `action` | string | Filter by action type |
| `component` | string | Filter by component type |
| `limit` | int | Max results |
| `page` | int | Page number |

---

## Error handling

CJA APIs return standard HTTP status codes:

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (check request body) |
| 401 | Unauthorized (token issue) |
| 403 | Forbidden (permissions issue) |
| 404 | Resource not found |
| 429 | Rate limited (back off and retry) |
| 500 | Server error |

---

## References

- [CJA API Documentation](https://developer.adobe.com/cja-apis/docs/)
- [CJA API Reference (OpenAPI)](https://developer.adobe.com/cja-apis/docs/api/)
- [CJA Endpoint Guides](https://developer.adobe.com/cja-apis/docs/endpoints/)
- [Reporting API](https://developer.adobe.com/cja-apis/docs/endpoints/reporting/)
- [Reporting Debugger](https://developer.adobe.com/cja-apis/docs/endpoints/reporting/debugger/)
