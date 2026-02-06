import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { IPWho } from '../src';
import * as fs from 'fs';
import * as path from 'path';

const fixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/response.json'), 'utf8'));
const realApiKey = process.env.IPWHO_API_KEY;
const originalFetch = global.fetch;

describe('IPWho SDK', () => {
  const sdk = new IPWho('sk_test_123');

  it('should throw error if API key is missing', () => {
    expect(() => new IPWho('')).toThrow("API Key is required");
  });

  it('should format the URL correctly for getIp', async () => {
    // We mock the global fetch to prevent real API calls during tests
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { ip: '8.8.8.8' } })
    });
    // @ts-ignore
    global.fetch = mockFetch;

    await sdk.getIp('8.8.8.8');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ip/8.8.8.8'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-API-Key': 'sk_test_123'
        })
      })
    );
  });

    describe('mappings', () => {
      beforeEach(()=>{
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(fixture)
        });
      });
      afterAll(() => {
        global.fetch = originalFetch;
      });

    it('getLocation maps correctly', async () => {
      const loc = await sdk.getLocation('202.21.42.9');
      expect(loc).toEqual({
        continent: 'Asia',
        continentCode: 'AS',
        country: 'India',
        countryCode: 'IN',
        capital: 'New Delhi',
        region: 'Telangana',
        regionCode: 'TS',
        city: null,
        postalCode: null,
        dialCode: '+91',
        isInEu: false,
        latitude: 17.3843,
        longitude: 78.4583,
        accuracyRadius: 1000
      });
      expect(typeof loc!.continent).toBe('string');
      expect(typeof loc!.country).toBe('string');
      expect(typeof loc!.latitude).toBe('number');
      expect(typeof loc!.longitude).toBe('number');
    });

    it('getTimezone maps correctly', async () => {
      const tz = await sdk.getTimezone();
      expect(tz).toMatchObject({
        timeZone: 'Asia/Kolkata',
        abbr: 'IST',
        offset: 19800,
        isDst: false,
        utc: '+05:30',
        currentTime: '2026-02-06T11:02:50+05:30'
      });
      expect(typeof tz!.timeZone).toBe('string');
      expect(typeof tz!.offset).toBe('number');
      expect(typeof tz!.isDst).toBe('boolean');
    });

    it('getConnection maps correctly', async () => {
      const conn = await sdk.getConnection();
      expect(conn).toMatchObject({
        asnNumber: 24186,
        asnOrg: 'RailTel Corporation of India Ltd',
        isp: 'RailTel Corporation Of India Ltd.',
        org: 'RailTel Corporation Of India Ltd.',
        domain: null,
        connectionType: 'Cable/DSL'
      });
      expect(typeof conn!.asnNumber).toBe('number');
      expect(typeof conn!.asnOrg).toBe('string');
      expect(conn!.domain).toBeNull();
    });

    it('getSecurity maps correctly', async () => {
      const sec = await sdk.getSecurity();
      expect(sec).toMatchObject({
        isVpn: false,
        isTor: false,
        isThreat: 'low'
      });
      expect(typeof sec!.isVpn).toBe('boolean');
      expect(typeof sec!.isTor).toBe('boolean');
      expect(typeof sec!.isThreat).toBe('string');
    });

    it('getMe returns the raw API payload when requested', async () => {
      const data = await sdk.getMe();
      expect(data).toEqual(fixture.data);
      expect(typeof data.ip).toBe('string');
      expect(data.timezone).toBeDefined();
      expect(data.security).toHaveProperty('isVpn');
    });

    it('exposes currency details within the payload', async () => {
      const data = await sdk.getMe();
      expect(data.currency).toMatchObject({
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee'
      });
      expect(typeof data.currency!.code).toBe('string');
      expect(typeof data.currency!.symbol).toBe('string');
      expect(typeof data.currency!.name).toBe('string');
    });

    it('exposes geoLocation nested data', async () => {
      const data = await sdk.getMe();
      expect(data.geoLocation).toBeDefined();
      expect(data.geoLocation).toMatchObject({
        continent: 'Asia',
        country: 'India',
        capital: 'New Delhi'
      });
      expect(typeof data.geoLocation?.latitude).toBe('number');
      expect(typeof data.geoLocation?.longitude).toBe('number');
      expect(data.geoLocation?.city).toBeNull();
    });

    it('exposes userAgent nested metadata', async () => {
      const data = await sdk.getMe();
      expect(data.userAgent).toBeDefined();
      expect(data.userAgent?.browser?.name).toBe('Chrome');
      expect(data.userAgent?.os?.name).toBe('macOS');
      expect(data.userAgent?.device?.type).toBe('desktop');
      expect(data.userAgent?.browser?.version).toBe('143.0.0.0');
      expect(data.userAgent?.engine?.name).toBe('Blink');
      expect(data.userAgent?.device?.vendor).toBe('Apple');
    });

  });

});

describe('real API integration', () => {
  if (!realApiKey) {
    it.skip('requires IPWHO_API_KEY env var to run', () => {});
    return;
  }

  const realSdk = new IPWho(realApiKey);

  it('gets timezone data from the live API', async () => {
    const tz = await realSdk.getTimezone();
    expect(tz).not.toBeNull();
    expect(typeof tz!.timeZone).toBe('string');
    expect(typeof tz!.offset).toBe('number');
    expect(typeof tz!.isDst).toBe('boolean');
  });

  it('gets connection data from the live API', async () => {
    const connection = await realSdk.getConnection();
    expect(connection).not.toBeNull();
    expect(typeof connection!.isp).toBe('string');
    expect(connection!.domain).toBeDefined();
  });

  it('gets security data from the live API', async () => {
    const security = await realSdk.getSecurity();
    expect(security).not.toBeNull();
    expect(typeof security!.isVpn).toBe('boolean');
    expect(typeof security!.isThreat).toBe('string');
  });

  it('gets currency data from the live API', async () => {
    const me = await realSdk.getMe();
    expect(me.currency).toBeDefined();
    expect(typeof me.currency!.code).toBe('string');
    expect(typeof me.currency!.symbol).toBe('string');
    expect(typeof me.currency!.name).toBe('string');
  });

  it('gets geoLocation metadata from the live API', async () => {
    const loc = await realSdk.getLocation();
    expect(loc).toBeDefined();
    expect(typeof loc!.continent).toBe('string');
    expect(typeof loc!.latitude).toBe('number');
    expect(typeof loc!.longitude).toBe('number');
  });

  it('gets userAgent metadata from the live API', async () => {
    const me = await realSdk.getMe();
    expect(me.userAgent).toBeDefined();
    expect(typeof me.userAgent?.browser?.name).toBe('string');
    expect(typeof me.userAgent?.os?.name).toBe('string');
    expect(typeof me.userAgent?.device?.type).toBe('string');
  });
});
