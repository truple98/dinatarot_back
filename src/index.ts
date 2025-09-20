import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import spreadRoutes from './routes/spread.routes';
import cardRoutes from './routes/card.routes';
import readingRoutes from './routes/reading.routes';
import { ServiceManager } from './services/service-manager';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger, Logger } from './middleware/logger.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 로그 미들웨어
app.use(requestLogger);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/spreads', spreadRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/reading', readingRoutes);





app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Dinatarot is running dayo',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 핸들러 (모든 라우트 뒤에 배치)
app.use(notFoundHandler);

// 에러 핸들러 (가장 마지막에 배치)
app.use(errorHandler);

async function initializeServices(): Promise<void> {
  try {
    Logger.info('서비스 초기화 시작...');
    const serviceManager = ServiceManager.getInstance();
    await serviceManager.initialize();
    Logger.info('서비스 초기화 완료!');
  } catch (error) {
    Logger.error('서비스 초기화에 실패했다요:', error);
    Logger.warn('일부 기능이 제한될 수 있다요...');
  }
}

async function startServer(): Promise<void> {
  await initializeServices();

  app.listen(PORT, () => {
    Logger.info(`SERVER IS RUNNING ON PORT ${PORT} DAYO`);
    Logger.info('Dinatarot 백엔드가 준비되었다요!');
  });
}

// 예상치 못한 에러 처리
process.on('unhandledRejection', (reason, promise) => {
  Logger.error('Unhandled Rejection at promise', reason);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();