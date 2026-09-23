const how = { id: 'how', label: 'Как это работает' } as const;
const features = { id: 'features', label: 'Возможности' } as const;
const faq = { id: 'faq', label: 'FAQ' } as const;

export const landingSection = { how, features, faq };

export const LANDING_SECTIONS = [how, features, faq] as const;
