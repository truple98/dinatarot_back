import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import readingRoutes from './routes/reading.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

// UTF-8 인코딩 설정
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});


app.use('/api', readingRoutes);


app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Dinatarot is running dayo' });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT} DAYO`);
});