import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type";

export const packageBop : BusinessOperations = {
  name: "package-bop",
  input: {
    age: { type: "number", required: true },
  },
  output: {},
  constants: [
    { name: "adulthood", type: "number", value: 18 },
    { name: "isOlder", type: "string", value: "Is older than 18." },
    { name: "isNotOlder", type: "string", value: "Is not older than 18." },
    { name: "trueConst", type: "boolean", value: true },
    { name: "varName", type: "string", value: "isAdult" },
  ],
  variables: [
    { name: "isAdult", type: "boolean", initialValue: false },
  ],
  configuration: [
    {
      moduleType: "internal",
      moduleRepo: "lowerThan",
      key: 1,
      dependencies: [
        { origin: "inputs", originPath: "age", targetPath: "A" },
        { origin: "constants", originPath: "adulthood", targetPath: "B" },
      ],
    },
    {
      moduleType: "internal",
      moduleRepo: "if",
      key: 2,
      dependencies: [
        { origin: 1, originPath: "result.isLower", targetPath: "boolean" },
        { origin: 6, originPath: "module", targetPath: "ifTrue" },
        { origin: 4, originPath: "module", targetPath: "ifFalse" },
      ],
    },
    {
      moduleType: "variable",
      moduleRepo: "setVariable",
      key: 4,
      dependencies: [
        { origin: "constants", originPath: "varName", targetPath: "variableName" },
        { origin: "constants", originPath: "trueConst", targetPath: "value" },
      ],
    },
    {
      moduleType: "external",
      modulePackage: "logger-meta-functions",
      moduleRepo: "warnLog",
      key: 6,
      dependencies: [
        { origin: "constants", originPath: "isNotOlder", targetPath: "message" },
      ],
    },
    {
      moduleRepo: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: 2 },
        { origin: "variables", originPath: "isAdult", targetPath: "over18" },
      ],
    },
  ],
  customObjects: [],
};
