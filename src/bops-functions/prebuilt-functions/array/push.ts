import { InternalMetaFunction } from "../../internal-meta-function";

export const arrayPushBopsFunction = (input : {
  targetArray ?: unknown[];
  newItems ?: Record<string, unknown>;
  item ?: unknown;
}) : unknown => {
  const resultArray = [...(input.targetArray ?? [])];
  const newItemsArray = Object.values(input.newItems ?? {});

  if (input.item !== undefined) {
    resultArray.push(input.item);
  }

  return ({ result: [...resultArray, ...newItemsArray ?? [] ] });
};

export const arrayPushBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayPushBopsFunction",
  version: "1.0.0",
  description: "Pushes items into the array",
  inputParameters: {
    targetArray: { type: "array", subtype: "any", required: true },
    newItems: { type: "cloudedObject", required: false },
    item: { type: "any", required: false },
  },
  outputData: {
    result: { type: "array", subtype: "any", required: true },
  },
};
