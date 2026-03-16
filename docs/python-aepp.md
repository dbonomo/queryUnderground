# aepp — Python Wrapper for AEP API

**Repo:** [github.com/pitchmuc/aepp](https://github.com/pitchmuc/aepp)
**Install:** `pip install aepp`
**License:** Apache-2.0

A comprehensive Python wrapper for the Adobe Experience Platform APIs. Each AEP service has its own sub-module with a dedicated class. Supports both OAuth and JWT authentication.

## Setup

### 1. Install

```bash
pip install aepp --upgrade
```

> Requires Python 3.9+. Not all dependencies fully support 3.10+ yet.

### 2. Generate a config file

**OAuth (recommended):**

```python
import aepp
aepp.createConfigFile(destination='config.json', auth_type="oauth")
```

Produces:

```json
{
    "org_id": "<orgID>",
    "client_id": "<client_id>",
    "secret": "<YourSecret>",
    "sandbox-name": "prod",
    "environment": "prod",
    "auth_code": "<auth_code>"
}
```

**JWT (legacy):**

```python
import aepp
aepp.createConfigFile(destination='config.json')
```

Produces a template with `tech_id` and `pathToKey` fields for JWT auth.

### 3. Import config and use modules

```python
import aepp
aepp.importConfigFile('config.json', auth_type="oauth")

from aepp import schema
mySchema = schema.Schema()
```

Or configure programmatically:

```python
import aepp
aepp.configure(
    org_id='YOUR_ORG_ID',
    client_id='YOUR_CLIENT_ID',
    secret='YOUR_SECRET',
    auth_code='YOUR_AUTH_CODE',  # for OAuth
    environment='prod',
    sandbox='prod',
)
```

### Multi-sandbox support

```python
config1 = aepp.importConfigFile('sandbox1_config.json', connectInstance=True)
config2 = aepp.importConfigFile('sandbox2_config.json', connectInstance=True)

from aepp import schema
schema1 = schema.Schema(config=config1)
schema2 = schema.Schema(config=config2)
```

## Available modules

| Module | Class | AEP Service |
|---|---|---|
| `schema` | `Schema` | Schema Registry — XDM schema CRUD |
| `catalog` | `Catalog` | Catalog Service — dataset metadata |
| `datasets` | `Datasets` | Dataset operations |
| `queryservice` | `QueryService` | Query Service — SQL queries on the data lake |
| `queryservice` | `InteractiveQuery` | Interactive SQL via psycopg2 (returns DataFrames) |
| `segmentation` | `Segmentation` | Segmentation Service — audiences |
| `customerprofile` | `CustomerProfile` | Real-Time Customer Profile |
| `identity` | `Identity` | Identity Service — namespaces and graphs |
| `sandboxes` | `Sandboxes` | Sandbox management |
| `flowservice` | `FlowService` | Source/destination connectors |
| `ingestion` | `Ingestion` | Data ingestion (batch/streaming) |
| `dataaccess` | `DataAccess` | Data access and download |
| `dataprep` | `DataPrep` | Data prep / mapping functions |
| `policy` | `Policy` | Data governance / DULE policies |
| `accesscontrol` | `AccessControl` | Permission management |
| `privacyservice` | `PrivacyService` | GDPR/privacy requests (requires separate JWT creds) |
| `observability` | `Observability` | Platform observability insights |
| `destinationauthoring` | `DestinationAuthoring` | Destination SDK authoring |
| `destinationinstanceservice` | `DestinationInstanceService` | Destination instance management |
| `sensei` | `Sensei` | ML / Data Science Workspace |
| `hygiene` | `Hygiene` | Data hygiene operations |
| `edge` | `Edge` | Edge Network |

## Key module usage patterns

### Schema Registry

```python
from aepp import schema

s = schema.Schema()

# List all tenant schemas
schemas = s.getSchemas()

# Get a specific schema
my_schema = s.getSchema(schemaId="https://ns.adobe.com/tenant/schemas/xxx")

# Create a schema
s.createSchema({
    "title": "My Schema",
    "type": "object",
    "allOf": [{"$ref": "https://ns.adobe.com/xdm/context/experienceevent"}]
})

# Field groups
field_groups = s.getFieldGroups()
```

### Schema — SchemaManager & FieldGroupManager

Higher-level helpers for inspecting and composing schemas:

```python
# Inspect a schema
sm = s.SchemaManager("https://ns.adobe.com/tenant/schemas/xxx")
sm.searchField("email", partialMatch=True)
df = sm.to_dataframe()

# Compose a field group
fgm = s.FieldGroupManager(fieldGroup="fg_id_or_dict", title="My FG")
fgm.addField("myField", "string", title="My Field")
fgm.addField("myObj", "object", objectComponents={"sub1": "string", "sub2": "integer"})
fgm.createFieldGroup()
```

### Query Service

```python
from aepp import queryservice

qs = queryservice.QueryService()

# Submit a batch query
query = qs.postQueries(sql="SELECT * FROM my_dataset LIMIT 10", name="test")

# List queries
queries = qs.getQueries()

# Scheduled queries (API-only feature)
qs.createSchedule(name="weekly", sql="SELECT * FROM ds", schedule={"schedule": "0 0 * * 1"})
schedules = qs.getSchedules()

# Interactive query (requires psycopg2 and PSQL connection)
conn = qs.connection()
iq = queryservice.InteractiveQuery2(conn)
df = iq.query("SELECT * FROM my_dataset LIMIT 100", output="dataframe")

# Query by identity
df = iq.queryIdentity(
    identityId="21d67084-398e-4a48-8723-2fd",
    fields=['_tenant.person.fullname', '_tenant.person.sex'],
    tableName='myTableName'
)
```

### Segmentation

```python
from aepp import segmentation

seg = segmentation.Segmentation()

# List segment definitions
segments = seg.getSegments()

# Create a segment
seg.createSegment({
    "name": "US Users",
    "expression": {
        "type": "PQL",
        "format": "pql/text",
        "value": "homeAddress.countryCode = 'US'"
    },
    "schema": {"name": "_xdm.context.profile"}
})
```

### Catalog / Datasets

```python
from aepp import catalog

cat = catalog.Catalog()

# List datasets
datasets = cat.getDataSets()

# Get a specific dataset
ds = cat.getDataSet(datasetId="abc123")

# List batches
batches = cat.getBatches()
```

### Customer Profile

```python
from aepp import customerprofile

profile = customerprofile.CustomerProfile()

# Get a profile entity
entity = profile.getEntity(entityId="user@example.com", entityIdNS="email")

# List merge policies
policies = profile.getMergePolicies()
```

### Identity Service

```python
from aepp import identity

ident = identity.Identity()

# List identity namespaces
namespaces = ident.getIdentities()
```

### Sandboxes

```python
from aepp import sandboxes

sb = sandboxes.Sandboxes()
sandbox_list = sb.getSandboxes()
```

### Flow Service

```python
from aepp import flowservice

fs = flowservice.FlowService()

# List connections
connections = fs.getConnections()

# List flows
flows = fs.getFlows()
```

### Data Ingestion

```python
from aepp import ingestion

di = ingestion.DataIngestion()

# Streaming ingestion
di.streamMessage(inletId="my_inlet_id", data={"key": "value"})

# Batch ingestion
batch = di.createBatch(datasetId="ds_id", format="json")
di.uploadSmallFile(batchId=batch['id'], datasetId="ds_id", filePath="data.json")
di.uploadSmallFileFinish(batchId=batch['id'])
```

### DataPrep (Mapping)

```python
from aepp import dataprep

dp = dataprep.DataPrep()
mapping_sets = dp.getMappingSets()
dp.validateExpression(expression="trim(firstName)")
```

### Flow Service — FlowManager

```python
from aepp import flowservice

fs = flowservice.FlowService()

# Landing Zone operations
sas_uri = fs.getLandingZoneSASUri()
contents = fs.exploreLandingZone()

# FlowManager for a specific flow
fm = fs.FlowManager(flowId="flow_123")
fm.summary()
runs = fm.getRuns()
```

## Tips

- All modules follow the same pattern: `import module` → `Class()` → `methods()`
- Use `help(instance.methodName)` to see parameter details
- Most `get*` methods return lists or dicts; some support `output="df"` for DataFrames
- The `connectInstance=True` param on `importConfigFile` is key for multi-sandbox workflows
- `InteractiveQuery` requires PyGreSQL; `InteractiveQuery2` requires psycopg2. Both need PostgreSQL client libraries.
- Token management and retry logic are handled automatically by the connector
- Enable logging: pass `loggingObject=aepp.generateLoggingObject(level="DEBUG")` to any class
- Privacy Service requires a **separate** JWT auth config with specific Privacy API permissions

## References

- [aepp GitHub](https://github.com/pitchmuc/aepp)
- [aepp docs](https://github.com/pitchmuc/aepp/tree/master/docs)
- [AEP API official docs](https://developer.adobe.com/experience-platform-apis/)
