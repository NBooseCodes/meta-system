import { mapikitProvidedBop } from "../test-data/business-operations/prebuilt-bop";
import { ConfigurationType } from "../../../../src/configuration/configuration-type";
import { internalBop } from "./business-operations/internal-bop";
import { schemaBop } from "./business-operations/schema-bop";
import { externalBop } from "./business-operations/external-bop";
import { variableBop } from "./business-operations/variables-bop";
import { packageBop } from "./business-operations/package-bop";
import { ProtocolKind } from "../../../../src/configuration/protocols/protocols-type";

export const testSystem : ConfigurationType = {
  name: "test-system",
  version: "0.0.1",
  envs: [],
  schemas: [
    {
      name: "car",
      format: {
        model: { type: "string" },
        year: { type: "string" },
      },
      dbProtocol: "MainMongoDb",
      identifier: "3993",
    },
  ],
  dbConnectionString: "mongodb://myDBReader:D1fficultP%40ssw0rd@mongodb0.example.com:27017/?authSource=admin",
  businessOperations: [
    mapikitProvidedBop,
    internalBop,
    schemaBop,
    externalBop,
    variableBop,
    packageBop,
  ],
  protocols: [
    {
      "protocol": "@meta-system/mongodb-db-protocol",
      "identifier": "MainMongoDb",
      "configuration": { databaseName: "test" },
      "protocolKind": ProtocolKind.dbProtocol,
      "protocolVersion": "latest",
    },
  ],
};

