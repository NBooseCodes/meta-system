export enum FailureResponseCodes {
  internalServerError = "MS0000",
  invalidRequest = "MS0001",

  //Auth codes
  tokenExpired = "MS3001",
  tokenInvalid = "MS3002",

  //Entity
  schemaTypeMismatch = "MS4002",
  invalidClientId = "MK2002",
};
