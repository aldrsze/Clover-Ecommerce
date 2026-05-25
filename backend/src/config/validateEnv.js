require('dotenv').config();

const requiredEnv = [
  'DB_USER',
  'DB_HOST',
  'DB_NAME',
  'DB_PASSWORD',
  'DB_PORT',
  'JWT_SECRET'
];

function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Aborting startup. Please set the missing variables in your environment or .env file.');
    process.exit(1);
  }
}

module.exports = validateEnv;
