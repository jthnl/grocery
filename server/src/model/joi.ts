// Validator
import Joi from "joi";
import { ListItem, MetaData, GroceryList } from "./models";

// Define the schema for a GroceryList Item
export const listItemSchema = Joi.object<ListItem>({
  title: Joi.string().allow(null, ''),
  metadata: Joi.object<MetaData>({
    checkbox: Joi.boolean().required(),
  }).required(),
});

// Define the schema for a Grocery List
export const groceryListSchema = Joi.object<GroceryList>({
  title: Joi.string().allow(null, ''),
  items: Joi.array().items(listItemSchema),
});

// Validation function for GroceryList,
// GroceryList is stored as a JSON in Entry's data
// validating this ensures that users will not be able to inject non-conforming
// JSON to the database.
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
