# Adobe API Authentication

All Adobe CJA and AEP APIs authenticate via **OAuth Server-to-Server** credentials using the `client_credentials` grant type. The legacy JWT method is deprecated and no longer available for new integrations.

## Prerequisites

1. Access to [Adobe Developer Console](https://developer.adobe.com/console)
2. An organization with CJA and/or AEP provisioned
3. Developer role assigned via Adobe Admin Console
4. A project with the relevant API product profiles added

## Setting up credentials

1. Go to [Adobe Developer Console](https://developer.adobe.com/console)
2. Create a new project (or open an existing one)
3. Click **Add API** and select the APIs you need:
   - **Customer Journey Analytics** (for CJA endpoints)
   - **Experience Platform** (for AEP endpoints)
4. Choose **OAuth Server-to-Server** as the credential type
5. Select the product profiles that grant the permissions you need
6. Save the project

You'll find your credentials under **Credentials > OAuth Server-to-Server**:

| Credential | Usage |
|---|---|
| **Client ID** | Sent as `x-api-key` header and in token requests |
| **Client Secret** | Used only in server-side token requests |
| **Scopes** | Determine which APIs your token can access |
| **Organization ID** | Sent as `x-gw-ims-org-id` header |

## Generating an access token

### Token endpoint

```
POST https://ims-na1.adobelogin.com/ims/token/v3
```

### cURL

```bash
curl -X POST 'https://ims-na1.adobelogin.com/ims/token/v3' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials&scope=YOUR_SCOPES'
```

### Response

```json
{
  "access_token": "eyJhbGciOiJS...",
  "token_type": "bearer",
  "expires_in": 86399
}
```

Tokens expire in **24 hours** (86,399 seconds). There is no refresh token — just request a new token when the current one expires.

### Node.js

```javascript
const response = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: process.env.ADOBE_CLIENT_ID,
    client_secret: process.env.ADOBE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: process.env.ADOBE_SCOPES,
  }),
});
const { access_token } = await response.json();
```

### Python

```python
import requests

resp = requests.post(
    "https://ims-na1.adobelogin.com/ims/token/v3",
    data={
        "client_id": os.environ["ADOBE_CLIENT_ID"],
        "client_secret": os.environ["ADOBE_CLIENT_SECRET"],
        "grant_type": "client_credentials",
        "scope": os.environ["ADOBE_SCOPES"],
    },
)
access_token = resp.json()["access_token"]
```

## Required headers for API calls

Every request to a CJA or AEP endpoint must include:

```
Authorization: Bearer {access_token}
x-api-key: {client_id}
x-gw-ims-org-id: {org_id}
Content-Type: application/json        # for POST/PUT/PATCH
x-sandbox-name: {sandbox}             # AEP only (default: "prod")
```

## Secret rotation

OAuth Server-to-Server credentials support secret rotation. You can generate a new secret before revoking the old one, which allows zero-downtime rotation:

1. Generate a new client secret in Adobe Developer Console
2. Update your application to use the new secret
3. Verify the new secret works
4. Delete the old secret

## Scopes reference

Common scopes for CJA and AEP integrations:

| Scope | Purpose |
|---|---|
| `openid` | Required for all integrations |
| `AdobeID` | Required for all integrations |
| `read_organizations` | Read org information |
| `additional_info.projectedProductContext` | Access product context |
| `additional_info.roles` | Access role information |

The exact scopes needed depend on your project configuration in Adobe Developer Console. The console will auto-populate the correct scopes when you add APIs to your project.

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Token expired or invalid | Generate a new token |
| `403 Forbidden` | Missing product profile permissions | Check Admin Console assignments |
| `invalid_scope` | Wrong scopes in token request | Copy scopes from Developer Console |
| `invalid_client` | Wrong client ID or secret | Verify credentials in Developer Console |

## References

- [OAuth S2S Implementation Guide](https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/implementation)
- [AEP Authentication Tutorial](https://experienceleague.adobe.com/en/docs/experience-platform/landing/platform-apis/api-authentication)
- [CJA API Getting Started](https://developer.adobe.com/cja-apis/docs/)
