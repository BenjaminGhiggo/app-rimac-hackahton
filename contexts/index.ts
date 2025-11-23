/**
 * Context Files Index
 * Exports all context files for AWS Bedrock service
 */

export { insurancePlansContext } from './insurance-plans';
export { medicalServicesContext } from './medical-services';
export { wellnessContext } from './wellness';
export { treatmentsContext } from './treatments';
export { emergencyContext } from './emergency';

/**
 * Context metadata for easy loading
 */
export const contextMetadata = {
  insurance: {
    id: 'insurance-plans',
    type: 'insurance' as const,
    name: 'Insurance Plans & Benefits',
    description: 'Information about RIMAC health insurance plans, coverage, and policies',
  },
  medical: {
    id: 'medical-services',
    type: 'medical' as const,
    name: 'Medical Services',
    description: 'Triage system, appointments, telemedicine, and preventive care',
  },
  wellness: {
    id: 'wellness',
    type: 'wellness' as const,
    name: 'Wellness & Mental Health',
    description: 'Wellness programs, mental health services, and lifestyle support',
  },
  treatments: {
    id: 'treatments',
    type: 'treatments' as const,
    name: 'Medications & Treatments',
    description: 'Medication management, treatment adherence, and pharmaceutical services',
  },
  emergency: {
    id: 'emergency',
    type: 'emergency' as const,
    name: 'Emergency Services',
    description: 'Emergency care, urgent situations, and immediate response protocols',
  },
};
