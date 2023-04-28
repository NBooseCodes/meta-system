import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";

export const updateInfo : InternalMetaFunction = {
  functionName: "update",
  description: "Updates all entities in the database, filtering by the properties given",
  author: "mapikit",
  input: {
    query: { type: "cloudedObject", required: true },
    data: { type: "%entity", required: true },
  },
  output: {
    success: { type: "boolean", required: true },
    affectedEntities: { type: "number", required: false },
  },
  customTypes: [],
};
