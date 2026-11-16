import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { ClearDataModal } from './components/ClearDataModal';
import { NetworkModal } from './components/NetworkModal';
import { NoticeModal } from './components/NoticeModal';
import { ServerModal } from './components/ServerModal';
import { Sidebar } from './components/Sidebar';
import { CustomTweakView } from './components/views/CustomTweakView';
import { DashboardView } from './components/views/DashboardView';
import { IpHunterView } from './components/views/IpHunterView';
import { PerAppProxyView } from './components/views/PerAppProxyView';
import { SystemView } from './components/views/SystemView';
import { VpnTetherView } from './components/views/VpnTetherView';
import {
  BUILD_VERSION,
  DEFAULT_DNS,
  DEFAULT_PER_APP_PROXY,
  DEFAULT_TETHER,
  DEFAULT_TWEAK,
  generateHwid,
  INITIAL_CONFIG_VERSION,
  NETWORK_PRESETS,
  SERVERS,
} from './data/tunnelData';
import {
  ConnectionStatus,
  CustomTweakConfig,
  DnsConfig,
  LogEntry,
  NavSection,
  PerAppProxyConfig,
  ServerNode,
  TetherConfig,
  TrafficPoint,
} from './types/tunnel';

const STORAGE_KEY = 'hx_tunnel_pc_state_v1';

interface PersistedState {
  selectedServerId: string;
  selectedNetworkId: string;
  dns: DnsConfig;
  customTweak: CustomTweakConfig;
  perAppProxy: PerAppProxyConfig;
  tether: TetherConfig;
  hwid: string;
  configVersion: string;
  darkMode: boolean;
}

function loadInitialState(): PersistedState {
  const fallback: PersistedState = {
    selectedServerId: 'auto',
    selectedNetworkId: 'ao-movicel',
    dns: DEFAULT_DNS,
    customTweak: DEFAULT_TWEAK,
    perAppProxy: DEFAULT_PER_APP_PROXY,
    tether: DEFAULT_TETHER,
    hwid: generateHwid(),
    configVersion: INITIAL_CONFIG_VERSION,
    darkMode: false,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      selectedServerId: parsed.selectedServerId ?? fallback.selectedServerId,
      selectedNetworkId: parsed.selectedNetworkId ?? fallback.selectedNetworkId,
      dns: parsed.dns ?? fallback.dns,
      customTweak: parsed.customTweak ?? fallback.customTweak,
      perAppProxy: parsed.perAppProxy ?? fallback.perAppProxy,
      tether: parsed.tether ?? fallback.tether,
      hwid: parsed.hwid ?? fallback.hwid,
      configVersion: parsed.configVersion ?? fallback.configVersion,
      darkMode: Boolean(parsed.darkMode),
    };
  } catch {
    return fallback;
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour12: false });
}

function buildEmptyTraffic(): TrafficPoint[] {
  return Array.from({ length: 24 }, (_, idx) => ({
    time: `${idx}`,
    downKbps: 0,
    upKbps: 0,
  }));
}

