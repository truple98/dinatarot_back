const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, '../data/cards/json/tarot-cards.json');

function cleanDuplicateCards() {
  try {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const cardData = JSON.parse(jsonContent);

    console.log('현재 카드 수:', cardData.cards.length);

    // ID별로 카드를 그룹화하여 중복 제거
    const uniqueCards = {};

    cardData.cards.forEach(card => {
      if (!uniqueCards[card.id] || (card.arcana && card.name)) {
        // 기존 카드가 없거나, 현재 카드가 더 완전한 정보를 가지고 있으면 업데이트
        uniqueCards[card.id] = card;
      }
    });

    // 배열로 변환하고 ID 순으로 정렬
    const cleanedCards = Object.values(uniqueCards).sort((a, b) => a.id - b.id);

    console.log('정리 후 카드 수:', cleanedCards.length);
    console.log('메이저 아르카나:', cleanedCards.filter(c => c.arcana === 'major').length);
    console.log('마이너 아르카나:', cleanedCards.filter(c => c.arcana === 'minor').length);

    // 정리된 데이터로 업데이트
    cardData.cards = cleanedCards;

    // 파일 저장
    fs.writeFileSync(jsonFilePath, JSON.stringify(cardData, null, 2), 'utf-8');
    console.log('✅ 중복 카드 정리 완료!');

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

cleanDuplicateCards();