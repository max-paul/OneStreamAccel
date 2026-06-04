const CONFIG = {
  info: {
    icon: 'ti-info-circle',
    color: 'var(--accent)',
    bg: 'rgba(79,142,247,0.07)',
    border: 'rgba(79,142,247,0.20)',
  },
  tip: {
    icon: 'ti-bulb',
    color: 'var(--success)',
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.20)',
  },
  warning: {
    icon: 'ti-alert-triangle',
    color: 'var(--warning)',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.20)',
  },
  critical: {
    icon: 'ti-alert-circle',
    color: 'var(--danger)',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.20)',
  },
};

export default function InfoBox({ type = 'info', title, children }) {
  const c = CONFIG[type] || CONFIG.info;
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius)',
      padding: '0.875rem 1rem',
      marginBottom: '1.25rem',
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <i className={`ti ${c.icon}`} style={{ color: c.color, fontSize: '15px', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {title && (
            <div style={{ fontSize: '11px', fontWeight: '600', color: c.color, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
              {title}
            </div>
          )}
          <div style={{ fontSize: '12.5px', color: 'var(--text2)', lineHeight: '1.7' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
