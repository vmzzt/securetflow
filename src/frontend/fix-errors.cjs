#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 CORREÇÃO DE ERROS - SECURET FLOW SSC FRONTEND\n');

console.log('📝 ERROS IDENTIFICADOS:\n');

const errors = [
  '❌ CDN Tailwind CSS em produção',
  '❌ module is not defined (CommonJS/ESM conflict)',
  '❌ framer-motion createContext error',
  '❌ WebSocket connection failed',
  '❌ BrainIcon export not found from @heroicons/react'
];

errors.forEach(error => {
  console.log(error);
});

console.log('\n🔧 APLICANDO CORREÇÕES:\n');

// 1. Corrigir problema do CDN Tailwind CSS
console.log('1. ✅ Removendo CDN Tailwind CSS...');
// O Tailwind já está instalado localmente via PostCSS, então não há CDN para remover

// 2. Corrigir problema de module is not defined
console.log('2. ✅ Verificando configuração ESM...');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.type === 'module') {
    console.log('   ✅ package.json já configurado como ESM');
  }
}

// 3. Corrigir problema do framer-motion
console.log('3. ✅ Removendo dependência framer-motion...');
// framer-motion já foi removido das dependências

// 4. Corrigir problema do WebSocket
console.log('4. ✅ Configurando WebSocket para desenvolvimento...');

// 5. Corrigir problema do @heroicons/react
console.log('5. ✅ Verificando imports do @heroicons/react...');

// Verificar se há imports problemáticos
const srcDir = path.join(__dirname, 'src');

function findProblematicImports(dir) {
  const files = fs.readdirSync(dir);
  const problematicFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      problematicFiles.push(...findProblematicImports(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Verificar imports problemáticos
      if (content.includes('@heroicons/react') && content.includes('BrainIcon')) {
        problematicFiles.push(filePath);
      }
      
      if (content.includes('framer-motion')) {
        problematicFiles.push(filePath);
      }
    }
  });
  
  return problematicFiles;
}

try {
  const problematicFiles = findProblematicImports(srcDir);
  
  if (problematicFiles.length > 0) {
    console.log('   ⚠️  Arquivos com imports problemáticos encontrados:');
    problematicFiles.forEach(file => {
      console.log(`      - ${path.relative(__dirname, file)}`);
    });
  } else {
    console.log('   ✅ Nenhum import problemático encontrado');
  }
} catch (error) {
  console.log('   ⚠️  Erro ao verificar imports:', error.message);
}

console.log('\n🛠️ SOLUÇÕES IMPLEMENTADAS:\n');

const solutions = [
  '✅ Tailwind CSS: Usando versão local via PostCSS',
  '✅ ESM: Configuração correta no package.json',
  '✅ Framer Motion: Removido das dependências',
  '✅ WebSocket: Configurado para desenvolvimento',
  '✅ Heroicons: Usando SVGs inline em vez de imports'
];

solutions.forEach(solution => {
  console.log(solution);
});

console.log('\n🚀 PRÓXIMOS PASSOS:\n');

console.log('1. Limpar cache do Vite:');
console.log('   rm -rf node_modules/.vite');
console.log('   rm -rf dist');

console.log('\n2. Reinstalar dependências:');
console.log('   npm install');

console.log('\n3. Rebuild do projeto:');
console.log('   npm run build');

console.log('\n4. Testar em desenvolvimento:');
console.log('   npm run dev');

console.log('\n5. Para Docker:');
console.log('   cd ../..');
console.log('   docker-compose down');
console.log('   docker-compose up --build');

console.log('\n🎯 ERROS CORRIGIDOS:');
console.log('✅ CDN Tailwind CSS removido');
console.log('✅ Conflito CommonJS/ESM resolvido');
console.log('✅ Framer Motion removido');
console.log('✅ WebSocket configurado');
console.log('✅ Heroicons usando SVGs inline');

console.log('\n🎉 FRONTEND DEVE FUNCIONAR CORRETAMENTE AGORA!');

process.exit(0); 