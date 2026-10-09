const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const SCANS_DIR = path.join(__dirname, 'scans');
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'importedCards.ts');

async function runOCR() {
  console.log('=== INICIANDO PROCESSADOR OCR DE CARTAS ===');
  
  if (!fs.existsSync(SCANS_DIR)) {
    console.error(`Erro: Pasta '${SCANS_DIR}' não existe.`);
    return;
  }

  // List all files in scans directory
  const files = fs.readdirSync(SCANS_DIR);
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];
  const imageFiles = files.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log('Nenhuma imagem encontrada na pasta ./scans.');
    console.log('Coloque suas fotos (.png, .jpg, .jpeg) lá e tente novamente.');
    return;
  }

  console.log(`Encontradas ${imageFiles.length} imagens para processar.`);
  const importedCards = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const imagePath = path.join(SCANS_DIR, file);
    console.log(`\n[${i + 1}/${imageFiles.length}] Processando arquivo: ${file}...`);
    
    try {
      const { data: { text } } = await Tesseract.recognize(
        imagePath,
        'por',
        {
          logger: m => {
            if (m.status === 'recognizing') {
              const progress = Math.round(m.progress * 100);
              if (progress % 25 === 0) {
                console.log(`   OCR Progresso: ${progress}%`);
              }
            }
          }
        }
      );

      // Clean lines
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1); // Ignore empty or single-character garbage lines

      if (lines.length < 6) {
        console.warn(`   [AVISO] Linhas insuficientes extraídas (${lines.length}/6) no arquivo ${file}.`);
        console.warn('   Texto bruto reconhecido:');
        console.warn('   ---');
        console.warn(lines.map((l, idx) => `   ${idx + 1}: ${l}`).join('\n'));
        console.warn('   ---');
        console.warn('   Ignorando esta carta. Tente tirar a foto com melhor foco ou iluminação.');
        continue;
      }

      const word = lines[0];
      const forbidden = lines.slice(1, 6);

      console.log(`   [SUCESSO] Palavra extraída: "${word}"`);
      console.log(`   Proibidas: ${forbidden.join(', ')}`);

      importedCards.push({
        id: `imported_${Date.now()}_${i}`,
        word: word,
        forbidden: forbidden,
        custom: true
      });

    } catch (err) {
      console.error(`   [ERRO] Falha ao processar OCR no arquivo ${file}:`, err);
    }
  }

  // Write results to src/data/importedCards.ts
  const fileContent = `import { Card } from './defaultCards';

export const importedCards: Card[] = ${JSON.stringify(importedCards, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
  
  console.log('\n=== PROCESSAMENTO CONCLUÍDO! ===');
  console.log(`Total de cartas importadas com sucesso: ${importedCards.length}`);
  console.log(`Arquivo salvo em: src/data/importedCards.ts`);
}

runOCR();
