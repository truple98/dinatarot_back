const fs = require('fs');
const path = require('path');

// 파일 경로 설정
const textFilePath = path.join(__dirname, '../data/pdfs/tarot_card_complete.txt');
const jsonFilePath = path.join(__dirname, '../data/cards/json/tarot-cards.json');

// 메이저 아르카나 카드 목록 (순서대로)
const majorArcanaCards = [
  { id: 0, name: 'The Fool', nameKr: '바보' },
  { id: 1, name: 'The Magician', nameKr: '마법사' },
  { id: 2, name: 'The High Priestess', nameKr: '여교황' },
  { id: 3, name: 'The Empress', nameKr: '여황제' },
  { id: 4, name: 'The Emperor', nameKr: '황제' },
  { id: 5, name: 'The Hierophant', nameKr: '교황' },
  { id: 6, name: 'The Lovers', nameKr: '연인' },
  { id: 7, name: 'The Chariot', nameKr: '전차' },
  { id: 8, name: 'Strength', nameKr: '힘' },
  { id: 9, name: 'The Hermit', nameKr: '은둔자' },
  { id: 10, name: 'Wheel of Fortune', nameKr: '운명의 수레바퀴' },
  { id: 11, name: 'Justice', nameKr: '정의' },
  { id: 12, name: 'The Hanged Man', nameKr: '매달린 남자' },
  { id: 13, name: 'Death', nameKr: '죽음' },
  { id: 14, name: 'Temperance', nameKr: '절제' },
  { id: 15, name: 'The Devil', nameKr: '악마' },
  { id: 16, name: 'The Tower', nameKr: '탑' },
  { id: 17, name: 'The Star', nameKr: '별' },
  { id: 18, name: 'The Moon', nameKr: '달' },
  { id: 19, name: 'The Sun', nameKr: '태양' },
  { id: 20, name: 'Judgement', nameKr: '심판' },
  { id: 21, name: 'The World', nameKr: '세계' }
];

// 텍스트에서 카드 정보 추출하는 함수 (수정된 버전)
function extractCardInfo(text, cardName) {
  // 카드 이름으로 시작점 찾기
  const cardPattern = new RegExp(`^${cardName}\\s*$`, 'im');
  const match = text.match(cardPattern);

  if (!match) {
    console.log(`${cardName} 카드를 찾을 수 없습니다.`);
    return null;
  }

  const startIndex = match.index;

  // 다음 카드 시작점 찾기
  const nextCards = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'
  ];

  let endIndex = text.length;
  for (const nextCard of nextCards) {
    if (nextCard !== cardName) {
      const nextPattern = new RegExp(`^${nextCard}\\s*$`, 'im');
      const nextMatch = text.substring(startIndex + cardName.length).match(nextPattern);
      if (nextMatch && nextMatch.index !== undefined) {
        const candidateEnd = startIndex + cardName.length + nextMatch.index;
        if (candidateEnd > startIndex && candidateEnd < endIndex) {
          endIndex = candidateEnd;
        }
      }
    }
  }

  const cardText = text.substring(startIndex, endIndex);
  console.log(`\n=== ${cardName} 추출된 텍스트 길이: ${cardText.length} ===`);

  // Description 추출 (올바른 패턴 사용)
  const descMatch = cardText.match(/Description:\s*([^]*?)(?=\s*Esoteric interpretation:|$)/i);
  let description = '';
  if (descMatch) {
    description = descMatch[1].trim().replace(/\s+/g, ' ').substring(0, 500);
  }

  // Traditional meaning 추출 (올바른 패턴 사용)
  const meaningMatch = cardText.match(/Traditional meaning:\s*([^]*?)(?=\s*Traditional reversed meaning:|$)/i);
  let traditionalMeaning = '';
  if (meaningMatch) {
    traditionalMeaning = meaningMatch[1].trim().replace(/\s+/g, ' ').substring(0, 800);
  }

  // Traditional reversed meaning 추출 (올바른 패턴 사용)
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

