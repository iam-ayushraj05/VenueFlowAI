import { useEffect, useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const fans = [
  { id: 'f1', name: 'Oliver T.', type: 'General Admission', seat: 'North Stand · N5-12-34', arr: '18:45' },
  { id: 'f2', name: 'Sarah M.', type: 'VIP Hospitality', seat: 'Club Level · Box 12', arr: '17:30' },
  { id: 'f3', name: 'James & Family', type: 'Family Enclosure', seat: 'East Stand · E2-4-10', arr: '18:15' }
];

const timelineData = {
  f1: [
    { title: 'Digital ticket scanned', sub: 'Gate A turnstile 4 · 18:45', status: 'done' },
    { title: 'Concourse navigation', sub: 'Routed via Section 112 to avoid congestion', status: 'done' },
    { title: 'Smart queue order', sub: '2x Beer at Stand A2 · 4m wait', status: 'done' },
    { title: 'In seat', sub: 'Detected via WiFi triangulation · 19:10', status: 'active' },
    { title: 'Exit orchestration', sub: 'Assigned Gate C · 22:05 staggered departure', status: 'pending' }
  ],
  f2: [
    { title: 'VIP Parking entry', sub: 'Zone A · 17:30', status: 'done' },
    { title: 'Lounge check-in', sub: 'Club Level reception · 17:35', status: 'done' },
    { title: 'In-seat dining delivery', sub: 'Ordered at 19:15 · Delivered 19:22', status: 'done' },
    { title: 'In seat', sub: 'Box 12 · 19:30', status: 'active' }
  ],
  f3: [
    { title: 'Family Gate scan', sub: 'Gate F · 18:15', status: 'done' },
    { title: 'Merch store visit', sub: 'North Store · 18:25 (10m dwell time)', status: 'done' },
    { title: 'In seat', sub: 'E2-4-10 · 18:45', status: 'active' }
  ]
};

export default function Journey() {
  const [activeFan, setActiveFan] = useState('f1');
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const { theme } = useTheme();

  const fan = fans.find(f => f.id === activeFan);
  const tl = timelineData[activeFan] || [];

  useEffect(() => {
    if (canvasRef.current) {
      const c = canvasRef.current;
      const ctx = c.getContext('2d');
      const W = c.offsetWidth || 300, H = 200;
      c.width = W; c.height = H;
      
      // Draw parking map mock
      ctx.clearRect(0, 0, W, H);
      
      // Grid lines
      ctx.strokeStyle = 'rgba(255, 16, 83, 0.05)'; ctx.lineWidth = 1;
      for(let x=0;x<W;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for(let y=0;y<H;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
      
      // Zones
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath(); ctx.roundRect(20, 20, 100, 60, 4); ctx.fill();
      ctx.beginPath(); ctx.roundRect(140, 20, 140, 60, 4); ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 16, 83, 0.1)';
      ctx.beginPath(); ctx.roundRect(20, 100, 260, 80, 4); ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.font = '10px "DM Mono", monospace';
      ctx.fillText('STADIUM', 25, 35);
      ctx.fillText('CONCOURSE', 145, 35);
      
      ctx.fillStyle = 'rgba(255, 16, 83, 0.7)';
      ctx.fillText('PARKING ZONE A (VIP)', 25, 115);
      
      // Route line
      ctx.strokeStyle = '#FF1053'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(60, 50); ctx.lineTo(60, 80); ctx.lineTo(150, 80); ctx.lineTo(150, 140); ctx.stroke();
      ctx.setLineDash([]);
      
      // Dots
      ctx.fillStyle = '#00FF87'; ctx.beginPath(); ctx.arc(60, 50, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#FF1053'; ctx.beginPath(); ctx.arc(150, 140, 4, 0, Math.PI*2); ctx.fill();
    }
  }, [activeFan, theme]);

  const sendPush = () => {
    toast(`Push notification sent to ${fan.name}: "Avoid Gate C post-match"`, 'cyan');
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Fan Journey</div>
          <div className="page-sub">PRE-ARRIVAL · LIVE EVENT · POST-GAME</div>
        </div>
      </div>
      
      <div className="grid-1-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">Fan profile</div>
            <select value={activeFan} onChange={e => setActiveFan(e.target.value)} style={{ marginBottom: '12px' }}>
              {fans.map(f => <option key={f.id} value={f.id}>{f.name} ({f.type})</option>)}
            </select>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><div className="sec">Ticket type</div><div style={{ fontWeight: 500 }}>{fan.type}</div></div>
              <div><div className="sec">Location</div><div className="mono">{fan.seat}</div></div>
              <div><div className="sec">Arrival</div><div className="mono">{fan.arr}</div></div>
            </div>
            
            <div className="divider"></div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={sendPush}>
              Message Fan
            </button>
          </div>
          
          <div className="card">
            <div className="card-title">Post-game exit routing</div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '200px', borderRadius: '8px', background: 'var(--bg3)', display: 'block' }}></canvas>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px', textAlign: 'center' }}>Optimized route to parking</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Journey touchpoints</div>
          <div className="timeline">
            {tl.map((item, i) => (
              <div key={i} className="tl-item">
                <div className={`tl-dot ${item.status}`}></div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: item.status === 'pending' ? 'var(--text3)' : 'var(--text)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
