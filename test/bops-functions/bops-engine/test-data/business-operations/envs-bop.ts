import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const envBop : BusinessOperations = {
  name: "env-bop",
  identifier: "",
  input: {},
  output: {},
  constants: [],
  variables: [],
  configuration: [
    {
      moduleName: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: "env", originPath: "testEnv", targetPath: "output" },
      ],
    },
  ],
  customObjects: [],
};
