import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { ChartCard, OrdersBarChart } from '../components/Chart.jsx';
import { Icon } from '../components/icons.jsx';

const LINKS = [
  { to: '/employe',           label: 'Mes tâches', icon: Icon.Tasks,   end: true },
  { to: '/employe/commandes', label: 'Commandes',  icon: Icon.Orders },
  { to: '/employe/clients',   label: 'Clients',    icon: Icon.Clients },
];

function MesTaches() {
  return (
    <>
      <div className="stat-grid">
        <StatCard label="Tâches du jour" value="6" icon={Icon.Tasks}  tone="primary" />
        <StatCard label="Commandes à traiter" value="9" icon={Icon.Orders} tone="warning" trend={{ direction: 'up', label: '+2 depuis hier' }} />
        <StatCard label="Clients à recontacter" value="3" icon={Icon.Clients} tone="info" />
      </div>
      <div className="chart-grid">
        <ChartCard title="Mon activité" sub="7 derniers jours">
          <OrdersBarChart labels={['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']} values={[4,6,5,8,7,3,2]} />
        </ChartCard>
      </div>
    </>
  );
}

function Commandes() {
  return <div className="placeholder-block">Commandes assignées (à brancher sur l'API)</div>;
}

function Clients() {
  return <div className="placeholder-block">Mes clients (à brancher sur l'API)</div>;
}

export default function DashboardEmploye() {
  return (
    <DashboardLayout title="Employé" links={LINKS}>
      <Routes>
        <Route index              element={<MesTaches />} />
        <Route path="commandes"   element={<Commandes />} />
        <Route path="clients"     element={<Clients />} />
      </Routes>
    </DashboardLayout>
  );
}
