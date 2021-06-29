import { BopsEngine } from "@api/bops-functions/bops-engine/bops-engine";
import { MappedFunctions, ModuleManager } from "@api/bops-functions/bops-engine/modules-manager";
import { FunctionsInstaller } from "@api/bops-functions/installation/functions-installer";
import { SchemasManager } from "@api/schemas/application/schemas-manager";
import { createFakeMongo } from "@test/doubles/mongo-server";
import { expect } from "chai";
import { MongoClient } from "mongodb";
import { testSystem } from "@test/bops-functions/bops-engine/test-data/test-system";
import { FunctionFileSystem } from "@api/bops-functions/installation/function-file-system";
import { ResolvedConstants, StaticSystemInfo } from "@api/bops-functions/bops-engine/static-info-validation";
import { BusinessOperations } from "@api/configuration/business-operations/business-operations-type";
import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { mapikitProvidedBop } from "./test-data/business-operations/prebuilt-bop";
import { internalBop } from "./test-data/business-operations/internal-bop";
import { schemaBop } from "./test-data/business-operations/schema-bop";
import { externalBop } from "./test-data/business-operations/external-bop";
import faker from "faker";
import Path from "path";
import { ExternalFunctionManagerClass } from "@api/bops-functions/function-managers/external-function-manager";
import { CheckBopsFunctionsDependencies }
  from "@api/configuration/business-operations/check-bops-functions-dependencies";
import { BusinessOperation } from "@api/configuration/business-operations/business-operation";
import internalFunctionManager from "@api/bops-functions/function-managers/internal-function-manager";
import { BopsManagerClass } from "@api/bops-functions/function-managers/bops-manager";

interface EngineInput {
  MappedFunctions : MappedFunctions;
  MappedConstants : Record<string, ResolvedConstants>;
  BopsConfigs : BusinessOperations[];
}

let bopsEnginePrerequisites : EngineInput;
let fakeMongo : MongoClient;
const maxExecutionTime = 100;

const setupBopsEngineRequisites = async (bop : BusinessOperations) : Promise<EngineInput> => {
  const functionsFolder = "test-functions";
  const installationHandler = new FunctionsInstaller(functionsFolder);
  const installPath = Path.join(process.cwd(), functionsFolder);
  const fileSystem = new FunctionFileSystem(installPath, "meta-function.json");
  const externalFunctionHandler = new ExternalFunctionManagerClass(installationHandler, fileSystem);
  const bopsManager = new BopsManagerClass();

  const schemasManager = new SchemasManager(testSystem.name, fakeMongo);
  await schemasManager.addSystemSchemas(testSystem.schemas as SchemasType[]);
  const moduleManager = new ModuleManager({
    SchemasManager: schemasManager,
    ExternalFunctionManager: externalFunctionHandler,
    InternalFunctionManager: internalFunctionManager,
    BopsManager: bopsManager,
  });

  const businessOperations = testSystem.businessOperations
    .map((plainBop) => { return new BusinessOperation(plainBop) ;});

  const bopsDependencies = new CheckBopsFunctionsDependencies(
    testSystem.schemas,
    businessOperations,
    new BusinessOperation(bop),
    externalFunctionHandler,
    internalFunctionManager,
  ).bopsDependencies;

  for (const externalDependency of bopsDependencies.external) {
    await externalFunctionHandler.add(externalDependency.name.slice(1), externalDependency.version);
  }

  const bopsEngineInputOptions = {
    MappedFunctions: await moduleManager.resolveSystemModules(testSystem),
    MappedConstants: StaticSystemInfo.validateSystemStaticInfo(testSystem),
    BopsConfigs: testSystem.businessOperations,
  };
  return bopsEngineInputOptions;
};

describe("Bops Engine Testing", () => {
  before(async () => {
    fakeMongo = await createFakeMongo();
  });

  afterEach(async () => {
    fakeMongo = await createFakeMongo();
  });

  it("Test of prebuilt functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(mapikitProvidedBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(mapikitProvidedBop, maxExecutionTime);
    const randomNumber = Math.round(Math.random()*10);
    const res = await stitched({ aNumber: randomNumber });

    expect(res["output"]).to.be.equal(Math.pow(3, randomNumber));
  });

  it("Test of BOp as internal function", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(internalBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(internalBop, maxExecutionTime);
    const res = await stitched();

    expect(res["output"]).to.be.equal(73);
  });

  it("Test of schema BOps functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(schemaBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(schemaBop, maxExecutionTime);
    const randomYear = Math.round(Math.random()*2100);
    const car = { model: "fakeModel", year: randomYear };
    const res = await stitched({ aCar: car });

    expect(res["output"]["deletedCount"]).to.be.equal(1);
  });

  it("Test of external BOps functions", async () => {
    bopsEnginePrerequisites = await setupBopsEngineRequisites(externalBop);
    const bopsEngine = new BopsEngine(bopsEnginePrerequisites);
    const stitched = bopsEngine.stitch(externalBop, maxExecutionTime);
    const randomName = faker.name.firstName();
    const res = await stitched({ myName: randomName });

    expect(res["wasGreeted"]).to.be.true;
    expect(res["greetings"]).to.be.equal("Hello " + randomName);
  });
});

