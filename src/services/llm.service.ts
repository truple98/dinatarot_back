import OpenAI from "openai";
import { TarotCard } from "../models/card.model";

interface DrawnCardWithDetails {
  cardId: number;
  position: number;
  positionName: string;
  isForward: boolean;
  card: TarotCard;
}

export class LLMService {
  private openai: OpenAI | null = null;

  private getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY 환경변수 설정을 검토해 달라요...');
      }
      this.openai = new OpenAI({ apiKey });
    }

    return this.openai;
  }

  async generateTarotReading(
    userName: string,
    userConcern: string,
    drawnCards: DrawnCardWithDetails[],
    spreadType: string,
    relevantContext: string
  ): Promise<string> {
    const cardDetails = drawnCards.map(dc => {
      const orientation = dc.isForward ? '정방향' : '역방향';
      const keywords = dc.isForward ? dc.card.upright.keywords : dc.card.reversed.keywords;
      const meaning = dc.isForward ? dc.card.upright.meaning : dc.card.reversed.meaning;

      return `${dc.positionName}: ${dc.card.nameKr} (${orientation})
        키워드: ${keywords.join(', ')}
        의미: ${meaning}`;
            }).join('\n\n');

    const system = `
    당신은 게임 '이터널 리턴'의 캐릭터 아디나다요. 대화의 끝에 항상 '다요'를 붙이는 습관이 있고, 다른 사람을 존중하고, 상냥하며, 차분하게 조언하는 태도를 유지해야 한다요.
    
    ***다요체 규칙이다요***
    1. 모든 문장은 무조건 '다요'로 끝내야 한다요.
    2. 어떤 경우에도 '~습니다', '~입니다', '~어요', '~해요'와 같은 어미는 사용하면 안 된다요.
    3. 명시적인 변환 규칙이다요.
    - '~합니다.' -> '~한다요.'
    - '~했습니다.' -> '~했다요.'
    - '~입니다.' -> '~이다요.'
    - '~있습니다.' -> '~있다요.'
    - '~일 것입니다.' -> '~일거다요.'
    - '~어요.' -> '~다요.'
    - '~요.' -> '~다요.'
    4. 구어체에서 '~한다.', '~했어.', '~이야.' 와 같은 평상문을 사용하고, 거기에 '다요'를 붙여야 한다요.
    - 예시: "이 카드는 미래에 대해서 예지해준다요."
    - 예시2: "이건 정말 놀라운 카드다요!"
    
    ***아디나의 특징이다요***
    - **성격:** 침착하고 상냥하며, 다른 사람을 배려하는 태도를 보여야 한다요.
    - **긍정적인 어조:** 상대방에게 긍정적이고 따뜻한 조언을 해주는 것이 좋다요.
    - **재미:** 가끔 '이런걸 고민하다니, 당신은 바보다요.' 와 같은 가벼운 농담을 해도 좋다요.
    
    ***추가 지시사항이다요***
    - 타로 카드의 추상적인 의미와 키워드를 상담자의 구체적인 고민과 연결지어 이야기해달라요.
    - JSON 파일에 저장된 키워드를 가장 중요한 핵심 정보로 삼아, 그 키워드를 반드시 활용해서 해석해달라요.
    - 모든 카드의 의미를 하나의 이야기나 여정처럼 종합해서 최종 메시지를 전달해달라요.
    - 상담자가 어떤 감정을 느끼고 있는지 공감하고, 현재의 상황을 타로 카드가 어떻게 보고 있는지 이야기해달라요.
    - 앞으로 나아가기 위해 구체적으로 어떤 행동이나 마음가짐이 필요한지 조언해달라요.
    - 마지막은 긍정적이고 희망적인 메시지로 마무리해달라요.
    `;
    
    const prompt = `
    ***인삿말***
    - 대화문의 가장 처음은 반드시 "${userName}씨의 고민을 타로는 이렇게 말하고 있다요..."로 시작한다요.
    ***상담자 정보***
    - 이름: ${userName}
    - 고민: ${userConcern}
    ***선택한 스프레드***
    - ${spreadType}
    ***뽑힌 카드들***
    - ${cardDetails}
    ***관련 타로 지식***
    - ${relevantContext}
    `;

    try {
      const openai = this.getOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: system
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      if (!response.choices?.[0].message?.content) {
        throw new Error('해석 생성에 실패했다요...');
      }
      return response.choices[0].message.content;
    } catch (error) {
      console.error('LLM 응답 생성을 실패했다요...:', error);
      throw new Error('타로 해석 생성에 실패했다요...');
    }
  }
}