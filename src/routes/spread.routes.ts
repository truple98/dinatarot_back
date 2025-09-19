import express from 'express';
import { SpreadController } from '../controllers/spread.controller';

const router = express.Router();
const spreadController = new SpreadController();

router.get('/', (req, res) => spreadController.getAllSpreads(req, res));
router.get('/:spreadId', (req, res) => spreadController.getSpreadById(req, res));

export default router;