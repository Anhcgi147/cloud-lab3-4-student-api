require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;

app.use(express.json());

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  classCode: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', StudentSchema);

app.get('/', (_req, res) => {
  res.json({ status: 'success', message: 'Cloud LAB 3 & 4 Student API' });
});

app.get('/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected'
  });
});

app.get('/api/students', async (_req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: students });
  } catch (error) {
    next(error);
  }
});

app.post('/api/students', async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ status: 'success', data: student });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error?.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'studentId already exists' });
  }
  if (error?.name === 'ValidationError') {
    return res.status(400).json({ status: 'error', message: error.message });
  }
  console.error(error);
  return res.status(500).json({ status: 'error', message: 'Internal server error' });
});

async function start() {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Set it in Render Environment Variables or .env.');
  }

  await mongoose.connect(databaseUrl);
  console.log('Connected to MongoDB.');
  app.listen(port, '0.0.0.0', () => {
    console.log('Server listening on port ' + port);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  });
}

module.exports = { app, start };
