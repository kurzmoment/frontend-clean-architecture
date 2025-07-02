// Combined server functions for backward compatibility
import {
  projectServerQueryFunctions,
  projectServerMutationFunctions,
} from "../projects";
import {
  confidentServerQueryFunctions,
  confidentServerMutationFunctions,
} from "../confidents";
import { tagServerQueryFunctions, tagServerMutationFunctions } from "../tags";

// Export all server query functions
export const serverQueryFunctions = {
  ...projectServerQueryFunctions,
  ...confidentServerQueryFunctions,
  ...tagServerQueryFunctions,
};

// Export all server mutation functions
export const serverMutationFunctions = {
  ...projectServerMutationFunctions,
  ...confidentServerMutationFunctions,
  ...tagServerMutationFunctions,
};
