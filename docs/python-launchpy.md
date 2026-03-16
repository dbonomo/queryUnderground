# launchpy — Python Wrapper for Adobe Launch API

**Repo:** [github.com/pitchmuc/launchpy](https://github.com/pitchmuc/launchpy)
**Install:** `pip install launchpy`
**License:** GPL-3.0

A Python wrapper for the Adobe Experience Platform Data Collection (Launch) API. Manages properties, extensions, rules, data elements, and the publishing lifecycle programmatically.

## Setup

### 1. Install

```bash
pip install launchpy
```

### 2. Generate a config file

```python
import launchpy as lp
lp.createConfigFile()
```

Supports both **OAuth V2** (default) and **JWT** authentication. Specify with `auth_type` parameter:

```python
lp.createConfigFile(auth_type='oauthV2')  # or 'jwt'
```

Fill in your Adobe Developer Console credentials in the generated JSON.

### 3. Import config

```python
import launchpy as lp
lp.importConfigFile('myconfig.json')
```

## Module structure

```
launchpy/
├── launchpy.py      # Core helper functions
├── admin.py         # Admin class — company/property discovery
├── property.py      # Property class — manage a single property
├── library.py       # Library class — publishing lifecycle
├── synchronizer.py  # Synchronizer class — sync properties
├── config.py        # Configuration management
├── configs.py       # Multi-config support
├── connector.py     # HTTP connector layer
└── cli/             # Command-line interface
```

## Workflow

### Step 1: Admin — discover companies and properties

```python
import launchpy as lp
lp.importConfigFile('config.json')

admin = lp.Admin()
company_id = admin.getCompanyId()       # stored in admin.COMPANY_ID
properties = admin.getProperties(company_id)  # stored in admin.properties
```

### Step 2: Property — manage a specific property

```python
# Select a property
my_prop = [p for p in properties if p['attributes']['name'] == 'My Site'][0]
prop = lp.Property(my_prop)
```

### Step 3: Work with property resources

```python
# Data elements
data_elements = prop.getDataElements()
prop.createDataElement(name='myDE', descriptor='...', extension={...})

# Rules
rules = prop.getRules()
prop.createRule('My New Rule')

# Extensions
extensions = prop.getExtensions()
prop.checkExtensionUpdate()  # check for available updates

# Environments
envs = prop.getEnvironments()
```

### Step 4: Library — publish changes

```python
lib = prop.createLibrary('v1.2.0', return_class=True)
# Or get an existing library
lib = prop.getLibrary('v1.2.0')
```

## Property class — Full method reference

### GET methods

| Method | Description |
|---|---|
| `getRessource(res_url, params=None)` | Generic GET from any Launch API URL |
| `getEnvironments()` | List environments |
| `getHost()` | List hosts |
| `getExtensions()` | List extensions |
| `getProfile()` | Get profile info |
| `getRules()` | List all rules (populates `ruleComponents` attribute) |
| `getRule(rule_id, attr_dict)` | Get/update a specific rule |
| `getRulesComponents(rule_ids=None, rule_names=None)` | List all rule components |
| `getRuleComponent(rc_id)` | Get a single rule component |
| `getRuleComponents(rule_id)` | Get components for a specific rule |
| `getDataElements()` | List all data elements |
| `getDataElement(dataElementId)` | Get a specific data element |
| `getLibraries(state=None, name=None, ...)` | List libraries with optional filters |
| `getLibrary(library)` | Get a library by name or ID |
| `getNotes(data=None)` | Get notes for an object |
| `getRuleRevision(rule_id)` | Get revisions of a rule |
| `getRevisions(element)` | Get revisions of any element |
| `getProductionEndpoint()` | Get the production library URL |
| `getStagingEndpoint()` | Get the staging library URL |

### CREATE methods

| Method | Description |
|---|---|
| `createExtension(extension_id, settings, delegate_descriptor_id)` | Add an extension |
| `createRule(name)` | Create a rule |
| `createRuleComponent(name, descriptor, extension_infos, rule_infos, settings=None, order=None, ...)` | Create a rule component |
| `createDataElement(name, descriptor, extension, settings=None, **kwargs)` | Create a data element |
| `createEnvironment(name, host_id, stage=None)` | Create an environment (max 1 staging, 1 production) |
| `createHost(name, host_type=None, username=None, ...)` | Create a host (default: Akamai) |
| `createLibrary(name, return_class=None)` | Create a library (optionally returns `Library` instance) |

### UPDATE methods

| Method | Description |
|---|---|
| `updateRule(rule_id, attr_dict)` | Update a rule |
| `updateRuleComponent(rc_id, attr_dict)` | Update a rule component |
| `updateDataElement(dataElement_id, attr_dict)` | Update a data element |
| `updateEnvironment(name, env_id)` | Rename an environment |
| `updateExtension(extension_id, attr_dict)` | Update an extension |
| `updateCustomCode(comp_id, customCode, encoding=None)` | Update custom JS code for a component |

### DELETE methods

| Method | Description |
|---|---|
| `deleteEnvironment(env_id)` | Delete an environment |
| `deleteExtension(extension_id)` | Delete an extension |
| `deleteRule(rule_id)` | Delete a rule |
| `deleteRuleComponent(rc_id)` | Delete a rule component |
| `deleteDataElement(dataElement_id)` | Delete a data element |
| `deleteLibrary(library, components=None)` | Delete a library (development state only) |

### Helper methods

| Method | Description |
|---|---|
| `checkExtensionUpdate(platform=None)` | Check for extension updates |
| `upgradeExtension(extension_id, package_id)` | Upgrade an extension |
| `searchRules(name=None, enabled=None, published=None, dirty=None)` | Search rules by criteria |
| `searchDataElements(name=None, enabled=None, published=None, dirty=None)` | Search data elements |
| `extractSettings(element, save=None)` | Extract settings/custom code from an element |
| `extractAttributes(element, save=None)` | Extract attributes from an element |
| `duplicateAttributes(base_elements, target_elements)` | Copy settings between elements |
| `copySettings(data)` | Copy settings for creation |
| `extensionsInfo(data)` | Format extensions as dict |
| `rulesInfo(data)` | Format rules as dict |
| `dataElementInfo(data)` | Format data elements as dict |

## Common patterns

### Export all rules and data elements

```python
rules = prop.getRules()
for rule in rules:
    components = prop.getRuleComponents(rule['id'])
    for comp in components:
        prop.extractSettings(comp, save=True)

data_elements = prop.getDataElements()
for de in data_elements:
    prop.extractSettings(de, save=True)
```

### Check and upgrade extensions

```python
updates = prop.checkExtensionUpdate()
for ext_name, info in updates.items():
    if info.get('update_available'):
        prop.upgradeExtension(info['id'], info['new_package_id'])
```

### Publish a library

```python
lib = prop.createLibrary('v2.0.0', return_class=True)
# Add resources, then build and publish through the Library class
```

## References

- [launchpy GitHub](https://github.com/pitchmuc/launchpy)
- [launchpy docs](https://github.com/pitchmuc/launchpy/tree/master/docs)
- [Adobe Launch API docs](https://developer.adobe.com/experience-platform-apis/references/reactor/)
