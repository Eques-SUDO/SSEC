import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Icon } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { employeesApi } from '../api/client.js';

const LINKS = [
  { to: '/admin',              label: 'Vue système',  icon: Icon.Server,   end: true },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Icon.Users },
  { to: '/admin/journaux',     label: 'Journaux',     icon: Icon.Logs },
];

function VueSysteme() {
  return (
    <div className="stat-grid">
      <StatCard label="Utilisateurs actifs" value="14" icon={Icon.Users}    tone="success" />
      <StatCard label="Sessions JWT"        value="6"  icon={Icon.Server}   tone="primary" foot="actuellement valides" />
      <StatCard label="Erreurs 24h"         value="0"  icon={Icon.Alert}    tone="success" trend={{ direction: 'down', label: '-100%' }} />
      <StatCard label="Statut services"     value="OK" icon={Icon.Check}    tone="success" foot="DB · API · Auth" />
    </div>
  );
}

function Utilisateurs() {
  const { token } = useAuth();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    employeesApi.list(token)
      .then((res) => { if (alive) setData(res.data ?? []); })
      .catch((e)  => { if (alive) setError(e.message || 'Erreur de chargement'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [token]);

  const columns = [
    { key: 'id',     label: 'ID',     sortable: true, width: 70 },
    { key: 'nom',    label: 'Nom',    sortable: true,
      render: (r) => <strong>{r.prenom} {r.nom}</strong> },
    { key: 'email',  label: 'Email',  sortable: true },
    { key: 'role',   label: 'Rôle',   sortable: true,
      render: (r) => <StatusBadge status={r.role} tone="info" label={r.role} /> },
    { key: 'statut', label: 'Statut', sortable: true,
      render: (r) => <StatusBadge status={r.statut} /> },
  ];

  const actions = [
    { label: 'Modifier',  icon: Icon.Edit,  onClick: (r) => toast.info('Édition', `${r.prenom} ${r.nom}`) },
    { label: 'Supprimer', icon: Icon.Trash, tone: 'danger',
      onClick: (r) => toast.error('Suppression bloquée', 'Action protégée en démo') },
  ];

  return (
    <DataTable
      title="Utilisateurs"
      columns={columns}
      data={data}
      actions={actions}
      loading={loading}
      error={error}
      onAdd={() => toast.success('Nouvel utilisateur', 'Formulaire de création (à brancher)')}
      addLabel="Nouvel utilisateur"
    />
  );
}

function Journaux() {
  return <div className="placeholder-block">Logs d'authentification et accès (à brancher)</div>;
}

export default function DashboardAdmin() {
  return (
    <DashboardLayout title="Admin IT" links={LINKS}>
      <Routes>
        <Route index               element={<VueSysteme />} />
        <Route path="utilisateurs" element={<Utilisateurs />} />
        <Route path="journaux"     element={<Journaux />} />
      </Routes>
    </DashboardLayout>
  );
}
