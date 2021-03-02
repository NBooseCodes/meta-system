import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export async function main (input : { entity : CloudedObject }) : Promise<unknown> {
  return SchemaFunctions.create(input);
}
