// Utility helpers for measuring SPA route timings and formatting logs
export function startRouteTimer(name = 'route') {
  try {
    if (performance && performance.mark) performance.mark(`${name}-start`);
  } catch (e) {
    // ignore
  }
}

export function endRouteTimer(name = 'route', extra = '') {
  try {
    if (!(performance && performance.mark && performance.measure)) return null;
    performance.mark(`${name}-end`);
    const measureName = `${name}-duration`;
    performance.measure(measureName, `${name}-start`, `${name}-end`);
    const measures = performance.getEntriesByName(measureName);
    const last = measures[measures.length - 1];
    const duration = last ? Math.round(last.duration) : null;
    const formatDuration = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} S` : `${ms} MS`);
    if (duration !== null) {
      if (import.meta.env && import.meta.env.DEV) {
        console.log(
          `[PERFORMANCE] PERALIHAN KE HALAMAN ${String(name).toUpperCase()} ${extra} SELESAI DALAM ${formatDuration(duration)}.`
        );
      }
    }
    // clear marks/measures to avoid memory growth
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(measureName);
    return duration;
  } catch (e) {
    return null;
  }
}
