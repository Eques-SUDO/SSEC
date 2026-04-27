import { Icon } from './icons.jsx';
import { Skeleton } from './Skeleton.jsx';

export function StatCard({ label, value, icon: IconCmp, tone = 'primary', trend, foot, loading }) {
  return (
    <div className="stat-card">
      <div className="stat-card-head">
        <div className="stat-card-label">{label}</div>
        {IconCmp && (
          <div className={`stat-card-icon is-${tone}`}>
            <IconCmp />
          </div>
        )}
      </div>

      <div className="stat-card-value">
        {loading ? <Skeleton width="60%" height={28} /> : value}
      </div>

      {trend && !loading && (
        <span className={`stat-card-trend is-${trend.direction}`}>
          {trend.direction === 'up'   ? <Icon.TrendUp width={12} height={12} /> : null}
          {trend.direction === 'down' ? <Icon.TrendDown width={12} height={12} /> : null}
          {trend.label}
        </span>
      )}

      {foot && !loading && <div className="stat-card-foot">{foot}</div>}
    </div>
  );
}
