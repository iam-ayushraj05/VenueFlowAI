const express = require('express');
const path = require('path');
const cors = require('cors');
const { State } = require('./data');

const app = express();
app.use(cors());
app.use(express.json());

// Helper for generating IDs
const generateId = (prefix, length) => {
    return prefix + '-' + Math.random().toString(36).substr(2, length).toUpperCase();
};

// API: Get comprehensive state
app.get('/api/state', (req, res) => {
    res.json(State);
});

// Refresh generic metrics (simulation)
app.post('/api/refresh', (req, res) => {
    State.gates = State.gates.map(g => ({
        ...g, 
        vel: Math.max(20, Math.min(100, g.vel + Math.floor(Math.random() * 14 - 7))), 
        trend: ['↑', '→', '↓'][Math.floor(Math.random() * 3)]
    }));
    res.json(State);
});

// Incidents
app.get('/api/incidents', (req, res) => res.json(State.incidents));
app.post('/api/incidents', (req, res) => {
    const { type, loc, desc, priority } = req.body;
    const now = new Date(); 
    const time = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    const id = 'INC-' + (100 + State.incidents.length + 3).toString();
    const newInc = { id, type, loc: loc || 'GPS auto-tagged', desc: desc || 'Reported via app', priority, status: 'dispatched', time, staff: 'Nearest staff auto-assigned' };
    State.incidents.push(newInc);
    res.status(201).json(newInc);
});
app.post('/api/incidents/:id/resolve', (req, res) => {
    State.incidents = State.incidents.filter(i => i.id !== req.params.id);
    State.resolvedCount++;
    res.json({ success: true, newIncidents: State.incidents });
});
app.delete('/api/incidents/resolved', (req, res) => {
    // Currently clear all resolved is a no-op as they are removed, but we keep the endpoint
    res.json({ success: true });
});

// Queues
app.get('/api/queues', (req, res) => res.json(State.queues));
app.post('/api/queues', (req, res) => {
    const { stand, seat } = req.body;
    const id = 'Q-' + (State.queues.length + 1).toString().padStart(3, '0');
    const eta = Math.floor(Math.random() * 10 + 2);
    const pos = Math.floor(Math.random() * 6 + 1);
    const newQ = { id, stand, seat: seat || 'Walk-up', pos, eta, status: 'waiting' };
    State.queues.push(newQ);
    res.status(201).json(newQ);
});
app.delete('/api/queues/:id', (req, res) => {
    State.queues = State.queues.filter(q => q.id !== req.params.id);
    res.json({ success: true });
});

// Deliveries
app.get('/api/deliveries', (req, res) => res.json(State.deliveries));
app.post('/api/deliveries', (req, res) => {
    const { seat, item, priority } = req.body;
    const eta = priority === 'express' ? Math.floor(Math.random() * 3 + 5) : Math.floor(Math.random() * 4 + 8);
    const id = 'D-' + (State.deliveries.length + 1).toString().padStart(3, '0');
    const newDel = { id, seat: seat || 'Walk-up', item, status: 'preparing', eta, staff: 'Courier ' + (String.fromCharCode(65 + Math.floor(Math.random() * 5))) };
    State.deliveries.push(newDel);
    res.status(201).json(newDel);
});

// Surges
app.post('/api/surges/trigger', (req, res) => {
    State.surges[0].risk = 'Critical';
    State.surges[0].eta = '~3 min';
    State.surges[0].action = 'EVACUATE ROUTE';
    res.json(State.surges);
});

// Restrooms
app.get('/api/restrooms', (req, res) => res.json(State.restrooms));
app.post('/api/restrooms/refresh', (req, res) => {
    State.restrooms = State.restrooms.map(r => ({
        ...r, 
        level: Math.max(0, Math.min(100, r.level + Math.floor(Math.random() * 20 - 10)))
    }));
    res.json(State.restrooms);
});

// Exit Orchestration
app.post('/api/gates/reassign', (req, res) => {
    const { section, gate, time } = req.body;
    State.gateAssignments = State.gateAssignments.map(g => g.section === section ? { ...g, gate, time } : g);
    res.json(State.gateAssignments);
});

app.post('/api/incentives', (req, res) => {
    const { offer, duration, tier } = req.body;
    const newInc = { offer: offer || 'Special offer', duration: parseInt(duration) || 20, tier, claimed: 0, active: true };
    State.incentives.push(newInc);
    res.status(201).json(newInc);
});
app.delete('/api/incentives/:index', (req, res) => {
    State.incentives.splice(req.params.index, 1);
    res.json(State.incentives);
});


// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
