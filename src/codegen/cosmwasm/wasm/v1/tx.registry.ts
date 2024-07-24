import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgStoreCode, MsgInstantiateContract, MsgInstantiateContract2, MsgExecuteContract, MsgMigrateContract, MsgUpdateAdmin, MsgClearAdmin, MsgUpdateInstantiateConfig } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmwasm.wasm.v1.MsgStoreCode", MsgStoreCode], ["/cosmwasm.wasm.v1.MsgInstantiateContract", MsgInstantiateContract], ["/cosmwasm.wasm.v1.MsgInstantiateContract2", MsgInstantiateContract2], ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract], ["/cosmwasm.wasm.v1.MsgMigrateContract", MsgMigrateContract], ["/cosmwasm.wasm.v1.MsgUpdateAdmin", MsgUpdateAdmin], ["/cosmwasm.wasm.v1.MsgClearAdmin", MsgClearAdmin], ["/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig", MsgUpdateInstantiateConfig]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
        value: MsgStoreCode.encode(value).finish()
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
        value: MsgInstantiateContract.encode(value).finish()
      };
    },
    instantiateContract2(value: MsgInstantiateContract2) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
        value: MsgInstantiateContract2.encode(value).finish()
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.encode(value).finish()
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
        value: MsgMigrateContract.encode(value).finish()
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.encode(value).finish()
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
        value: MsgClearAdmin.encode(value).finish()
      };
    },
    updateInstantiateConfig(value: MsgUpdateInstantiateConfig) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig",
        value: MsgUpdateInstantiateConfig.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
        value
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
        value
      };
    },
    instantiateContract2(value: MsgInstantiateContract2) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
        value
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
        value
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
        value
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
        value
      };
    },
    updateInstantiateConfig(value: MsgUpdateInstantiateConfig) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig",
        value
      };
    }
  },
  fromPartial: {
    storeCode(value: MsgStoreCode) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
        value: MsgStoreCode.fromPartial(value)
      };
    },
    instantiateContract(value: MsgInstantiateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
        value: MsgInstantiateContract.fromPartial(value)
      };
    },
    instantiateContract2(value: MsgInstantiateContract2) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
        value: MsgInstantiateContract2.fromPartial(value)
      };
    },
    executeContract(value: MsgExecuteContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial(value)
      };
    },
    migrateContract(value: MsgMigrateContract) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
        value: MsgMigrateContract.fromPartial(value)
      };
    },
    updateAdmin(value: MsgUpdateAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateAdmin",
        value: MsgUpdateAdmin.fromPartial(value)
      };
    },
    clearAdmin(value: MsgClearAdmin) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgClearAdmin",
        value: MsgClearAdmin.fromPartial(value)
      };
    },
    updateInstantiateConfig(value: MsgUpdateInstantiateConfig) {
      return {
        typeUrl: "/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig",
        value: MsgUpdateInstantiateConfig.fromPartial(value)
      };
    }
  }
};