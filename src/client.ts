import { IPWhoResponse } from './types';

export class IPWho {
  private apiKey: string;
  private baseUrl: string = 'https://api.ipwho.org';

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("API Key is required");
    this.apiKey = apiKey;
  }

  private async fetcher<T>(endpoint: string): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${endpoint}${separator}apiKey=${this.apiKey}`;
    const response = await fetch(url, {
      headers: {
        'X-API-Key': this.apiKey,
        'User-Agent': 'ipwho-node-sdk/1.0.0'
      }
    });

    const body = await response.json();
    if (!body.success) throw new Error(body.message || "Request failed");
    
    return body.data as T;
  }

  async getIp(ip: string) {
    return this.fetcher<IPWhoResponse>(`/ip/${ip}`);
  }

  async getMe() {
    return this.fetcher<IPWhoResponse>(`/me`);
  }
}
