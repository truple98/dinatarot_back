import express from 'express';
import { ReadingController } from '../controllers/reading.controller';

const router = express.Router();
const readingController = new ReadingController();

router.post('/generate', (req, res) => readingController.generateReading(req, res));

export default router;