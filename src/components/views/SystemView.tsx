import React, { useState } from 'react';
import {
  Check,
  Copy,
  DownloadCloud,
  Info,
  Moon,
  RefreshCw,
  Send,
  Sun,
  Trash2,
} from 'lucide-react';

interface SystemViewProps {
  hwid: string;
  onRegenerateHwid: () => void;
  buildVersion: string;
  configVersion: string;
  onCheckUpdate: () => void;
  isUpdating: boolean;
  onOpenNotice: () => void;
  onOpenClearData: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SystemView: React.FC<SystemViewProps> = ({
  hwid,
  onRegenerateHwid,
  buildVersion,
  configVersion,
  onCheckUpdate,
  isUpdating,
  onOpenNotice,
  onOpenClearData,
  darkMode,
  onToggleDarkMode,
}) => {
  const [copied, setCopied] = useState(false);

  const copyHwid = async () => {
    try {
      await navigator.clipboard.writeText(hwid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* HWID Card */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            HWID (Hardware ID do PC)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Identificador único usado para autenticar servidores VIP, arquivos de configuração bloqueados e sessões desktop.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
          <code className="font-mono text-sm sm:text-base font-semibold text-blue-900 dark:text-amber-400 tracking-wide">
            {hwid}
          </code>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyHwid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar HWID'}</span>
            </button>
            <button
              type="button"
              onClick={onRegenerateHwid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Renovar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Version, Theme & Maintenance */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Versão &amp; Atualização de Configurações
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              Build Version: {buildVersion} · Config Version: {configVersion}
            </p>
          </div>

          <button
            type="button"
            onClick={onCheckUpdate}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60"
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
            <span>{isUpdating ? 'Verificando...' : 'Verificar Atualizações'}</span>
          </button>
        </div>

        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Tema da Interface Desktop
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Alterne entre o tema claro clássico HX Tunnel e o tema escuro para PC.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-900" />}
            <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>
        </div>

        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white">
              Canal Oficial &amp; Notas de Versão
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Acesse o aviso de versão (4U Tunnel Lite / CloudFront) ou entre na comunidade Telegram.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenNotice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Ver Notice</span>
            </button>
            <a
              href="https://t.me/s/hxtunnel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-900 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-sm text-rose-700 dark:text-rose-400">
              Clear Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Redefinir todas as preferências locais, tweaks e contadores do aplicativo.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenClearData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Dados</span>
          </button>
        </div>
      </section>
    </div>
  );
};
