import { ConsentEntry, AllConsents } from './all-consents';

export { ConsentEntry, AllConsents };

/**
 * Get a specific consent (patient or physician) for a drug.
 */
export function getConsentByDrugAndType(
  drugId: string,
  type: 'patient' | 'physician'
): ConsentEntry | undefined {
  return AllConsents.find(c => c.drugId === drugId && c.type === type);
}

