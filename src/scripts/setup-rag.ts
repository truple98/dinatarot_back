import path from 'path';
import { RAGService } from '../services/rag.service';

async function setupRAG() {
  try {
    console.log('RAG 시스템 초기화중이다요...');

    const ragService = new RAGService();
    const pdfPath = path.join(__dirname, '../../data/pdfs/tarot_card_complete.pdf');

    console.log('PDF에서 추출중이다요...');
    const chunks = await ragService.processPDF(pdfPath);
    console.log(`${chunks.length}개의 청크가 생성됐다요.`);

    console.log('임베딩 생성중이다요...');
    await ragService.createEmbeddings(chunks, 'tarot_complete');

    console.log('RAG 시스템 초기화 완료했다요.');
  } catch (error) {
    console.error('RAG 시스템 초기화를 실패했다요...:', error);
  }
}

setupRAG();