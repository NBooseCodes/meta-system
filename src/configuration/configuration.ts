import { ConfigurationType } from "../index.js";
import { BusinessOperation } from "./business-operations/business-operation.js";
import { EnvironmentVariable } from "./configuration-type.js";
import { ProtocolConfigType } from "./protocols/protocols-type.js";
import { Schema } from "./schemas/schema.js";


export class Configuration implements ConfigurationType {
  public readonly name : string;
  public readonly version : string;
  public readonly envs : EnvironmentVariable[];
  public readonly schemas : Schema[];
  public readonly protocols : ProtocolConfigType[];
  public readonly businessOperations : BusinessOperation[];

  public constructor (input : ConfigurationType) {
    this.name = input.name;
    this.version = input.version;
    this.envs = input.envs;
    this.schemas = input.schemas;
    this.businessOperations = input.businessOperations.map((businessOperationData) => {
      return new BusinessOperation(businessOperationData);
    });
    this.protocols = input.protocols;
  }
}
