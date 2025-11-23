/**
 * Verification script for AWS Bedrock Service
 * Run this to verify that all context files are loaded correctly
 */

import { bedrockService } from '../services/bedrock';

console.log('🔍 Verifying AWS Bedrock Service...\n');

// Initialize contexts
console.log('📦 Loading contexts...');
bedrockService.initializeContexts();

// Get all contexts
const allContexts = bedrockService.getAllContexts();
console.log(`✅ Loaded ${allContexts.length} context files\n`);

// Verify each context
console.log('🔎 Verifying context contents:\n');

const expectedContexts = [
  { id: 'insurance-plans', type: 'insurance', keywords: ['RIMAC', 'Plan Premium', 'cobertura'] },
  { id: 'medical-services', type: 'medical', keywords: ['Triaje', 'Telemedicina', '🟥'] },
  { id: 'wellness', type: 'wellness', keywords: ['Índice de Bienestar', 'Mental Health'] },
  { id: 'treatments', type: 'treatments', keywords: ['Medication Adherence', 'adherencia'] },
  { id: 'emergency', type: 'emergency', keywords: ['Emergency', 'emergencia', '911'] },
];

let allPassed = true;

expectedContexts.forEach(expected => {
  const context = bedrockService.getContext(expected.id);
  
  if (!context) {
    console.log(`❌ Context "${expected.id}" not found`);
    allPassed = false;
    return;
  }

  if (context.type !== expected.type) {
    console.log(`❌ Context "${expected.id}" has wrong type: ${context.type} (expected: ${expected.type})`);
    allPassed = false;
    return;
  }

  const missingKeywords = expected.keywords.filter(keyword => !context.content.includes(keyword));
  
  if (missingKeywords.length > 0) {
    console.log(`⚠️  Context "${expected.id}" is missing keywords: ${missingKeywords.join(', ')}`);
    allPassed = false;
    return;
  }

  console.log(`✅ ${expected.id} (${context.type})`);
});

console.log('\n🧪 Testing prompt building:\n');

// Test building a prompt with specific context
const insurancePrompt = bedrockService.buildPromptWithContext(
  '¿Qué cubre mi plan para telemedicina?',
  ['insurance']
);

if (insurancePrompt.includes('<context type="insurance">') && 
    insurancePrompt.includes('<user_query>')) {
  console.log('✅ Insurance prompt building works');
} else {
  console.log('❌ Insurance prompt building failed');
  allPassed = false;
}

// Test building a prompt with multiple contexts
const multiContextPrompt = bedrockService.buildPromptWithContext(
  'Tengo síntomas de emergencia',
  ['medical', 'emergency']
);

if (multiContextPrompt.includes('<context type="medical">') && 
    multiContextPrompt.includes('<context type="emergency">')) {
  console.log('✅ Multi-context prompt building works');
} else {
  console.log('❌ Multi-context prompt building failed');
  allPassed = false;
}

// Test getting contexts by type
const medicalContexts = bedrockService.getContextsByType('medical');
if (medicalContexts.length > 0 && medicalContexts[0].type === 'medical') {
  console.log('✅ Getting contexts by type works');
} else {
  console.log('❌ Getting contexts by type failed');
  allPassed = false;
}

// Final result
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ All verifications passed! Bedrock service is working correctly.');
} else {
  console.log('❌ Some verifications failed. Please review the output above.');
  process.exit(1);
}
