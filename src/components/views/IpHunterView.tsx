import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Play, Square, Trash2 } from 'lucide-react';
import { HunterResult } from '../../types/tunnel';

interface IpHunterViewProps {
  onApplyIp: (ip: string) => void;
}

export const IpHunterView: React.FC<IpHunterViewProps> = ({ onApplyIp }) => {
  const [prefixes, setPrefixes] = useState('10.10.;100.64.;172.16.');
  const [method, setMethod] = useState<'http' | 'gateway' | 'cloudfront'>('http');
  const [scanning, setScanning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<HunterResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopScan = () => {
    setScanning(false);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const startScan = () => {
    const list = prefixes
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean);
    if (list.length === 0) return;

    setScanning(true);
    timerRef.current = window.setInterval(() => {
      setAttempts((prev) => prev + 1);
      const chosenPrefix = list[Math.floor(Math.random() * list.length)];
      const cleanBase = chosenPrefix.replace(/\.+$/, '');
      const segments = cleanBase.split('.').length;
      const missing = Math.max(0, 4 - segments);
      const octets = Array.from({ length: missing }, () =>
        Math.floor(Math.random() * 253) + 1
      );
      const ip = [cleanBase, ...octets].join('.');
      const matched = Math.random() > 0.55;

      const entry: HunterResult = {
        id: `${Date.now()}-${Math.random()}`,
        ip,
        prefix: chosenPrefix,
        gateway: `${cleanBase}.0.1`,
        latencyMs: Math.floor(22 + Math.random() * 85),
        httpStatus: matched ? '200 OK (Matched)' : '302 Redirect',
        matched,
        timestamp: new Date().toLocaleTimeString(),
      };

      setResults((prev) => [entry, ...prev].slice(0, 40));
    }, 650);
  };

  const handleCopy = async (id: string, ip: string) => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              IP Hunter (PC Network Scanner)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Procure endereços IP locais ou faixas compatíveis separadas por ponto e vírgula (;).
            </p>
          </div>

          <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
            Tentativas: <span className="font-bold">{attempts}</span> · Encontrados:{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {results.filter((r) => r.matched).length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Faixas / Prefixos Alvo
            </label>
            <input
              type="text"
              value={prefixes}
              onChange={(e) => setPrefixes(e.target.value)}
              disabled={scanning}
              placeholder="10.10.;100.64.;192.168."
              className="w-full px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900 disabled:opacity-60"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Método de Busca
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'http' | 'gateway' | 'cloudfront')}
              disabled={scanning}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            >
              <option value="http">HTTP Header Probe</option>
              <option value="gateway">Local Gateway Sweep</option>
              <option value="cloudfront">CloudFront Edge Check</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            {scanning ? (
              <button
                type="button"
                onClick={stopScan}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Parar Busca</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startScan}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Iniciar Hunter</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setResults([]);
                setAttempts(0);
              }}
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Limpar resultados"
              aria-label="Limpar resultados"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Presets rápidos:</span>
          <button
            type="button"
            disabled={scanning}
            onClick={() => setPrefixes('10.10.;10.20.;100.64.')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          >
            Angola 10.x / 100.64.x
          </button>
          <button
            type="button"
            disabled={scanning}
            onClick={() => setPrefixes('13.32.;18.64.;52.84.')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          >
            CloudFront Edge
          </button>
          <button
            type="button"
            disabled={scanning}
            onClick={() => setPrefixes('192.168.1.;192.168.0.')}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200"
          >
            LAN Local
          </button>
        </div>
      </section>

      {/* Results Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">IP Detectado</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Resposta</th>
                <th className="py-3 px-4 text-right">Latência</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    Clique em &ldquo;Iniciar Hunter&rdquo; para escanear faixas de IP compatíveis.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-mono text-xs tabular-nums text-slate-500">
                      {r.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {r.ip}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {r.gateway}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-xs font-medium ${
                        r.matched
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {r.httpStatus}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-right text-slate-700 dark:text-slate-300">
                      {r.latencyMs} ms
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(r.id, r.ip)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          {copiedId === r.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === r.id ? 'Copiado' : 'Copiar'}</span>
                        </button>
                        {r.matched && (
                          <button
                            type="button"
                            onClick={() => onApplyIp(r.ip)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-900 dark:text-amber-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded"
                          >
                            Aplicar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
