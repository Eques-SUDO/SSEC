const TONES = {
  actif:       { tone: 'success', label: 'Actif' },
  inactif:     { tone: 'muted',   label: 'Inactif' },
  suspendu:    { tone: 'danger',  label: 'Suspendu' },
  en_alerte:   { tone: 'danger',  label: 'En alerte' },
  en_attente:  { tone: 'warning', label: 'En attente' },
  validee:     { tone: 'info',    label: 'Validée' },
  expediee:    { tone: 'info',    label: 'Expédiée' },
  livree:      { tone: 'success', label: 'Livrée' },
  annulee:     { tone: 'danger',  label: 'Annulée' },
};

export function StatusBadge({ status, label, tone }) {
  const preset = TONES[status] ?? { tone: tone ?? 'muted', label: label ?? status };
  return (
    <span className={`badge is-${tone ?? preset.tone}`}>
      {label ?? preset.label}
    </span>
  );
}
