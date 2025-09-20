import express from 'express';
import { CardController } from '../controllers/card.controller';

const router = express.Router();
const cardController = new CardController();

router.post('/draw', (req, res) => cardController.drawCards(req, res));
router.post('/reset', (req, res) => cardController.resetCards(req, res));
router.post('/session/create', (req, res) => cardController.createSession(req, res));
router.post('/session/cleanup', (req, res) => cardController.cleanupSessions(req, res));
router.get('/', (req, res) => cardController.getAllCards(req, res));
router.get('/:cardId', (req, res) => cardController.getCardById(req, res));

export default router;