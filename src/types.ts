export interface BrowserInfo {
  name: string;
  version?: string;
  [key: string]: any;
}

export interface EngineInfo {
  name: string;
  version?: string;
  [key: string]: any;
}

export interface OSInfo {
  name: string;
  version?: string;
  [key: string]: any;
}

export interface DeviceInfo {
  type?: string;
  vendor?: string;
  model?: string;
  [key: string]: any;
}

export interface CPUInfo {
  architecture?: string;
  [key: string]: any;
}

export interface UserAgent {
  browser: BrowserInfo;
  engine: EngineInfo;
  os: OSInfo;
  device: DeviceInfo;
  cpu: CPUInfo;
  [key: string]: any;
}

export interface Flag {
  flagIcon: string;
  flagUnicode: string;
  [key: string]: any;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  namePlural?: string;
  hexUnicode?: string;
  [key: string]: any;
}

export interface GeoLocation {
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  capital?: string;
  region?: string;
  regionCode?: string;
  city?: string | null;
  postalCode?: string | null;
  dialCode?: string | null;
  isInEu?: boolean;
  latitude?: number;
  longitude?: number;
  accuracyRadius?: number;
  [key: string]: any;
}

export interface Timezone {
  timeZone: string;
  abbr?: string | null;
  offset?: number | null;
  isDst?: boolean;
  utc?: string | null;
  currentTime?: string | null;
  [key:string]: any;
}

export interface Connection {
  asnNumber?: number | null;
  asnOrg?: string | null;
  isp?: string | null;
  org?: string | null;
  domain?: string | null;
  connectionType?: string | null;
  [key:string]: any;
}

export interface Security {
  isVpn?: boolean;
  isTor?: boolean;
  isThreat?: string | null;
  [key:string]: any;
}

export interface IPWhoData {
  ip: string;
  geoLocation?: GeoLocation;
  timezone?: Timezone;
  flag?: Flag;
  currency?: Currency;
  connection?: Connection;
  userAgent?: UserAgent;
  security?: Security;
  [key:string]: any;
}

export interface IPWhoAPIResponse<T = IPWhoData> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
