import React, { useState } from 'react';
import { Globe, Search, X } from 'lucide-react';
import { NetworkPreset } from '../types/tunnel';
import { HxLogo } from './HxLogo';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  networks: NetworkPreset[];
  selectedNetworkId: string;
  onSelectNetwork: (id: string) => void;
}

export const NetworkModal: React.FC<NetworkModalProps> = ({
  isOpen,
  onClose,
  networks,
  selectedNetworkId,
  onSelectNetwork,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = networks.filter(
    (n) =>
      n.displayName.toLowerCase().includes(query.toLowerCase()) ||
      n.country.toLowerCase().includes(query.toLowerCase()) ||
      n.carrier.toLowerCase().includes(query.toLowerCase()) ||
      n.protocol.toLowerCase().includes(query.toLowerCase()) ||
      (n.host ?? '').toLowerCase().includes(query.toLowerCase()) ||
      (n.message ?? '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="network-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-blue-900 dark:text-amber-400" />
            <h2
              id="network-modal-title"
              className="font-display font-bold text-lg text-slate-900 dark:text-white"
            >
              Selecionar Rede / País
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Network/Country"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-blue-900/30 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-900 dark:focus:border-amber-400"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              Nenhuma rede encontrada para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((net) => {
              const isSelected = net.id === selectedNetworkId;
              return (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => {
                    onSelectNetwork(net.id);
                    onClose();
                  }}
                  className={`w-full px-6 py-3.5 flex items-center justify-between gap-4 text-left transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/35'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <HxLogo size="sm" />
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 truncate">
                        <span>{net.country.charAt(0)}·</span>
                        <span aria-hidden="true">{net.flag}</span>
                        <span className="truncate">{net.displayName}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                        <span>{net.subtitle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{net.method ? net.method.toUpperCase() : net.protocol}</span>
                        {net.port && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">:{net.port}</span>
                          </>
                        )}
                        {net.sslws && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">SSL+WS</span>
                          </>
                        )}
                        {net.message && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{net.message}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                      Ativo
                    </span>
                  )}
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
