import { BrokerEntity, BrokerEntityFactory } from "./broker-entity.js";
import { brokerPresets } from "./broker-presets.js";

export class BrokerFactory {
  private result : EntityBroker;
  private readonly steps : Array<Function> = [];

  public useEntity (data : { entity : string, permissions : string[] }) : this {
    this.steps.push(() => {
      const foundPreset = brokerPresets[data.entity];
      if (!foundPreset) { return; }

      const factory = new BrokerEntityFactory();
      factory.usingRepository(foundPreset.repo);
      factory.withPermissions(data.permissions);

      foundPreset.actions.forEach((action) => {
        factory.withAction(action);
      });

      this.result[data.entity] = factory.build();
    });

    return this;
  }

  public build () : EntityBroker {
    const intermediate = {
      done: () : void => {
        Object.keys(this.result).forEach((key) => {
          if (key === "done") return;
          this.result[key].done();
        });
      },
    };

    this.result = intermediate as EntityBroker;
    // Always add logger
    this.useEntity({ entity: "logger", permissions: ["log"] });

    this.steps.forEach((step) => step());

    return this.result;
  }
}

export type EntityBroker = Record<string, BrokerEntity> & {
  done : () => void;
}
