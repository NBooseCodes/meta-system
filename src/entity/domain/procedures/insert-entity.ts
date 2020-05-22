import { Procedure } from "birbs";
import { logger } from "@api/mapikit/logger/logger";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import Http from "http-status-codes";
import { InsertEntityResponse } from "@api/entity/domain/types/responses/response-payloads";
import { Entity } from "@api/entity/domain/models/entity";
import { EntityInsertionPayload } from "@api/entity/domain/payloads/entity-insertion-payload";
import { MongoRepositoryAttributes } from "@api/entity/domain/repositories/mongo-repository";
import { EntityContext } from "@api/entity/domain/contexts/entity-context";

interface InsertEntityParameters { payload : EntityInsertionPayload; identifier : symbol }

export class InsertEntity extends Procedure {
  public mongoRepository : MongoRepositoryAttributes;

  constructor (options : {
    MongoRepository : MongoRepositoryAttributes;
  }) {
    super({ lifetime: "SINGLE" });
    this.mongoRepository = options.MongoRepository;
  }

  public async execute (context : EntityContext, parameters ?: InsertEntityParameters) : Promise<void> {
    logger.debug({ message: "Starting Enitty Insertion Procedure", contextState: context.contextState });

    if(!context.contextState.clientName) {
      this.invalidRequest(context);

      return;
    }

    const entity = Entity.toDomain(parameters.payload.entity);
    await this.mongoRepository.checkoutDatabase(context.contextState.clientName);
    await this.mongoRepository.selectCollection(parameters.payload.schemaId);
    await this.mongoRepository.insert(entity);

    context.setResponse<InsertEntityResponse>({ data : { message : "Inserted" }, statusCode: 201 });
    logger.debug({ message: `New entity ${entity} added` });
  }

  //For future use
  private async validateUniqueKeys (entity : Entity, uniqueKeys : string[]) : Promise<boolean> {
    for (const key of uniqueKeys) {
      if (await this.mongoRepository.query({ [key]: entity[key] })) {
        return false;
      }
    }

    return true;
  }


  private invalidRequest (context : EntityContext) : void {
    context.setError({
      key: FailureResponseCodes.invalidRequest,
      message: ResponseMessages.invalidRequest,
      statusCode: Http.BAD_REQUEST,
    });
  }
}
