import React from 'react';
import { TrafficPoint } from '../types/tunnel';

interface TrafficChartProps {
  points: TrafficPoint[];
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ points }) => {
  const width = 560;
  const height = 150;
  const padX = 8;
  const padY = 12;

  const maxVal = Math.max(
    120,
    ...points.map((p) => Math.max(p.downKbps, p.upKbps))
  );

  const buildPolyline = (values: number[]) => {
    if (values.length === 0) return '';
    const step = (width - padX * 2) / Math.max(1, values.length - 1);
    return values
      .map((v, i) => {
        const x = padX + i * step;
        const y = height - padY - (v / maxVal) * (height - padY * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const buildArea = (values: number[]) => {
    if (values.length === 0) return '';
    const line = buildPolyline(values);
    const step = (width - padX * 2) / Math.max(1, values.length - 1);
    const lastX = padX + (values.length - 1) * step;
    const baseY = height - padY;
    return `${padX},${baseY} ${line} ${lastX.toFixed(1)},${baseY}`;
  };

  const downValues = points.map((p) => p.downKbps);
  const upValues = points.map((p) => p.upKbps);
  const latest = points[points.length - 1] ?? { downKbps: 0, upKbps: 0 };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <span className="w-2.5 h-0.5 bg-blue-900 dark:bg-blue-400 inline-block" />
            Download: <span className="font-mono tabular-nums">{latest.downKbps.toFixed(0)} KB/s</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block" />
            Upload: <span className="font-mono tabular-nums">{latest.upKbps.toFixed(0)} KB/s</span>
          </span>
        </div>
        <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">
          Escala máx: {Math.round(maxVal)} KB/s
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-36 block"
          preserveAspectRatio="none"
          aria-label="Gráfico de tráfego em tempo real"
        >
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = padY + ratio * (height - padY * 2);
            return (
              <line
                key={ratio}
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {points.length > 1 && (
            <>
              <polygon
                points={buildArea(downValues)}
                className="fill-blue-900/10 dark:fill-blue-400/15"
              />
              <polyline
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildPolyline(downValues)}
                className="stroke-blue-900 dark:stroke-blue-400"
              />
              <polyline
                fill="none"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={buildPolyline(upValues)}
                className="stroke-amber-500"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
