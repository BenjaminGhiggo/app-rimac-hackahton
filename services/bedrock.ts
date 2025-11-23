/**
 * AWS Bedrock Service
 * Manages context files and AI-powered features for the RIMAC health insurance app
 */

import {
  insurancePlansContext,
  medicalServicesContext,
  wellnessContext,
  treatmentsContext,
  emergencyContext,
  contextMetadata,
} from '../contexts';

export interface BedrockContext {
  type: 'insurance' | 'medical' | 'wellness' | 'treatments' | 'emergency';
  content: string;
  metadata?: Record<string, any>;
}

class BedrockService {
  private contexts: Map<string, BedrockContext> = new Map();
  private initialized = false;

  /**
   * Initialize and load all context files
   */
  initializeContexts(): void {
    if (this.initialized) {
      return;
    }

    // Load insurance plans context
    this.loadContext(contextMetadata.insurance.id, {
      type: contextMetadata.insurance.type,
      content: insurancePlansContext,
      metadata: {
        name: contextMetadata.insurance.name,
        description: contextMetadata.insurance.description,
      },
    });

    // Load medical services context
    this.loadContext(contextMetadata.medical.id, {
      type: contextMetadata.medical.type,
      content: medicalServicesContext,
      metadata: {
        name: contextMetadata.medical.name,
        description: contextMetadata.medical.description,
      },
    });

    // Load wellness context
    this.loadContext(contextMetadata.wellness.id, {
      type: contextMetadata.wellness.type,
      content: wellnessContext,
      metadata: {
        name: contextMetadata.wellness.name,
        description: contextMetadata.wellness.description,
      },
    });

    // Load treatments context
    this.loadContext(contextMetadata.treatments.id, {
      type: contextMetadata.treatments.type,
      content: treatmentsContext,
      metadata: {
        name: contextMetadata.treatments.name,
        description: contextMetadata.treatments.description,
      },
    });

    // Load emergency context
    this.loadContext(contextMetadata.emergency.id, {
      type: contextMetadata.emergency.type,
      content: emergencyContext,
      metadata: {
        name: contextMetadata.emergency.name,
        description: contextMetadata.emergency.description,
      },
    });

    this.initialized = true;
  }

  /**
   * Load a context file for use with AWS Bedrock
   */
  loadContext(contextId: string, context: BedrockContext): void {
    this.contexts.set(contextId, context);
  }

  /**
   * Get a specific context by ID
   */
  getContext(contextId: string): BedrockContext | undefined {
    return this.contexts.get(contextId);
  }

  /**
   * Get all contexts of a specific type
   */
  getContextsByType(type: BedrockContext['type']): BedrockContext[] {
    return Array.from(this.contexts.values()).filter(ctx => ctx.type === type);
  }

  /**
   * Get all loaded contexts
   */
  getAllContexts(): BedrockContext[] {
    return Array.from(this.contexts.values());
  }

  /**
   * Build a prompt with relevant context for AWS Bedrock
   */
  buildPromptWithContext(
    userQuery: string,
    contextTypes?: BedrockContext['type'][]
  ): string {
    const relevantContexts = contextTypes
      ? this.getAllContexts().filter(ctx => contextTypes.includes(ctx.type))
      : this.getAllContexts();

    const contextContent = relevantContexts
      .map(ctx => `<context type="${ctx.type}">\n${ctx.content}\n</context>`)
      .join('\n\n');

    return `${contextContent}\n\n<user_query>\n${userQuery}\n</user_query>`;
  }

  /**
   * Clear all loaded contexts
   */
  clearContexts(): void {
    this.contexts.clear();
  }
}

export const bedrockService = new BedrockService();
