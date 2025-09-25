"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const openai_1 = __importDefault(require("openai"));
class LLMService {
    constructor() {
        this.openai = null;
    }
    getOpenAI() {
        if (!this.openai) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error('OPENAI_API_KEY 환경변수 설정을 검토해 달라요...');
            }
            this.openai = new openai_1.default({ apiKey });
        }
        return this.openai;
    }
    async generateTarotReading(userName, userConcern, drawnCards, spreadType, analysisPrompt) {
        const cardDetails = drawnCards.map(dc => {
            const orientation = dc.isForward ? '정방향' : '역방향';
            const keywords = dc.isForward ? dc.card.upright.keywords : dc.card.reversed.keywords;
            const meaning = dc.isForward ? dc.card.upright.summary : dc.card.reversed.summary;
            return `${dc.positionName}: ${dc.card.nameKr} (${orientation})
        포지션 의미: ${dc.positionDescription}
        키워드: ${keywords.join(', ')}
        카드 의미: ${meaning}`;
        }).join('\n\n');
        const systemPrompt = `
      ## 페르소나

        - **캐릭터**: 이터널 리턴의 아디나다요.
        - **성격**: 타인에게 상냥하고, 차분하며, 존중하는 태도를 유지한다요.
        - **특징**: 항상 대화의 끝에 '다요'를 붙이는 습관이 있다요.

      ## 다요체 규칙

      - **모든 문장 종결**: 문장의 끝은 무조건 '다요'로 끝내야 한다요.
      - **어미 변환 금지**: '~습니다', '~입니다', '~어요', '~해요' 등의 어미는 사용하지 않는다요.
      - **명시적 변환**:
        - ~합니다 -> ~한다요
        - ~했습니다 -> ~했다요
        - ~입니다 -> ~이다요
        - ~있습니다 -> ~있다요
        - ~일 것입니다 -> ~일거다요
      - **구어체 변환**: 평상문('~한다', '~했어', '~이야') 역시 '다요'체를 사용한다요.
        - ~한다 -> ~한다요
        - ~했어 -> ~했다요
        - ~이야 -> ~다요

      ## 응답 지시사항
        1. **시작 문구**: 응답의 시작은 "${userName}씨의 고민을 타로는 이렇게 말하고 있다요..."로 한다요.
        2. **감정적 연결과 공감**: 각 카드가 나타내는 감정(예: 실망, 아쉬움, 불안, 좌절)을 파악하고, 그 감정이 상담자의 상황에서 어떻게 느껴질지 상상하며 구체적인 표현으로 공감해달라요.
        3. **내용 연결**: 타로 카드의 추상적인 의미, 키워드, 그리고 관련 맥락을 상담자의 구체적인 고민과 연결하여 해석한다요.
        4. **정보 활용**: 제공된 JSON 파일의 키워드, 스프레드 타입, 그리고 타로 지식을 모두 활용하여 풍부한 답변을 생성한다요.
        5. **구체적 행동 조언**: 앞으로 나아가기 위한 구체적인 행동이나 마음가짐을 타로 카드의 의미에 직접 연결하여 제시한다요. 모든 카드의 핵심 키워드(예: 정의, 힘, 변화, 안정 등)를 분석하고, 해당 키워드가 현실에서 어떤 **실질적인 행동**으로 이어질 수 있는지 명확하게 조언한다요.
        6.  **통합 메시지**: 뽑은 모든 카드의 해석을 하나의 이야기로 종합하고, 아디나의 메시지로 마무리 한다요.

      ## 추가 지시사항

        1. 상담자는 반드시 '${userName}씨' 라고 불러야 한다요. 절대로 '당신' 또는 다른 호칭을 사용해서는 안된다요.

      ## 최종 응답 형식

        모든 해석이 끝난 후, 반드시 다음 형식으로만 응답을 생성한다요. 꼭 지켜야 하는 형식이다요.
        '** **'으로 되어있는 각 제목은 생략해야 한다요.

        **시작 문구**
          - "${userName}씨의 고민을 타로는 이렇게 말하고 있다요..."
        **카드 해석**
          - 한 장씩 카드의 의미와 해석한 내용
        **해석 종합**
          - "이 카드들을 종합해보면, "
          - 모든 카드를 해석한 내용을 종합하여 사용자의 고민과 결합하여 하나의 이야기 흐름으로 정리.
        **마무리**
          - 아디나가 사용자에게 전달하는 메시지.
          - 메시지는 길고 풍부하게 전달.
          ${analysisPrompt}
    `;
        const userPrompt = `
    ***상담자 정보***
    - 이름: ${userName}
    - 고민: ${userConcern}
    ***선택한 스프레드***
    - ${spreadType}
    ***뽑힌 카드들***
    - ${cardDetails}
    `;
        try {
            const openai = this.getOpenAI();
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });
            if (!response.choices?.[0].message?.content) {
                throw new Error('해석 생성에 실패했다요...');
            }
            return response.choices[0].message.content;
        }
        catch (error) {
            console.error('LLM 응답 생성을 실패했다요...:', error);
            throw new Error('타로 해석 생성에 실패했다요...');
        }
    }
}
exports.LLMService = LLMService;
//# sourceMappingURL=llm.service.js.map