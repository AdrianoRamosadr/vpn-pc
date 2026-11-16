import React from 'react';
import {
  Activity,
  Cpu,
  DownloadCloud,
  Info,
  Layers,
  Radar,
  RefreshCw,
  Send,
  Sliders,
  Trash2,
  Wifi,
} from 'lucide-react';
import { ConnectionStatus, NavSection } from '../types/tunnel';
import { HxLogo } from './HxLogo';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  status: ConnectionStatus;
  onOpenNotice: () => void;
  onCheckUpdate: () => void;
  onOpenClearData: () => void;
  configVersion: string;
  isUpdating: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  status,
  onOpenNotice,
  onCheckUpdate,
  onOpenClearData,
  configVersion,
  isUpdating,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Conexão', icon: <Activity className="w-4 h-4 shrink-0" /> },
    { id: 'tweak', label: 'Custom Tweak', icon: <Sliders className="w-4 h-4 shrink-0" /> },
    { id: 'hunter', label: 'IP Hunter', icon: <Radar className="w-4 h-4 shrink-0" /> },
    { id: 'proxy', label: 'Per-App Proxy', icon: <Layers className="w-4 h-4 shrink-0" /> },
    { id: 'tether', label: 'VPNTether', icon: <Wifi className="w-4 h-4 shrink-0" /> },
    { id: 'system', label: 'HWID & Sistema', icon: <Cpu className="w-4 h-4 shrink-0" /> },
  ];

  const handleNav = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Signature HX Tunnel Amber Brand Header */}
        <div className="bg-amber-500 px-5 py-4 flex items-center gap-3 border-b border-amber-600/30">
          <HxLogo size="md" />
          <div className="min-w-0">
            <div className="font-display font-bold text-base text-slate-950 leading-tight truncate">
              HX Tunnel PC
            </div>
            <div className="text-xs font-medium text-slate-900/80 tabular-nums truncate">
              Config v{configVersion}
            </div>
          </div>
        </div>

        {/* Primary Desktop Modules */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Menu Principal">
          <div className="px-3 pb-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            Módulos do Túnel
          </div>
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 ${
                  active
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <div className="pt-5 pb-1.5 px-3 text-xs font-medium text-slate-400 dark:text-slate-500">
            Utilitários &amp; Suporte
          </div>

          <button
            type="button"
            onClick={() => {
              onCheckUpdate();
              onCloseMobile();
            }}
            disabled={isUpdating}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap disabled:opacity-60"
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
            ) : (
              <DownloadCloud className="w-4 h-4 shrink-0" />
            )}
            <span>{isUpdating ? 'Atualizando...' : 'Update Config'}</span>
          </button>

          <a
            href="https://t.me/s/hxtunnel"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>Telegram</span>
          </a>

          <button
            type="button"
            onClick={() => {
              onOpenNotice();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>Notice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenClearData();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Clear Data</span>
          </button>
        </nav>

        {/* Bottom Connection Summary */}
        <div className="px-4 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Estado do Túnel</span>
            <span
              className={`font-semibold ${
                status === 'connected'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : status === 'connecting'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {status === 'connected'
                ? 'Conectado'
                : status === 'connecting'
                ? 'Conectando...'
                : 'Desconectado'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
