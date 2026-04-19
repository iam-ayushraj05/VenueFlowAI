import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function Heatmap() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [density, setDensity] = useState(68);
  const [zoneDetail, setZoneDetail] = useState(null);
  const [hoverZone, setHoverZone] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [state, setState] = useState(null);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    fetch('/api/state').then(r => r.json()).then(data => setState(data));
  }, []);

  const drawStadiumHeatmap = (ctx, W, H, densityMult) => {
    ctx.clearRect(0,0,W,H);
    // Grid lines
    ctx.strokeStyle='rgba(255, 16, 83, 0.05)'; ctx.lineWidth=0.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    // Stadium outline
    ctx.strokeStyle='rgba(0,200,255,0.2)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.44,H*.44,0,0,Math.PI*2); ctx.stroke();
    // Pitch
    ctx.fillStyle='rgba(0,40,15,0.8)';
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.28,H*.26,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.28,H*.26,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W*.5,H*.24); ctx.lineTo(W*.5,H*.76); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.ellipse(W*.5,H*.5,W*.06,H*.08,0,0,Math.PI*2); ctx.stroke();
    // Density zones
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
    // Gate labels
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
    if (canvasRef.current) {
      const c = canvasRef.current;
      const ctx = c.getContext('2d');
      const W = c.offsetWidth || 600;
      const H = 380;
      c.width = W; c.height = H;
      drawStadiumHeatmap(ctx, W, H, density / 100);
    }
  }, [density, state, theme]);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type:'bar',
        data:{
          labels:['Gate A','Concourse A','Gate B','Concourse B','Gate C','Concourse C','Gate D','VIP'],
          datasets:[{
            data:[92,68,67,45,44,72,78,28],
            backgroundColor:(ctx2)=>{
              const v=ctx2.raw; return v>80?'rgba(255,68,68,0.7)':v>50?'rgba(255,176,32,0.7)':'rgba(0,255,157,0.7)';
            },
            borderRadius:3, borderWidth:0
          }]
        },
        options:{
          plugins:{legend:{display:false}},
          scales:{
            y:{ticks:{color:'#7BA8C4',font:{size:9},maxTicksLimit:4},grid:{color:'rgba(128,128,128,0.1)'},title:{display:true,text:'people/min',color:'#7BA8C4',font:{size:9}}},
            x:{ticks:{color:'#7BA8C4',font:{size:9}},grid:{display:false}}
          },
          responsive:true, maintainAspectRatio:false
        }
      });
    }
  }, [state]);

  const handleCanvasHover = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    
    const zones=[
      {name:'North Stand',xr:[.3,.7],yr:[0,.25],occ:91,flow:48,risk:'Critical'},
      {name:'South Stand',xr:[.3,.7],yr:[.75,1],occ:68,flow:35,risk:'Moderate'},
      {name:'East Stand (Gate B)',xr:[.75,1],yr:[.2,.8],occ:72,flow:40,risk:'High'},
      {name:'West Stand (Gate D)',xr:[0,.25],yr:[.2,.8],occ:85,flow:55,risk:'High'},
      {name:'Concourse B',xr:[.25,.75],yr:[.35,.65],occ:30,flow:22,risk:'Low'},
    ];
    const z = zones.find(z => rx >= z.xr[0] && rx <= z.xr[1] && ry >= z.yr[0] && ry <= z.yr[1]);
    setHoverZone(z || null);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasClick = (e) => {
    if (hoverZone) setZoneDetail(hoverZone);
  };

  const triggerSurge = () => {
    fetch('/api/surges/trigger', { method: 'POST' }).then(r => r.json()).then(data => {
      setDensity(95);
      setState(prev => ({ ...prev, surges: data }));
      toast('SURGE ALERT: Section 112–115 — Critical density reached. Auto-routing active.', 'red', 5000);
    });
  };

  if (!state) return <div>Loading...</div>;

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Crowd Heat Map</div>
          <div className="page-sub">LIDAR + COMPUTER VISION · 30FPS UPDATE</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select style={{ width: 'auto' }}>
            <option value="density">Crowd density</option>
            <option value="velocity">Flow velocity</option>
            <option value="risk">Risk index</option>
          </select>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card" style={{ padding: '12px', position: 'relative' }}>
          <div className="card-title">Stadium overview — hover/tap zones for detail</div>
          <canvas ref={canvasRef} onClick={handleCanvasClick} onMouseMove={handleCanvasHover} onMouseLeave={() => setHoverZone(null)} style={{ width: '100%', height: '380px', borderRadius: '8px', cursor: 'crosshair', background: 'var(--bg3)', display: 'block' }}></canvas>
          
          {hoverZone && (
            <div style={{ position: 'fixed', left: mousePos.x + 15, top: mousePos.y + 15, background: 'var(--surface)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', pointerEvents: 'none', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', width: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{hoverZone.name}</span>
                <span className={`badge ${hoverZone.risk === 'Critical' || hoverZone.risk === 'High' ? 'red' : hoverZone.risk === 'Moderate' ? 'amber' : 'green'}`}>{hoverZone.risk}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Occ: {hoverZone.occ}% · Flow: {hoverZone.flow} ppm</div>
            </div>
          )}

          <div className="legend" style={{ marginTop: '10px' }}>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#00FF9D' }}></div>Free flow (&lt;40%)</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#FFB020' }}></div>Congested (40–75%)</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#FF4444' }}></div>Critical (&gt;75%)</div>
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <div className="sec">Crowd density override</div>
              <input type="range" min="10" max="100" value={density} onChange={e => setDensity(e.target.value)} step="1" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ color: 'var(--cyan)', fontSize: '18px', fontWeight: 500 }}>{density}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text3)' }}>capacity</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">Zone detail</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {!zoneDetail ? (
                <div style={{ fontSize: '12px', color: 'var(--text3)', textAlign: 'center', padding: '12px' }}>Click a zone on the map</div>
              ) : (
                <>
                  <div style={{ marginBottom: '6px' }}>
                    <span className={`badge ${zoneDetail.risk === 'Critical' || zoneDetail.risk === 'High' ? 'red' : zoneDetail.risk === 'Moderate' ? 'amber' : 'green'}`}>{zoneDetail.risk}</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{zoneDetail.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Occupancy</span><span className="mono">{zoneDetail.occ}%</span></div>
                    <div className="progress"><div className="progress-fill" style={{ width: `${zoneDetail.occ}%`, background: zoneDetail.occ > 75 ? 'var(--red)' : zoneDetail.occ > 50 ? 'var(--amber)' : 'var(--green)' }}></div></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>Flow velocity</span><span className="mono">{zoneDetail.flow} ppm</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text3)' }}>AI recommendation</span><span style={{ color: 'var(--cyan)' }}>{zoneDetail.risk === 'Critical' ? 'Divert now' : zoneDetail.risk === 'High' ? 'Open aux route' : 'Monitor'}</span></div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Predictive surge — 15 min forecast</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {state.surges.map((s, i) => (
                <div key={i} className="feed-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.zone}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.eta} · {s.action}</div>
                  </div>
                  <span className={`badge ${s.risk === 'High' || s.risk === 'Critical' ? 'red' : s.risk === 'Medium' ? 'amber' : 'green'}`}>{s.risk}</span>
                </div>
              ))}
            </div>
            <div className="divider"></div>
            <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={triggerSurge}>
              Simulate surge event
            </button>
          </div>

          <div className="card">
            <div className="card-title">Automated responses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {action:'Overhead signs updated',zone:'Section 112–115',status:'done'},
                {action:'Staff deployed — 3 stewards',zone:'Concourse B West',status:'active'},
                {action:'App push sent to 4,200 fans',zone:'North Stand exits',status:'done'},
                {action:'Gate B auxiliary opened',zone:'East Stand',status:'active'}
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div><span style={{ color: 'var(--text)' }}>{r.action}</span><span style={{ color: 'var(--text3)', marginLeft: '6px' }}>{r.zone}</span></div>
                  <span className={`badge ${r.status === 'done' ? 'green' : 'cyan'}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Flow velocity — by section (people/min)</div>
        <div style={{ height: '100px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </section>
  );
}
