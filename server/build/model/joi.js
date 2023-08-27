"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistrationSchema = exports.validateGroceryList = exports.groceryListSchema = exports.listItemSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define the schema for a grocery list item
exports.listItemSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    metadata: joi_1.default.object({
        checkbox: joi_1.default.boolean().required(),
    }).required(),
});
// Define the schema for the entire grocery list
exports.groceryListSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    items: joi_1.default.array().items(exports.listItemSchema).required(),
});
// Validation function
function validateGroceryList(groceryList) {
    const { error } = exports.groceryListSchema.validate(groceryList);
    return error ? error.details[0].message : null;
}
exports.validateGroceryList = validateGroceryList;
// Validation schema for user registration
exports.userRegistrationSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
//# sourceMappingURL=joi.js.map