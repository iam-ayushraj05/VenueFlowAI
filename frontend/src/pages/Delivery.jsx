import { useEffect, useState } from 'react';
import Metric from '../components/Metric';
import { useToast } from '../context/ToastContext';

export default function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [seat, setSeat] = useState('');
  const [item, setItem] = useState('Loaded nachos + beer');
  const [priority, setPriority] = useState('standard');
  const { toast } = useToast();

  const fetchDeliveries = () => {
    fetch('/api/deliveries').then(r => r.json()).then(data => setDeliveries(data));
  };

  useEffect(() => { fetchDeliveries(); }, []);

  const placeDelivery = () => {
    fetch('/api/deliveries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seat, item, priority })
    }).then(r => r.json()).then(newD => {
      fetchDeliveries();
      toast(`Order placed for seat ${seat}. Estimated delivery: ${newD.eta} min.`, 'cyan');
      setSeat('');
    });
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">In-Seat Delivery</div>
          <div className="page-sub">PREMIUM TIER · GPS STAFF DISPATCH</div>
        </div>
      </div>
      <div className="metrics-row">
        <Metric label="Active orders" val={deliveries.filter(d => d.status !== 'delivered').length} sub="In transit" color="cyan" />
        <Metric label="Delivered today" val={deliveries.filter(d => d.status === 'delivered').length} sub="Fulfilled" color="green" />
        <Metric label="Avg delivery" val="7.2m" sub="From order to seat" color="amber" />
        <Metric label="Staff GPS active" val="14" sub="Couriers on duty" color="green" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Active deliveries</div>
            <span className="badge cyan">{deliveries.filter(d => d.status !== 'delivered').length} active</span>
          </div>
          <div className="scroll-area">
            {deliveries.map(d => (
              <div key={d.id} className="list-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>Seat {d.seat}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{d.item} · {d.staff}</div>
                </div>
                <span className={`badge ${d.status === 'delivered' ? 'green' : d.status === 'en route' ? 'cyan' : 'amber'}`}>
                  {d.status === 'delivered' ? 'Delivered' : d.status === 'en route' ? '~' + d.eta + 'm' : 'Preparing'}
                </span>
              </div>
            ))}
          </div>
          <div className="divider"></div>
          <div className="sec">New delivery order</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="Seat (e.g. N5-12-34)" value={seat} onChange={e => setSeat(e.target.value)} />
              <select value={item} onChange={e => setItem(e.target.value)}>
                <option>Loaded nachos + beer</option>
                <option>2× Craft beer</option>
                <option>Hot dog combo meal</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select style={{ flex: 1 }} value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="standard">Standard (8–12 min)</option>
                <option value="express">Express (5–8 min)</option>
              </select>
              <button className="btn btn-primary" onClick={placeDelivery}>Place order</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
