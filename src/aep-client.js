/**
 * Adobe Experience Platform API client.
 *
 * Wraps common AEP endpoints with convenient methods.
 * Uses src/auth.js for authentication.
 */

const { getHeaders } = require('./auth');

const AEP_BASE = 'https://platform.adobe.io';

/**
 * Make an authenticated request to the AEP API.
 *
 * @param {string} path - API path (e.g., "/data/foundation/catalog/datasets")
 * @param {Object} [options]
 * @param {string} [options.method] - HTTP method
 * @param {Object} [options.body] - JSON body
 * @param {string} [options.sandbox] - Sandbox name (default: "prod")
 * @param {Object} [options.headers] - Additional headers
 */
async function aepFetch(path, options = {}) {
  const headers = await getHeaders({ sandbox: options.sandbox || 'prod' });
  const url = `${AEP_BASE}${path}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: { ...headers, ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AEP API ${options.method || 'GET'} ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Schema Registry
// ---------------------------------------------------------------------------

/**
 * List tenant schemas.
 * @param {Object} [options] - { sandbox, headers }
 */
async function listSchemas(options = {}) {
  return aepFetch('/data/foundation/schemaregistry/tenant/schemas', {
    ...options,
    headers: {
      Accept: 'application/vnd.adobe.xed-id+json',
      ...options.headers,
    },
  });
}

async function getSchema(schemaId, options = {}) {
  return aepFetch(`/data/foundation/schemaregistry/tenant/schemas/${encodeURIComponent(schemaId)}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.adobe.xed+json',
      ...options.headers,
    },
  });
}

async function listFieldGroups(options = {}) {
  return aepFetch('/data/foundation/schemaregistry/tenant/fieldgroups', {
    ...options,
    headers: {
      Accept: 'application/vnd.adobe.xed-id+json',
      ...options.headers,
    },
  });
}

// ---------------------------------------------------------------------------
// Catalog (Datasets)
// ---------------------------------------------------------------------------

async function listDatasets(params = {}, options = {}) {
  const qs = new URLSearchParams(params).toString();
  return aepFetch(`/data/foundation/catalog/datasets${qs ? `?${qs}` : ''}`, options);
}

async function getDataset(datasetId, options = {}) {
  return aepFetch(`/data/foundation/catalog/datasets/${datasetId}`, options);
}

async function createDataset(body, options = {}) {
  return aepFetch('/data/foundation/catalog/datasets', { ...options, method: 'POST', body });
}

async function listBatches(params = {}, options = {}) {
  const qs = new URLSearchParams(params).toString();
  return aepFetch(`/data/foundation/catalog/batches${qs ? `?${qs}` : ''}`, options);
}

// ---------------------------------------------------------------------------
// Query Service
// ---------------------------------------------------------------------------

async function createQuery(sql, name = '', options = {}) {
  return aepFetch('/qs/queries', {
    ...options,
    method: 'POST',
    body: {
      dbName: 'prod:all',
      sql,
      name: name || 'API query',
    },
  });
}

async function getQuery(queryId, options = {}) {
  return aepFetch(`/qs/queries/${queryId}`, options);
}

async function listQueries(params = {}, options = {}) {
  const qs = new URLSearchParams(params).toString();
  return aepFetch(`/qs/queries${qs ? `?${qs}` : ''}`, options);
}

/**
 * Poll a query until it completes or fails.
 *
 * @param {string} queryId
 * @param {Object} [options]
 * @param {number} [options.intervalMs=5000] - Polling interval
 * @param {number} [options.maxAttempts=60] - Max polling attempts
 */
async function waitForQuery(queryId, options = {}) {
  const intervalMs = options.intervalMs || 5000;
  const maxAttempts = options.maxAttempts || 60;

  for (let i = 0; i < maxAttempts; i++) {
    const result = await getQuery(queryId, options);
    if (result.state === 'SUCCESS' || result.state === 'FAILED') {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Query ${queryId} did not complete after ${maxAttempts} polling attempts`);
}

// ---------------------------------------------------------------------------
// Segmentation
// ---------------------------------------------------------------------------

async function listAudiences(params = {}, options = {}) {
  const qs = new URLSearchParams(params).toString();
  return aepFetch(`/segment/audiences${qs ? `?${qs}` : ''}`, options);
}

async function createSegmentDefinition(body, options = {}) {
  return aepFetch('/segment/definitions', { ...options, method: 'POST', body });
}

async function getSegmentDefinition(segmentId, options = {}) {
  return aepFetch(`/segment/definitions/${segmentId}`, options);
}

async function createSegmentJob(segmentId, options = {}) {
  return aepFetch('/segment/jobs', {
    ...options,
    method: 'POST',
    body: { segmentId },
  });
}

async function getSegmentJob(jobId, options = {}) {
  return aepFetch(`/segment/jobs/${jobId}`, options);
}

// ---------------------------------------------------------------------------
// Real-Time Customer Profile
// ---------------------------------------------------------------------------

async function getProfile(entityId, namespace, options = {}) {
  const qs = new URLSearchParams({
    'schema.name': '_xdm.context.profile',
    entityId,
    entityIdNS: namespace,
  }).toString();
  return aepFetch(`/data/core/ups/access/entities?${qs}`, options);
}

async function listMergePolicies(options = {}) {
  return aepFetch('/data/core/ups/config/mergePolicies', options);
}

// ---------------------------------------------------------------------------
// Identity Service
// ---------------------------------------------------------------------------

async function listIdentityNamespaces(options = {}) {
  return aepFetch('/data/core/idnamespace/identities', options);
}

// ---------------------------------------------------------------------------
// Sandboxes
// ---------------------------------------------------------------------------

async function listSandboxes(options = {}) {
  return aepFetch('/data/foundation/sandbox-management/sandboxes', options);
}

module.exports = {
  aepFetch,
  listSchemas,
  getSchema,
  listFieldGroups,
  listDatasets,
  getDataset,
  createDataset,
  listBatches,
  createQuery,
  getQuery,
  listQueries,
  waitForQuery,
  listAudiences,
  createSegmentDefinition,
  getSegmentDefinition,
  createSegmentJob,
  getSegmentJob,
  getProfile,
  listMergePolicies,
  listIdentityNamespaces,
  listSandboxes,
};
