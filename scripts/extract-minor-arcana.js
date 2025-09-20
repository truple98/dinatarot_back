const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const textFilePath = path.join(__dirname, '../data/pdfs/tarot_card_complete.txt');
const jsonFilePath = path.join(__dirname, '../data/cards/json/tarot-cards.json');

// 마이너 아르카나 카드 목록
const minorArcanaCards = [
  // Wands (완드) - 22-35
  { id: 22, name: 'Ace of Wands', nameKr: '완드 에이스', suit: 'wands', rank: 'ace' },
  { id: 23, name: 'Two of Wands', nameKr: '완드 2', suit: 'wands', rank: '2' },
  { id: 24, name: 'Three of Wands', nameKr: '완드 3', suit: 'wands', rank: '3' },
  { id: 25, name: 'Four of Wands', nameKr: '완드 4', suit: 'wands', rank: '4' },
  { id: 26, name: 'Five of Wands', nameKr: '완드 5', suit: 'wands', rank: '5' },
  { id: 27, name: 'Six of Wands', nameKr: '완드 6', suit: 'wands', rank: '6' },
  { id: 28, name: 'Seven of Wands', nameKr: '완드 7', suit: 'wands', rank: '7' },
  { id: 29, name: 'Eight of Wands', nameKr: '완드 8', suit: 'wands', rank: '8' },
  { id: 30, name: 'Nine of Wands', nameKr: '완드 9', suit: 'wands', rank: '9' },
  { id: 31, name: 'Ten of Wands', nameKr: '완드 10', suit: 'wands', rank: '10' },
  { id: 32, name: 'Page of Wands', nameKr: '완드 페이지', suit: 'wands', rank: 'page' },
  { id: 33, name: 'Knight of Wands', nameKr: '완드 나이트', suit: 'wands', rank: 'knight' },
  { id: 34, name: 'Queen of Wands', nameKr: '완드 퀸', suit: 'wands', rank: 'queen' },
  { id: 35, name: 'King of Wands', nameKr: '완드 킹', suit: 'wands', rank: 'king' },

  // Cups (컵) - 36-49
  { id: 36, name: 'Ace of Cups', nameKr: '컵 에이스', suit: 'cups', rank: 'ace' },
  { id: 37, name: 'Two of Cups', nameKr: '컵 2', suit: 'cups', rank: '2' },
  { id: 38, name: 'Three of Cups', nameKr: '컵 3', suit: 'cups', rank: '3' },
  { id: 39, name: 'Four of Cups', nameKr: '컵 4', suit: 'cups', rank: '4' },
  { id: 40, name: 'Five of Cups', nameKr: '컵 5', suit: 'cups', rank: '5' },
  { id: 41, name: 'Six of Cups', nameKr: '컵 6', suit: 'cups', rank: '6' },
  { id: 42, name: 'Seven of Cups', nameKr: '컵 7', suit: 'cups', rank: '7' },
  { id: 43, name: 'Eight of Cups', nameKr: '컵 8', suit: 'cups', rank: '8' },
  { id: 44, name: 'Nine of Cups', nameKr: '컵 9', suit: 'cups', rank: '9' },
  { id: 45, name: 'Ten of Cups', nameKr: '컵 10', suit: 'cups', rank: '10' },
  { id: 46, name: 'Page of Cups', nameKr: '컵 페이지', suit: 'cups', rank: 'page' },
  { id: 47, name: 'Knight of Cups', nameKr: '컵 나이트', suit: 'cups', rank: 'knight' },
  { id: 48, name: 'Queen of Cups', nameKr: '컵 퀸', suit: 'cups', rank: 'queen' },
  { id: 49, name: 'King of Cups', nameKr: '컵 킹', suit: 'cups', rank: 'king' },

  // Swords (소드) - 50-63
  { id: 50, name: 'Ace of Swords', nameKr: '소드 에이스', suit: 'swords', rank: 'ace' },
  { id: 51, name: 'Two of Swords', nameKr: '소드 2', suit: 'swords', rank: '2' },
  { id: 52, name: 'Three of Swords', nameKr: '소드 3', suit: 'swords', rank: '3' },
  { id: 53, name: 'Four of Swords', nameKr: '소드 4', suit: 'swords', rank: '4' },
  { id: 54, name: 'Five of Swords', nameKr: '소드 5', suit: 'swords', rank: '5' },
  { id: 55, name: 'Six of Swords', nameKr: '소드 6', suit: 'swords', rank: '6' },
  { id: 56, name: 'Seven of Swords', nameKr: '소드 7', suit: 'swords', rank: '7' },
  { id: 57, name: 'Eight of Swords', nameKr: '소드 8', suit: 'swords', rank: '8' },
  { id: 58, name: 'Nine of Swords', nameKr: '소드 9', suit: 'swords', rank: '9' },
  { id: 59, name: 'Ten of Swords', nameKr: '소드 10', suit: 'swords', rank: '10' },
  { id: 60, name: 'Page of Swords', nameKr: '소드 페이지', suit: 'swords', rank: 'page' },
  { id: 61, name: 'Knight of Swords', nameKr: '소드 나이트', suit: 'swords', rank: 'knight' },
  { id: 62, name: 'Queen of Swords', nameKr: '소드 퀸', suit: 'swords', rank: 'queen' },
  { id: 63, name: 'King of Swords', nameKr: '소드 킹', suit: 'swords', rank: 'king' },

  // Coins/Pentacles (코인) - 64-77
  { id: 64, name: 'Ace of Coins', nameKr: '코인 에이스', suit: 'pentacles', rank: 'ace' },
  { id: 65, name: 'Two of Coins', nameKr: '코인 2', suit: 'pentacles', rank: '2' },
  { id: 66, name: 'Three of Coins', nameKr: '코인 3', suit: 'pentacles', rank: '3' },
  { id: 67, name: 'Four of Coins', nameKr: '코인 4', suit: 'pentacles', rank: '4' },
  { id: 68, name: 'Five of Coins', nameKr: '코인 5', suit: 'pentacles', rank: '5' },
  { id: 69, name: 'Six of Coins', nameKr: '코인 6', suit: 'pentacles', rank: '6' },
  { id: 70, name: 'Seven of Coins', nameKr: '코인 7', suit: 'pentacles', rank: '7' },
  { id: 71, name: 'Eight of Coins', nameKr: '코인 8', suit: 'pentacles', rank: '8' },
  { id: 72, name: 'Nine of Coins', nameKr: '코인 9', suit: 'pentacles', rank: '9' },
  { id: 73, name: 'Ten of Coins', nameKr: '코인 10', suit: 'pentacles', rank: '10' },
  { id: 74, name: 'Page of Coins', nameKr: '코인 페이지', suit: 'pentacles', rank: 'page' },
  { id: 75, name: 'Knight of Coins', nameKr: '코인 나이트', suit: 'pentacles', rank: 'knight' },
  { id: 76, name: 'Queen of Coins', nameKr: '코인 퀸', suit: 'pentacles', rank: 'queen' },
  { id: 77, name: 'King of Coins', nameKr: '코인 킹', suit: 'pentacles', rank: 'king' }
];

