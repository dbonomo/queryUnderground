/**
 * Adobe OAuth Server-to-Server authentication client.
 *
 * Generates and caches access tokens using the client_credentials grant type.
 * Tokens are refreshed automatically when they expire.
 */

const TOKEN_ENDPOINT = 'https://ims-na1.adobelogin.com/ims/token/v3';

// Buffer before expiry to avoid using a token that's about to expire
const EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get a valid access token, generating a new one if necessary.
 *
 * @param {Object} [credentials] - Override credentials (defaults to env vars)
 * @param {string} [credentials.clientId]
 * @param {string} [credentials.clientSecret]
 * @param {string} [credentials.scopes]
 * @returns {Promise<string>} Access token
 */
async function getAccessToken(credentials = {}) {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = credentials.clientId || process.env.ADOBE_CLIENT_ID;
  const clientSecret = credentials.clientSecret || process.env.ADOBE_CLIENT_SECRET;
  const scopes = credentials.scopes || process.env.ADOBE_SCOPES;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Adobe credentials. Set ADOBE_CLIENT_ID and ADOBE_CLIENT_SECRET env vars or pass them explicitly.'
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });
  if (scopes) {
    body.set('scope', scopes);
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - EXPIRY_BUFFER_MS;

  return cachedToken;
}

/**
 * Build the common headers required by all Adobe API calls.
 *
 * @param {Object} [options]
 * @param {string} [options.orgId] - Override org ID (defaults to ADOBE_ORG_ID env var)
 * @param {string} [options.sandbox] - AEP sandbox name (defaults to "prod")
 * @param {Object} [options.credentials] - Override auth credentials
 * @returns {Promise<Object>} Headers object
 */
async function getHeaders(options = {}) {
  const token = await getAccessToken(options.credentials);
  const clientId = options.credentials?.clientId || process.env.ADOBE_CLIENT_ID;
  const orgId = options.orgId || process.env.ADOBE_ORG_ID;

  const headers = {
    Authorization: `Bearer ${token}`,
    'x-api-key': clientId,
    'x-gw-ims-org-id': orgId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (options.sandbox) {
    headers['x-sandbox-name'] = options.sandbox;
  }

  return headers;
}

/**
 * Clear the cached token (useful for testing or forced refresh).
 */
function clearTokenCache() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

module.exports = { getAccessToken, getHeaders, clearTokenCache };
