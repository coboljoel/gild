export function fmt(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmt0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function signed(n, digits = 2) {
  return (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(digits) + '%';
}

export function signedFmt(n) {
  return (n >= 0 ? '+' : '−') + fmt(Math.abs(n));
}

export function toPath(series, min, max, w, h, pad) {
  const span = (max - min) || 1;
  return series
    .map((v, i) => (i ? 'L' : 'M') + (i / (series.length - 1) * w).toFixed(1) + ',' + (h - pad - (v - min) / span * (h - 2 * pad)).toFixed(1))
    .join(' ');
}
