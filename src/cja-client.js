/**
 * Adobe Customer Journey Analytics API client.
 *
 * Wraps common CJA endpoints with convenient methods.
 * Uses src/auth.js for authentication.
 */

const { getHeaders } = require('./auth');

const CJA_BASE = 'https://cja.adobe.io';

/**
 * Make an authenticated request to the CJA API.
 */
async function cjaFetch(path, options = {}) {
  const headers = await getHeaders(options);
  const url = `${CJA_BASE}${path}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: { ...headers, ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CJA API ${options.method || 'GET'} ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Data Views
// ---------------------------------------------------------------------------

/**
 * List all data views.
 * @param {Object} [params] - Query params (limit, page, expansion)
 */
async function listDataViews(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/data/dataviews${qs ? `?${qs}` : ''}`);
}

/**
 * Get a single data view by ID.
 */
async function getDataView(dataViewId) {
  return cjaFetch(`/data/dataviews/${dataViewId}`);
}

/**
 * List metrics available in a data view.
 */
async function listMetrics(dataViewId, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/data/dataviews/${dataViewId}/metrics${qs ? `?${qs}` : ''}`);
}

/**
 * List dimensions available in a data view.
 */
async function listDimensions(dataViewId, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/data/dataviews/${dataViewId}/dimensions${qs ? `?${qs}` : ''}`);
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

/**
 * Run a ranked report.
 *
 * @param {Object} body - Full report request body
 * @param {string} body.rsid - Data view ID
 * @param {string} body.dimension - Dimension to report on
 * @param {Array}  body.globalFilters - Filters (date ranges, segments)
 * @param {Object} body.metricContainer - Metrics configuration
 * @param {Object} [body.settings] - Pagination and display settings
 * @returns {Promise<Object>} Report response with rows and columns
 */
async function runReport(body) {
  return cjaFetch('/reports', { method: 'POST', body });
}

/**
 * Get top items for a dimension (quick endpoint, no metric values returned).
 *
 * @param {string} dataViewId - Data view ID
 * @param {string} dimensionId - Dimension ID (e.g., "variables/page")
 * @param {Object} [params] - Additional params (limit, etc.)
 */
async function getTopItems(dataViewId, dimensionId, params = {}) {
  const qs = new URLSearchParams({ rsid: dataViewId, dimension: dimensionId, ...params }).toString();
  return cjaFetch(`/reports/topItems?${qs}`);
}

/**
 * Helper: build a simple ranked report request body.
 *
 * @param {Object} opts
 * @param {string} opts.dataViewId - Data view ID
 * @param {string} opts.dimension - Dimension ID (e.g., "variables/page")
 * @param {string[]} opts.metricIds - Metric IDs (e.g., ["metrics/pageviews"])
 * @param {string} opts.startDate - ISO date string
 * @param {string} opts.endDate - ISO date string
 * @param {number} [opts.limit=50] - Rows per page
 * @param {number} [opts.page=0] - Page number
 * @returns {Object} Request body ready for runReport()
 */
function buildReportBody({ dataViewId, dimension, metricIds, startDate, endDate, limit = 50, page = 0 }) {
  return {
    rsid: dataViewId,
    globalFilters: [
      {
        type: 'dateRange',
        dateRange: `${startDate}/${endDate}`,
      },
    ],
    metricContainer: {
      metrics: metricIds.map((id, i) => ({
        columnId: String(i),
        id,
        ...(i === 0 ? { sort: 'desc' } : {}),
      })),
    },
    dimension,
    settings: {
      countRepeatInstances: true,
      limit,
      page,
      nonesBehavior: 'return-nones',
    },
  };
}

// ---------------------------------------------------------------------------
// Calculated Metrics
// ---------------------------------------------------------------------------

async function listCalculatedMetrics(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/calculatedmetrics${qs ? `?${qs}` : ''}`);
}

async function getCalculatedMetric(id) {
  return cjaFetch(`/calculatedmetrics/${id}`);
}

async function createCalculatedMetric(body) {
  return cjaFetch('/calculatedmetrics', { method: 'POST', body });
}

async function updateCalculatedMetric(id, body) {
  return cjaFetch(`/calculatedmetrics/${id}`, { method: 'PUT', body });
}

async function deleteCalculatedMetric(id) {
  return cjaFetch(`/calculatedmetrics/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Segments (Filters)
// ---------------------------------------------------------------------------

async function listSegments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/segments${qs ? `?${qs}` : ''}`);
}

async function getSegment(id) {
  return cjaFetch(`/segments/${id}`);
}

async function createSegment(body) {
  return cjaFetch('/segments', { method: 'POST', body });
}

async function updateSegment(id, body) {
  return cjaFetch(`/segments/${id}`, { method: 'PUT', body });
}

async function deleteSegment(id) {
  return cjaFetch(`/segments/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Connections
// ---------------------------------------------------------------------------

async function listConnections(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/data/connections${qs ? `?${qs}` : ''}`);
}

async function getConnection(connectionId) {
  return cjaFetch(`/data/connections/${connectionId}`);
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------

async function getAuditLogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return cjaFetch(`/auditlogs${qs ? `?${qs}` : ''}`);
}

module.exports = {
  cjaFetch,
  listDataViews,
  getDataView,
  listMetrics,
  listDimensions,
  runReport,
  getTopItems,
  buildReportBody,
  listCalculatedMetrics,
  getCalculatedMetric,
  createCalculatedMetric,
  updateCalculatedMetric,
  deleteCalculatedMetric,
  listSegments,
  getSegment,
  createSegment,
  updateSegment,
  deleteSegment,
  listConnections,
  getConnection,
  getAuditLogs,
};