// 카드명 변형 패턴 (텍스트에서 다양한 형태로 나타날 수 있음)
function getCardPatterns(cardName) {
  const patterns = [cardName];

  // "of" 패턴들
  if (cardName.includes(' of ')) {
    // "Two of Wands" -> "2 of Wands"
    patterns.push(cardName.replace(/^(Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten)/, (match) => {
      const numbers = {
        'Two': '2', 'Three': '3', 'Four': '4', 'Five': '5',
        'Six': '6', 'Seven': '7', 'Eight': '8', 'Nine': '9', 'Ten': '10'
      };
      return numbers[match] || match;
    }));
  }

  return patterns;
}

// 텍스트에서 마이너 아르카나 카드 정보 추출
function extractMinorCardInfo(text, cardInfo) {
  const patterns = getCardPatterns(cardInfo.name);
  let cardText = null;
  let startIndex = -1;

  // 여러 패턴으로 카드 찾기
  for (const pattern of patterns) {
    const regex = new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
    const match = text.match(regex);

    if (match) {
      startIndex = match.index;
      break;
    }
  }

  if (startIndex === -1) {
    console.log(`${cardInfo.name} 카드를 찾을 수 없습니다.`);
    return null;
  }

  // 다음 카드 찾기
  const allCardNames = minorArcanaCards.map(c => c.name).concat([
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
  ]);

  let endIndex = text.length;
  for (const nextCard of allCardNames) {
    if (nextCard !== cardInfo.name) {
      const nextPattern = new RegExp(`^${nextCard.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
      const nextMatch = text.substring(startIndex + cardInfo.name.length).match(nextPattern);
      if (nextMatch && nextMatch.index !== undefined) {
        const candidateEnd = startIndex + cardInfo.name.length + nextMatch.index;
        if (candidateEnd > startIndex && candidateEnd < endIndex) {
          endIndex = candidateEnd;
        }
      }
    }
  }

  cardText = text.substring(startIndex, endIndex);
  console.log(`\n=== ${cardInfo.name} 추출된 텍스트 길이: ${cardText.length} ===`);

  // Description 추출
  const descMatch = cardText.match(/Description:\s*([^]*?)(?=\s*Prime elements|Traditional meaning:|$)/i);
  let description = '';
  if (descMatch) {
    description = descMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
  }

  // Traditional meaning 추출
  const meaningMatch = cardText.match(/Traditional meaning:\s*([^]*?)(?=\s*Traditional reversed meaning:|$)/i);
  let traditionalMeaning = '';
  if (meaningMatch) {
    traditionalMeaning = meaningMatch[1].trim().replace(/\s+/g, ' ').substring(0, 800);
  }

  // Traditional reversed meaning 추출
  const reversedMatch = cardText.match(/Traditional reversed meaning:\s*([^]*?)(?=\n[A-Z][^:]*\n|$)/i);
  let reversedMeaning = '';
  if (reversedMatch) {
    reversedMeaning = reversedMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
  }

  console.log(`Description found: ${description ? 'YES' : 'NO'} (${description.length} chars)`);
  console.log(`Traditional meaning found: ${traditionalMeaning ? 'YES' : 'NO'} (${traditionalMeaning.length} chars)`);
  console.log(`Reversed meaning found: ${reversedMeaning ? 'YES' : 'NO'} (${reversedMeaning.length} chars)`);

  if (description) console.log(`Description preview: ${description.substring(0, 100)}...`);
  if (traditionalMeaning) console.log(`Meaning preview: ${traditionalMeaning.substring(0, 100)}...`);
  if (reversedMeaning) console.log(`Reversed preview: ${reversedMeaning.substring(0, 100)}...`);

  return {
    description: description || '설명을 추출할 수 없습니다.',
    traditionalMeaning: traditionalMeaning || '의미를 추출할 수 없습니다.',
    reversedMeaning: reversedMeaning || '역방향 의미를 추출할 수 없습니다.'
  };
}

// 수트별 키워드 추출
function extractSuitKeywords(text, suit, isReversed = false) {
  const keywords = [];
  const textLower = text.toLowerCase();

  const suitKeywords = {
    wands: {
      upright: ['에너지', '열정', '창조', '행동', '모험', '리더십'],
      reversed: ['좌절', '지연', '에너지 부족', '갈등']
    },
    cups: {
      upright: ['사랑', '감정', '관계', '직감', '행복', '만족'],
      reversed: ['감정적 고통', '관계 문제', '실망', '우울']
    },
    swords: {
      upright: ['지성', '소통', '진실', '정의', '결단력'],
      reversed: ['갈등', '혼란', '거짓말', '정신적 고통', '의사소통 문제']
    },
    pentacles: {
      upright: ['물질', '안정', '성공', '실용성', '보안', '성취'],
      reversed: ['재정 문제', '불안정', '탐욕', '물질적 손실']
    }
  };

  const relevantKeywords = suitKeywords[suit] ?
    (isReversed ? suitKeywords[suit].reversed : suitKeywords[suit].upright) :
    ['기본 키워드'];

  return relevantKeywords.slice(0, 3); // 최대 3개 키워드
}

async function main() {
  try {
    const textContent = fs.readFileSync(textFilePath, 'utf-8');
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const cardData = JSON.parse(jsonContent);

    console.log('마이너 아르카나 카드 정보 추출 시작...');

    // 기존 카드 배열에 마이너 아르카나 카드들 추가
    for (const cardInfo of minorArcanaCards) {
      console.log(`\n처리 중: ${cardInfo.name} (${cardInfo.nameKr})`);

      const extractedInfo = extractMinorCardInfo(textContent, cardInfo);

      if (extractedInfo) {
        // 새 카드 객체 생성
        const newCard = {
          id: cardInfo.id,
          name: cardInfo.name,
          nameKr: cardInfo.nameKr,
          suit: cardInfo.suit,
          rank: cardInfo.rank,
          arcana: 'minor',
          upright: {
            keywords: extractSuitKeywords(extractedInfo.traditionalMeaning, cardInfo.suit, false),
            meaning: extractedInfo.traditionalMeaning,
            description: extractedInfo.description
          },
          reversed: {
            keywords: extractSuitKeywords(extractedInfo.reversedMeaning, cardInfo.suit, true),
            meaning: extractedInfo.reversedMeaning,
            description: extractedInfo.reversedMeaning.substring(0, 200)
          },
          imageFile: `${cardInfo.id}.jpg`,
          element: getSuitElement(cardInfo.suit),
          planet: null
        };

        cardData.cards.push(newCard);
        console.log(`✅ ${cardInfo.name} 추가 완료`);
      } else {
        console.log(`❌ ${cardInfo.name} 정보 추출 실패`);
      }
    }

    // 업데이트된 JSON 파일 저장
    fs.writeFileSync(jsonFilePath, JSON.stringify(cardData, null, 2), 'utf-8');
    console.log('\n🎯 마이너 아르카나 카드 정보 추출 완료!');
    console.log(`총 카드 수: ${cardData.cards.length}개`);
    console.log(`업데이트된 파일: ${jsonFilePath}`);

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

function getSuitElement(suit) {
  const elements = {
    'wands': 'fire',
    'cups': 'water',
    'swords': 'air',
    'pentacles': 'earth'
  };
  return elements[suit] || null;
}

main();