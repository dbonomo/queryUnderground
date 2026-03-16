# cjapy — Python Wrapper for CJA API

**Repo:** [github.com/pitchmuc/cjapy](https://github.com/pitchmuc/cjapy)
**Install:** `pip install cjapy`
**License:** Apache-2.0

A Python wrapper around the Adobe Customer Journey Analytics API. Provides a `CJA` class with methods for retrieving and managing data views, metrics, dimensions, filters, calculated metrics, segments, projects, reports, and more. Report results are returned as `Workspace` instances (or DataFrames) by default.

> **Prerequisite:** Your Adobe Developer Console project must have access to **both** AEP and CJA APIs.

## Setup

### 1. Install

```bash
pip install cjapy
# or latest from GitHub:
pip install --upgrade git+https://github.com/pitchmuc/cjapy.git#egg=cjapy
```

### 2. Generate a config file

```python
import cjapy

# Generates a JSON template for OAuth Server-to-Server (default since v0.2.0)
cjapy.createConfigFile()
```

Fill in your credentials from Adobe Developer Console.

### 3. Import config and instantiate

```python
import cjapy

cjapy.importConfigFile('myconfig.json')
cja = cjapy.CJA()
```

Or configure programmatically (no file):

```python
import cjapy

cjapy.configure(
    org_id='YOUR_ORG_ID',
    client_id='YOUR_CLIENT_ID',
    secret='YOUR_SECRET',
    # additional params as needed
)
cja = cjapy.CJA()
```

## Module structure

```
cjapy/
├── cjapy.py           # Main CJA class with all API methods
├── workspace.py       # Workspace class (report result container)
├── requestCreator.py  # Helper to build report request bodies
├── projects.py        # Project analysis utilities
├── config.py          # Configuration management
├── configs.py         # Multi-config support
├── connector.py       # HTTP connector layer
└── token_provider.py  # OAuth token generation
```

## CJA class — Full method reference

### Data Views

| Method | Description |
|---|---|
| `getDataViews(limit=100, full=True, output="df")` | List all data views (DataFrame by default) |
| `getDataView(dataViewId, full=False, save=False)` | Get a specific data view |
| `createDataView(data)` | Create a data view from dict/JSON |
| `updateDataView(dataViewId, data)` | Update (PUT) a data view |
| `deleteDataView(dataViewId)` | Delete a data view |
| `validateDataView(data)` | Validate a data view definition |
| `copyDataView(dataViewId)` | Copy a data view's settings |

### Metrics & Dimensions

| Method | Description |
|---|---|
| `getMetrics(dataviewId, full=False, output="df")` | List metrics for a data view |
| `getMetric(dataviewId, metricId, full=True)` | Get a specific metric |
| `getDimensions(dataviewId, full=False, output="df")` | List dimensions for a data view |
| `getDimension(dataviewId, dimensionId, full=True)` | Get a specific dimension |
| `getTopItems(dataId, dimension, dateRange=None, limit=100, ...)` | Top items for a dimension |

### Filters (Segments)

| Method | Description |
|---|---|
| `getFilters(limit=100, full=False, output="df", ...)` | List filters |
| `getFilter(filterId, full=False)` | Get a single filter |
| `createFilter(data)` | Create a filter from dict/JSON |
| `updateFilter(filterId, data)` | Update a filter |
| `deleteFilter(filterId)` | Delete a filter |
| `validateFilter(data)` | Validate filter syntax |

### Calculated Metrics

| Method | Description |
|---|---|
| `getCalculatedMetrics(full=False, limit=100, output="dataframe")` | List calculated metrics |
| `getCalculatedMetric(calcId)` | Get a single calculated metric |
| `createCalculatedMetric(data)` | Create a calculated metric |
| `updateCalculatedMetrics(calcId, data)` | Update (PUT) a calculated metric |
| `deleteCalculateMetrics(calcId)` | Delete a calculated metric |
| `validateCalculatedMetric(data)` | Validate a calculated metric definition |
| `getCalculatedMetricsFunctions(output="raw")` | List available functions |

### Reporting

| Method | Description |
|---|---|
| `getReport(request, limit=1000, n_results="inf", returnClass=True, ...)` | Run a report. Returns a `Workspace` instance by default. Handles throttling automatically (12 req/6s, 120/min). |
| `getMultidimensionalReport(dimensions, dimensionLimit, metrics, dataViewId, globalFilters, ...)` | **Beta.** Automatic multi-dimensional breakdown reports. |
| `getPersonProfiles(dataviewId, featureMetrics, ...)` | Get person-level profile data (useful for ML feature extraction). |

### Projects

| Method | Description |
|---|---|
| `getProjects(full=True, output=None)` | List projects with metadata |
| `getProject(projectId)` | Get a specific project definition |
| `createProject(projectDefinition)` | Create a project |
| `updateProject(projectId, projectDefinition)` | Update a project |
| `deleteProject(projectId)` | Delete a project |
| `validateProject(projectDefinition)` | Validate a project definition |

### Connections

| Method | Description |
|---|---|
| `getConnections(limit=100, output="df")` | List connections |
| `getConnection(connectionId)` | Get connection details |

### Tags & Shares

| Method | Description |
|---|---|
| `getTags(limit=None)` | List company tags |
| `getTag(tagId)` | Get a single tag |
| `createTags(data)` | Create tags |
| `updateTags(data)` | Update tags (PUT) |
| `deleteTags(componentIds, componentType)` | Remove tags from components |
| `getComponentTags(componentId, componentType)` | Get tags for a component |
| `getShares(userId=None)` | List shared elements |
| `getShare(shareId)` | Get a specific share |
| `updateShares(data)` | Update shares (PUT, replaces current set) |
| `deleteShare(shareId)` | Delete a share |
| `searchShares(data, full=False, limit=10)` | Search shares |

### Date Ranges

| Method | Description |
|---|---|
| `getDateRanges(limit=None, output=None)` | List date ranges |
| `getDateRange(dateRangeId)` | Get a date range |
| `createDateRange(dateRangeData)` | Create a date range |
| `updateDateRange(dateRangeId, data)` | Update a date range |
| `deleteDateRange(dateRangeId)` | Delete a date range |

### Annotations

| Method | Description |
|---|---|
| `getAnnotations(full=True, limit=1000)` | List annotations |
| `getAnnotation(annotationId)` | Get an annotation |
| `createAnnotation(name, dateRange, dataViewId, ...)` | Create an annotation |
| `updateAnnotation(annotationId, annotationObj)` | Update an annotation |
| `deleteAnnotation(annotationId)` | Delete an annotation |

### Audit Logs

| Method | Description |
|---|---|
| `getAuditLogs(startDate=None, endDate=None, action=None, component=None, ...)` | Get audit logs with filters. Actions: `CREATE`, `EDIT`, `DELETE`, `LOGIN_FAILED`, `LOGIN_SUCCESSFUL`, `API_REQUEST`. |
| `searchAuditLogs(filterMessage)` | Advanced search with operators (`EQUALS`, `CONTAINS`, `NOT_EQUALS`, `IN`) and connectors (`AND`, `OR`). |

### Users & Assets

| Method | Description |
|---|---|
| `getCurrentUser()` | Get current user info |
| `getUsers()` | List all users with IMS IDs |
| `getAssetCount(imsUserId)` | Count assets owned by a user |
| `transferAssets(imsUserId, assets)` | Transfer assets to another user |
| `getSharedComponentsMatrix()` | Matrix of shared dimensions/metrics across all data views |

## Workspace class

The `Workspace` object is returned by `getReport()`. Key methods:

| Method | Description |
|---|---|
| `to_csv(filename, delimiter, index=False)` | Export to CSV |
| `to_json(filename, orient)` | Export to JSON |
| `breakdown(index, dimension, n_results=10)` | Break down a row by another dimension |

## RequestCreator class

A helper to build report request payloads programmatically instead of hand-writing JSON.

```python
req = cjapy.RequestCreator()
req.setDataViewId('dv_xxx')
req.setDimension('variables/page')
req.addMetric('metrics/visits')
req.addMetric('metrics/orders', attributionModel='lastTouch', lookbackWindow=30)
req.addGlobalFilter('2025-01-01T00:00:00.000/2025-02-01T00:00:00.000')
req.setLimit(100)

report = cja.getReport(req.to_dict())
```

| Method | Description |
|---|---|
| `setDimension(dimension)` | Set the report dimension |
| `setDataViewId(dataViewId)` | Set the data view |
| `addMetric(metricId, attributionModel=None, lookbackWindow=30, lookbackGranularity="day")` | Add a metric (with optional attribution) |
| `addGlobalFilter(filterId, adHocFilter)` | Add a filter or date range |
| `removeGlobalFilter(index, filterId)` | Remove a filter |
| `addMetricFilter(metricId, filterId, metricIndex, staticRow=False)` | Filter a specific metric |
| `removeMetricFilter(filterId)` | Remove metric filter |
| `setDateRange(start_date, end_date)` | Set date range |
| `updateDateRange(dateRange, shiftingDays, ...)` | Shift dates |
| `setLimit(limit=100)` | Set result count |
| `setSearch(itemIds, clause, reset=True)` | Search for dimension values |
| `setNoneBehavior(returnNones=True)` | Handle None values |
| `setRepeatInstance(repeat=True)` | Count repeat instances |
| `setDimensionSort(order="dsc")` | Sort order |
| `setSampling(sample, upsample=False)` | Set sampling |
| `to_dict()` | Return as dict |
| `save(fileName)` | Save to JSON file |

**Attribution models:** `lastTouch`, `firstTouch`, `linear`, `participation`, `sameTouch`, `uShaped`, `jShaped`, `reverseJShaped`, `timeDecay`, `positionBased`, `algorithmic`

**Built-in date ranges** (via `req.dates`): `thisMonth`, `last30daysTillToday`, `lastMonth`, `thisWeek`, `lastWeek`, `last7days`, `yesterday`, `today`, `thisYear`, `lastYear`, etc.

## Operational notes

- **Rate limits:** 120 requests/minute, burst limit of 12 per 6 seconds. Handled automatically by the library.
- **Concurrency:** CJA servers typically allow 5 simultaneous reports per org.
- **Single dimension per report:** Use `breakdown()` or `getMultidimensionalReport()` for multi-dimensional analysis.
- **Output formats:** Most GET methods accept `output="df"` (DataFrame, default) or `output="raw"` (JSON/list).
- **`n_results="inf"`** fetches all results with automatic pagination.
- **Caching:** Many methods support `cache=True` / `useCache=True` to avoid redundant API calls.
- **Logging:** `cja = cjapy.CJA(loggingObject=cjapy.generateLoggingObject(level="DEBUG"))` for debug output.

## Common usage patterns

### Pull a report

```python
import cjapy

cjapy.importConfigFile('config.json')
cja = cjapy.CJA()

# From a JSON request file (copy from Workspace debugger)
report = cja.getReport('my_request.json')
report.to_csv('output.csv')

# Or build the request as a dict
request = {
    "rsid": "dv_my_dataview",
    "globalFilters": [{"type": "dateRange", "dateRange": "2025-01-01T00:00:00.000/2025-02-01T00:00:00.000"}],
    "metricContainer": {"metrics": [{"columnId": "0", "id": "metrics/pageviews", "sort": "desc"}]},
    "dimension": "variables/page",
    "settings": {"limit": 50, "page": 0}
}
report = cja.getReport(request)
```

### Multi-dimensional breakdown

```python
report = cja.getMultidimensionalReport(
    dimensions=["variables/page", "variables/browser"],
    dimensionLimit={"variables/page": 10, "variables/browser": 5},
    metrics=["metrics/pageviews", "metrics/visits"],
    dataViewId="dv_xxx",
    globalFilters=[{"type": "dateRange", "dateRange": "2025-01-01T00:00:00.000/2025-02-01T00:00:00.000"}],
)
```

### Build a report with RequestCreator

```python
req = cjapy.RequestCreator()
req.setDataViewId('dv_xxx')
req.setDimension('variables/page')
req.addMetric('metrics/visits')
req.addMetric('metrics/orders', attributionModel='lastTouch', lookbackWindow=30)
req.addGlobalFilter(req.dates['last30daysTillToday'])
req.setLimit(100)

report = cja.getReport(req.to_dict())
```

### Breakdown a report row

```python
report = cja.getReport(request)
# Break down the first row by product dimension
breakdown = report.breakdown(index=0, dimension='variables/product', n_results=20)
```

### Person profiles (for ML feature extraction)

```python
df = cja.getPersonProfiles(
    dataviewId='dv_xxx',
    featureMetrics=['metrics/visits', 'metrics/pageviews', 'metrics/timespent'],
    targetMetric='metrics/orders',
    binaryTargetMetric=True,
    startDate='2025-01-01',
    endDate='2025-03-31',
    sampleSize=10000,
)
```

### List and inspect data views

```python
data_views = cja.getDataViews()  # Returns DataFrame
metrics = cja.getMetrics("dv_xxx")
dimensions = cja.getDimensions("dv_xxx")
```

## References

- [cjapy GitHub](https://github.com/pitchmuc/cjapy)
- [cjapy docs](https://github.com/pitchmuc/cjapy/tree/master/docs)
- [CJA API official docs](https://developer.adobe.com/cja-apis/docs/)
