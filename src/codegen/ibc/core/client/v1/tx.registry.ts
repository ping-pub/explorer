import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgCreateClient, MsgUpdateClient, MsgUpgradeClient, MsgSubmitMisbehaviour } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/ibc.core.client.v1.MsgCreateClient", MsgCreateClient], ["/ibc.core.client.v1.MsgUpdateClient", MsgUpdateClient], ["/ibc.core.client.v1.MsgUpgradeClient", MsgUpgradeClient], ["/ibc.core.client.v1.MsgSubmitMisbehaviour", MsgSubmitMisbehaviour]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    createClient(value: MsgCreateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgCreateClient",
        value: MsgCreateClient.encode(value).finish()
      };
    },
    updateClient(value: MsgUpdateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpdateClient",
        value: MsgUpdateClient.encode(value).finish()
      };
    },
    upgradeClient(value: MsgUpgradeClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpgradeClient",
        value: MsgUpgradeClient.encode(value).finish()
      };
    },
    submitMisbehaviour(value: MsgSubmitMisbehaviour) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour",
        value: MsgSubmitMisbehaviour.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    createClient(value: MsgCreateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgCreateClient",
        value
      };
    },
    updateClient(value: MsgUpdateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpdateClient",
        value
      };
    },
    upgradeClient(value: MsgUpgradeClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpgradeClient",
        value
      };
    },
    submitMisbehaviour(value: MsgSubmitMisbehaviour) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour",
        value
      };
    }
  },
  fromPartial: {
    createClient(value: MsgCreateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgCreateClient",
        value: MsgCreateClient.fromPartial(value)
      };
    },
    updateClient(value: MsgUpdateClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpdateClient",
        value: MsgUpdateClient.fromPartial(value)
      };
    },
    upgradeClient(value: MsgUpgradeClient) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgUpgradeClient",
        value: MsgUpgradeClient.fromPartial(value)
      };
    },
    submitMisbehaviour(value: MsgSubmitMisbehaviour) {
      return {
        typeUrl: "/ibc.core.client.v1.MsgSubmitMisbehaviour",
        value: MsgSubmitMisbehaviour.fromPartial(value)
      };
    }
  }
};