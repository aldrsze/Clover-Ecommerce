export const MENU_CATEGORIES = [
  { value: 'cold-beverages', label: 'Cold Beverages & Frappes' },
  { value: 'breakfast',      label: 'Breakfast Plates & Omelettes' },
  { value: 'sandwiches',     label: 'Sandwiches & Flatbreads' },
  { value: 'pastries',       label: 'Pastries, Cookies & Cakes' },
];

export const MENU_PREFERENCES = [
  { value: 'sweet',   label: 'Sweet Treats' },
  { value: 'savory',  label: 'Savory Meals' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'meat',    label: 'Contains Meat' },
];

export const CATEGORY_LABEL = Object.fromEntries(
  MENU_CATEGORIES.map(c => [c.value, c.label])
);

export const PREF_LABEL = Object.fromEntries(
  MENU_PREFERENCES.map(p => [p.value, p.label])
);
