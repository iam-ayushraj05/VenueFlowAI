import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Incident() {
  const [incidents, setIncidents] = useState([]);
  const [type, setType] = useState('Medical emergency');
  const [priority, setPriority] = useState('medium');
  const [loc, setLoc] = useState('');
  const [desc, setDesc] = useState('');
  const { toast } = useToast();

  const fetchIncidents = () => {
    fetch('/api/incidents').then(r => r.json()).then(data => setIncidents(data));
  };

  useEffect(() => { fetchIncidents(); }, []);

  const reportIncident = () => {
    fetch('/api/incidents', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, priority, loc, desc })
    }).then(r => r.json()).then(newI => {
      fetchIncidents();
      toast(`Incident ${newI.id} reported. Staff dispatched.`, newI.priority === 'critical' || newI.priority === 'high' ? 'red' : 'amber', 4000);
      setLoc(''); setDesc('');
    });
  };

  const resolveIncident = (id) => {
    fetch(`/api/incidents/${id}/resolve`, { method: 'POST' }).then(() => {
      fetchIncidents();
      toast('Incident resolved. Staff returning to duty.', 'green');
    });
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Incident Management</div>
          <div className="page-sub">REAL-TIME DISPATCH · GPS TAGGED REPORTS</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge red blink">{incidents.length} ACTIVE</span>
        </div>
      </div>

      <div className="grid-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ marginBottom: 0 }}>Active incidents</div>
              <button className="btn btn-sm btn-success" onClick={fetchIncidents}>Refresh</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {incidents.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text3)', padding: '12px', textAlign: 'center' }}>No active incidents</div>}
              {incidents.map(i => (
                <div key={i.id} style={{ padding: '10px 12px', background: 'var(--bg3)', border: `1px solid ${i.priority === 'high' || i.priority === 'critical' ? 'rgba(255,68,68,0.2)' : 'var(--border)'}`, borderRadius: 'var(--r2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono" style={{ color: 'var(--text3)', fontSize: '11px' }}>{i.id}</span>
                      <span className={`badge ${i.priority === 'high' || i.priority === 'critical' ? 'red' : 'amber'}`}>{i.type}</span>
                    </div>
                    <button className="btn btn-sm btn-success" onClick={() => resolveIncident(i.id)}>Resolve</button>
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '3px' }}>{i.loc}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{i.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Report new incident</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div className="sec">Type</div>
                  <select value={type} onChange={e => setType(e.target.value)}>
                    <option>Medical emergency</option>
                    <option>Spill / slip hazard</option>
                    <option>Broken seat / fixture</option>
                  </select>
                </div>
                <div>
                  <div className="sec">Priority</div>
                  <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="sec">Location</div>
                <input type="text" placeholder="e.g. Gate 4" value={loc} onChange={e => setLoc(e.target.value)} />
              </div>
              <div>
                <div className="sec">Description</div>
                <textarea rows="2" placeholder="Brief description..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
              </div>
              <button className="btn btn-danger" onClick={reportIncident}>Report & dispatch</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
