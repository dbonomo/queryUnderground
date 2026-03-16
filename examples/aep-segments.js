#!/usr/bin/env node

/**
 * Example: Work with AEP Segmentation Service.
 *
 * Lists existing audiences and optionally creates a sample segment definition.
 *
 * Usage:
 *   node examples/aep-segments.js
 *   CREATE_SAMPLE=1 node examples/aep-segments.js   # also create a sample segment
 */

require('dotenv').config();
const { listAudiences, createSegmentDefinition, getSegmentDefinition } = require('../src/aep-client');

async function main() {
  const sandbox = process.env.AEP_SANDBOX || 'prod';

  // List existing audiences
  console.log(`Listing audiences (sandbox: ${sandbox}):\n`);
  const result = await listAudiences({}, { sandbox });
  const audiences = result.segments || result.children || result;

  if (Array.isArray(audiences)) {
    for (const a of audiences) {
      console.log(`  ${a.id} — ${a.name || '(untitled)'} [${a.status || 'unknown'}]`);
    }
    console.log(`\nTotal: ${audiences.length}`);
  } else {
    console.log('  (unexpected response format)');
    console.log(JSON.stringify(result, null, 2));
  }

  // Optionally create a sample segment
  if (process.env.CREATE_SAMPLE) {
    console.log('\n--- Creating sample segment ---\n');

    const segment = await createSegmentDefinition(
      {
        name: 'API Test - High Value Users',
        description: 'Created via aep-segments.js example',
        expression: {
          type: 'PQL',
          format: 'pql/text',
          value: 'homeAddress.countryCode = "US"',
        },
        schema: {
          name: '_xdm.context.profile',
        },
      },
      { sandbox }
    );

    console.log(`Created segment: ${segment.id}`);
    console.log(`Name: ${segment.name}`);
    console.log(`Status: ${segment.status}`);

    // Fetch it back
    const fetched = await getSegmentDefinition(segment.id, { sandbox });
    console.log('\nFull segment definition:');
    console.log(JSON.stringify(fetched, null, 2));
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
