/**
 * AWS Bedrock Service Usage Examples
 * 
 * This file demonstrates how to use the bedrock service with context files.
 * It is not imported by the app, but serves as documentation and reference.
 */

import { bedrockService } from './bedrock';

// Example 1: Initialize all contexts
export function initializeBedrockContexts() {
  bedrockService.initializeContexts();
  console.log('All contexts loaded successfully');
}

// Example 2: Get a specific context
export function getInsuranceContext() {
  bedrockService.initializeContexts();
  const context = bedrockService.getContext('insurance-plans');
  
  if (context) {
    console.log('Context type:', context.type);
    console.log('Context metadata:', context.metadata);
    console.log('Content preview:', context.content.substring(0, 200) + '...');
  }
  
  return context;
}

// Example 3: Get all medical-related contexts
export function getMedicalContexts() {
  bedrockService.initializeContexts();
  const contexts = bedrockService.getContextsByType('medical');
  
  console.log(`Found ${contexts.length} medical contexts`);
  return contexts;
}

// Example 4: Build a prompt for insurance coverage question
export function buildInsuranceCoveragePrompt(userQuestion: string) {
  bedrockService.initializeContexts();
  
  const prompt = bedrockService.buildPromptWithContext(
    userQuestion,
    ['insurance']
  );
  
  return prompt;
}

// Example 5: Build a prompt for symptom triage
export function buildTriagePrompt(symptoms: string[], description?: string) {
  bedrockService.initializeContexts();
  
  const userQuery = `
Usuario presenta los siguientes síntomas: ${symptoms.join(', ')}
${description ? `\nDescripción adicional: ${description}` : ''}

Por favor, evalúa la urgencia y recomienda el canal de atención apropiado.
  `.trim();
  
  const prompt = bedrockService.buildPromptWithContext(
    userQuery,
    ['medical', 'emergency']
  );
  
  return prompt;
}

// Example 6: Build a prompt for medication adherence
export function buildMedicationAdherencePrompt(
  medicationName: string,
  adherencePercentage: number
) {
  bedrockService.initializeContexts();
  
  const userQuery = `
El usuario está tomando ${medicationName} con una adherencia del ${adherencePercentage}%.
¿Qué recomendaciones puedes dar para mejorar la adherencia?
  `.trim();
  
  const prompt = bedrockService.buildPromptWithContext(
    userQuery,
    ['treatments']
  );
  
  return prompt;
}

// Example 7: Build a comprehensive prompt with all contexts
export function buildComprehensivePrompt(userQuestion: string) {
  bedrockService.initializeContexts();
  
  // Get all contexts
  const prompt = bedrockService.buildPromptWithContext(userQuestion);
  
  return prompt;
}

// Example 8: Get all loaded contexts
export function listAllContexts() {
  bedrockService.initializeContexts();
  
  const allContexts = bedrockService.getAllContexts();
  
  console.log(`Total contexts loaded: ${allContexts.length}`);
  allContexts.forEach(context => {
    console.log(`- ${context.metadata?.name || 'Unknown'} (${context.type})`);
  });
  
  return allContexts;
}

// Example 9: Clear all contexts (useful for testing)
export function clearAllContexts() {
  bedrockService.clearContexts();
  console.log('All contexts cleared');
}

// Example 10: Build a wellness coaching prompt
export function buildWellnessCoachingPrompt(
  wellnessScore: number,
  concerns: string[]
) {
  bedrockService.initializeContexts();
  
  const userQuery = `
El usuario tiene un índice de bienestar de ${wellnessScore}/100.
Áreas de preocupación: ${concerns.join(', ')}

Proporciona recomendaciones personalizadas para mejorar su bienestar.
  `.trim();
  
  const prompt = bedrockService.buildPromptWithContext(
    userQuery,
    ['wellness']
  );
  
  return prompt;
}

// Example usage scenarios:

/**
 * Scenario 1: User asks about their insurance coverage
 */
export const scenario1Example = () => {
  const prompt = buildInsuranceCoveragePrompt(
    '¿Qué cubre mi plan para consultas de telemedicina?'
  );
  console.log('Prompt for Bedrock API:', prompt);
};

/**
 * Scenario 2: User reports symptoms for triage
 */
export const scenario2Example = () => {
  const prompt = buildTriagePrompt(
    ['dolor de cabeza', 'fiebre', 'fatiga'],
    'Los síntomas comenzaron hace 2 días'
  );
  console.log('Triage prompt:', prompt);
};

/**
 * Scenario 3: User needs help with medication adherence
 */
export const scenario3Example = () => {
  const prompt = buildMedicationAdherencePrompt('Metformina', 65);
  console.log('Adherence coaching prompt:', prompt);
};

/**
 * Scenario 4: User asks for wellness advice
 */
export const scenario4Example = () => {
  const prompt = buildWellnessCoachingPrompt(55, [
    'Poco ejercicio',
    'Sueño irregular',
    'Estrés laboral'
  ]);
  console.log('Wellness coaching prompt:', prompt);
};

// Note: This file is for documentation purposes only.
// In production, you would integrate these prompts with your AWS Bedrock API calls.
