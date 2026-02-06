import { IPWhoAPIResponse, IPWhoData, GeoLocation, Timezone, Connection, Security } from './types';

export class IPWho {
  private apiKey: string;
  private baseUrl: string = 'https://api.ipwho.org/v1';

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("API Key is required");
    this.apiKey = apiKey;
  }

  private async fetcher<T>(endpoint: string): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}`;
    const response = await fetch(url, {
      headers: {
        'X-API-Key': this.apiKey
      }
    });

    const body = await response.json();
    if (!body.success) throw new Error(body.message || "Request failed");
    
    return body.data as T;
  }

  private async request(ip?: string): Promise<IPWhoData> {
    const endpoint = ip ? `/ip/${ip}` : `/me`;
    return this.fetcher<IPWhoData>(endpoint);
  }

  async getLocation(ip?: string): Promise<GeoLocation | null> {
    const data = await this.request(ip);
    const raw = data.geoLocation || data.geo_location || null;
    if (!raw) return null;

    return {
      continent: raw.continent,
      continentCode: raw.continentCode ?? raw.continent_code,
      country: raw.country,
      countryCode: raw.countryCode ?? raw.country_code,
      capital: raw.capital,
      region: raw.region,
      regionCode: raw.regionCode ?? raw.region_code,
      city: raw.city ?? null,
      postalCode: raw.postal_Code ?? raw.postalCode ?? null,
      dialCode: raw.dial_code ?? raw.dialCode ?? null,
      isInEu: raw.is_in_eu ?? raw.isInEu ?? false,
      latitude: raw.latitude,
      longitude: raw.longitude,
      accuracyRadius: raw.accuracy_radius ?? raw.accuracyRadius ?? null
    };
  }

  async getTimezone(ip?: string): Promise<Timezone | null> {
    const data = await this.request(ip);
    const raw = data.timezone || data.time_zone || null;
    if (!raw) return null;

    return {
      timeZone: raw.time_zone ?? raw.timeZone ?? raw.time_zone,
      abbr: raw.abbr ?? null,
      offset: raw.offset ?? null,
      isDst: raw.is_dst ?? raw.isDst ?? false,
      utc: raw.utc ?? null,
      currentTime: raw.current_time ?? raw.currentTime ?? null
    };
  }

  async getConnection(ip?: string): Promise<Connection | null> {
    const data = await this.request(ip);
    const raw = data.connection || null;
    if (!raw) return null;

    return {
      asnNumber: raw.asn_number ?? raw.asnNumber ?? null,
      asnOrg: raw.asn_org ?? raw.asnOrg ?? null,
      isp: raw.isp ?? null,
      org: raw.org ?? null,
      domain: raw.domain ?? null,
      connectionType: raw.connection_type ?? raw.connectionType ?? null
    };
  }

  async getSecurity(ip?: string): Promise<Security | null> {
    const data = await this.request(ip);
    const raw = data.security || null;
    if (!raw) return null;

    return {
      isVpn: raw.isVpn ?? raw.is_vpn ?? raw.isVpn ?? false,
      isTor: raw.isTor ?? raw.is_tor ?? false,
      isThreat: raw.isThreat ?? raw.is_threat ?? null
    };
  }

  async getIp(ip: string) {
    return this.request(ip);
  }

  async getMe() {
    return this.request();
  }
}
