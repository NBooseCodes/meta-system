import { InternalMetaFunction } from "../../../internal-meta-function";
import { ResolvedVariables } from "../variables-context";

type IncreaseVariableInput = { variableName : string; value : number };

export function increaseVariableFunction (input : IncreaseVariableInput, variables : ResolvedVariables) : unknown {
  input.value = input.value ?? 1;
  const foundVariable = variables[input.variableName];

  if(foundVariable === undefined) {
    return { errorMessage: `No variable named "${input.variableName}" was found` };
  }

  if(typeof  input.value !== "number" || foundVariable.type !== "number") {
    return { errorMessage: `Input value ${input.value} is not a number` };
  }

  (foundVariable.value as number) += input.value;
  return { newValue: variables[input.variableName] };
}

export const increaseVariableFunctionInformation : InternalMetaFunction = {
  functionName: "increaseVariable",
  version: "1.0.0",
  description: "Increases the referenced variable value by the given amount (defaults to 1)",
  inputParameters: {
    variableName: { type: "string", required: true },
    value: { type: "number", required: true },
  },
  outputData: {
    newValue: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
