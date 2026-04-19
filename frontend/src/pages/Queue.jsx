import { useEffect, useState } from 'react';
import Metric from '../components/Metric';
import { useToast } from '../context/ToastContext';

export default function Queue() {
  const [queues, setQueues] = useState([]);
  const [seat, setSeat] = useState('');
  const [stand, setStand] = useState('Stand A2 — Burgers & Dogs');
  const { toast } = useToast();

  const fetchQueues = () => {
    fetch('/api/queues')
      .then(r => r.json())
      .then(data => setQueues(data));
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, []);

  const joinQueue = () => {
    fetch('/api/queues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stand, seat })
    }).then(r => r.json()).then(newQ => {
      fetchQueues();
      toast(`Joined queue at ${stand}. Estimated wait: ${newQ.eta} min. Haptic alert when ready.`, 'green');
    });
  };

  const clearQueue = (id) => {
    fetch(`/api/queues/${id}`, { method: 'DELETE' }).then(() => {
      fetchQueues();
      toast('Order collected. Enjoy!', 'green');
    });
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Smart Queue</div>
          <div className="page-sub">VIRTUAL QUEUING SYSTEM · HAPTIC ALERTS</div>
        </div>
      </div>

      <div className="metrics-row">
        <Metric label="Active queues" val={queues.length} sub="Across 12 stands" color="green" />
        <Metric label="Fans in queue" val={queues.reduce((a,q) => a + q.pos, 0) + 220} sub="In virtual line" color="cyan" />
        <Metric label="Avg wait" val="6.4m" sub="Down 41%" color="amber" />
        <Metric label="Served today" val="3,841" sub="Orders fulfilled" color="green" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Virtual queue — active slots</div>
            <button className="btn btn-sm" onClick={fetchQueues}>↻</button>
          </div>
          <div className="scroll-area">
            {queues.map(q => (
              <div key={q.id} className="list-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{q.stand}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Seat {q.seat} · pos #{q.pos}</div>
                </div>
                <span className={`badge ${q.status === 'ready' ? 'green' : 'cyan'}`}>{q.status === 'ready' ? 'Ready now' : q.eta + ' min'}</span>
                {q.status === 'ready' && <button className="btn btn-sm btn-success" onClick={() => clearQueue(q.id)}>Collect</button>}
              </div>
            ))}
          </div>
          <div className="divider"></div>
          <div className="sec">Join a new queue</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <select value={stand} onChange={e => setStand(e.target.value)}>
              <option>Stand A2 — Burgers & Dogs</option>
              <option>Stand B4 — Pizza</option>
              <option>Stand C1 — Craft Beer</option>
              <option>Stand D3 — Soft Drinks</option>
              <option>Merch — North Stand</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Your seat (e.g. N5-12-34)" style={{ flex: 1 }} value={seat} onChange={e => setSeat(e.target.value)} />
              <button className="btn btn-primary" onClick={joinQueue}>Join</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">Stand status board</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {/* Mock status board */}
              {['Stand A2 — Burgers', 'Stand B4 — Pizza', 'Stand C1 — Craft Beer'].map(s => (
                <div key={s} className="feed-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{s}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text3)' }}>4 waiting</span>
                    <span className="badge green">8m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
