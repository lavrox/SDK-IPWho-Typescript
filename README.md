# IPWho TypeScript SDK

## Introduction

`ipwho` is an npm-ready TypeScript wrapper around the [IPWho public API](https://ipwho.is/). The client handles API key injection, chooses between `/me` and `/ip/{ip}` automatically, and provides typed helpers (`getLocation`, `getTimezone`, `getConnection`, `getSecurity`) that normalize and narrow the nested payload so you can pull just the information your service needs without re-implementing parsing logic.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Helper methods](#helper-methods)
- [Typed responses](#typed-responses)
- [Forwarding headers](#forwarding-headers)

## Installation

```bash
npm install ipwho
```

Or, if you install via yarn:

```bash
yarn add ipwho
```

## Getting Started

```ts
import { IPWho } from 'ipwho';

const client = new IPWho(process.env.IPWHO_API_KEY);

// Resolve the caller's IP by default (calls /me)
const location = await client.getLocation();

// Look up another IP
const armyLocation = await client.getLocation('8.8.8.8');

// Use the typed helpers
const timezone = await client.getTimezone();
const connection = await client.getConnection();
const security = await client.getSecurity('1.1.1.1');

// Grab raw payloads when needed
const me = await client.getMe();
const remote = await client.getIp('1.2.3.4');
```

### API key handling

- Provide your `apiKey` when constructing the client: `new IPWho('sk_live_XXXX')`.
- The SDK adds `apiKey` to every request (query param + `X-API-Key` header).
- Missing keys throw immediately, so you can fail fast in CI.

## Helper Methods

| Method | Description | Returns |
| --- | --- | --- |
| `getLocation(ip?: string)` | Normalized geo data for the requested IP (street-level; defaults to caller). | `GeoLocation` |
| `getTimezone(ip?: string)` | Timezone metadata, offset, DST, and current time. | `Timezone` |
| `getConnection(ip?: string)` | ISP connection details (ASN, org, domain, connection type). | `Connection` |
| `getSecurity(ip?: string)` | VPN/Tor/threat flags and status. | `Security` |
| `getMe()` | Full raw payload for the caller's IP (identical to `/me`). | `IPWhoData` |
| `getIp(ip: string)` | Full raw payload for any other IP. | `IPWhoData` |

Each helper accepts an optional `ip` parameter. When `ip` is omitted the SDK automatically calls `/me`; when `ip` is provided it calls `/ip/{ip}`.

## Typed Responses

- `GeoLocation` exports continent, country, coordinates, `dialCode`, and accuracy radius with camel-cased fields that accept both snake_case and camelCase from the API.
- `Timezone` includes `timeZone`, `abbr`, `offset`, `currentTime`, DST flags, and UTC offset.
- `Connection`, `Security`, `Currency`, `Flag`, and `UserAgent` wrap nested data (browser/engine/os/device/cpu info, currencies, flags) so you never handle untyped JSON in your application.
- Refer to `src/types.ts` for the complete interfaces if you need to extend or reconstruct payloads.

## Forwarding Headers

The SDK no longer injects a `User-Agent` header. When proxying requests (e.g., from a browser) forward relevant headers:

```ts
const forwardHeaders = new Headers();
for (const [key, value] of request.headers) {
  if (['user-agent', 'accept'].includes(key.toLowerCase())) {
    forwardHeaders.set(key, value);
  }
}

const client = new IPWho(process.env.IPWHO_API_KEY, { headers: forwardHeaders });
```

You can add headers by extending the `fetcher` call if you wrap the client; the SDK focuses on the API key and payload normalization.
