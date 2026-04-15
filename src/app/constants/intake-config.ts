import * as intakeConfigJson from './intake-config.json';

type IntakeConfig = {
  caseTypeByDrug: Record<string, string[]>;
};

export const intakeConfig: IntakeConfig = intakeConfigJson as IntakeConfig;

export const CASE_TYPE_BY_DRUG = intakeConfig.caseTypeByDrug;

export const CASE_TYPES = Object.keys(CASE_TYPE_BY_DRUG);

export function getDrugNamesByCaseType(caseType: string): string[] {
  return CASE_TYPE_BY_DRUG[caseType] ?? [];
}