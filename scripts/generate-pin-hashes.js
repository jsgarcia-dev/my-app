// Script para gerar hashes dos PINs
// Execute com: node scripts/generate-pin-hashes.js

const bcrypt = require('bcryptjs');

const pins = [
  { professional: 'Ana Silva', pin: '1234' },
  { professional: 'Beatriz Santos', pin: '2345' },
  { professional: 'Carlos Oliveira', pin: '3456' },
  { professional: 'Diana Costa', pin: '4567' }
];

console.log('-- Hashes dos PINs para o seed-data.sql\n');

pins.forEach(async ({ professional, pin }) => {
  const hash = await bcrypt.hash(pin, 10);
  console.log(`-- ${professional} (PIN: ${pin})`);
  console.log(`'${hash}',\n`);
});