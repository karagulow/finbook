const how = { id: 'how', label: 'Как это работает' } as const;
const plans = { id: 'plans', label: 'Цели' } as const;
const data = { id: 'data', label: 'Данные' } as const;
const features = { id: 'features', label: 'Возможности' } as const;
const faq = { id: 'faq', label: 'FAQ' } as const;

export const landingSection = { how, plans, data, features, faq };

export const LANDING_SECTIONS = [how, plans, data, features, faq] as const;
