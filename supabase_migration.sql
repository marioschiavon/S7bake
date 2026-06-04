-- ============================================================
-- S7bake Migration: add user_id + JSONB columns
-- Run this in the Supabase SQL Editor (once)
-- ============================================================

-- 1. bake_categories: add user_id
ALTER TABLE bake_categories
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. bake_recipes: add user_id + JSONB columns for ingredients & nodes
ALTER TABLE bake_recipes
  ADD COLUMN IF NOT EXISTS user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS ingredients jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS nodes       jsonb NOT NULL DEFAULT '[]';

-- 3. bake_ingredients: add user_id
ALTER TABLE bake_ingredients
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Indexes for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_bake_categories_user  ON bake_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_bake_recipes_user     ON bake_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_bake_ingredients_user ON bake_ingredients(user_id);

-- 5. Row Level Security (RLS) — enable and add policies
-- Categories
ALTER TABLE bake_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own categories" ON bake_categories;
CREATE POLICY "Users manage own categories" ON bake_categories
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Recipes
ALTER TABLE bake_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own recipes" ON bake_recipes;
CREATE POLICY "Users manage own recipes" ON bake_recipes
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ingredients
ALTER TABLE bake_ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own ingredients" ON bake_ingredients;
CREATE POLICY "Users manage own ingredients" ON bake_ingredients
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
