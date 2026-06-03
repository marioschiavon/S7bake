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
}

export interface WorkflowNode {
  id: string;
  type: 'ingredients' | 'instruction' | 'timer';
  content?: string;
  duration?: number; // in seconds for timer
  ingredients?: RecipeIngredient[]; // for ingredients node
}

export interface Recipe {
  id: string;
  name: string;
  categoryId: string;
  yield: number;
  yieldUnit: string;
  prepTimeMinutes: number;
  nodes: WorkflowNode[];
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Pães' },
  { id: '2', name: 'Bolos' },
  { id: '3', name: 'Marmitas' },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Farinha de Trigo Anaconda', packagePrice: 24.90, packageSize: 5000, unit: 'g' },
  { id: 'i2', name: 'Fermento Biológico Seco', packagePrice: 3.95, packageSize: 10, unit: 'g' },
  { id: 'i3', name: 'Água', packagePrice: 0, packageSize: 1000, unit: 'ml' },
  { id: 'i4', name: 'Sal Refinado', packagePrice: 2.50, packageSize: 1000, unit: 'g' },
  { id: 'i5', name: 'Açúcar Refinado', packagePrice: 4.50, packageSize: 1000, unit: 'g' },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Pão Caseiro Tradicional',
    categoryId: '1',
    yield: 2,
    yieldUnit: 'pães',
    prepTimeMinutes: 120,
    nodes: [
      {
        id: 'n1',
        type: 'ingredients',
        ingredients: [
          { ingredientId: 'i1', quantity: 1000 },
          { ingredientId: 'i2', quantity: 10 },
          { ingredientId: 'i5', quantity: 50 },
          { ingredientId: 'i4', quantity: 20 },
          { ingredientId: 'i3', quantity: 550 },
        ]
      },
      {
        id: 'n2',
        type: 'instruction',
        content: 'Misture todos os ingredientes secos em uma tigela grande.'
      },
      {
        id: 'n3',
        type: 'instruction',
        content: 'Adicione a água aos poucos e sove por 10 a 15 minutos até a massa ficar lisa e elástica.'
      },
      {
        id: 'n4',
        type: 'timer',
        content: 'Deixe a massa descansar coberta e dobrar de volume (Fermentação).',
        duration: 3600
      },
      {
        id: 'n5',
        type: 'instruction',
        content: 'Divida a massa em 2 partes iguais, modele os pães e coloque em formas untadas.'
      },
      {
        id: 'n6',
        type: 'timer',
        content: 'Segunda fermentação na forma.',
        duration: 1800
      },
      {
        id: 'n7',
        type: 'instruction',
        content: 'Asse em forno pré-aquecido a 200°C até dourar.'
      },
      {
        id: 'n8',
        type: 'timer',
        content: 'Tempo de Forno',
        duration: 2400
      }
    ]
  }
];
