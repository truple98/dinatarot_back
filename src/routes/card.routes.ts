import express from 'express';
import { CardController } from '../controllers/card.controller';

const router = express.Router();
const cardController = new CardController();

router.get('/', (req, res) => cardController.getAllCards(req, res));
router.post('/draw', (req, res) => cardController.drawCards(req, res));
router.get('/:cardId', (req, res) => cardController.getCardById(req, res));

export default router;

