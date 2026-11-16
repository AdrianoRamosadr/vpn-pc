import React from 'react';
import { HxLogo } from './HxLogo';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  configVersion: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  configVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <HxLogo size="sm" />
          <h2
            id="notice-modal-title"
            className="font-display font-bold text-xl text-slate-900 dark:text-white"
          >
            Notice!
          </h2>
        </div>

        <div className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white">
            4U Tunnel Lite · HX Tunnel PC (v{configVersion})
          </p>
          <p>Fast &amp; secure internet connection</p>
          <p>Supports CloudFront servers</p>
          <p>Always use the latest version for better speed &amp; stability.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Nota PC: Os perfis configurados aqui podem ser exportados em JSON ou Script Proxy para uso no cliente Windows/Linux.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold tracking-wide text-blue-900 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            OKAY
          </button>
        </div>
      </div>
    </div>
  );
};
