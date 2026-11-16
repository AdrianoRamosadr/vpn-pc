import React, { useState } from 'react';
import { RefreshCw, Search, Server, X } from 'lucide-react';
import { ServerNode } from '../types/tunnel';
import { HxLogo } from './HxLogo';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: ServerNode[];
  selectedServerId: string;
  onSelectServer: (id: string) => void;
  onPingServers: () => void;
  isPinging: boolean;
}

export const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  servers,
  selectedServerId,
  onSelectServer,
  onPingServers,
  isPinging,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = servers.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.region.toLowerCase().includes(query.toLowerCase()) ||
      s.host.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="server-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-blue-900 dark:text-amber-400" />
            <h2
              id="server-modal-title"
              className="font-display font-bold text-lg text-slate-900 dark:text-white"
            >
              Selecionar Servidor
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPingServers}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Testando...' : 'Testar Latência'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servidor, região ou host..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-900 dark:focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhum servidor encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((server) => {
              const isSelected = server.id === selectedServerId;
              return (
                <button
                  key={server.id}
                  type="button"
                  onClick={() => {
                    onSelectServer(server.id);
                    onClose();
                  }}
                  className={`w-full px-6 py-3.5 flex items-center justify-between gap-4 text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <HxLogo size="sm" />
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {server.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{server.subtitle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{server.region}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">:{server.port}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 text-right">
                    <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {server.latencyMs !== null ? `${server.latencyMs} ms` : '-- ms'}
                    </div>
                    <span
                      className={`text-xs font-bold tracking-wide ${
                        server.badgeText === 'Random'
                          ? 'text-blue-700 dark:text-blue-400'
                          : server.badgeText === 'CLOUDFRONT'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {server.badgeText}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
