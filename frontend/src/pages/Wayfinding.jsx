import { useEffect, useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const arScenes = [
  {title:'Seat navigation',subtitle:'Follow AR arrows to your seat'},
  {title:'Nearest beer stand',subtitle:'87m — shortest queue (2 min)'},
  {title:'Exit route active',subtitle:'Personalised — Gate B · 6 min'}
];

export default function Wayfinding() {
  const canvasRef = useRef(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [routeResult, setRouteResult] = useState(null);
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    let animationId;
    if (canvasRef.current) {
      const c = canvasRef.current;
      const ctx = c.getContext('2d');
      const W = c.offsetWidth || 400;
      const H = 320;
      c.width = W; c.height = H;
      const scene = arScenes[sceneIdx % arScenes.length];
      
      const draw = (time) => {
        const tOffset = (time % 2000) / 2000; // 0 to 1 loop every 2s

        // Camera view bg
        ctx.clearRect(0, 0, W, H);
        
        // Simulated stadium aisle with movement
        const vp = {x:W*.5,y:H*.35};
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
        for(let i=0;i<5;i++){const t=i/4;ctx.beginPath();ctx.moveTo(W*.2+t*W*.6,H*.6+t*H*.3);ctx.lineTo(vp.x,vp.y);ctx.stroke()}
        
        // Moving horizontal lines
        for(let i=1;i<6;i++){
          const yOffset = (i - 1 + tOffset) / 5;
          const y = H*.35 + yOffset*(H*.65);
          const spread = ((y-H*.35)/(H*.65))*W*.4;
          if (y > H*.35) {
            ctx.beginPath();ctx.moveTo(W*.5-spread,y);ctx.lineTo(W*.5+spread,y);ctx.stroke();
          }
        }
        
        // AR arrows (pulsing and moving)
        const arrowY = [H*.75,H*.6,H*.5];
        arrowY.forEach((ay,i)=>{
          const moveY = ay - (tOffset * 15);
          const scale = (1-i*.2) + (Math.sin(time/200 + i) * 0.05); // Pulsing
          const ax = W*.5;
          ctx.save(); ctx.translate(ax,moveY); ctx.scale(scale,scale);
          ctx.beginPath();
          ctx.moveTo(0,-22);ctx.lineTo(16,6);ctx.lineTo(5,2);ctx.lineTo(5,20);
          ctx.lineTo(-5,20);ctx.lineTo(-5,2);ctx.lineTo(-16,6);ctx.closePath();
          ctx.fillStyle = `rgba(255, 16, 83, ${0.9-i*.2})`; // Cyan replaced with Cyber Sunset Primary
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
          ctx.stroke(); ctx.restore();
        });
        
        // Distance indicator
        const dist = [87,65,43][sceneIdx % 3];
        ctx.fillStyle = 'rgba(255, 16, 83, 0.9)';
        ctx.beginPath(); ctx.roundRect(W*.5-50,H*.15-14,100,28,6); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = `bold 13px "DM Mono", monospace`; ctx.textAlign = 'center';
        ctx.fillText(dist+'m ahead',W*.5,H*.15+4);
        
        // Scene label
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath(); ctx.roundRect(10,H-48,W-20,38,6); ctx.fill();
        ctx.fillStyle = 'rgba(255, 16, 83, 0.9)'; ctx.font = 'bold 12px "Syne", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(scene.title,22,H-27);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(scene.subtitle,22,H-12);
        
        // HUD corners
        const hud = (x,y,flip) => {
          ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);
          ctx.strokeStyle='rgba(255, 16, 83, 0.5)';ctx.lineWidth=1.5;
          ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,0);ctx.lineTo(18,0);ctx.stroke();
          ctx.restore()
        };
        hud(6,6); hud(W-6,6,true); hud(6,H-6); hud(W-6,H-6,true);

        animationId = requestAnimationFrame(draw);
      };
      
      animationId = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(animationId);
  }, [sceneIdx, theme]);

  const generateRoute = (e) => {
    e.preventDefault();
    const dest = e.target.dest.value;
    const seat = e.target.seat.value || 'N5-12-34';
    const dist = Math.floor(Math.random() * 200 + 50);
    const time = Math.floor(dist / 80) + 1;
    setRouteResult({ dest, seat, dist, time });
    toast(`AR route to "${dest}" generated — ${dist}m, ~${time} min walk`, 'cyan');
  };

  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">AR Wayfinding</div>
          <div className="page-sub">AUGMENTED REALITY NAVIGATION · MESH ROUTING</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">AR phone preview — live</div>
          <canvas ref={canvasRef} onClick={() => setSceneIdx(s => s + 1)} style={{ width: '100%', height: '320px', borderRadius: '8px', cursor: 'pointer', display: 'block', background: 'var(--bg3)' }}></canvas>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--text3)' }}>Click to cycle scenes</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">Wayfinding request</div>
            <form onSubmit={generateRoute} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div className="sec">Fan seat</div>
                <input name="seat" type="text" placeholder="e.g. Block N5, Row 12, Seat 34" defaultValue="Block N5, Row 12, Seat 34" />
              </div>
              <div>
                <div className="sec">Destination</div>
                <select name="dest">
                  <option>My seat</option>
                  <option>Nearest beer stand (shortest queue)</option>
                  <option>Nearest restroom (available)</option>
                  <option>Merchandise — North</option>
                  <option>Exit Gate A</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Generate AR route</button>
            </form>
            
            {routeResult && (
              <>
                <div className="divider"></div>
                <div>
                  <div className="sec">Route computed</div>
                  <div className="feed-item" style={{ flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>{routeResult.dest}</span>
                      <span className="badge cyan">{routeResult.dist}m · {routeResult.time} min</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>From {routeResult.seat} · AR route active · Avoiding congestion</div>
                    <div style={{ fontSize: '11px', color: 'var(--green)' }}>Route sent to fan's device</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="card">
            <div className="card-title">Active AR sessions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                {fan:'Seat B12-4-18',dest:'Stand A2',dist:'42m',status:'active'},
                {fan:'Seat F4-2-9',dest:'Gate C exit',dist:'128m',status:'active'},
                {fan:'Seat N5-8-3',dest:'Accessible WC',dist:'31m',status:'arrived'},
              ].map(s => (
                <div key={s.fan} className="feed-item" style={{ justifyContent: 'space-between' }}>
                  <div><div style={{ fontSize: '12px', fontWeight: 500 }}>{s.fan}</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>→ {s.dest} · {s.dist}</div></div>
                  <span className={`badge ${s.status === 'arrived' ? 'green' : 'cyan'}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
