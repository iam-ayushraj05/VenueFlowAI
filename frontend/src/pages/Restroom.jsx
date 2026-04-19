import { useEffect, useState } from 'react';
import Metric from '../components/Metric';
import { useToast } from '../context/ToastContext';

export default function Restroom() {
  const [restrooms, setRestrooms] = useState([]);
  const { toast } = useToast();

  const fetchRestrooms = () => {
    fetch('/api/restrooms').then(r => r.json()).then(data => setRestrooms(data));
  };

  useEffect(() => { fetchRestrooms(); }, []);

  const refreshRestrooms = () => {
    fetch('/api/restrooms/refresh', { method: 'POST' }).then(r => r.json()).then(data => {
      setRestrooms(data);
      toast('Sensor data refreshed', 'cyan', 2000);
    });
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Restroom Index</div>
          <div className="page-sub">GREEN-LIGHT SYSTEM · REAL-TIME OCCUPANCY SENSORS</div>
        </div>
        <button className="btn btn-sm" onClick={refreshRestrooms}>↻ Refresh sensors</button>
      </div>

      <div className="metrics-row">
        <Metric label="Available" val={restrooms.filter(r => r.level < 45).length} sub="Low occupancy" color="green" />
        <Metric label="Moderate" val={restrooms.filter(r => r.level >= 45 && r.level < 75).length} sub="Short wait" color="amber" />
        <Metric label="Busy" val={restrooms.filter(r => r.level >= 75).length} sub="Avoid if possible" color="red" />
        <Metric label="Avg wait" val="2.1m" sub="Across all" color="cyan" />
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-title">All facilities — live status</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {restrooms.map(r => (
              <div key={r.name} className="card" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>{r.name}</span>
                  <span className={`badge ${r.level > 75 ? 'red' : r.level > 45 ? 'amber' : 'green'}`}>
                    {r.level > 75 ? 'Busy' : r.level > 45 ? 'Moderate' : 'Free'}
                  </span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${r.level}%`, background: r.level > 75 ? 'var(--red)' : r.level > 45 ? 'var(--amber)' : 'var(--green)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
