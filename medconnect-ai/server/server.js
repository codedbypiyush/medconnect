require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./src/models');

const app = express();

app.use(helmet());
const normalizeOrigin = (value) => (value || '').trim().replace(/\/+$/, '');

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin header), e.g. curl/Postman/mobile.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(normalizeOrigin(origin))) return callback(null, true);
      return callback(new Error('CORS blocked: origin not allowed'));
    }
  })
);
app.use(express.json());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/doctors', require('./src/routes/doctors'));
app.use('/api/appointments', require('./src/routes/appointments'));
app.use('/api/ai', require('./src/routes/ai'));
app.use('/api/admin', require('./src/routes/admin'));

app.get('/', (_req, res) => {
  res.json({ message: 'MedConnect API running' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const port = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => app.listen(port, () => console.log(`Listening on ${port}`)))
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
