import { logger } from "../../common/logger/logger.js";
import { BusinessOperation } from "./business-operation.js";
import { BopsConfigurationEntry } from "./business-operations-type.js";

// TODO: Test
export class ValidateBopsPipelineFlowCommand {
  private businessOperation : BusinessOperation;
  private functions : Map<number, BopsConfigurationEntry> = new Map();
  private mappedPaths : number[][] = [];

  public execute (businessOperation : BusinessOperation) : void {
    this.businessOperation = businessOperation;

    this.extractModules();
    const outputFunction = this.getOutputFunction();
    this.mapFunctionPipelinePath(outputFunction);
    this.checkForUnusedModules();
  }

  private extractModules () : void {
    this.businessOperation.configuration.forEach((configurationEntry) => {
      if(this.functions.has(configurationEntry.key)) {
        const sameIdModuleName = this.functions.get(configurationEntry.key).moduleName;
        throw Error(`Duplicate keys in Bop ${this.businessOperation.identifier}\n` +
        `\t- Both modules "${sameIdModuleName}" and "${configurationEntry.moduleName}" have the same identifier`);
      }
      this.functions.set(configurationEntry.key, configurationEntry);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private mapFunctionPipelinePath (currentFunction : BopsConfigurationEntry, currentPath : number[] = []) : number[] {
    const path = [...currentPath];

    if (path.includes(currentFunction.key)) {
      throw Error(
        `Circular dependency found in BOps "${this.businessOperation.identifier}" configuration.`
        + `[ key ${currentFunction.key} ]`,
      );
    }

    path.push(currentFunction.key);

    const dependencies = currentFunction.dependencies;
    const isLeafNode = dependencies.every(input => typeof input.origin === "string") || !dependencies;

    if(isLeafNode) {
      this.mappedPaths.push(path);
      return path;
    }

    dependencies.filter(dependency => typeof dependency.origin === "number").forEach((input) => {
      const dependentOn = this.functions.get(input.origin as number);

      if (!dependentOn) {
        throw Error(
          `Unmapped dependency modules found at BOPS ${this.businessOperation.identifier}`
          + ` Tried to get key [${input.origin}] but it does not exist.`,
        );
      }

      return this.mapFunctionPipelinePath(dependentOn, path);
    });
    return path;
  }

  private checkForUnusedModules () : void {
    for(const functionKey of Array.from(this.functions.keys())) {
      if(!this.mappedPaths.some(path => path.includes(functionKey))) {
        logger.warn(`Function with key ${functionKey} in "${this.businessOperation.identifier}" ` +
        "is not part of any execution flow and will therefore not be executed");
      }
    }
  }

  private getOutputFunction () : BopsConfigurationEntry {
    const iterator = this.functions.values();
    let current : IteratorResult<BopsConfigurationEntry>;

    do  {
      current = iterator.next();
    } while(!current.done && current.value.moduleType !== "output");

    if(current.value === undefined) {
      throw Error(`BOp "${this.businessOperation.identifier}" has no output function`);
    }
    return current.value;
  }
}
