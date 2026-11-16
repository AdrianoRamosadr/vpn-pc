import React from 'react';
import {
  ChevronDown,
  CloudDownload,
  CloudUpload,
  Copy,
  Download,
  Globe,
  MapPin,
  Trash2,
} from 'lucide-react';
import {
  ConnectionStatus,
  CustomTweakConfig,
  DnsConfig,
  LogEntry,
  NetworkPreset,
  ServerNode,
  TrafficPoint,
} from '../../types/tunnel';
import { HxLogo } from '../HxLogo';
import { TrafficChart } from '../TrafficChart';

interface DashboardViewProps {
  status: ConnectionStatus;
  onToggleConnect: () => void;
  durationSeconds: number;
  uploadBytes: number;
  downloadBytes: number;
  localIp: string;
  buildVersion: string;
  configVersion: string;
  selectedServer: ServerNode;
  selectedNetwork: NetworkPreset;
  onOpenServerModal: () => void;
  onOpenNetworkModal: () => void;
  dns: DnsConfig;
  onChangeDns: (dns: DnsConfig) => void;
  customTweak: CustomTweakConfig;
  logs: LogEntry[];
  onClearLogs: () => void;
  onCopyLogs: () => void;
  copiedFeedback: string | null;
  trafficHistory: TrafficPoint[];
  onExportConfig: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  status,
  onToggleConnect,
  durationSeconds,
  uploadBytes,
  downloadBytes,
  localIp,
  buildVersion,
  configVersion,
  selectedServer,
  selectedNetwork,
  onOpenServerModal,
  onOpenNetworkModal,
  dns,
  onChangeDns,
  customTweak,
  logs,
  onClearLogs,
  onCopyLogs,
  copiedFeedback,
  trafficHistory,
  onExportConfig,
}) => {
  const activeProtocol = customTweak.enabled
    ? customTweak.mode
    : selectedNetwork.protocol;
  const activeSni = customTweak.enabled
    ? customTweak.sniHost
    : selectedNetwork.sniHost;

  const ringClass =
    status === 'connected'
      ? 'ring-emerald-200 dark:ring-emerald-900/60 bg-emerald-500/10'
      : status === 'connecting'
      ? 'ring-amber-200 dark:ring-amber-900/60 bg-amber-500/10 animate-pulse'
      : 'ring-rose-200 dark:ring-rose-900/40 bg-rose-500/10';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Left Primary Connection Column (7 cols) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Main Status + Power Control Surface */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          {/* Upload / IP / Download Row */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
              <CloudUpload className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
              <span>{formatBytes(uploadBytes)}</span>
            </div>

            <div className="text-xs sm:text-sm font-mono tabular-nums text-slate-600 dark:text-slate-300 text-center">
              {localIp}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
              <span>{formatBytes(downloadBytes)}</span>
              <CloudDownload className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
            </div>
          </div>

          {/* Center Status & Power Connect Button */}
          <div className="py-7 flex flex-col items-center text-center">
            <div
              className={`text-2xl font-display font-bold tracking-tight ${
                status === 'connected'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : status === 'connecting'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              {status === 'connected'
                ? 'Connected'
                : status === 'connecting'
                ? 'Connecting...'
                : 'Disconnected'}
            </div>

            {/* Version & Duration Metadata Strip */}
            <div className="mt-3 w-full grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="text-left tabular-nums">
                Build Version: <span className="text-slate-900 dark:text-slate-200 font-semibold">{buildVersion}</span>
              </div>
              <div className="text-center font-mono tabular-nums">
                Duration: <span className="text-slate-900 dark:text-slate-200 font-semibold">{formatDuration(durationSeconds)}</span>
              </div>
              <div className="text-right tabular-nums">
                Config Version: <span className="text-slate-900 dark:text-slate-200 font-semibold">{configVersion}</span>
              </div>
            </div>

            {/* Iconic HX Tunnel Power Button */}
            <div className="mt-7 mb-2">
              <button
                type="button"
                onClick={onToggleConnect}
                aria-label={
                  status === 'connected'
                    ? 'Desconectar túnel'
                    : status === 'connecting'
                    ? 'Cancelar conexão'
                    : 'Conectar túnel'
                }
                className={`group relative w-36 h-36 rounded-full p-3 ring-8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900 active:scale-[0.97] ${ringClass}`}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center shadow-inner transition-colors ${
                    status === 'connected'
                      ? 'bg-gradient-to-b from-emerald-600 to-blue-950'
                      : 'bg-gradient-to-b from-slate-200 via-blue-700 to-blue-950'
                  }`}
                >
                  {/* Power + Lightning Bolt SVG */}
                  <svg
                    viewBox="0 0 64 64"
                    className="w-16 h-16 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                    fill="none"
                  >
                    <path
                      d="M21 20C15.5 24 12 30.5 12 38C12 49 21 56 32 56C43 56 52 49 52 38C52 30.5 48.5 24 43 20"
                      stroke="#F97316"
                      strokeWidth="6.5"
                      strokeLinecap="round"
                    />
                    <circle cx="32" cy="14" r="4.5" fill="#F97316" />
                    <path
                      d="M34 24L25 36H32L30 47L39 34H32L34 24Z"
                      fill="#FACC15"
                      stroke="#0F172A"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {status === 'connected'
                  ? 'Clique para encerrar a sessão do túnel'
                  : status === 'connecting'
                  ? 'Negociando handshake TLS / CloudFront...'
                  : 'Clique no botão de energia para iniciar o túnel'}
              </p>
            </div>
          </div>

          {/* Server & Network Selectors (Faithful Navy-Bordered Cards) */}
          <div className="space-y-4 pt-2">
            {/* SERVER */}
            <div className="relative">
              <span className="absolute -top-2.5 left-4 px-2 bg-blue-900 text-white text-[10px] font-bold tracking-wider rounded">
                SERVER
              </span>
              <button
                type="button"
                onClick={onOpenServerModal}
                disabled={status !== 'disconnected'}
                className="w-full flex items-center justify-between gap-4 px-4 py-3.5 bg-white dark:bg-slate-900 border-2 border-blue-900 dark:border-blue-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left disabled:opacity-65 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-blue-500 flex items-center justify-center text-blue-900 dark:text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <HxLogo size="sm" />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                      {selectedServer.name}
                    </div>
                    <div className="text-xs text-blue-900 dark:text-blue-400 truncate">
                      {selectedServer.subtitle} · {selectedServer.region}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-blue-800 dark:text-amber-400">
                    {selectedServer.badgeText}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </button>
            </div>

            {/* NETWORK */}
            <div className="relative">
              <span className="absolute -top-2.5 left-4 px-2 bg-blue-900 text-white text-[10px] font-bold tracking-wider rounded">
                NETWORK
              </span>
              <button
                type="button"
                onClick={onOpenNetworkModal}
                disabled={status !== 'disconnected'}
                className="w-full flex items-center justify-between gap-4 px-4 py-3.5 bg-white dark:bg-slate-900 border-2 border-blue-900 dark:border-blue-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left disabled:opacity-65 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full border-2 border-blue-900 dark:border-blue-500 flex items-center justify-center text-blue-900 dark:text-blue-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <HxLogo size="sm" />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                      <span>{selectedNetwork.country.charAt(0)}·</span>
                      <span aria-hidden="true">{selectedNetwork.flag}</span>
                      <span className="truncate">{selectedNetwork.displayName}</span>
                    </div>
                    <div className="text-xs text-blue-900 dark:text-blue-400 truncate">
                      {selectedNetwork.subtitle} · {activeProtocol}
                      {selectedNetwork.port ? ` :${selectedNetwork.port}` : ''}
                      {selectedNetwork.sslws ? ' · SSL+WS' : ''}
                      {selectedNetwork.message ? ` · ${selectedNetwork.message}` : ''}
                    </div>
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* DNS (Custom) & Quick Info Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dns.enabled}
                  onChange={(e) => onChangeDns({ ...dns, enabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900 accent-blue-900"
                />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  DNS (Custom)
                </span>
              </label>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                Host/SNI: {selectedNetwork.sausage || activeSni} · {customTweak.enabled ? 'Custom Tweak Ativo' : (selectedNetwork.category ?? 'Preset Padrão')}
              </div>
            </div>

            {dns.enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    DNS Primário
                  </label>
                  <input
                    type="text"
                    value={dns.primary}
                    onChange={(e) => onChangeDns({ ...dns, primary: e.target.value })}
                    placeholder="1.1.1.1"
                    className="w-full px-3 py-1.5 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    DNS Secundário
                  </label>
                  <input
                    type="text"
                    value={dns.secondary}
                    onChange={(e) => onChangeDns({ ...dns, secondary: e.target.value })}
                    placeholder="8.8.8.8"
                    className="w-full px-3 py-1.5 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right PC Telemetry & Log Console Column (5 cols) */}
      <div className="xl:col-span-5 space-y-6">
        {/* Live Bandwidth Graph */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Monitor de Tráfego (PC)
            </h2>
            <button
              type="button"
              onClick={onExportConfig}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-900 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Config PC</span>
            </button>
          </div>
          <TrafficChart points={trafficHistory} />
        </section>

        {/* Real-time Tunnel Handshake Logs */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Console de Logs do Túnel
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCopyLogs}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedFeedback === 'logs' ? 'Copiado' : 'Copiar'}</span>
              </button>
              <button
                type="button"
                onClick={onClearLogs}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            </div>
          </div>

          <div className="h-72 overflow-y-auto rounded-lg bg-slate-950 text-slate-200 p-3.5 font-mono text-xs space-y-1.5 border border-slate-800">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500">
                Nenhum registro de sessão ainda. Clique no botão de energia para iniciar.
              </div>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className="leading-relaxed break-words">
                  <span className="text-slate-500 tabular-nums">[{entry.time}]</span>{' '}
                  <span
                    className={
                      entry.level === 'OK'
                        ? 'text-emerald-400 font-semibold'
                        : entry.level === 'WARN'
                        ? 'text-amber-400 font-semibold'
                        : entry.level === 'PAYLOAD'
                        ? 'text-sky-400 font-semibold'
                        : 'text-indigo-300 font-semibold'
                    }
                  >
                    {entry.level}:
                  </span>{' '}
                  <span>{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
