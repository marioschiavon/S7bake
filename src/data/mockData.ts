export interface Ingredient {
  id: string;
  name: string;
  packagePrice: number;
  packageSize: number;
  unit: 'g' | 'ml' | 'un';
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  measureUnit?: string;
  measureAmount?: number;
}

export const MEASURE_UNITS = [
  { id: 'g', name: 'Gramas (g)', type: 'base' },
  { id: 'ml', name: 'Mililitros (ml)', type: 'base' },
  { id: 'un', name: 'Unidade (un)', type: 'base' },
  { id: 'xicara', name: 'Xícara (240g/ml)', type: 'household', factor: 240 },
  { id: 'copo', name: 'Copo (200g/ml)', type: 'household', factor: 200 },
  { id: 'colher_sopa', name: 'Colher de Sopa (15g/ml)', type: 'household', factor: 15 },
  { id: 'colher_sobremesa', name: 'Colher de Sobremesa (10g/ml)', type: 'household', factor: 10 },
  { id: 'colher_cha', name: 'Colher de Chá (5g/ml)', type: 'household', factor: 5 },
  { id: 'colher_cafe', name: 'Colher de Café (2.5g/ml)', type: 'household', factor: 2.5 },
];

export interface WorkflowNode {
  id: string;
  type: 'ingredients' | 'instruction' | 'timer';
  content?: string;
  duration?: number; // in seconds for timer
  ingredients?: RecipeIngredient[]; // for ingredients node
  linkedIngredients?: string[]; // ingredientIds linked to this step
}

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  yield: number;
  yieldUnit: string;
  prepTimeMinutes: number;
  ingredients: RecipeIngredient[];
  nodes: WorkflowNode[];
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
}
