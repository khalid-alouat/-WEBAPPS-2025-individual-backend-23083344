const fs = require('fs');
const path = require('path');
const { Motor, sequelize } = require('./server'); // import setup

async function seed() {
    const raw = fs.readFileSync(path.join(__dirname, 'db.json'));
    const { motoren } = JSON.parse(raw);

    await sequelize.sync({ force: true }); // reset db
    await Motor.bulkCreate(motoren.map(m => ({
        naam: m.naam,
        bouwjaar: m.bouwjaar,
        merk: m.merk,
        afbeelding: m.afbeelding,
        alt: m.alt
    })));

    process.exit();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
