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

// 텍스트에서 카드 정보 추출하는 함수
function extractCardInfo(text, cardName) {
  // 카드 이름으로 시작점 찾기
  const cardPattern = new RegExp(`^${cardName}\\s*$`, 'im');
  const match = text.match(cardPattern);

  if (!match) {
    console.log(`${cardName} 카드를 찾을 수 없습니다.`);
    return null;
  }

  const startIndex = match.index;

  // 다음 카드 시작점 찾기 (다음 메이저 아르카나 카드 이름)
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
      if (nextMatch && nextMatch.index) {
        const candidateEnd = startIndex + cardName.length + nextMatch.index;
        if (candidateEnd > startIndex && candidateEnd < endIndex) {
          endIndex = candidateEnd;
        }
      }
    }
  }

  const cardText = text.substring(startIndex, endIndex);
  console.log(`\\n=== ${cardName} 추출된 텍스트 길이: ${cardText.length} ===`);

  // Description 추출
  const descMatch = cardText.match(/Description:\\s*([\\s\\S]*?)(?=\\s*Esoteric interpretation:|\\s*Traditional meaning:|$)/i);
  const description = descMatch ? descMatch[1].trim().replace(/\\n+/g, ' ').substring(0, 500) : '';

  // Traditional meaning 추출
  const meaningMatch = cardText.match(/Traditional meaning:\\s*([\\s\\S]*?)(?=\\s*Traditional reversed meaning:|$)/i);
  const traditionalMeaning = meaningMatch ? meaningMatch[1].trim().replace(/\\n+/g, ' ').substring(0, 800) : '';

  // Traditional reversed meaning 추출
  const reversedMatch = cardText.match(/Traditional reversed meaning:\\s*([\\s\\S]*?)(?=\\s*[A-Z][a-z\\s]+\\s*$|$)/i);
  const reversedMeaning = reversedMatch ? reversedMatch[1].trim().replace(/\\n+/g, ' ').substring(0, 500) : '';

  console.log(`Description: ${description.substring(0, 100)}...`);
  console.log(`Traditional meaning: ${traditionalMeaning.substring(0, 100)}...`);
  console.log(`Reversed meaning: ${reversedMeaning.substring(0, 100)}...`);

  return {
    description,
    traditionalMeaning,
    reversedMeaning
  };
}

// 키워드 추출 함수 (의미에서 주요 키워드들을 추출)
function extractKeywords(text, isReversed = false) {
  const keywords = [];

  if (isReversed) {
    // 역방향 키워드들
    const reversedPatterns = [
      /confusion|혼란/, /fear|두려움/, /weakness|약함/, /indecision|우유부단/,
      /abuse|남용/, /paranoia|편집증/, /extremism|극단주의/, /false|거짓/,
      /cowardly|겁쟁이/, /lazy|게으른/, /unskilled|미숙한/
    ];

    reversedPatterns.forEach(pattern => {
      if (pattern.test(text.toLowerCase())) {
        if (pattern.source.includes('confusion')) keywords.push('혼란');
        if (pattern.source.includes('fear')) keywords.push('두려움');
        if (pattern.source.includes('weakness')) keywords.push('약함');
        if (pattern.source.includes('indecision')) keywords.push('우유부단');
        if (pattern.source.includes('false')) keywords.push('거짓');
      }
    });
  } else {
    // 정방향 키워드들
    const uprightPatterns = [
      /new beginning|새로운 시작/, /freedom|자유/, /adventure|모험/, /trust|신뢰/,
      /will|의지/, /action|행동/, /confidence|자신감/, /decision|결정/,
      /intuition|직감/, /wisdom|지혜/, /creativity|창조/, /inspiration|영감/,
      /love|사랑/, /nurturing|양육/, /abundance|풍요/, /fertility|다산/
    ];

    uprightPatterns.forEach(pattern => {
      if (pattern.test(text.toLowerCase())) {
        if (pattern.source.includes('new beginning')) keywords.push('새로운 시작');
        if (pattern.source.includes('freedom')) keywords.push('자유');
        if (pattern.source.includes('will')) keywords.push('의지력');
        if (pattern.source.includes('action')) keywords.push('행동');
        if (pattern.source.includes('intuition')) keywords.push('직감');
        if (pattern.source.includes('wisdom')) keywords.push('지혜');
      }
    });
  }

  return keywords.length > 0 ? keywords : ['키워드 추출 필요'];
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
      console.log(`처리 중: ${cardInfo.name} (${cardInfo.nameKr})`);

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
          card.upright.description = extractedInfo.description || '설명을 추출할 수 없습니다.';
          card.upright.meaning = extractedInfo.traditionalMeaning || '의미를 추출할 수 없습니다.';
          card.upright.keywords = extractKeywords(extractedInfo.traditionalMeaning, false);

          card.reversed.description = extractedInfo.reversedMeaning ? extractedInfo.reversedMeaning.substring(0, 200) : '역방향 설명을 추출할 수 없습니다.';
          card.reversed.meaning = extractedInfo.reversedMeaning || '역방향 의미를 추출할 수 없습니다.';
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
    console.log('\\n🎯 메이저 아르카나 카드 정보 추출 완료!');
    console.log(`업데이트된 파일: ${jsonFilePath}`);

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
main();