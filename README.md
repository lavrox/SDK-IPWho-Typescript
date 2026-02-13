# IPWho TypeScript SDK

[![npm version](https://img.shields.io/npm/v/@ipwho/ipwho?style=flat-square)](https://www.npmjs.com/package/@ipwho/ipwho) [![npm downloads](https://img.shields.io/npm/dm/@ipwho/ipwho?style=flat-square)](https://www.npmjs.com/package/@ipwho/ipwho) [![license](https://img.shields.io/github/license/lavrox/SDK-IPWho-Typescript?style=flat-square)](https://github.com/lavrox/SDK-IPWho-Typescript/blob/main/LICENSE)

A small, lightweight TypeScript SDK for the IPWho Geolocation API — get geolocation, timezone, connection and security information for IP addresses with typed responses.

<!-- TOC -->
- Installation
- Quick Start
- API Reference
- Type Definitions
- Troubleshooting
- Changelog
<!-- /TOC -->

## Installation

Install via npm:

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

const client = new IPWho(process.env.IPWHO_API_KEY || 'your-api-key');

// Get caller's location (uses your IP by default)
const location = await client.getLocation();
console.log(location);
```

Example minimal response (normalized):

```json
{
  "country": "United States",
  "countryCode": "US",
  "city": "San Francisco",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

## API Reference

All methods accept an optional `ip` parameter. When omitted, the SDK queries the caller's IP (`/me`). When provided, it queries `/ip/{ip}`.

- `getLocation(ip?: string): Promise<GeoLocation | null>` — Returns normalized geographical information.
- `getTimezone(ip?: string): Promise<Timezone | null>` — Returns timezone details, includes `currentTime` when available.
- `getConnection(ip?: string): Promise<Connection | null>` — ISP/ASN/org details.
- `getSecurity(ip?: string): Promise<Security | null>` — VPN/Tor/threat indicators.
- `getMe(): Promise<IPWhoData>` — Raw API payload for the caller's IP.
- `getIp(ip: string): Promise<IPWhoData>` — Raw API payload for a specific IP.

Type definitions are shipped in the package — see the `types` field in `package.json` (`dist/index.d.ts`).

## Type Definitions

See the distributed types in `dist/index.d.ts` for full typings. Example summary:

```typescript
type GeoLocation = {
  continent: string;
  country: string;
  countryCode: string;
  city?: string | null;
  latitude?: number;
  longitude?: number;
};
```

## Troubleshooting

- Missing API key: initialize with your API key or set `X-API-Key` header.
- Network errors: the SDK uses `fetch`/`undici`; network failures will throw and should be retried according to your app's policy.
- API errors: when the API returns `success: false` the SDK surfaces an error.

## Changelog

See `CHANGELOG.md` for release notes and upgrade guidance.

## Contributing & Metadata

- Recommend adding `repository` and `homepage` fields to `package.json` for better discovery.
- Please open issues or PRs at the repository.

## License

See [LICENSE](LICENSE).

## Support

- API docs: [Docs](https://www.ipwho.org/docs/api/geolocation-data/)
- Support: [Contact](https://www.ipwho.org/contact)
- Website: [Home](https://ipwho.org/)
