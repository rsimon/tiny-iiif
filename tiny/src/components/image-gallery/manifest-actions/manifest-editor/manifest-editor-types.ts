export type LanguageMap = Record<string, string[]>;

export interface LabelValuePair {

  label: LanguageMap;

  value: LanguageMap;

}

export interface AgentResource {

  id: string;
  
  type: 'Agent';

  label: LanguageMap;

  homepage?: { id: string; type: string; label: LanguageMap; format: string }[];

  logo?: { id: string; type: string; format?: string; width?: number; height?: number }[];

}


export interface IIIFDescriptiveProperties {

  label: LanguageMap;

  metadata: LabelValuePair[];

  summary: LanguageMap;

  requiredStatement?: LabelValuePair;

  rights?: string;

  provider: AgentResource[];

  navDate?: string;

}

export const RIGHTS_OPTIONS = [
  { value: '', label: 'No rights statement' },
  { value: 'http://creativecommons.org/licenses/by/4.0/', label: 'CC BY 4.0' },
  { value: 'http://creativecommons.org/licenses/by-sa/4.0/', label: 'CC BY-SA 4.0' },
  { value: 'http://creativecommons.org/licenses/by-nd/4.0/', label: 'CC BY-ND 4.0' },
  { value: 'http://creativecommons.org/licenses/by-nc/4.0/', label: 'CC BY-NC 4.0' },
  { value: 'http://creativecommons.org/licenses/by-nc-sa/4.0/', label: 'CC BY-NC-SA 4.0' },
  { value: 'http://creativecommons.org/licenses/by-nc-nd/4.0/', label: 'CC BY-NC-ND 4.0' },
  { value: 'http://creativecommons.org/publicdomain/zero/1.0/', label: 'CC0 1.0 (Public Domain)' },
  { value: 'http://rightsstatements.org/vocab/InC/1.0/', label: 'In Copyright' },
  { value: 'http://rightsstatements.org/vocab/NoC-US/1.0/', label: 'No Copyright — US' },
  { value: 'http://rightsstatements.org/vocab/CNE/1.0/', label: 'Copyright Not Evaluated' },
] as const;

export const createDefaultDescriptiveProperties = (): IIIFDescriptiveProperties => ({
  label: { en: [''] },
  metadata: [],
  summary: { en: [''] },
  requiredStatement: undefined,
  rights: '',
  provider: [],
  navDate: undefined,
});