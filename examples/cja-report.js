#!/usr/bin/env node

/**
 * Example: Pull a ranked report from CJA.
 *
 * Shows the top 20 pages by pageviews for the last 30 days.
 *
 * Usage:
 *   DATAVIEW_ID=dv_xxx node examples/cja-report.js
 */

require('dotenv').config();
const { runReport, buildReportBody } = require('../src/cja-client');

async function main() {
  const dataViewId = process.env.DATAVIEW_ID;
  if (!dataViewId) {
    console.error('Set DATAVIEW_ID env var to a valid CJA data view ID.');
    process.exit(1);
  }

  // Last 30 days
  const endDate = new Date().toISOString().split('T')[0] + 'T00:00:00.000';
  const startDate =
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00.000';

  const body = buildReportBody({
    dataViewId,
    dimension: 'variables/page',
    metricIds: ['metrics/pageviews', 'metrics/visits'],
    startDate,
    endDate,
    limit: 20,
  });

  console.log('Request body:', JSON.stringify(body, null, 2));
  console.log('---');

  const report = await runReport(body);

  console.log(`Total rows: ${report.totalElements}`);
  console.log(`Showing page ${report.number + 1} of ${report.totalPages}\n`);

  console.log('Page Name'.padEnd(50), 'Pageviews'.padStart(12), 'Visits'.padStart(12));
  console.log('-'.repeat(74));

  for (const row of report.rows) {
    const [pageviews, visits] = row.data;
    console.log(
      row.value.padEnd(50),
      String(Math.round(pageviews)).padStart(12),
      String(Math.round(visits)).padStart(12)
    );
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
