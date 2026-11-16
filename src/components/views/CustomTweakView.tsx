import React from 'react';
import { Check, Copy, RotateCcw, Save } from 'lucide-react';
import {
  CustomTweakConfig,
  NetworkPreset,
  TunnelProtocol,
} from '../../types/tunnel';

interface CustomTweakViewProps {
  tweak: CustomTweakConfig;
  onChangeTweak: (tweak: CustomTweakConfig) => void;
  selectedNetwork: NetworkPreset;
  onSaveNotice: (msg: string) => void;
}

const MODES: TunnelProtocol[] = [
  'CloudFront CDN',
  'SSH + WebSocket',
  'SSL / SNI (Stunnel)',
  'SlowDNS (DNSTT)',
  'V2Ray / Trojan',
];

const PAYLOAD_TOKENS = [
  '[crlf]',
  '[cf]',
  '[host]',
  '[host_port]',
  '[protocol]',
  '[ua]',
  '[rotate]',
  '[split]',
  'Upgrade: websocket',
];

export const CustomTweakView: React.FC<CustomTweakViewProps> = ({
  tweak,
  onChangeTweak,
  selectedNetwork,
  onSaveNotice,
}) => {
  const [copied, setCopied] = React.useState(false);

  const insertToken = (token: string) => {
    onChangeTweak({
      ...tweak,
      payload: `${tweak.payload}${token}`,
    });
  };

  const loadFromNetwork = () => {
    const parsedPort = Number(selectedNetwork.port);
    onChangeTweak({
      ...tweak,
      mode: selectedNetwork.protocol,
      sniHost: selectedNetwork.sausage || selectedNetwork.host || selectedNetwork.sniHost,
      remotePort: Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : tweak.remotePort,
      payload: selectedNetwork.payload,
    });
    onSaveNotice(`Payload importado de ${selectedNetwork.displayName}.`);
  };

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(tweak.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked in restricted frame
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Custom Tweak &amp; Payload Injector
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Substitua a configuração automática da rede por cabeçalhos HTTP, SNI ou rotas CloudFront personalizadas.
            </p>
          </div>

          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {tweak.enabled ? 'Tweak Ativado' : 'Usando Preset da Rede'}
            </span>
            <input
              type="checkbox"
              checked={tweak.enabled}
              onChange={(e) =>
                onChangeTweak({ ...tweak, enabled: e.target.checked })
              }
              className="w-5 h-5 rounded accent-blue-900"
            />
          </label>
        </div>

        {/* Protocol Mode Selector */}
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Modo de Injeção / Protocolo
          </div>
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChangeTweak({ ...tweak, mode })}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  tweak.mode === mode
                    ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-amber-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* SNI / Port / Keep-Alive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              SNI / Bug Host
            </label>
            <input
              type="text"
              value={tweak.sniHost}
              onChange={(e) =>
                onChangeTweak({ ...tweak, sniHost: e.target.value })
              }
              placeholder="ex: portal.movicel.co.ao"
              className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Porta Remota
            </label>
            <input
              type="number"
              min={1}
              max={65535}
              value={tweak.remotePort}
              onChange={(e) =>
                onChangeTweak({
                  ...tweak,
                  remotePort: Number(e.target.value) || 443,
                })
              }
              className="w-full px-3.5 py-2 text-sm font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        {/* Payload Editor */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Payload HTTP / WebSocket
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadFromNetwork}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Carregar de {selectedNetwork.carrier}</span>
              </button>
              <button
                type="button"
                onClick={copyPayload}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={tweak.payload}
            onChange={(e) =>
              onChangeTweak({ ...tweak, payload: e.target.value })
            }
            className="w-full p-3.5 text-sm font-mono bg-slate-950 text-emerald-300 border border-slate-800 rounded-lg focus:outline-none focus:border-amber-500"
          />

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
              Inserir tag:
            </span>
            {PAYLOAD_TOKENS.map((tok) => (
              <button
                key={tok}
                type="button"
                onClick={() => insertToken(tok)}
                className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition-colors"
              >
                {tok}
              </button>
            ))}
          </div>
        </div>

        {/* Options Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={tweak.preserveSni}
                onChange={(e) =>
                  onChangeTweak({ ...tweak, preserveSni: e.target.checked })
                }
                className="w-4 h-4 rounded accent-blue-900"
              />
              <span>Preservar SNI na negociação TLS</span>
            </label>

            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span>Keep-Alive (s):</span>
              <input
                type="number"
                min={5}
                max={300}
                value={tweak.keepAliveSeconds}
                onChange={(e) =>
                  onChangeTweak({
                    ...tweak,
                    keepAliveSeconds: Number(e.target.value) || 30,
                  })
                }
                className="w-20 px-2.5 py-1 font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onSaveNotice(
                tweak.enabled
                  ? 'Custom Tweak salvo e ativo no perfil atual.'
                  : 'Custom Tweak salvo (marque "Tweak Ativado" para usá-lo na conexão).'
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Aplicar Tweak</span>
          </button>
        </div>
      </section>
    </div>
  );
};
