#!/usr/bin/env node

/**
 * Example: Query the AEP Schema Registry.
 *
 * Lists tenant schemas, and optionally shows details for a specific schema.
 *
 * Usage:
 *   node examples/aep-schemas.js
 *   SCHEMA_ID=https://ns.adobe.com/... node examples/aep-schemas.js
 */

require('dotenv').config();
const { listSchemas, getSchema, listFieldGroups } = require('../src/aep-client');

async function main() {
  const sandbox = process.env.AEP_SANDBOX || 'prod';
  const schemaId = process.env.SCHEMA_ID;

  if (schemaId) {
    console.log(`Fetching schema: ${schemaId}\n`);
    const schema = await getSchema(schemaId, { sandbox });
    console.log(JSON.stringify(schema, null, 2));
  } else {
    console.log(`Listing tenant schemas (sandbox: ${sandbox}):\n`);
    const result = await listSchemas({ sandbox });
    const schemas = result.results || result;

    for (const s of schemas) {
      console.log(`  ${s['$id'] || s.meta_alt_id || s.title} — ${s.title || '(untitled)'}`);
    }

    console.log(`\nTotal: ${schemas.length}`);

    console.log('\n--- Field Groups ---\n');
    const fgs = await listFieldGroups({ sandbox });
    const groups = fgs.results || fgs;
    for (const fg of groups) {
      console.log(`  ${fg['$id'] || fg.meta_alt_id || fg.title} — ${fg.title || '(untitled)'}`);
    }
    console.log(`\nTotal: ${groups.length}`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
