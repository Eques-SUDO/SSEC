import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { ChartCard, OrdersBarChart, RevenueLineChart, StatusDoughnut } from '../components/Chart.jsx';
import { Icon } from '../components/icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { employeesApi } from '../api/client.js';

const LINKS = [
  { to: '/direction',             label: "Vue d'ensemble", icon: Icon.Overview, end: true },
  { to: '/direction/performance', label: 'Performances',   icon: Icon.Performance },
  { to: '/direction/employes',    label: 'Employés',       icon: Icon.Users },
];

function VueEnsemble() {
  const revenue = {
    labels: ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5', 'Sem. 6'],
    values: [42, 51, 48, 64, 72, 81],
  };
  const orders = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    values: [12, 19, 15, 22, 28, 24, 9],
  };
  const status = {
    labels: ['Livrée', 'En attente', 'Validée', 'Annulée'],
    values: [54, 18, 22, 6],
  };

  return (
    <>
      <div className="section-title">
        <div>
          <h2>Vue d'ensemble</h2>
          <p>Indicateurs clés du business sur les 30 derniers jours.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total commandes"
          value="1 248"
          icon={Icon.Orders}
          tone="primary"
          trend={{ direction: 'up', label: '+12.4% vs mois dernier' }}
        />
        <StatCard
          label="Chiffre d'affaires"
          value="284 320 MAD"
          icon={Icon.Performance}
          tone="info"
          trend={{ direction: 'up', label: '+8.1%' }}
        />
        <StatCard
          label="Seuil d'alerte stock"
          value="7 produits"
          icon={Icon.Inventory}
          tone="warning"
          trend={{ direction: 'down', label: '-2 vs hier' }}
        />
        <StatCard
          label="Employés actifs"
          value="14"
          icon={Icon.Users}
          tone="success"
          foot="2 nouveaux ce mois-ci"
        />
      </div>

      <div className="chart-grid">
        <ChartCard title="Évolution du CA" sub="Données sur 6 semaines">
          <RevenueLineChart {...revenue} />
        </ChartCard>
        <ChartCard title="Commandes par statut" sub="Répartition sur 30 jours">
          <StatusDoughnut {...status} />
        </ChartCard>
      </div>

      <div className="chart-grid">
        <ChartCard title="Commandes par jour" sub="7 derniers jours">
          <OrdersBarChart {...orders} />
        </ChartCard>
      </div>
    </>
  );
}

function Performance() {
  const labels = ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin'];
  return (
    <>
      <div className="stat-grid">
        <StatCard label="Taux de conversion" value="3.8%"  icon={Icon.Performance} tone="success" trend={{ direction: 'up',   label: '+0.4 pts' }} />
        <StatCard label="Panier moyen"       value="427 MAD" icon={Icon.Orders}     tone="info"    trend={{ direction: 'flat', label: 'stable' }} />
        <StatCard label="Délai moyen livraison" value="2.1 j" icon={Icon.Tasks}     tone="warning" trend={{ direction: 'down', label: '-0.3 j' }} />
      </div>
      <div className="chart-grid">
        <ChartCard title="Performance par employé" sub="Commandes traitées">
          <OrdersBarChart labels={['A. Karroud', 'S. Allioui', 'F. Moughamir', 'M. Roukhsi']} values={[32, 28, 41, 36]} />
        </ChartCard>
        <ChartCard title="Évolution mensuelle" sub="6 derniers mois">
          <RevenueLineChart labels={labels} values={[120, 132, 128, 145, 160, 178]} />
        </ChartCard>
      </div>
    </>
  );
}

function EmployesTab() {
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
    { key: 'nom',      label: 'Nom',      sortable: true,
      render: (r) => <strong>{r.prenom} {r.nom}</strong> },
    { key: 'email',    label: 'Email',    sortable: true },
    { key: 'role',     label: 'Rôle',     sortable: true,
      render: (r) => <StatusBadge status={r.role} tone="info" label={r.role} /> },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'date_embauche', label: 'Embauche', sortable: true,
      render: (r) => new Date(r.date_embauche).toLocaleDateString('fr-FR') },
    { key: 'statut',   label: 'Statut',   sortable: true,
      render: (r) => <StatusBadge status={r.statut} /> },
  ];

  const actions = [
    { label: 'Voir',      icon: Icon.Eye,   onClick: (r) => toast.info('Aperçu', `${r.prenom} ${r.nom}`) },
    { label: 'Modifier',  icon: Icon.Edit,  onClick: (r) => toast.warning('À implémenter', `Édition de ${r.prenom} ${r.nom}`) },
    { label: 'Supprimer', icon: Icon.Trash, tone: 'danger',
      onClick: (r) => toast.error('Action protégée', `Suppression de ${r.email} non disponible en démo`) },
  ];

  return (
    <DataTable
      title="Liste des employés"
      columns={columns}
      data={data}
      actions={actions}
      loading={loading}
      error={error}
      onAdd={() => toast.success('Ajout employé', 'Formulaire de création (à brancher)')}
      addLabel="Nouvel employé"
    />
  );
}

export default function DashboardDirection() {
  return (
    <DashboardLayout title="Direction" links={LINKS}>
      <Routes>
        <Route index            element={<VueEnsemble />} />
        <Route path="performance" element={<Performance />} />
        <Route path="employes"    element={<EmployesTab />} />
      </Routes>
    </DashboardLayout>
  );
}
