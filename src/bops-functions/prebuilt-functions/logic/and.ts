import { InternalMetaFunction } from "../../internal-meta-function";

export const andGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const bothTrue = input.A && input.B;

  return ({ bothTrue });
};

export const andGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "and",
  version: "1.0.0",
  description: "And gate comparing boolean values for A and B",
  inputParameters: {
    A: { type: "boolean", required: true },
    B: { type: "boolean", required: true },
  },
  outputData: {
    bothTrue: { type: "boolean", required: true },
  },
};
