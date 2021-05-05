import { BopsConstant } from "@api/configuration-de-serializer/domain/business-operations-type";

export class ConstantTypeError extends Error {
  constructor (constant : BopsConstant) {
    super(`The constant "${constant.name}" was expected to be a ${constant.type}` +
      ` but ${constant.value} type is ${typeof constant.value}`);
    this.name = ConstantTypeError.name;
  }
}
