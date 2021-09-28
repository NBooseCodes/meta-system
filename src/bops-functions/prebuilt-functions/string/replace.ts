import { InternalMetaFunction } from "../../internal-meta-function";

export const stringReplaceFunction = (input : { baseString : string; search : string; replacer : string })
: unknown => {
  let result = input.baseString;
  while (result.includes(input.search)) {
    result = result.replace(input.search, input.replacer);
  }
  return ({ result });
};

export const stringReplaceFunctionInformation : InternalMetaFunction = {
  functionName: "stringReplace",
  version: "1.0.0",
  description: "Replaces a part of a string",
  inputParameters: {
    baseString: { type: "string", required: true },
    search: { type: "string", required: true },
    replacer: { type: "string", required: true },
  },
  outputData: {
    result: { type: "string", required: true },
  },
};