export default function App() {
  const initial = useMemo(() => loadInitialState(), []);

  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [servers, setServers] = useState<ServerNode[]>(SERVERS);
  const [selectedServerId, setSelectedServerId] = useState(initial.selectedServerId);
  const [selectedNetworkId, setSelectedNetworkId] = useState(initial.selectedNetworkId);
  const [dns, setDns] = useState<DnsConfig>(initial.dns);
  const [customTweak, setCustomTweak] = useState<CustomTweakConfig>(initial.customTweak);
  const [perAppProxy, setPerAppProxy] = useState<PerAppProxyConfig>(initial.perAppProxy);
  const [tether, setTether] = useState<TetherConfig>(initial.tether);
  const [hwid, setHwid] = useState(initial.hwid);
  const [configVersion, setConfigVersion] = useState(initial.configVersion);
  const [darkMode, setDarkMode] = useState(initial.darkMode);

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [uploadBytes, setUploadBytes] = useState(0);
  const [downloadBytes, setDownloadBytes] = useState(0);
  const [localIp, setLocalIp] = useState('192.168.1.1-');
  const [trafficHistory, setTrafficHistory] = useState<TrafficPoint[]>(buildEmptyTraffic);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'boot-1',
      time: nowTime(),
      level: 'INFO',
      message: `HX Tunnel PC Core iniciado (Build ${BUILD_VERSION} · Config ${initial.configVersion}).`,
    },
  ]);

  const [serverModalOpen, setServerModalOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState<string | null>(null);

  const connectTimersRef = useRef<number[]>([]);

  const selectedServer = useMemo(
    () => servers.find((s) => s.id === selectedServerId) ?? servers[0],
    [servers, selectedServerId]
  );

  const selectedNetwork = useMemo(
    () =>
      NETWORK_PRESETS.find((n) => n.id === selectedNetworkId) ??
      NETWORK_PRESETS[0],
    [selectedNetworkId]
  );

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist user settings cleanly
  useEffect(() => {
    const stateToSave: PersistedState = {
      selectedServerId,
      selectedNetworkId,
      dns,
      customTweak,
      perAppProxy,
      tether,
      hwid,
      configVersion,
      darkMode,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // storage quota exceeded or disabled
    }
  }, [
    selectedServerId,
    selectedNetworkId,
    dns,
    customTweak,
    perAppProxy,
    tether,
    hwid,
    configVersion,
    darkMode,
  ]);

  const pushLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs((prev) => [
      ...prev.slice(-149),
      {
        id: `${Date.now()}-${Math.random()}`,
        time: nowTime(),
        level,
        message,
      },
    ]);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const clearConnectTimers = () => {
    connectTimersRef.current.forEach((id) => window.clearTimeout(id));
    connectTimersRef.current = [];
  };

  const disconnectTunnel = useCallback(() => {
    clearConnectTimers();
    setStatus('disconnected');
    setLocalIp('192.168.1.1-');
    setTrafficHistory((prev) => [
      ...prev.slice(1),
      { time: nowTime(), downKbps: 0, upKbps: 0 },
    ]);
    pushLog('WARN', 'Túnel encerrado pelo usuário. Interface tun0 desativada.');
  }, [pushLog]);

  const startTunnel = useCallback(() => {
    clearConnectTimers();
    setStatus('connecting');
    setDurationSeconds(0);

    const activeProtocol = customTweak.enabled
      ? customTweak.mode
      : selectedNetwork.protocol;
    const activeSni = customTweak.enabled
      ? customTweak.sniHost
      : selectedNetwork.sausage || selectedNetwork.sniHost;
    const presetPort = Number(selectedNetwork.port);
    const targetPort = customTweak.enabled
      ? customTweak.remotePort
      : Number.isFinite(presetPort) && presetPort > 0
      ? presetPort
      : selectedServer.port;

    const resolvedServer =
      selectedServer.id === 'auto'
        ? servers[1 + Math.floor(Math.random() * (servers.length - 1))]
        : selectedServer;

    pushLog(
      'INFO',
      `Conectando a ${resolvedServer.name} (${
        selectedNetwork.host && selectedNetwork.host !== 'Pulled'
          ? selectedNetwork.host
          : resolvedServer.host
      }:${targetPort})...`
    );

    const t1 = window.setTimeout(() => {
      pushLog(
        'PAYLOAD',
        `Injetando payload (${activeProtocol}${
          selectedNetwork.sslws ? ' · SSLWS' : ''
        }) · Host/SNI: ${activeSni}`
      );
    }, 350);

    const t2 = window.setTimeout(() => {
      pushLog(
        'TLS',
        `Handshake TLS 1.3 concluído · HTTP/1.1 101 Switching Protocols`
      );
      if (dns.enabled) {
        pushLog(
          'INFO',
          `DNS Customizado ativo: ${dns.primary} / ${dns.secondary}`
        );
      }
      if (perAppProxy.enabled) {
        const count = perAppProxy.apps.filter((a) => a.enabled).length;
        pushLog(
          'INFO',
          `Per-App Proxy (${perAppProxy.mode === 'bypass' ? 'Bypass' : 'Only Selected'}) aplicado para ${count} apps.`
        );
      }
    }, 850);

    const t3 = window.setTimeout(() => {
      const assignedIp = `10.8.${Math.floor(1 + Math.random() * 250)}.${Math.floor(
        10 + Math.random() * 230
      )}`;
      setLocalIp(assignedIp);
      setStatus('connected');
      pushLog(
        'OK',
        `Conectado! Interface virtual tun0 UP (${assignedIp}) · Rede: ${selectedNetwork.displayName}${
          selectedNetwork.message ? ` (${selectedNetwork.message})` : ''
        }`
      );
      if (tether.enabled) {
        pushLog(
          'TUN',
          `VPNTether ativo em ${tether.bindAddress}:${tether.httpPort} (HTTP) e :${tether.socksPort} (SOCKS5)`
        );
      }
    }, 1400);

    connectTimersRef.current = [t1, t2, t3];
  }, [
    customTweak,
    dns,
    perAppProxy,
    pushLog,
    selectedNetwork,
    selectedServer,
    servers,
    tether,
  ]);

  const handleToggleConnect = () => {
    if (status === 'disconnected') {
      startTunnel();
    } else {
      disconnectTunnel();
    }
  };

  // Live duration & traffic counters when connected
  useEffect(() => {
    if (status !== 'connected') return;

    const interval = window.setInterval(() => {
      setDurationSeconds((d) => d + 1);
      const downKbps = 140 + Math.random() * 680;
      const upKbps = 35 + Math.random() * 190;

      setDownloadBytes((b) => b + Math.round(downKbps * 1024));
      setUploadBytes((b) => b + Math.round(upKbps * 1024));
      setTrafficHistory((prev) => [
        ...prev.slice(1),
        {
          time: nowTime(),
          downKbps: Math.round(downKbps),
          upKbps: Math.round(upKbps),
        },
      ]);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    return () => clearConnectTimers();
  }, []);

  const handlePingServers = () => {
    setIsPinging(true);
    pushLog('INFO', 'Medindo latência dos servidores HX Tunnel...');
    window.setTimeout(() => {
      setServers((prev) =>
        prev.map((srv) => ({
          ...srv,
          latencyMs: Math.max(
            22,
            Math.round((srv.latencyMs ?? 50) + (Math.random() * 18 - 9))
          ),
        }))
      );
      setIsPinging(false);
      pushLog('OK', 'Teste de latência concluído.');
    }, 750);
  };

  const handleCheckUpdate = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    pushLog('INFO', `Verificando atualizações de config (atual: v${configVersion})...`);
    window.setTimeout(() => {
      const nextVersion = configVersion === '26.02' ? '26.03' : configVersion;
      setConfigVersion(nextVersion);
      setIsUpdating(false);
      if (nextVersion !== configVersion) {
        pushLog('OK', `Configuração atualizada para v${nextVersion} (novos nós CloudFront).`);
        showToast(`Configurações atualizadas para v${nextVersion}.`);
      } else {
        pushLog('OK', `Você já está utilizando a versão mais recente (v${nextVersion}).`);
        showToast(`Configuração já está atualizada (v${nextVersion}).`);
      }
    }, 900);
  };

  const handleClearData = () => {
    if (status !== 'disconnected') disconnectTunnel();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSelectedServerId('auto');
    setSelectedNetworkId('ao-movicel');
    setDns(DEFAULT_DNS);
    setCustomTweak(DEFAULT_TWEAK);
    setPerAppProxy(DEFAULT_PER_APP_PROXY);
    setTether(DEFAULT_TETHER);
    setHwid(generateHwid());
    setConfigVersion(INITIAL_CONFIG_VERSION);
    setDurationSeconds(0);
    setUploadBytes(0);
    setDownloadBytes(0);
    setTrafficHistory(buildEmptyTraffic());
    setLogs([
      {
        id: `reset-${Date.now()}`,
        time: nowTime(),
        level: 'INFO',
        message: 'Dados redefinidos para os padrões de fábrica.',
      },
    ]);
    showToast('Dados do aplicativo limpos com sucesso.');
  };

  const handleCopyLogs = async () => {
    const text = logs
      .map((l) => `[${l.time}] ${l.level}: ${l.message}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFeedback('logs');
      setTimeout(() => setCopiedFeedback(null), 1600);
    } catch {
      // ignore
    }
  };

  const handleExportConfig = () => {
    const profile = {
      app: 'HX Tunnel PC',
      buildVersion: BUILD_VERSION,
      configVersion,
      exportedAt: new Date().toISOString(),
      hwid,
      server: {
        id: selectedServer.id,
        name: selectedServer.name,
        host: selectedServer.host,
        port: customTweak.enabled ? customTweak.remotePort : selectedServer.port,
      },
      network: {
        id: selectedNetwork.id,
        friendly_name: `${selectedNetwork.flag} ${selectedNetwork.displayName}`,
        payload: customTweak.enabled ? customTweak.payload : selectedNetwork.payload,
        sausage: selectedNetwork.sausage ?? '',
        host: selectedNetwork.host ?? selectedServer.host,
        port: customTweak.enabled
          ? String(customTweak.remotePort)
          : selectedNetwork.port ?? String(selectedServer.port),
        dothost: selectedNetwork.dothost ?? '',
        message: selectedNetwork.message ?? '',
        method: selectedNetwork.method ?? 'http',
        category: selectedNetwork.category ?? 'ocsws',
        query: selectedNetwork.query ?? 'normal',
        sslws: String(Boolean(selectedNetwork.sslws)),
        sniHost: customTweak.enabled ? customTweak.sniHost : selectedNetwork.sniHost,
      },
      dns,
      perAppProxy: perAppProxy.enabled ? perAppProxy : { enabled: false },
      tether: tether.enabled ? tether : { enabled: false },
    };

    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hx-tunnel-pc-${selectedNetwork.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushLog('INFO', `Perfil PC exportado: hx-tunnel-pc-${selectedNetwork.id}.json`);
    showToast('Perfil de túnel exportado (.json).');
  };

  const sectionTitles: Record<NavSection, string> = {
    dashboard: 'Painel de Conexão',
    tweak: 'Custom Tweak',
    hunter: 'IP Hunter',
    proxy: 'Per-App Proxy',
    tether: 'VPNTether',
    system: 'HWID & Sistema',
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        status={status}
        onOpenNotice={() => setNoticeModalOpen(true)}
        onCheckUpdate={handleCheckUpdate}
        onOpenClearData={() => setClearModalOpen(true)}
        configVersion={configVersion}
        isUpdating={isUpdating}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Zone 1 (Title/Breadcrumb) — Zone 2 (4 nav links) — Zone 3 (1 primary CTA) */}
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-8 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white whitespace-nowrap truncate">
              {sectionTitles[activeSection]}
            </h1>
          </div>

          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
            aria-label="Atalhos rápidos"
          >
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Conexão
            </button>
            <button
              type="button"
              onClick={() => setServerModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Servidores
            </button>
            <button
              type="button"
              onClick={() => setNetworkModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Redes
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('tweak')}
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Custom Tweak
            </button>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleToggleConnect}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                status === 'connected'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : status === 'connecting'
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
            >
              {status === 'connected'
                ? 'Desconectar'
                : status === 'connecting'
                ? 'Conectando...'
                : 'Conectar Túnel'}
            </button>
          </div>
        </header>

        {/* Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {toastMessage && (
            <div
              role="status"
              className="mb-5 px-4 py-3 rounded-lg bg-blue-900 text-white text-sm font-medium flex items-center justify-between gap-4"
            >
              <span>{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs underline opacity-85 hover:opacity-100"
              >
                Fechar
              </button>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <DashboardView
              status={status}
              onToggleConnect={handleToggleConnect}
              durationSeconds={durationSeconds}
              uploadBytes={uploadBytes}
              downloadBytes={downloadBytes}
              localIp={localIp}
              buildVersion={BUILD_VERSION}
              configVersion={configVersion}
              selectedServer={selectedServer}
              selectedNetwork={selectedNetwork}
              onOpenServerModal={() => setServerModalOpen(true)}
              onOpenNetworkModal={() => setNetworkModalOpen(true)}
              dns={dns}
              onChangeDns={setDns}
              customTweak={customTweak}
              logs={logs}
              onClearLogs={() => setLogs([])}
              onCopyLogs={handleCopyLogs}
              copiedFeedback={copiedFeedback}
              trafficHistory={trafficHistory}
              onExportConfig={handleExportConfig}
            />
          )}

          {activeSection === 'tweak' && (
            <CustomTweakView
              tweak={customTweak}
              onChangeTweak={setCustomTweak}
              selectedNetwork={selectedNetwork}
              onSaveNotice={(msg) => {
                pushLog('INFO', msg);
                showToast(msg);
              }}
            />
          )}

          {activeSection === 'hunter' && (
            <IpHunterView
              onApplyIp={(ip) => {
                setLocalIp(ip);
                pushLog('OK', `IP ${ip} selecionado no IP Hunter.`);
                showToast(`IP ${ip} aplicado como alvo de interface.`);
              }}
            />
          )}

          {activeSection === 'proxy' && (
            <PerAppProxyView config={perAppProxy} onChange={setPerAppProxy} />
          )}

          {activeSection === 'tether' && (
            <VpnTetherView
              config={tether}
              onChange={setTether}
              status={status}
            />
          )}

          {activeSection === 'system' && (
            <SystemView
              hwid={hwid}
              onRegenerateHwid={() => {
                const next = generateHwid();
                setHwid(next);
                pushLog('INFO', `Novo HWID gerado: ${next}`);
                showToast('Novo HWID gerado.');
              }}
              buildVersion={BUILD_VERSION}
              configVersion={configVersion}
              onCheckUpdate={handleCheckUpdate}
              isUpdating={isUpdating}
              onOpenNotice={() => setNoticeModalOpen(true)}
              onOpenClearData={() => setClearModalOpen(true)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((d) => !d)}
            />
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <ServerModal
        isOpen={serverModalOpen}
        onClose={() => setServerModalOpen(false)}
        servers={servers}
        selectedServerId={selectedServerId}
        onSelectServer={(id) => {
          setSelectedServerId(id);
          const found = servers.find((s) => s.id === id);
          if (found) pushLog('INFO', `Servidor alterado para ${found.name}.`);
        }}
        onPingServers={handlePingServers}
        isPinging={isPinging}
      />

      <NetworkModal
        isOpen={networkModalOpen}
        onClose={() => setNetworkModalOpen(false)}
        networks={NETWORK_PRESETS}
        selectedNetworkId={selectedNetworkId}
        onSelectNetwork={(id) => {
          setSelectedNetworkId(id);
          const found = NETWORK_PRESETS.find((n) => n.id === id);
          if (found) pushLog('INFO', `Rede alterada para ${found.displayName}.`);
        }}
      />

      <NoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        configVersion={configVersion}
      />

      <ClearDataModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearData}
      />
    </div>
  );
}
