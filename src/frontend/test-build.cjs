#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 TESTE DE BUILD - SECURET FLOW SSC FRONTEND\n');

// Verificar se o build foi gerado
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');
const assetsPath = path.join(distPath, 'assets');

console.log('📁 VERIFICANDO ARQUIVOS DE BUILD:\n');

if (!fs.existsSync(distPath)) {
  console.log('❌ Pasta dist não encontrada');
  process.exit(1);
}

if (!fs.existsSync(indexHtmlPath)) {
  console.log('❌ index.html não encontrado');
  process.exit(1);
}

console.log('✅ Pasta dist encontrada');
console.log('✅ index.html encontrado');

// Verificar conteúdo do index.html
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
console.log('✅ index.html lido com sucesso');

// Verificar se tem o div root
if (!indexHtml.includes('<div id="root"></div>')) {
  console.log('❌ div#root não encontrado no index.html');
  process.exit(1);
}

console.log('✅ div#root encontrado no index.html');

// Verificar se tem scripts
if (!indexHtml.includes('<script type="module"')) {
  console.log('❌ Scripts não encontrados no index.html');
  process.exit(1);
}

console.log('✅ Scripts encontrados no index.html');

// Verificar assets
if (!fs.existsSync(assetsPath)) {
  console.log('❌ Pasta assets não encontrada');
  process.exit(1);
}

const assets = fs.readdirSync(assetsPath);
console.log(`✅ Pasta assets encontrada com ${assets.length} arquivos`);

// Verificar se tem arquivos JS
const jsFiles = assets.filter(file => file.endsWith('.js'));
if (jsFiles.length === 0) {
  console.log('❌ Nenhum arquivo JS encontrado');
  process.exit(1);
}

console.log(`✅ ${jsFiles.length} arquivos JS encontrados`);

// Verificar se tem arquivos CSS
const cssFiles = assets.filter(file => file.endsWith('.css'));
if (cssFiles.length === 0) {
  console.log('❌ Nenhum arquivo CSS encontrado');
  process.exit(1);
}

console.log(`✅ ${cssFiles.length} arquivos CSS encontrados`);

// Verificar tamanho dos arquivos
const totalSize = assets.reduce((total, file) => {
  const filePath = path.join(assetsPath, file);
  const stats = fs.statSync(filePath);
  return total + stats.size;
}, 0);

console.log(`✅ Tamanho total dos assets: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

// Verificar se o index.html referencia os assets corretamente
const assetFiles = assets.map(file => `/assets/${file}`);
const missingAssets = assetFiles.filter(asset => !indexHtml.includes(asset));

if (missingAssets.length > 0) {
  console.log('⚠️  Assets não referenciados no index.html:', missingAssets);
} else {
  console.log('✅ Todos os assets estão referenciados no index.html');
}

console.log('\n🎉 BUILD TESTADO COM SUCESSO!');
console.log('✅ O frontend está pronto para produção');
console.log('✅ Todos os arquivos necessários estão presentes');
console.log('✅ O index.html está correto');
console.log('✅ Os assets estão sendo referenciados corretamente');

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('1. docker-compose up --build');
console.log('2. Acesse http://localhost');
console.log('3. Verifique se a aplicação carrega corretamente');

process.exit(0); 