const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Sequelize setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Motor-model
const Motor = sequelize.define('Motor', {
    naam: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bouwjaar: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    merk: {
        type: DataTypes.STRING,
        allowNull: false
    },
    afbeelding: {
        type: DataTypes.STRING,
        defaultValue: 'images/dummy.jpg'
    },
    alt: {
        type: DataTypes.STRING
    }
});

// sync model met database
sequelize.sync();

// Swagger configuratie
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Motoren API',
            version: '1.0.0',
            description: 'API voor het beheren van motoren met Sequelize'
        },
        servers: [
            { url: 'http://localhost:4000' }
        ]
    },
    apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Motor:
 *       type: object
 *       required:
 *         - naam
 *         - bouwjaar
 *         - merk
 *       properties:
 *         id:
 *           type: integer
 *           description: Het unieke ID van de motor
 *         naam:
 *           type: string
 *           description: De naam van de motor
 *         bouwjaar:
 *           type: integer
 *           description: Het bouwjaar van de motor
 *         merk:
 *           type: string
 *           description: Het merk van de motor
 *         afbeelding:
 *           type: string
 *           description: Het pad naar de afbeelding
 *         alt:
 *           type: string
 *           description: Alternatieve tekst voor de afbeelding
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welkomstbericht
 *     responses:
 *       200:
 *         description: Geeft een welkomstbericht terug.
 */
app.get('/', (req, res) => {
    res.send('Welkom bij mijn Motoren API! Gebruik /motoren om de data te zien.');
});

/**
 * @swagger
 * /motoren:
 *   get:
 *     summary: Haal alle motoren op
 *     responses:
 *       200:
 *         description: Een lijst met motoren.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Motor'
 */
app.get('/motoren', async (req, res) => {
    try {
        const motoren = await Motor.findAll();
        res.json(motoren);
    } catch (error) {
        res.status(500).json({ error: 'Fout bij ophalen motoren' });
    }
});

/**
 * @swagger
 * /motoren/{id}:
 *   get:
 *     summary: Haal een enkele motor op
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: De ID van de motor
 *     responses:
 *       200:
 *         description: Motor gevonden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motor'
 *       404:
 *         description: Motor niet gevonden
 */
app.get('/motoren/:id', async (req, res) => {
    try {
        const motor = await Motor.findByPk(req.params.id);
        if (motor) {
            res.json(motor);
        } else {
            res.status(404).json({ error: 'Motor niet gevonden' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fout bij ophalen motor' });
    }
});

/**
 * @swagger
 * /motoren:
 *   post:
 *     summary: Voeg een nieuwe motor toe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Motor'
 *     responses:
 *       201:
 *         description: Motor toegevoegd
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motor'
 */
app.post('/motoren', async (req, res) => {
    try {
        const nieuweMotor = await Motor.create(req.body);
        res.status(201).json(nieuweMotor);
    } catch (error) {
        res.status(500).json({ error: 'Fout bij toevoegen motor' });
    }
});

/**
 * @swagger
 * /motoren/{id}:
 *   put:
 *     summary: Werk een motor bij
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: De ID van de motor die je wilt bijwerken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Motor'
 *     responses:
 *       200:
 *         description: Motor bijgewerkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motor'
 *       404:
 *         description: Motor niet gevonden
 */
app.put('/motoren/:id', async (req, res) => {
    try {
        const motor = await Motor.findByPk(req.params.id);
        if (motor) {
            await motor.update(req.body);
            res.json(motor);
        } else {
            res.status(404).json({ error: 'Motor niet gevonden' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fout bij updaten motor' });
    }
});

/**
 * @swagger
 * /motoren/{id}:
 *   delete:
 *     summary: Verwijder een motor
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: De ID van de motor die je wilt verwijderen
 *     responses:
 *       204:
 *         description: Motor verwijderd
 *       404:
 *         description: Motor niet gevonden
 */
app.delete('/motoren/:id', async (req, res) => {
    try {
        const motor = await Motor.findByPk(req.params.id);
        if (motor) {
            await motor.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Motor niet gevonden' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Fout bij verwijderen motor' });
    }
});

app.listen(4000, () => {
    console.log('Express API draait op http://localhost:4000');
});

module.exports = { sequelize, Motor };
