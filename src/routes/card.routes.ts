import express from 'express';
import { CardController } from '../controllers/card.controller';

const router = express.Router();
const cardController = new CardController();

router.post('/draw', (req, res) => cardController.drawCards(req, res));

export default router;

