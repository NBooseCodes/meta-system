import { BopsConfigurationEntry } from "../../../configuration/business-operations/business-operations-type";
import { MappedFunctions } from "../modules-manager";
import { ResolvedConstants } from "../static-info-validation";
import { ResolvedVariables } from "../variables/variables-context";

export class BopContext {
  public readonly constants : ResolvedConstants;
  public readonly variables : ResolvedVariables;
  public readonly config : BopsConfigurationEntry[];
  public readonly results : Map<number, unknown> = new Map();
  public readonly availableFunctions;

  // eslint-disable-next-line max-params
  public constructor (
    config : BopsConfigurationEntry[],
    variables : ResolvedVariables,
    constants : ResolvedConstants,
    availableFunctions : MappedFunctions,
  ) {
    this.constants = Object.freeze(constants);
    this.variables = variables;
    this.config = config;
    this.availableFunctions = availableFunctions;
  }

  /** Clones the context, flushing the results */
  public static cloneToNewContext (bopContext : BopContext) : BopContext {
    return new BopContext(
      bopContext.config,
      bopContext.variables,
      bopContext.constants,
      bopContext.availableFunctions,
    );
  }
}
