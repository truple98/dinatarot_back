import express from 'express';
import { ReadingController } from '../controllers/reading.controller';

const router = express.Router();
const readingController = new ReadingController();

router.post('/interpret', (req, res) => readingController.interpretReading(req, res));
router.get('/history', (req, res) => readingController.getReadingHistory(req, res));

export default router;