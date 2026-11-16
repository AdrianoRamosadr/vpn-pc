import React, { useState } from 'react';
import { Check, Copy, Wifi } from 'lucide-react';
import { ConnectionStatus, TetherConfig } from '../../types/tunnel';

interface VpnTetherViewProps {
  config: TetherConfig;
  onChange: (config: TetherConfig) => void;
  status: ConnectionStatus;
}

export const VpnTetherView: React.FC<VpnTetherViewProps> = ({
  config,
  onChange,
  status,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCommand = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      // ignore
    }
  };

  const hotspotCmd = `netsh wlan set hostednetwork mode=allow ssid="${config.hotspotName}" key=hxtunnel2026 && netsh wlan start hostednetwork`;
  const proxyEnvCmd = `set HTTP_PROXY=http://${config.bindAddress}:${config.httpPort} & set HTTPS_PROXY=http://${config.bindAddress}:${config.httpPort}`;

  return (
    <div className="max-w-4xl space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                VPNTether (Compartilhamento LAN &amp; Hotspot PC)
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Compartilhe a conexão do túnel do PC via Proxy HTTP/SOCKS5 na rede local ou Wi-Fi Hotspot.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {config.enabled ? 'Servidor Proxy Ativo' : 'Desativado'}
            </span>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) =>
                onChange({ ...config, enabled: e.target.checked })
              }
              className="w-5 h-5 rounded accent-blue-900"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Endereço de Escuta (LAN)
            </label>
            <input
              type="text"
              value={config.bindAddress}
              onChange={(e) =>
                onChange({ ...config, bindAddress: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Porta HTTP Proxy
            </label>
            <input
              type="number"
              value={config.httpPort}
              onChange={(e) =>
                onChange({
                  ...config,
                  httpPort: Number(e.target.value) || 8080,
                })
              }
              className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Porta SOCKS5
            </label>
            <input
              type="number"
              value={config.socksPort}
              onChange={(e) =>
                onChange({
                  ...config,
                  socksPort: Number(e.target.value) || 1080,
                })
              }
              className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Nome do Hotspot Wi-Fi (PC)
            </label>
            <input
              type="text"
              value={config.hotspotName}
              onChange={(e) =>
                onChange({ ...config, hotspotName: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="inline-flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.allowLan}
                onChange={(e) =>
                  onChange({ ...config, allowLan: e.target.checked })
                }
                className="w-4 h-4 rounded accent-blue-900"
              />
              <span>Permitir conexões de outros dispositivos na LAN (0.0.0.0)</span>
            </label>
          </div>
        </div>

        {/* Status Summary */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-sm space-y-1">
          <div className="font-semibold text-slate-900 dark:text-white">
            Endpoints para configurar no dispositivo cliente:
          </div>
          <div className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
            HTTP/HTTPS Proxy: {config.allowLan ? config.bindAddress : '127.0.0.1'}:{config.httpPort} · SOCKS5: {config.allowLan ? config.bindAddress : '127.0.0.1'}:{config.socksPort}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Túnel principal: {status === 'connected' ? 'Conectado e pronto para roteamento' : 'Aguardando conexão do túnel'}
          </div>
        </div>

        {/* Windows Helper Commands */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Comando Windows Hotspot (Admin CMD)
              </span>
              <button
                type="button"
                onClick={() => copyCommand('hotspot', hotspotCmd)}
                className="inline-flex items-center gap-1 text-xs text-blue-900 dark:text-amber-400 hover:underline"
              >
                {copiedKey === 'hotspot' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'hotspot' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
              {hotspotCmd}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Variáveis de Proxy para Terminal PC
              </span>
              <button
                type="button"
                onClick={() => copyCommand('proxy', proxyEnvCmd)}
                className="inline-flex items-center gap-1 text-xs text-blue-900 dark:text-amber-400 hover:underline"
              >
                {copiedKey === 'proxy' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'proxy' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
              {proxyEnvCmd}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
