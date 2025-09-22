import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import spreadRoutes from './routes/spread.routes';
import cardRoutes from './routes/card.routes';
import readingRoutes from './routes/reading.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());



// CORS

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

// ROUTES

app.use('/api/spreads', spreadRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/readings', readingRoutes);


app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Dinatarot is running dayo' });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT} DAYO`);
});