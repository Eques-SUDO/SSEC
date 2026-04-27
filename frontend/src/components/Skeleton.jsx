export function Skeleton({ width = '100%', height = 12, radius = 6, style }) {
  return (
    <span
      className="skeleton"
      style={{ display: 'inline-block', width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function SkeletonRows({ rows = 5, cols = 4 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c}><Skeleton width={c === 0 ? '40%' : '70%'} /></td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
