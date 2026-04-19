import { useEffect, useState, useRef } from 'react';
import Metric from '../components/Metric';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const [state, setState] = useState(null);
  const { toast } = useToast();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const mapCanvasRef = useRef(null);
  const { theme } = useTheme();

  const fetchState = () => {
    fetch('/api/state').then(res => res.json()).then(data => setState(data));
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
      fetch('/api/refresh', { method: 'POST' }).then(res => res.json()).then(data => setState(data));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const drawStadiumHeatmap = (ctx, W, H, densityMult) => {
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(255, 16, 83, 0.05)'; ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    ctx.strokeStyle='rgba(0,200,255,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.44,H*.44,0,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(0,40,15,0.8)';
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.28,H*.26,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.28,H*.26,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W*.5,H*.24); ctx.lineTo(W*.5,H*.76); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.06,H*.08,0,0,Math.PI*2); ctx.stroke();
    const zones = [
      {x:.15,y:.5,r:.09,d:0.85*densityMult},{x:.85,y:.5,r:.09,d:0.72*densityMult},
      {x:.5,y:.07,r:.07,d:0.91*densityMult},{x:.5,y:.93,r:.07,d:0.68*densityMult},
      {x:.28,y:.22,r:.07,d:0.48},{x:.72,y:.22,r:.07,d:0.42},
      {x:.28,y:.78,r:.07,d:0.55},{x:.72,y:.78,r:.07,d:0.58},
      {x:.38,y:.12,r:.05,d:0.44*densityMult},{x:.62,y:.12,r:.05,d:0.44*densityMult},
      {x:.38,y:.88,r:.05,d:0.38},{x:.62,y:.88,r:.05,d:0.35}
    ];
    zones.forEach(z=>{
      const gx=z.x*W, gy=z.y*H, gr=z.r*Math.min(W,H), d=Math.min(z.d,1);
      const col = d>.75?`rgba(255,68,68,${d*.85})`:d>.45?`rgba(255,176,32,${d*.8})`:`rgba(0,255,157,${d*.7})`;
      const g=ctx.createRadialGradient(gx,gy,0,gx,gy,gr);
      g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(gx,gy,gr,0,Math.PI*2); ctx.fill();
    });
    ctx.font=`bold 10px "DM Mono", monospace`; ctx.textAlign='center';
    ctx.fillStyle='rgba(0,200,255,0.7)';
    ctx.fillText('GATE A',W*.5,13);
    ctx.fillText('GATE C',W*.5,H-3);
    ctx.save(); ctx.translate(10,H*.5); ctx.rotate(-Math.PI/2); ctx.fillText('GATE D',0,0); ctx.restore();
    ctx.save(); ctx.translate(W-10,H*.5); ctx.rotate(Math.PI/2); ctx.fillText('GATE B',0,0); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='9px "DM Mono", monospace';
    ctx.fillText('PITCH',W*.5,H*.5+4);
  };

  useEffect(() => {
    if (mapCanvasRef.current) {
      const c = mapCanvasRef.current;
      const ctx = c.getContext('2d');
      const W = c.offsetWidth || 600, H = 280;
      c.width = W; c.height = H;
      drawStadiumHeatmap(ctx, W, H, 0.68);
    }
  }, [state, theme]); // Redraw occasionally or on load

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const labels = Array.from({length:12}, (_,i) => '-' + (60 - i*5) + 'm');
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Fans/min',
            data: [820,910,1020,1180,980,860,790,840,1100,1240,1060,980],
            borderColor: '#00C8FF', tension: .4, fill: true, 
            backgroundColor: 'rgba(0,200,255,0.06)', pointRadius: 0, borderWidth: 1.5
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: { ticks: { color: '#7BA8C4', font: { size: 9 }, maxTicksLimit: 4 }, grid: { color: 'rgba(128,128,128,0.1)' } },
            x: { ticks: { color: '#7BA8C4', font: { size: 9 }, maxTicksLimit: 6 }, grid: { display: false } }
          },
          responsive: true, maintainAspectRatio: false
        }
      });
    }
  }, [state]);

  const simulateAlert = () => {
    const types = ['Surge detected — Gate C', 'Fan reported medical emergency', 'Queue at Stand B4 critical', 'Gate B velocity spike'];
    toast(types[Math.floor(Math.random() * types.length)], 'red', 4000);
  };

  const refreshAll = () => {
    fetch('/api/refresh', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setState(data);
        toast('All data refreshed', 'cyan', 2000);
      });
  };

  if (!state) return <div>Loading...</div>;

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Command Center</div>
          <div className="page-sub">EMIRATES STADIUM · 60,704 CAP · REAL-TIME</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn btn-sm" onClick={simulateAlert}>Simulate Alert</button>
          <button className="btn btn-primary btn-sm" onClick={refreshAll}>↻ Refresh</button>
        </div>
      </div>

      <div className="metrics-row">
        <Metric label="Attendance" val="58,420" sub="of 60,704 · 96.2%" color="cyan" />
        <Metric label="Choke Points" val={state.surges.filter(s => s.risk !== 'Low').length} sub="AI alerts active" color="amber" />
        <Metric label="Avg Queue Wait" val="4.2m" sub="↓ 38% vs last match" color="green" />
        <Metric label="Open Incidents" val={state.incidents.length} sub="Staff dispatched" color="red" />
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-title">Live stadium heat map</div>
          <canvas ref={mapCanvasRef} style={{ height: '280px', width: '100%', borderRadius: '8px' }}></canvas>
          <div className="legend" style={{ marginTop: '8px' }}>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#00FF9D' }}></div>Low density</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#FFB020' }}></div>Medium</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#FF4444' }}></div>Choke point</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">AI surge predictions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {state.surges.map((s, i) => (
                <div key={i} className="feed-item" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.zone}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.eta} · {s.action}</div>
                  </div>
                  <span className={`badge ${s.risk === 'High' || s.risk === 'Critical' ? 'red' : s.risk === 'Medium' ? 'amber' : 'green'}`}>{s.risk}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Gate velocity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.gates.map(g => (
                <div key={g.gate}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text2)' }}>{g.gate}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-mono)', color: g.vel > 80 ? 'var(--red)' : g.vel > 50 ? 'var(--amber)' : 'var(--green)' }}>
                      {g.vel} ppm {g.trend}
                    </span>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: `${g.vel}%`, background: g.vel > 80 ? 'var(--red)' : g.vel > 50 ? 'var(--amber)' : 'var(--green)' }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-title">Active queues</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {state.queues.slice(0, 4).map(q => (
              <div key={q.id} className="feed-item" style={{ justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{q.stand}</div>
                <span className={`badge ${q.status === 'ready' ? 'green' : 'cyan'}`}>{q.status === 'ready' ? 'Ready' : q.eta + 'm'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Recent incidents</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {state.incidents.length === 0 && <div style={{ fontSize: '12px', color: 'var(--text3)', padding: '6px' }}>No active incidents</div>}
            {state.incidents.map(i => (
              <div key={i.id} className="feed-item" style={{ justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{i.id}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{i.loc}</div>
                </div>
                <span className={`badge ${i.priority === 'high' || i.priority === 'critical' ? 'red' : 'amber'}`}>{i.priority}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">System throughput</div>
          <div style={{ height: '120px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
