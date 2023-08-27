import Joi from 'joi';

export interface MetaData {
  checkbox: boolean;
}

export interface ListItem {
  title: string;
  metadata: MetaData;
}

export interface GroceryList {
  title: string;
  items: ListItem[];
  listId: string;
}

// Define the schema for a grocery list item
export const listItemSchema = Joi.object<ListItem>({
  title: Joi.string().required(),
  metadata: Joi.object<MetaData>({
    checkbox: Joi.boolean().required(),
  }).required(),
});

// Define the schema for the entire grocery list
export const groceryListSchema = Joi.object<GroceryList>({
  title: Joi.string().required(),
  items: Joi.array().items(listItemSchema).required(),
});

// Validation function
export function validateGroceryList(groceryList: GroceryList): string | null {
  const { error } = groceryListSchema.validate(groceryList);
  return error ? error.details[0].message : null;
}

// Validation schema for user registration
export const userRegistrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });