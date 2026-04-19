const State = {
  incidents: [
    {id:'INC-001',type:'Medical emergency',loc:'Gate 4, Row C, Seat 12',desc:'Fan reported feeling faint',priority:'high',status:'dispatched',time:'14:22',staff:'Officer M. Khan'},
    {id:'INC-002',type:'Spill / slip hazard',loc:'Concourse B, Stand 12',desc:'Spilled beer, slip risk on stairway',priority:'medium',status:'en route',time:'14:31',staff:'Steward J. Patel'}
  ],
  queues: [
    {id:'Q-001',stand:'Stand A2 — Burgers & Dogs',seat:'B12-4-18',pos:1,eta:2,status:'ready'},
    {id:'Q-002',stand:'Stand B4 — Pizza',seat:'F4-2-9',pos:3,eta:6,status:'waiting'},
    {id:'Q-003',stand:'Stand C1 — Craft Beer',seat:'A8-1-4',pos:2,eta:4,status:'waiting'},
    {id:'Q-004',stand:'Merch — North Stand',seat:'N5-8-22',pos:5,eta:11,status:'waiting'},
    {id:'Q-005',stand:'Stand D3 — Soft Drinks',seat:'E3-6-14',pos:1,eta:1,status:'ready'}
  ],
  deliveries: [
    {id:'D-001',seat:'C4-Row 12',item:'2× Craft beer',status:'en route',eta:3,staff:'Courier A'},
    {id:'D-002',seat:'A2-Row 7',item:'Loaded nachos',status:'preparing',eta:8,staff:'Courier B'},
    {id:'D-003',seat:'F1-Row 2',item:'Hot dog combo',status:'delivered',eta:0,staff:'Courier C'}
  ],
  incentives: [
    {offer:'50% off hot drinks',duration:20,tier:'All fans',claimed:891,active:true},
    {offer:'Exclusive post-game highlights reel',duration:30,tier:'All fans',claimed:1203,active:true}
  ],
  gateAssignments: [
    {section:'North Stand',gate:'Gate A',fans:14200,time:'22:05',color:'#00FF9D'},
    {section:'South Stand',gate:'Gate C',fans:12800,time:'22:12',color:'#00C8FF'},
    {section:'East Stand',gate:'Gate B',fans:9400,time:'22:08',color:'#FFB020'},
    {section:'West Stand',gate:'Gate D',fans:8600,time:'22:18',color:'#9B7FFF'},
    {section:'Clock End',gate:'Gate E',fans:7200,time:'22:22',color:'#FF4444'},
  ],
  restrooms: [
    {name:'Gate A — Mens',level:18,cap:40},{name:'Gate A — Womens',level:12,cap:40},
    {name:'Gate B — Mens',level:76,cap:40},{name:'Gate B — Womens',level:62,cap:40},
    {name:'Gate C — Mens',level:38,cap:40},{name:'Gate C — Womens',level:25,cap:40},
    {name:'Gate D — Mens',level:88,cap:40},{name:'Gate D — Womens',level:91,cap:40},
    {name:'VIP — Mens',level:8,cap:20},{name:'VIP — Womens',level:5,cap:20},
    {name:'Concourse B',level:54,cap:60},{name:'Accessible',level:14,cap:16}
  ],
  surges: [
    {zone:'Section 112–115',risk:'High',eta:'~8 min',action:'Redirecting to Gate B'},
    {zone:'Concourse B West stairway',risk:'Medium',eta:'~12 min',action:'Staff alerted'},
    {zone:'Gate C tunnel',risk:'Low',eta:'~15 min',action:'Monitoring'}
  ],
  gates: [
    {gate:'Gate A',vel:92,trend:'↑'},{gate:'Gate B',vel:67,trend:'→'},
    {gate:'Gate C',vel:44,trend:'↓'},{gate:'Gate D',vel:78,trend:'↑'},{gate:'Gate E',vel:55,trend:'→'}
  ],
  resolvedCount: 14
};

module.exports = { State };
