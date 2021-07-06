import { MongoClient } from "mongodb";
import { MetaRepository } from "../../common/meta-repository";
import { SchemasType } from "../../configuration/schemas/schemas-type";
import { SchemaManager } from "./schema-manager";

export class SchemasManager {
  private readonly dbConnection : MongoClient;
  private readonly systemName : string;
  public schemas : Map<string, SchemaManager> = new Map();

  constructor (systemName : string, mongoConnection : MongoClient) {
    this.dbConnection = mongoConnection;
    this.systemName = systemName;
  }

  private async addSchema (schema : SchemasType) : Promise<void> {
    const repository = new MetaRepository(this.dbConnection);
    await repository.initialize(schema, this.systemName);

    const schemaManager = new SchemaManager({
      schema, metaRepository: repository, systemName: this.systemName,
    });

    this.schemas.set(schema.name, schemaManager);
  }

  public async addSystemSchemas (systemSchemas : SchemasType[]) : Promise<void> {
    for (const schema of systemSchemas) {
      await this.addSchema(schema)
        .then(async () => {
          console.log(`[Schemas] Schema "${schema.name}" successfully added`);
        })
        .catch(err => {
          console.log(`[Schemas] Error while adding schema "${schema.name}"`);
          console.log(err);
        });
    }
  }
}
