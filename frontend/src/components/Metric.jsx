export default function Metric({ label, val, sub, color }) {
  return (
    <div className={`metric ${color}`}>
      <div className="metric-label">{label}</div>
      <div className={`metric-val ${color}`}>{val}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}
