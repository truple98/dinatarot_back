import { CardService } from './card.service';
import { RAGService } from './rag.service';
import { LLMService } from './llm.service';

export class ServiceManager {
  private static instance: ServiceManager;
  private _cardService: CardService;
  private _ragService?: RAGService;
  private _llmService?: LLMService;
  private _initialized = false;

  private constructor() {
    this._cardService = new CardService();

    // OpenAI API 키가 있을 때만 서비스 초기화
    if (process.env.OPENAI_API_KEY) {
      this._ragService = new RAGService();
      this._llmService = new LLMService();
    } else {
      console.warn('⚠️ OPENAI_API_KEY가 설정되지 않았습니다. RAG 및 LLM 기능이 제한됩니다.');
    }
  }

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }

    try {
      console.log('서비스 초기화를 시작한다요...');

      await this._cardService.loadCards();
      console.log('✅ CardService 초기화 완료다요!');

      if (this._ragService) {
        await this._ragService.initialize();
        console.log('✅ RAGService 초기화 완료다요!');
      } else {
        console.log('⚠️ RAGService 초기화 건너뜀 (API 키 없음)');
      }

      this._initialized = true;
      console.log('🎯 모든 서비스 초기화가 완료되었다요!');
    } catch (error) {
      console.error('❌ 서비스 초기화에 실패했다요:', error);
      throw error;
    }
  }

  get cardService(): CardService {
    return this._cardService;
  }

  get ragService(): RAGService | undefined {
    return this._ragService;
  }

  get llmService(): LLMService | undefined {
    return this._llmService;
  }

  get isInitialized(): boolean {
    return this._initialized;
  }
}