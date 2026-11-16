export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export type NavSection =
  | 'dashboard'
  | 'tweak'
  | 'hunter'
  | 'proxy'
  | 'tether'
  | 'system';

export type TunnelProtocol =
  | 'SSH + WebSocket'
  | 'CloudFront CDN'
  | 'SSL / SNI (Stunnel)'
  | 'SlowDNS (DNSTT)'
  | 'V2Ray / Trojan';

export interface ServerNode {
  id: string;
  name: string;
  subtitle: string;
  badgeText: 'Random' | 'FREE' | 'CLOUDFRONT' | 'VIP';
  region: string;
  host: string;
  port: number;
  latencyMs: number | null;
  loadPercent: number;
  supportsCloudFront: boolean;
}

export interface NetworkPreset {
  id: string;
  countryCode: string;
  flag: string;
  country: string;
  carrier: string;
  displayName: string;
  subtitle: string;
  protocol: TunnelProtocol;
  sniHost: string;
  payload: string;
  cloudfrontFronting: boolean;
  host?: string;
  port?: string;
  sausage?: string;
  dothost?: string;
  message?: string;
  method?: string;
  category?: string;
  query?: string;
  sslws?: boolean;
}

export interface CustomTweakConfig {
  enabled: boolean;
  mode: TunnelProtocol;
  sniHost: string;
  remotePort: number;
  payload: string;
  preserveSni: boolean;
  keepAliveSeconds: number;
}

export interface DnsConfig {
  enabled: boolean;
  primary: string;
  secondary: string;
}

export interface ProxyAppItem {
  id: string;
  name: string;
  executable: string;
  category: 'Navegador' | 'Comunicação' | 'Desenvolvimento' | 'Jogos & Mídia' | 'Personalizado';
  enabled: boolean;
}

export interface PerAppProxyConfig {
  enabled: boolean;
  mode: 'bypass' | 'only-selected';
  apps: ProxyAppItem[];
}

export interface TetherConfig {
  enabled: boolean;
  httpPort: number;
  socksPort: number;
  bindAddress: string;
  allowLan: boolean;
  hotspotName: string;
}

export interface HunterResult {
  id: string;
  ip: string;
  prefix: string;
  gateway: string;
  latencyMs: number;
  httpStatus: string;
  matched: boolean;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  time: string;
  level: 'INFO' | 'PAYLOAD' | 'TLS' | 'TUN' | 'WARN' | 'OK';
  message: string;
}

export interface TrafficPoint {
  time: string;
  downKbps: number;
  upKbps: number;
}
