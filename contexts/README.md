# RIMAC Context Files for AWS Bedrock

This directory contains context files that provide domain-specific knowledge for AWS Bedrock AI service integration.

## Overview

These context files contain comprehensive information about RIMAC's health insurance services, medical offerings, and patient care programs. They are designed to be used with AWS Bedrock to power AI-driven features such as:

- Intelligent symptom triage
- Insurance benefit explanations
- Treatment recommendations
- Wellness coaching
- Emergency guidance

## Context Files

### 1. Insurance Plans (`insurance-plans.ts`)
**Type:** `insurance`

Contains information about:
- Available insurance plans (Premium, Plus, Basic)
- Coverage details and limits
- Copayments and deductibles
- Benefits by plan type
- Network of providers
- Claims process
- Policy information

**Use cases:**
- Explaining plan benefits to users
- Comparing coverage options
- Answering questions about copays and coverage
- Helping users understand their policy

### 2. Medical Services (`medical-services.ts`)
**Type:** `medical`

Contains information about:
- Triage system (symptom classification)
- Appointment scheduling
- Telemedicine services
- Emergency protocols
- Preventive care programs
- Specialist referrals

**Use cases:**
- Symptom triage and urgency assessment
- Scheduling appropriate appointments
- Recommending telemedicine vs. in-person visits
- Preventive care recommendations

### 3. Wellness & Mental Health (`wellness.ts`)
**Type:** `wellness`

Contains information about:
- Wellness index calculation
- Mental health services
- Physical activity tracking
- Sleep health
- Stress management
- Nutrition guidance
- Lifestyle programs

**Use cases:**
- Wellness score interpretation
- Mental health support recommendations
- Lifestyle coaching
- Stress management advice
- Goal setting and tracking

### 4. Treatments & Medications (`treatments.ts`)
**Type:** `treatments`

Contains information about:
- Medication adherence tracking
- Chronic disease management
- Medication coverage by plan
- Pharmacy services
- Drug interactions and safety
- Treatment plans

**Use cases:**
- Medication reminders and education
- Adherence improvement strategies
- Understanding medication coverage
- Drug interaction warnings
- Treatment plan explanations

### 5. Emergency Services (`emergency.ts`)
**Type:** `emergency`

Contains information about:
- Emergency situation recognition
- When to call emergency services
- Ambulance services
- Emergency room coverage
- Crisis response protocols
- International emergency coverage

**Use cases:**
- Identifying urgent vs. emergency situations
- Emergency response guidance
- Crisis intervention support
- Post-emergency care coordination

## Usage

### Basic Usage

```typescript
import { bedrockService } from '../services/bedrock';

// Initialize all contexts
bedrockService.initializeContexts();

// Get a specific context
const insuranceContext = bedrockService.getContext('insurance-plans');

// Get contexts by type
const medicalContexts = bedrockService.getContextsByType('medical');

// Build a prompt with relevant context
const prompt = bedrockService.buildPromptWithContext(
  'What does my plan cover for telemedicine?',
  ['insurance', 'medical']
);
```

### Integration with AWS Bedrock

```typescript
// Example: Using context with AWS Bedrock API call
import { bedrockService } from '../services/bedrock';

async function askBedrockWithContext(userQuery: string) {
  // Initialize contexts if not already done
  bedrockService.initializeContexts();
  
  // Build prompt with relevant contexts
  const prompt = bedrockService.buildPromptWithContext(
    userQuery,
    ['insurance', 'medical', 'wellness']
  );
  
  // Call AWS Bedrock API (implementation depends on your backend)
  // const response = await callBedrockAPI(prompt);
  
  return prompt;
}
```

### Context Selection Strategy

Choose contexts based on the user's query intent:

| Query Type | Recommended Contexts |
|-----------|---------------------|
| Plan benefits, coverage questions | `insurance` |
| Symptoms, appointments | `medical` |
| Mental health, lifestyle | `wellness` |
| Medications, adherence | `treatments` |
| Urgent situations | `emergency` |
| General health questions | `medical`, `wellness` |
| Comprehensive assistance | All contexts |

## Customization

### Adding New Context

To add a new context file:

1. Create a new TypeScript file in this directory
2. Export a context string constant
3. Add metadata to `contexts/index.ts`
4. Update `BedrockService.initializeContexts()` in `services/bedrock.ts`
5. Update the `BedrockContext` type if adding a new type

### Updating Existing Context

Context files can be updated to:
- Add new information
- Update policies or procedures
- Reflect changes in services
- Improve clarity and detail

Simply edit the relevant context file and the changes will be automatically picked up when contexts are reinitialized.

## Best Practices

1. **Context Selection**: Only load contexts relevant to the user's query to optimize token usage
2. **Regular Updates**: Keep context files up-to-date with current policies and services
3. **Clear Formatting**: Use clear headings and structure for easy parsing
4. **Factual Content**: Ensure all information is accurate and verified
5. **User Privacy**: Never include actual patient data in context files
6. **Multilingual**: Consider adding Spanish translations for better user experience

## Context File Format

Context files use Markdown format with:
- Clear hierarchical headings (`#`, `##`, `###`)
- Bullet points for lists
- Bold for emphasis
- Code blocks for examples
- Tables for structured data

This format is easily parseable by LLMs and provides good structure for information retrieval.

## Security Considerations

- Context files contain general information only
- No patient-specific data should be included
- No API keys or credentials
- Regular security reviews recommended
- Access control should be implemented at the backend level

## Maintenance

Context files should be reviewed and updated:
- Quarterly for general accuracy
- Immediately when policies change
- When new services are added
- Based on user feedback and common questions

## Support

For questions about context files or AWS Bedrock integration:
- Contact: RIMAC Development Team
- Documentation: [Internal Wiki]
- API Documentation: [AWS Bedrock Docs]
