"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingController = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const llm_service_1 = require("../services/llm.service");
const rag_service_1 = require("../services/rag.service");
;
class ReadingController {
    constructor() {
        this.cardsData = null;
        this.spreadsData = {};
        this.dataLoadPromise = null;
        this.llmService = new llm_service_1.LLMService();
        this.ragService = new rag_service_1.RAGService();
        this.dataLoadPromise = this.loadData();
    }
    async loadData() {
        try {
            const cardsPath = path_1.default.join(process.cwd(), 'data/cards/tarot-cards.json');
            this.cardsData = await fs_extra_1.default.readJson(cardsPath);
            const spreadsDir = path_1.default.join(process.cwd(), 'data/spreads');
            const spreadFiles = await fs_extra_1.default.readdir(spreadsDir);
            for (const file of spreadFiles) {
                if (file.endsWith('.json')) {
                    const spreadPath = path_1.default.join(spreadsDir, file);
                    const spreadData = await fs_extra_1.default.readJson(spreadPath);
                    this.spreadsData[spreadData.id] = spreadData;
                }
            }
            await this.ragService.initialize();
            console.log('데이터 로딩 완료: 카드, 스프레드, RAG 서비스');
        }
        catch (error) {
            console.error('데이터 로딩 실패:', error);
            throw error;
        }
    }
    async interpretTarot(req, res) {
        try {
            if (this.dataLoadPromise) {
                await this.dataLoadPromise;
                this.dataLoadPromise = null;
            }
            const { userName, userConcern, spreadType, drawnCards } = req.body;
            if (!userName || !userConcern || !spreadType || !drawnCards) {
                const response = {
                    success: false,
                    message: '필수 정보가 누락되었다요!'
                };
                res.status(400).json(response);
                return;
            }
            if (!this.cardsData) {
                const response = {
                    success: false,
                    message: '카드 데이터 로딩에 실패했다요...'
                };
                res.status(500).json(response);
                return;
            }
            const spreadData = this.spreadsData[spreadType];
            if (!spreadData) {
                const response = {
                    success: false,
                    message: `스프레드 타입 ${spreadType}을 찾을 수 없다요...`
                };
                res.status(400).json(response);
                return;
            }
            const drawnCardsWithDetails = drawnCards.map((drawn) => {
                const card = this.cardsData.cards.find((card) => card.id === drawn.cardId);
                if (!card) {
                    throw new Error(`카드 ID ${drawn.cardId}를 찾을 수 없다요... 유효한 카드 ID(0-77)를 달라요!`);
                }
                const positionInfo = spreadData.positions.find(pos => pos.id === drawn.position);
                const positionDescription = positionInfo ? positionInfo.description : drawn.positionName;
                return {
                    cardId: drawn.cardId,
                    position: drawn.position,
                    positionName: drawn.positionName,
                    isForward: drawn.isForward,
                    card,
                    positionDescription
                };
            });
            const interpretation = await this.llmService.generateTarotReading(userName, userConcern, drawnCardsWithDetails, spreadType, spreadData.summaryGuide.analysisPrompt);
            const response = {
                success: true,
                data: {
                    userName,
                    userConcern,
                    spreadType,
                    drawnCards,
                    interpretation
                },
                message: '타로 해석이 완료되었다요!'
            };
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.json(response);
        }
        catch (error) {
            console.error('타로 해석 실패:', error);
            const response = {
                success: false,
                message: '타로 해석에 실패했다요...'
            };
            res.status(500).json(response);
        }
    }
}
exports.ReadingController = ReadingController;
//# sourceMappingURL=reading.controller.js.map