import clsx from 'clsx';

/**
 * Badge component
 * variant: 'soft' | 'solid' | 'outline' | 'primary' | 'success' | 'danger' | 'warning' | 'secondary'
 * color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'purple' | 'blue'
 */
const Badge = ({ children, color, variant = 'soft', className }) => {
  // ── Alias map: shorthand variants → color + style ──────────────────────
  const aliasMap = {
    primary:   { color: 'indigo',  variant: 'soft' },
    success:   { color: 'emerald', variant: 'soft' },
    danger:    { color: 'rose',    variant: 'soft' },
    warning:   { color: 'amber',   variant: 'soft' },
    secondary: { color: 'slate',   variant: 'soft' },
  };

  // Resolve alias if used
  let resolvedVariant = variant;
  let resolvedColor   = color ?? 'slate';

  if (aliasMap[variant]) {
    resolvedVariant = aliasMap[variant].variant;
    resolvedColor   = color ?? aliasMap[variant].color; // caller color overrides alias
  }

  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  const styles = {
    soft: {
      slate:   'bg-slate-100 text-slate-700',
      indigo:  'bg-indigo-100 text-indigo-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      amber:   'bg-amber-100 text-amber-700',
      rose:    'bg-rose-100 text-rose-700',
      purple:  'bg-purple-100 text-purple-700',
      blue:    'bg-blue-100 text-blue-700',
      green:   'bg-green-100 text-green-700',
      red:     'bg-red-100 text-red-700',
      yellow:  'bg-yellow-100 text-yellow-700',
    },
    solid: {
      slate:   'bg-slate-600 text-white',
      indigo:  'bg-indigo-600 text-white',
      emerald: 'bg-emerald-600 text-white',
      amber:   'bg-amber-500 text-white',
      rose:    'bg-rose-600 text-white',
      purple:  'bg-purple-600 text-white',
      blue:    'bg-blue-600 text-white',
      green:   'bg-green-600 text-white',
      red:     'bg-red-600 text-white',
      yellow:  'bg-yellow-500 text-white',
    },
    outline: {
      slate:   'border border-slate-300 text-slate-700',
      indigo:  'border border-indigo-300 text-indigo-700',
      emerald: 'border border-emerald-300 text-emerald-700',
      amber:   'border border-amber-300 text-amber-700',
      rose:    'border border-rose-300 text-rose-700',
      purple:  'border border-purple-300 text-purple-700',
      blue:    'border border-blue-300 text-blue-700',
      green:   'border border-green-300 text-green-700',
      red:     'border border-red-300 text-red-700',
      yellow:  'border border-yellow-300 text-yellow-700',
    },
  };

  // Fallback so it never crashes — even with a totally unknown variant/color
  const variantStyles = styles[resolvedVariant] ?? styles.soft;
  const colorClass    = variantStyles[resolvedColor] ?? variantStyles.slate;

  return (
    <span className={clsx(base, colorClass, className)}>
      {children}
    </span>
  );
};

export default Badge;
