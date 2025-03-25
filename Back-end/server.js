const express = require('express');
const cors = require('cors');
const motoren = require('./db.json').motoren;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welkom bij mijn Motoren API! Gebruik /motoren om de data te zien.');
});

app.get('/motoren', (req, res) => {
    res.json(motoren);
});

app.get('/motoren/:id', (req, res) => {
    const motor = motoren.find(m => m.id === parseInt(req.params.id));
    motor ? res.json(motor) : res.status(404).json({ error: 'Motor niet gevonden' });
});

app.post('/motoren', (req, res) => {
    const nieuweMotor = { id: motoren.length + 1, ...req.body };
    motoren.push(nieuweMotor);
    res.status(201).json(nieuweMotor);
});

app.put('/motoren/:id', (req, res) => {
    const motor = motoren.find(m => m.id === parseInt(req.params.id));
    if (motor) {
        Object.assign(motor, req.body);
        res.json(motor);
    } else {
        res.status(404).json({ error: 'Motor niet gevonden' });
    }
});

app.delete('/motoren/:id', (req, res) => {
    const index = motoren.findIndex(m => m.id === parseInt(req.params.id));
    if (index >= 0) {
        motoren.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Motor niet gevonden' });
    }
});

app.listen(4000, () => {
    console.log('Express API draait op http://localhost:4000');
});
