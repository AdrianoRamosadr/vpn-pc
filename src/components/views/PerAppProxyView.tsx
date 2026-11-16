import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PerAppProxyConfig, ProxyAppItem } from '../../types/tunnel';

interface PerAppProxyViewProps {
  config: PerAppProxyConfig;
  onChange: (config: PerAppProxyConfig) => void;
}

export const PerAppProxyView: React.FC<PerAppProxyViewProps> = ({
  config,
  onChange,
}) => {
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newExe, setNewExe] = useState('');

  const filtered = config.apps.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.executable.toLowerCase().includes(search.toLowerCase())
  );

  const toggleApp = (id: string) => {
    onChange({
      ...config,
      apps: config.apps.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      ),
    });
  };

  const removeApp = (id: string) => {
    onChange({
      ...config,
      apps: config.apps.filter((a) => a.id !== id),
    });
  };

  const addCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newExe.trim()) return;
    const item: ProxyAppItem = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      executable: newExe.trim(),
      category: 'Personalizado',
      enabled: true,
    };
    onChange({
      ...config,
      apps: [item, ...config.apps],
    });
    setNewName('');
    setNewExe('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Per-App Proxy (Split Tunneling PC)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Escolha quais executáveis do Windows/PC passam pelo túnel VPN ou acessam a rede diretamente.
            </p>
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {config.enabled ? 'Ativado' : 'Desativado'}
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ ...config, mode: 'bypass' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                config.mode === 'bypass'
                  ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Ignorar VPN nos selecionados
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, mode: 'only-selected' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                config.mode === 'only-selected'
                  ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Apenas selecionados usam VPN
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar aplicativo..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
            />
          </div>
        </div>

        {/* Add Custom PC Executable */}
        <form
          onSubmit={addCustomApp}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome do programa (ex: Brave)"
            className="sm:col-span-5 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
          />
          <input
            type="text"
            value={newExe}
            onChange={(e) => setNewExe(e.target.value)}
            placeholder="Executável (ex: brave.exe)"
            className="sm:col-span-5 px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-900"
          />
          <button
            type="submit"
            className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </form>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th className="py-3 px-4">Aplicativo</th>
              <th className="py-3 px-4">Executável</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4 text-right">Regra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {filtered.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                  {app.name}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                  {app.executable}
                </td>
                <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                  {app.category}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    {app.category === 'Personalizado' && (
                      <button
                        type="button"
                        onClick={() => removeApp(app.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        aria-label={`Remover ${app.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      type="checkbox"
                      checked={app.enabled}
                      onChange={() => toggleApp(app.id)}
                      disabled={!config.enabled}
                      className="w-4 h-4 rounded accent-blue-900 disabled:opacity-50"
                      aria-label={`Alternar ${app.name}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
