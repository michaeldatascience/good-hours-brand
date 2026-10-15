export const needSections = [
  { id: 'after-training', need: 'after-training', label: 'After training' },
  { id: 'long-day', need: 'long-day', label: 'After a long day' },
  { id: 'before-bed', need: 'before-bed', label: 'Before bed' },
  { id: 'travel', need: 'travel', label: 'In the bag' },
] as const;

export const categoryLabel: Record<string, string> = {
  'red-light': 'Red light',
  massage: 'Massage',
  sleep: 'Sleep',
};

export const categoryOrder = ['red-light', 'massage', 'sleep'] as const;
