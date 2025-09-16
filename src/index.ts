import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Dinatarot is running dayo' });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT} DAYO`);
});