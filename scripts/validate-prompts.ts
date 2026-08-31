import { categories, prompts } from '../data/prompts';

const errors: string[] = [];
const expectedCatalogSize = 18;
const allowedTools = new Set(['ChatGPT', 'Claude', 'Midjourney', 'Stable Diffusion']);
const variablePattern = /{{\s*[a-zA-Z][a-zA-Z0-9_-]*\s*}}/g;

if (prompts.length !== expectedCatalogSize) {
  errors.push(`catalog contains ${prompts.length} prompts; expected ${expectedCatalogSize}`);
}

const ids = new Set<string>();
const categoryMap = new Map(categories.map((category) => [category.id, category]));

for (const prompt of prompts) {
  if (ids.has(prompt.id)) errors.push(`duplicate prompt id: ${prompt.id}`);
  ids.add(prompt.id);

  for (const field of ['title', 'description', 'content', 'category', 'subcategory'] as const) {
    if (!prompt[field]?.trim()) errors.push(`${prompt.id}: empty ${field}`);
  }

  if (!allowedTools.has(prompt.aiTool)) errors.push(`${prompt.id}: unsupported aiTool ${prompt.aiTool}`);

  const category = categoryMap.get(prompt.category);
  if (!category) {
    errors.push(`${prompt.id}: unknown category ${prompt.category}`);
  } else if (!category.subcategories.some((subcategory) => subcategory.id === prompt.subcategory)) {
    errors.push(`${prompt.id}: unknown subcategory ${prompt.category}/${prompt.subcategory}`);
  }

  const variables = (prompt.content.match(variablePattern) ?? []).map((match) => match.slice(2, -2).trim());
  const uniqueVariables = new Set(variables);
  if (uniqueVariables.size > 4) errors.push(`${prompt.id}: more than four variables`);
  if (variables.length !== uniqueVariables.size) errors.push(`${prompt.id}: repeated variable placeholder`);

  for (const variable of uniqueVariables) {
    if (!prompt.example) {
      errors.push(`${prompt.id}: variables require an explanatory example`);
    } else if (!prompt.example.toLowerCase().includes(variable.toLowerCase())) {
      errors.push(`${prompt.id}: variable {{${variable}}} is not explained by the example`);
    }
  }
}

for (const category of categories) {
  for (const subcategory of category.subcategories) {
    const actual = prompts.filter(
      (prompt) => prompt.category === category.id && prompt.subcategory === subcategory.id,
    ).length;
    if (actual !== subcategory.count) {
      errors.push(`${category.id}/${subcategory.id}: declared ${subcategory.count}, actual ${actual}`);
    }
  }
}

if (errors.length) {
  console.error(`Prompt catalog validation failed (${errors.length} error(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Prompt catalog validation passed: ${prompts.length} authored prompts, ${ids.size} unique ids.`);
