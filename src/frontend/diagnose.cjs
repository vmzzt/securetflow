#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO COMPLETO - SECURET FLOW SSC FRONTEND\n');

// Verificar arquivos essenciais
const essentialFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'src/routes/index.tsx',
  'src/pages/Login/index.tsx',
  'src/pages/Dashboard/index.tsx',
  'src/components/layout/Layout.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Sidebar.tsx',
  'Dockerfile',
  'nginx.conf'
];

console.log('📋 VERIFICANDO ARQUIVOS ESSENCIAIS:\n');

let errors = 0;
let warnings = 0;

essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      console.log(`⚠️  ${file} - ARQUIVO VAZIO`);
      warnings++;
    } else {
      console.log(`✅ ${file} - OK (${stats.size} bytes)`);
    }
  } else {
    console.log(`❌ ${file} - NÃO ENCONTRADO`);
    errors++;
  }
});

// Verificar build
console.log('\n🏗️  VERIFICANDO BUILD:\n');

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  const distStats = fs.statSync(distPath);
  console.log(`✅ Pasta dist existe (${distStats.size} bytes)`);
  
  const distFiles = fs.readdirSync(distPath);
  console.log(`✅ ${distFiles.length} arquivos na pasta dist`);
  
  if (distFiles.includes('index.html')) {
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    if (indexHtml.includes('<div id="root"></div>')) {
      console.log('✅ index.html contém div#root');
    } else {
      console.log('❌ index.html não contém div#root');
      errors++;
    }
  } else {
    console.log('❌ index.html não encontrado na pasta dist');
    errors++;
  }
} else {
  console.log('❌ Pasta dist não encontrada');
  errors++;
}

// Verificar dependências
console.log('\n📦 VERIFICANDO DEPENDÊNCIAS:\n');

const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Verificar dependências essenciais
    const essentialDeps = ['react', 'react-dom', 'react-router-dom', 'zustand', 'axios'];
    const missingDeps = essentialDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
      console.log('✅ Todas as dependências essenciais estão presentes');
    } else {
      console.log(`❌ Dependências faltando: ${missingDeps.join(', ')}`);
      errors++;
    }
    
    // Verificar devDependencies essenciais
    const essentialDevDeps = ['@vitejs/plugin-react', 'vite', 'typescript', 'terser'];
    const missingDevDeps = essentialDevDeps.filter(dep => !packageJson.devDependencies[dep]);
    
    if (missingDevDeps.length === 0) {
      console.log('✅ Todas as devDependencies essenciais estão presentes');
    } else {
      console.log(`❌ DevDependencies faltando: ${missingDevDeps.join(', ')}`);
      errors++;
    }
    
  } catch (error) {
    console.log('❌ Erro ao ler package.json:', error.message);
    errors++;
  }
} else {
  console.log('❌ package.json não encontrado');
  errors++;
}

// Verificar configurações
console.log('\n⚙️  VERIFICANDO CONFIGURAÇÕES:\n');

// Verificar vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  if (viteConfig.includes('@vitejs/plugin-react')) {
    console.log('✅ vite.config.ts configurado corretamente');
  } else {
    console.log('❌ vite.config.ts não tem plugin-react');
    errors++;
  }
} else {
  console.log('❌ vite.config.ts não encontrado');
  errors++;
}

// Verificar tsconfig.json
const tsConfigPath = path.join(__dirname, 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  try {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    if (tsConfig.compilerOptions && tsConfig.compilerOptions.jsx === 'react-jsx') {
      console.log('✅ tsconfig.json configurado corretamente');
    } else {
      console.log('❌ tsconfig.json não tem jsx configurado');
      errors++;
    }
  } catch (error) {
    console.log('❌ Erro ao ler tsconfig.json:', error.message);
    errors++;
  }
} else {
  console.log('❌ tsconfig.json não encontrado');
  errors++;
}

// Verificar Dockerfile
const dockerfilePath = path.join(__dirname, 'Dockerfile');
if (fs.existsSync(dockerfilePath)) {
  const dockerfile = fs.readFileSync(dockerfilePath, 'utf8');
  if (dockerfile.includes('npm ci') && dockerfile.includes('npm run build')) {
    console.log('✅ Dockerfile configurado corretamente');
  } else {
    console.log('❌ Dockerfile não tem comandos de build corretos');
    errors++;
  }
} else {
  console.log('❌ Dockerfile não encontrado');
  errors++;
}

// Verificar nginx.conf
const nginxPath = path.join(__dirname, 'nginx.conf');
if (fs.existsSync(nginxPath)) {
  const nginx = fs.readFileSync(nginxPath, 'utf8');
  if (nginx.includes('try_files $uri $uri/ /index.html')) {
    console.log('✅ nginx.conf configurado para SPA');
  } else {
    console.log('❌ nginx.conf não tem configuração para SPA');
    errors++;
  }
} else {
  console.log('❌ nginx.conf não encontrado');
  errors++;
}

// Resultado final
console.log('\n📊 RESULTADO DO DIAGNÓSTICO:');
console.log(`✅ Arquivos OK: ${essentialFiles.length - errors - warnings}`);
console.log(`⚠️  Avisos: ${warnings}`);
console.log(`❌ Erros: ${errors}`);

if (errors === 0) {
  console.log('\n🎉 DIAGNÓSTICO PASSOU! O frontend está pronto.');
  console.log('\n🚀 PARA TESTAR:');
  console.log('1. cd .. && docker-compose up --build');
  console.log('2. Acesse http://localhost');
  console.log('3. Verifique se a aplicação carrega');
} else {
  console.log('\n❌ DIAGNÓSTICO FALHOU! Corrija os erros antes de continuar.');
}

process.exit(errors > 0 ? 1 : 0); 