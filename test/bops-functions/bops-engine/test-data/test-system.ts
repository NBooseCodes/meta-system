/* eslint-disable max-len */
import "module-alias/register";
import { mapikitProvidedBop } from "@test/bops-functions/bops-engine/test-data/business-operations/prebuilt-bop";
import { ConfigurationType } from "@api/configuration/configuration-type";
import { internalBop } from "./business-operations/internal-bop";
import { schemaBop } from "./business-operations/schema-bop";
import { externalBop } from "./business-operations/external-bop";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  port: 8080,
  envs: [],
  schemas: [
    {
      name: "car",
      format: {
        model: { type: "string" },
        year: { type: "string" },
      },
      routes: {
        getMethodEnabled: true,
        postMethodEnabled: true,
        deleteMethodEnabled: true,
        patchMethodEnabled: true,
        putMethodEnabled: true,
        queryParamsGetEnabled: true,
      },
    },
  ],
  dbConnectionString: "mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin",
  businessOperations: [
    mapikitProvidedBop,
    internalBop,
    schemaBop,
    externalBop,
  ],
};

