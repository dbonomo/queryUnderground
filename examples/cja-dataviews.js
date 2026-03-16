#!/usr/bin/env node

/**
 * Example: List data views and their available metrics/dimensions.
 *
 * Usage:
 *   node examples/cja-dataviews.js
 *   DATAVIEW_ID=dv_xxx node examples/cja-dataviews.js   # inspect a specific data view
 */

require('dotenv').config();
const { listDataViews, getDataView, listMetrics, listDimensions } = require('../src/cja-client');

async function main() {
  const specificId = process.env.DATAVIEW_ID;

  if (specificId) {
    // Show details for a specific data view
    const dv = await getDataView(specificId);
    console.log(`Data View: ${dv.name} (${dv.id})`);
    console.log(`Description: ${dv.description || '(none)'}`);
    console.log(`Connection: ${dv.connectionId}`);
    console.log();

    const metrics = await listMetrics(specificId, { limit: 100 });
    console.log(`Metrics (${metrics.totalElements || metrics.length}):`);
    for (const m of metrics.content || metrics) {
      console.log(`  ${m.id} — ${m.name}`);
    }

    console.log();

    const dimensions = await listDimensions(specificId, { limit: 100 });
    console.log(`Dimensions (${dimensions.totalElements || dimensions.length}):`);
    for (const d of dimensions.content || dimensions) {
      console.log(`  ${d.id} — ${d.name}`);
    }
  } else {
    // List all data views
    const result = await listDataViews({ limit: 50 });
    const views = result.content || result;

    console.log('Available Data Views:\n');
    for (const dv of views) {
      console.log(`  ${dv.id} — ${dv.name}`);
    }
    console.log(`\nTotal: ${views.length}`);
    console.log('\nSet DATAVIEW_ID env var to inspect a specific data view.');
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
