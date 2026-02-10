# IPWho TypeScript SDK

TypeScript SDK for the [IPWho Geolocation API (ipwho.org)](https://ipwho.org/) - Get detailed IP geolocation, timezone, connection, and security information with full type safety.

## Installation

```bash
npm install @ipwho/ipwho
```

Or with yarn:

```bash
yarn add @ipwho/ipwho
```

## Quick Start

```typescript
import { IPWho } from '@ipwho/ipwho';

const client = new IPWho('your-api-key');

// Get caller's location (uses your IP by default)
const location = await client.getLocation();
console.log(location);

// Get location for a specific IP
const specificLocation = await client.getLocation('8.8.8.8');
```

## Authentication

Initialize the client with your API key:

```typescript
const client = new IPWho('your-api-key');
```
Get your API key by signing up at [https://www.ipwho.org/signup](https://www.ipwho.org/signup).

The SDK automatically includes your API key in the `X-API-Key` header for all requests. Missing API keys will throw an error immediately.

## Methods

All methods accept an optional `ip` parameter. When omitted, the SDK uses the caller's IP address (calls `/me` endpoint). When provided, it queries the specific IP (calls `/ip/{ip}` endpoint).

### Normalization behavior

- `getLocation`, `getTimezone`, `getConnection`, and `getSecurity` return *normalized* objects (camelCase keys like `countryCode`, `timeZone`, `asnNumber`, etc.).
- `getMe` and `getIp` return the *raw API payload* (`IPWhoData`) as returned by the API. Depending on the API version/edge, nested objects may include a mix of `camelCase` and `snake_case` keys (for example `timezone.time_zone`, `geoLocation.accuracy_radius`, `geoLocation.postal_Code`).

### `getLocation(ip?: string): Promise<GeoLocation | null>`

Get geographical location data for an IP address.

**Parameters:**
- `ip` (optional) - IP address to query. Defaults to caller's IP if omitted.

**Returns:** `GeoLocation` object or `null` if unavailable.

**Example:**
```typescript
// Get your own location
const myLocation = await client.getLocation();

// Get location for specific IP
const location = await client.getLocation('1.1.1.1');

console.log(location);
// {
//   continent: "Oceania",
//   continentCode: "OC",
//   country: "Australia",
//   countryCode: "AU",
//   capital: "Canberra",
//   region: "Queensland",
//   regionCode: "QLD",
//   city: "South Brisbane",
//   postalCode: "4101",
//   dialCode: "+61",
//   isInEu: false,
//   latitude: -27.4766,
//   longitude: 153.0166,
//   accuracyRadius: 1000
// }
```

### `getTimezone(ip?: string): Promise<Timezone | null>`

Get timezone information for an IP address.

**Parameters:**
- `ip` (optional) - IP address to query. Defaults to caller's IP if omitted.

**Returns:** `Timezone` object or `null` if unavailable.

**Example:**
```typescript
// Get your own timezone
const myTimezone = await client.getTimezone();

// Get timezone for specific IP
const timezone = await client.getTimezone('8.8.8.8');

console.log(timezone);
// {
//   timeZone: "America/Los_Angeles",
//   abbr: "PST",
//   offset: -28800,
//   isDst: false,
//   utc: "-08:00",
//   currentTime: "2026-02-07T10:30:00-08:00"
// }
```

### `getConnection(ip?: string): Promise<Connection | null>`

Get ISP and network connection details for an IP address.

**Parameters:**
- `ip` (optional) - IP address to query. Defaults to caller's IP if omitted.

**Returns:** `Connection` object or `null` if unavailable.

**Example:**
```typescript
// Get your own connection details
const myConnection = await client.getConnection();

// Get connection details for specific IP
const connection = await client.getConnection('1.1.1.1');

console.log(connection);
// {
//   asnNumber: 13335,
//   asnOrg: "Cloudflare, Inc.",
//   isp: "Cloudflare",
//   org: "APNIC Research and Development",
//   domain: "cloudflare.com",
//   connectionType: "Data Center/Web Hosting/Transit"
// }

// Note: `connectionType` is a descriptive string from the API (values may vary).
```

### `getSecurity(ip?: string): Promise<Security | null>`

Get security information including VPN, Tor, and threat detection.

**Parameters:**
- `ip` (optional) - IP address to query. Defaults to caller's IP if omitted.

**Returns:** `Security` object or `null` if unavailable.

**Example:**
```typescript
// Check your own IP security status
const mySecurity = await client.getSecurity();

// Check security for specific IP
const security = await client.getSecurity('8.8.8.8');

console.log(security);
// {
//   isVpn: false,
//   isTor: false,
//   isThreat: "low"
// }
```

### `getMe(): Promise<IPWhoData>`

Get complete IP information for the caller's IP address.

Note: this returns the raw payload (not normalized).

**Returns:** Full `IPWhoData` object with all available information.

**Example:**
```typescript
const myData = await client.getMe();

console.log(myData);
// {
//   ip: "203.0.113.1",
//   geoLocation: { ... },
//   timezone: { ... },
//   flag: { ... },
//   currency: { ... },
//   connection: { ... },
//   security: { ... },
//   userAgent: { ... }
// }
```

### `getIp(ip: string): Promise<IPWhoData>`

Get complete IP information for a specific IP address.

Note: this returns the raw payload (not normalized).

**Parameters:**
- `ip` (required) - IP address to query.

**Returns:** Full `IPWhoData` object with all available information.

**Example:**
```typescript
const data = await client.getIp('8.8.8.8');

console.log(data);
// {
//   ip: "8.8.8.8",
//   geoLocation: { ... },
//   timezone: { ... },
//   flag: { ... },
//   currency: { ... },
//   connection: { ... },
//   security: { ... }
// }
```

## Type Definitions

The SDK provides full TypeScript type definitions for all responses:

### `GeoLocation`
```typescript
{
  continent: string;           // Continent name
  continentCode: string;       // Two-letter continent code
  country: string;             // Country name
  countryCode: string;         // Two-letter country code (ISO 3166-1)
  capital?: string;            // Capital city
  region?: string;             // Region/state name
  regionCode?: string;         // Region/state code
  city?: string | null;        // City name
  postalCode?: string | null;  // Postal/ZIP code
  dialCode?: string | null;    // Country calling code (e.g., "+1")
  isInEu?: boolean;            // Whether country is in EU
  latitude?: number;           // Latitude coordinate
  longitude?: number;          // Longitude coordinate
  accuracyRadius?: number | null; // Accuracy radius in kilometers
}
```

### `Timezone`
```typescript
{
  timeZone: string;            // IANA timezone identifier
  abbr?: string | null;        // Timezone abbreviation (e.g., "PST")
  offset?: number | null;      // UTC offset in seconds
  isDst?: boolean;             // Whether DST is currently active
  utc?: string | null;         // UTC offset string (e.g., "-08:00")
  currentTime?: string | null; // Current time in ISO 8601 format
}
```

### `Connection`
```typescript
{
  asnNumber?: number | null;      // Autonomous System Number
  asnOrg?: string | null;         // ASN organization name
  isp?: string | null;            // Internet Service Provider name
  org?: string | null;            // Organization name
  domain?: string | null;         // Domain name
  connectionType?: string | null; // Connection type description
}
```

### `Security`
```typescript
{
  isVpn?: boolean;           // Whether IP is using VPN
  isTor?: boolean;           // Whether IP is a Tor exit node
  isThreat?: string | null;  // Threat level: "low", "medium", "high"
}
```

### `Currency`
```typescript
{
  code: string;              // Currency code (ISO 4217)
  symbol: string;            // Currency symbol (e.g., "$", "€")
  name: string;              // Currency name
  namePlural?: string;       // Plural form of currency name
  hexUnicode?: string;       // Hex unicode for symbol
}
```

### `Flag`
```typescript
{
  flagIcon: string;          // URL to flag icon
  flagUnicode: string;       // Unicode flag emoji
}
```

### `UserAgent`
```typescript
{
  browser: {
    name: string;            // Browser name
    version?: string;        // Browser version
  };
  engine: {
    name: string;            // Engine name (e.g., "Blink", "WebKit")
    version?: string;        // Engine version
  };
  os: {
    name: string;            // Operating system name
    version?: string;        // OS version
  };
  device: {
    type?: string;           // Device type (e.g., "desktop", "mobile")
    vendor?: string;         // Device vendor
    model?: string;          // Device model
  };
  cpu: {
    architecture?: string;   // CPU architecture
  };
}
```

### `IPWhoData`
Full response object containing all available data:
```typescript
{
  ip: string;                // IP address
  geoLocation?: GeoLocation; // Geographical data
  timezone?: Timezone;       // Timezone data
  flag?: Flag;               // Country flag
  currency?: Currency;       // Local currency
  connection?: Connection;   // ISP/connection data
  userAgent?: UserAgent;     // User agent details (when available)
  security?: Security;       // Security information
}
```

## Error Handling

The SDK throws errors for:
- Missing API key during initialization
- Failed API requests (when the API returns `success: false`)
- Invalid API responses

Network/transport errors from `fetch()` will also reject the promise.

**Example:**
```typescript
try {
  const location = await client.getLocation('invalid-ip');
} catch (error) {
  console.error('Failed to fetch location:', error.message);
}
```

## Advanced Usage

### Checking VPN/Proxy Usage
```typescript
const security = await client.getSecurity('203.0.113.1');

if (security?.isVpn) {
  console.log('VPN detected');
}

if (security?.isTor) {
  console.log('Tor exit node detected');
}

if (security?.isThreat === 'high') {
  console.log('High threat level detected');
}
```

### Getting User's Local Time
```typescript
const timezone = await client.getTimezone();

if (timezone?.currentTime) {
  const localTime = new Date(timezone.currentTime);
  console.log('User local time:', localTime.toLocaleString());
}
```

### Geo-Fencing by Country
```typescript
const location = await client.getLocation();

const allowedCountries = ['US', 'CA', 'GB'];
if (location && !allowedCountries.includes(location.countryCode)) {
  console.log('Access denied: Country not supported');
}
```

## License

See [LICENSE](LICENSE).

## Support

- API docs: [https://www.ipwho.org/docs/api/geolocation-data/](https://www.ipwho.org/docs/api/geolocation-data/)
- Support: [support@ipwho.io](mailto:support@ipwho.io)
- Website: [https://ipwho.org/](https://ipwho.org/)
