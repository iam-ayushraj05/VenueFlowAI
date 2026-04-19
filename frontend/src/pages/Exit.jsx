export default function Exit() {
  return (
    <section className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Exit Orchestration</div>
          <div className="page-sub">STAGGERED DEPARTURE · THIRD HALF INCENTIVES</div>
        </div>
      </div>
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-title">Staggered gate assignments</div>
            <div className="list-item">
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00FF9D' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>North Stand</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>14,200 fans · Depart 22:05</div>
              </div>
              <span className="badge cyan">Gate A</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ marginBottom: 0 }}>Third half incentives</div>
              <span className="badge green">1,203 opted in</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
