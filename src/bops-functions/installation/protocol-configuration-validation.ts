// Validates the meta-function.json of the custom BOps function
import MetaProtocolHelper, { BuiltMetaProtocolDefinition, MetaProtocolDefinition } from "meta-protocol-helper";
import { buildFullPackageDescription } from "meta-function-helper/dist/src/build-full-package-description";
import { isMetaFunction } from "meta-function-helper/dist/src/is-meta-function";
import { MetaFunction } from "meta-function-helper";
import { join } from "path";
import { runtimeDefaults } from "../../configuration/runtime-config/defaults";

export class ProtocolDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : string,
  ) { }

  public async validate (protocolName : string) : Promise<this> {
    await MetaProtocolHelper
      .validateProtocolStringConfiguration(this.descriptionFileContent, {
        filePath: join(runtimeDefaults.externalFunctionInstallFolder, protocolName),
      });
    this.validated = true;

    return this;
  }

  // eslint-disable-next-line max-lines-per-function
  public async getPackageConfiguration () : Promise<BuiltMetaProtocolDefinition> {
    if (!this.validated) {
      throw Error("Package Description Not Validated");
    }

    const fileContent = JSON.parse(this.descriptionFileContent) as MetaProtocolDefinition;

    if (fileContent.packageDetails !== undefined) {
      if (!Array.isArray(fileContent.packageDetails.functionsDefinitions)) {
        throw Error("Protocol Contains bad configuration in its functions definitions");
      }
      fileContent.packageDetails = await buildFullPackageDescription(fileContent.packageDetails);

      fileContent.packageDetails.functionsDefinitions.forEach((functionDef) => {
        isMetaFunction(functionDef as MetaFunction, true);
      });
    }

    return fileContent as BuiltMetaProtocolDefinition;
  }
}