// 키워드 추출 함수 (개선된 버전)
function extractKeywords(text, isReversed = false) {
  const keywords = [];
  const textLower = text.toLowerCase();

  if (isReversed) {
    // 역방향 키워드들
    const reversedKeywords = [
      { pattern: /confusion|혼란|混亂/, word: '혼란' },
      { pattern: /fear|두려움|恐怖/, word: '두려움' },
      { pattern: /weakness|약함|弱|weak/, word: '약함' },
      { pattern: /indecision|우유부단|優柔不斷/, word: '우유부단' },
      { pattern: /abuse|남용|濫用/, word: '남용' },
      { pattern: /false|거짓|虛僞/, word: '거짓' },
      { pattern: /cowardly|겁쟁이|膽小/, word: '겁쟁이' },
      { pattern: /lazy|게으른|怠惰/, word: '게으름' },
      { pattern: /unskilled|미숙한|未熟/, word: '미숙함' }
    ];

    reversedKeywords.forEach(({ pattern, word }) => {
      if (pattern.test(textLower) && !keywords.includes(word)) {
        keywords.push(word);
      }
    });
  } else {
    // 정방향 키워드들
    const uprightKeywords = [
      { pattern: /new beginning|새로운 시작|新しい始まり/, word: '새로운 시작' },
      { pattern: /freedom|자유|自由/, word: '자유' },
      { pattern: /adventure|모험|冒險/, word: '모험' },
      { pattern: /trust|신뢰|信賴/, word: '신뢰' },
      { pattern: /will|의지|意志/, word: '의지력' },
      { pattern: /action|행동|行動/, word: '행동' },
      { pattern: /confidence|자신감|自信/, word: '자신감' },
      { pattern: /decision|결정|決定/, word: '결정' },
      { pattern: /intuition|직감|直感/, word: '직감' },
      { pattern: /wisdom|지혜|知惠/, word: '지혜' },
      { pattern: /creativity|창조|創造/, word: '창조성' },
      { pattern: /inspiration|영감|靈感/, word: '영감' },
      { pattern: /love|사랑|愛/, word: '사랑' },
      { pattern: /abundance|풍요|豊饒/, word: '풍요' }
    ];

    uprightKeywords.forEach(({ pattern, word }) => {
      if (pattern.test(textLower) && !keywords.includes(word)) {
        keywords.push(word);
      }
    });
  }

  return keywords.length > 0 ? keywords : (isReversed ? ['부정적 에너지'] : ['긍정적 에너지']);
}

async function main() {
  try {
    // 텍스트 파일 읽기
    const textContent = fs.readFileSync(textFilePath, 'utf-8');

    // 기존 JSON 파일 읽기
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const cardData = JSON.parse(jsonContent);

    console.log('메이저 아르카나 카드 정보 추출 시작...');

    // 각 메이저 아르카나 카드 처리
    for (const cardInfo of majorArcanaCards) {
      console.log(`\n처리 중: ${cardInfo.name} (${cardInfo.nameKr})`);

      const extractedInfo = extractCardInfo(textContent, cardInfo.name);

      if (extractedInfo) {
        // JSON 데이터에서 해당 카드 찾기
        const cardIndex = cardData.cards.findIndex(card => card.id === cardInfo.id);

        if (cardIndex !== -1) {
          const card = cardData.cards[cardIndex];

          // 카드 정보 업데이트
          card.name = cardInfo.name;
          card.nameKr = cardInfo.nameKr;
          card.arcana = 'major';
          card.suit = null;

          // 설명과 의미 업데이트
          card.upright.description = extractedInfo.description;
          card.upright.meaning = extractedInfo.traditionalMeaning;
          card.upright.keywords = extractKeywords(extractedInfo.traditionalMeaning, false);

          card.reversed.description = extractedInfo.reversedMeaning.substring(0, 200);
          card.reversed.meaning = extractedInfo.reversedMeaning;
          card.reversed.keywords = extractKeywords(extractedInfo.reversedMeaning, true);

          // 이미지 파일명 업데이트
          card.imageFile = `${cardInfo.id}.jpg`;

          console.log(`✅ ${cardInfo.name} 업데이트 완료`);
        }
      } else {
        console.log(`❌ ${cardInfo.name} 정보 추출 실패`);
      }
    }

    // 업데이트된 JSON 파일 저장
    fs.writeFileSync(jsonFilePath, JSON.stringify(cardData, null, 2), 'utf-8');
    console.log('\n🎯 메이저 아르카나 카드 정보 추출 완료!');
    console.log(`업데이트된 파일: ${jsonFilePath}`);

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
main();