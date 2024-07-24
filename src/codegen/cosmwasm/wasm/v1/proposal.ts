import { AccessConfig, AccessConfigAmino, AccessConfigSDKType } from "./types";
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { BinaryReader, BinaryWriter } from "../../../binary";
import { fromBase64, toBase64, toUtf8, fromUtf8 } from "@cosmjs/encoding";
import { bytesFromBase64, base64FromBytes } from "../../../helpers";
/** StoreCodeProposal gov proposal content type to submit WASM code to the system */
export interface StoreCodeProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  runAs: string;
  /** WASMByteCode can be raw or gzip compressed */
  wasmByteCode: Uint8Array;
  /** InstantiatePermission to apply on contract creation, optional */
  instantiatePermission?: AccessConfig;
  /** UnpinCode code on upload, optional */
  unpinCode: boolean;
  /** Source is the URL where the code is hosted */
  source: string;
  /**
   * Builder is the docker image used to build the code deterministically, used
   * for smart contract verification
   */
  builder: string;
  /**
   * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
   * contract verification
   */
  codeHash: Uint8Array;
}
export interface StoreCodeProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.StoreCodeProposal";
  value: Uint8Array;
}
/** StoreCodeProposal gov proposal content type to submit WASM code to the system */
export interface StoreCodeProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  run_as?: string;
  /** WASMByteCode can be raw or gzip compressed */
  wasm_byte_code?: string;
  /** InstantiatePermission to apply on contract creation, optional */
  instantiate_permission?: AccessConfigAmino;
  /** UnpinCode code on upload, optional */
  unpin_code?: boolean;
  /** Source is the URL where the code is hosted */
  source?: string;
  /**
   * Builder is the docker image used to build the code deterministically, used
   * for smart contract verification
   */
  builder?: string;
  /**
   * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
   * contract verification
   */
  code_hash?: string;
}
export interface StoreCodeProposalAminoMsg {
  type: "wasm/StoreCodeProposal";
  value: StoreCodeProposalAmino;
}
/** StoreCodeProposal gov proposal content type to submit WASM code to the system */
export interface StoreCodeProposalSDKType {
  title: string;
  description: string;
  run_as: string;
  wasm_byte_code: Uint8Array;
  instantiate_permission?: AccessConfigSDKType;
  unpin_code: boolean;
  source: string;
  builder: string;
  code_hash: Uint8Array;
}
/**
 * InstantiateContractProposal gov proposal content type to instantiate a
 * contract.
 */
export interface InstantiateContractProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  runAs: string;
  /** Admin is an optional address that can execute migrations */
  admin: string;
  /** CodeID is the reference to the stored WASM code */
  codeId: bigint;
  /** Label is optional metadata to be stored with a constract instance. */
  label: string;
  /** Msg json encoded message to be passed to the contract on instantiation */
  msg: Uint8Array;
  /** Funds coins that are transferred to the contract on instantiation */
  funds: Coin[];
}
export interface InstantiateContractProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.InstantiateContractProposal";
  value: Uint8Array;
}
/**
 * InstantiateContractProposal gov proposal content type to instantiate a
 * contract.
 */
export interface InstantiateContractProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  run_as?: string;
  /** Admin is an optional address that can execute migrations */
  admin?: string;
  /** CodeID is the reference to the stored WASM code */
  code_id?: string;
  /** Label is optional metadata to be stored with a constract instance. */
  label?: string;
  /** Msg json encoded message to be passed to the contract on instantiation */
  msg?: any;
  /** Funds coins that are transferred to the contract on instantiation */
  funds?: CoinAmino[];
}
export interface InstantiateContractProposalAminoMsg {
  type: "wasm/InstantiateContractProposal";
  value: InstantiateContractProposalAmino;
}
/**
 * InstantiateContractProposal gov proposal content type to instantiate a
 * contract.
 */
export interface InstantiateContractProposalSDKType {
  title: string;
  description: string;
  run_as: string;
  admin: string;
  code_id: bigint;
  label: string;
  msg: Uint8Array;
  funds: CoinSDKType[];
}
/**
 * InstantiateContract2Proposal gov proposal content type to instantiate
 * contract 2
 */
export interface InstantiateContract2Proposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** RunAs is the address that is passed to the contract's enviroment as sender */
  runAs: string;
  /** Admin is an optional address that can execute migrations */
  admin: string;
  /** CodeID is the reference to the stored WASM code */
  codeId: bigint;
  /** Label is optional metadata to be stored with a constract instance. */
  label: string;
  /** Msg json encode message to be passed to the contract on instantiation */
  msg: Uint8Array;
  /** Funds coins that are transferred to the contract on instantiation */
  funds: Coin[];
  /** Salt is an arbitrary value provided by the sender. Size can be 1 to 64. */
  salt: Uint8Array;
  /**
   * FixMsg include the msg value into the hash for the predictable address.
   * Default is false
   */
  fixMsg: boolean;
}
export interface InstantiateContract2ProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.InstantiateContract2Proposal";
  value: Uint8Array;
}
/**
 * InstantiateContract2Proposal gov proposal content type to instantiate
 * contract 2
 */
export interface InstantiateContract2ProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** RunAs is the address that is passed to the contract's enviroment as sender */
  run_as?: string;
  /** Admin is an optional address that can execute migrations */
  admin?: string;
  /** CodeID is the reference to the stored WASM code */
  code_id?: string;
  /** Label is optional metadata to be stored with a constract instance. */
  label?: string;
  /** Msg json encode message to be passed to the contract on instantiation */
  msg?: any;
  /** Funds coins that are transferred to the contract on instantiation */
  funds?: CoinAmino[];
  /** Salt is an arbitrary value provided by the sender. Size can be 1 to 64. */
  salt?: string;
  /**
   * FixMsg include the msg value into the hash for the predictable address.
   * Default is false
   */
  fix_msg?: boolean;
}
export interface InstantiateContract2ProposalAminoMsg {
  type: "wasm/InstantiateContract2Proposal";
  value: InstantiateContract2ProposalAmino;
}
/**
 * InstantiateContract2Proposal gov proposal content type to instantiate
 * contract 2
 */
export interface InstantiateContract2ProposalSDKType {
  title: string;
  description: string;
  run_as: string;
  admin: string;
  code_id: bigint;
  label: string;
  msg: Uint8Array;
  funds: CoinSDKType[];
  salt: Uint8Array;
  fix_msg: boolean;
}
/** MigrateContractProposal gov proposal content type to migrate a contract. */
export interface MigrateContractProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** Contract is the address of the smart contract */
  contract: string;
  /** CodeID references the new WASM code */
  codeId: bigint;
  /** Msg json encoded message to be passed to the contract on migration */
  msg: Uint8Array;
}
export interface MigrateContractProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.MigrateContractProposal";
  value: Uint8Array;
}
/** MigrateContractProposal gov proposal content type to migrate a contract. */
export interface MigrateContractProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** Contract is the address of the smart contract */
  contract?: string;
  /** CodeID references the new WASM code */
  code_id?: string;
  /** Msg json encoded message to be passed to the contract on migration */
  msg?: any;
}
export interface MigrateContractProposalAminoMsg {
  type: "wasm/MigrateContractProposal";
  value: MigrateContractProposalAmino;
}
/** MigrateContractProposal gov proposal content type to migrate a contract. */
export interface MigrateContractProposalSDKType {
  title: string;
  description: string;
  contract: string;
  code_id: bigint;
  msg: Uint8Array;
}
/** SudoContractProposal gov proposal content type to call sudo on a contract. */
export interface SudoContractProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** Contract is the address of the smart contract */
  contract: string;
  /** Msg json encoded message to be passed to the contract as sudo */
  msg: Uint8Array;
}
export interface SudoContractProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.SudoContractProposal";
  value: Uint8Array;
}
/** SudoContractProposal gov proposal content type to call sudo on a contract. */
export interface SudoContractProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** Contract is the address of the smart contract */
  contract?: string;
  /** Msg json encoded message to be passed to the contract as sudo */
  msg?: any;
}
export interface SudoContractProposalAminoMsg {
  type: "wasm/SudoContractProposal";
  value: SudoContractProposalAmino;
}
/** SudoContractProposal gov proposal content type to call sudo on a contract. */
export interface SudoContractProposalSDKType {
  title: string;
  description: string;
  contract: string;
  msg: Uint8Array;
}
/**
 * ExecuteContractProposal gov proposal content type to call execute on a
 * contract.
 */
export interface ExecuteContractProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  runAs: string;
  /** Contract is the address of the smart contract */
  contract: string;
  /** Msg json encoded message to be passed to the contract as execute */
  msg: Uint8Array;
  /** Funds coins that are transferred to the contract on instantiation */
  funds: Coin[];
}
export interface ExecuteContractProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.ExecuteContractProposal";
  value: Uint8Array;
}
/**
 * ExecuteContractProposal gov proposal content type to call execute on a
 * contract.
 */
export interface ExecuteContractProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  run_as?: string;
  /** Contract is the address of the smart contract */
  contract?: string;
  /** Msg json encoded message to be passed to the contract as execute */
  msg?: any;
  /** Funds coins that are transferred to the contract on instantiation */
  funds?: CoinAmino[];
}
export interface ExecuteContractProposalAminoMsg {
  type: "wasm/ExecuteContractProposal";
  value: ExecuteContractProposalAmino;
}
/**
 * ExecuteContractProposal gov proposal content type to call execute on a
 * contract.
 */
export interface ExecuteContractProposalSDKType {
  title: string;
  description: string;
  run_as: string;
  contract: string;
  msg: Uint8Array;
  funds: CoinSDKType[];
}
/** UpdateAdminProposal gov proposal content type to set an admin for a contract. */
export interface UpdateAdminProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** NewAdmin address to be set */
  newAdmin: string;
  /** Contract is the address of the smart contract */
  contract: string;
}
export interface UpdateAdminProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.UpdateAdminProposal";
  value: Uint8Array;
}
/** UpdateAdminProposal gov proposal content type to set an admin for a contract. */
export interface UpdateAdminProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** NewAdmin address to be set */
  new_admin?: string;
  /** Contract is the address of the smart contract */
  contract?: string;
}
export interface UpdateAdminProposalAminoMsg {
  type: "wasm/UpdateAdminProposal";
  value: UpdateAdminProposalAmino;
}
/** UpdateAdminProposal gov proposal content type to set an admin for a contract. */
export interface UpdateAdminProposalSDKType {
  title: string;
  description: string;
  new_admin: string;
  contract: string;
}
/**
 * ClearAdminProposal gov proposal content type to clear the admin of a
 * contract.
 */
export interface ClearAdminProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** Contract is the address of the smart contract */
  contract: string;
}
export interface ClearAdminProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.ClearAdminProposal";
  value: Uint8Array;
}
/**
 * ClearAdminProposal gov proposal content type to clear the admin of a
 * contract.
 */
export interface ClearAdminProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** Contract is the address of the smart contract */
  contract?: string;
}
export interface ClearAdminProposalAminoMsg {
  type: "wasm/ClearAdminProposal";
  value: ClearAdminProposalAmino;
}
/**
 * ClearAdminProposal gov proposal content type to clear the admin of a
 * contract.
 */
export interface ClearAdminProposalSDKType {
  title: string;
  description: string;
  contract: string;
}
/**
 * PinCodesProposal gov proposal content type to pin a set of code ids in the
 * wasmvm cache.
 */
export interface PinCodesProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** CodeIDs references the new WASM codes */
  codeIds: bigint[];
}
export interface PinCodesProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.PinCodesProposal";
  value: Uint8Array;
}
/**
 * PinCodesProposal gov proposal content type to pin a set of code ids in the
 * wasmvm cache.
 */
export interface PinCodesProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** CodeIDs references the new WASM codes */
  code_ids?: string[];
}
export interface PinCodesProposalAminoMsg {
  type: "wasm/PinCodesProposal";
  value: PinCodesProposalAmino;
}
/**
 * PinCodesProposal gov proposal content type to pin a set of code ids in the
 * wasmvm cache.
 */
export interface PinCodesProposalSDKType {
  title: string;
  description: string;
  code_ids: bigint[];
}
/**
 * UnpinCodesProposal gov proposal content type to unpin a set of code ids in
 * the wasmvm cache.
 */
export interface UnpinCodesProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** CodeIDs references the WASM codes */
  codeIds: bigint[];
}
export interface UnpinCodesProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.UnpinCodesProposal";
  value: Uint8Array;
}
/**
 * UnpinCodesProposal gov proposal content type to unpin a set of code ids in
 * the wasmvm cache.
 */
export interface UnpinCodesProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** CodeIDs references the WASM codes */
  code_ids?: string[];
}
export interface UnpinCodesProposalAminoMsg {
  type: "wasm/UnpinCodesProposal";
  value: UnpinCodesProposalAmino;
}
/**
 * UnpinCodesProposal gov proposal content type to unpin a set of code ids in
 * the wasmvm cache.
 */
export interface UnpinCodesProposalSDKType {
  title: string;
  description: string;
  code_ids: bigint[];
}
/**
 * SetGasLessContractsProposal gov proposal content type to set gassless a set of contract addresses in the
 * wasmvm cache.
 */
export interface SetGasLessContractsProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** ContractAddresses references the new WASM addresses */
  contractAddresses: string[];
}
export interface SetGasLessContractsProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.SetGasLessContractsProposal";
  value: Uint8Array;
}
/**
 * SetGasLessContractsProposal gov proposal content type to set gassless a set of contract addresses in the
 * wasmvm cache.
 */
export interface SetGasLessContractsProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** ContractAddresses references the new WASM addresses */
  contract_addresses?: string[];
}
export interface SetGasLessContractsProposalAminoMsg {
  type: "wasm/SetGasLessContractsProposal";
  value: SetGasLessContractsProposalAmino;
}
/**
 * SetGasLessContractsProposal gov proposal content type to set gassless a set of contract addresses in the
 * wasmvm cache.
 */
export interface SetGasLessContractsProposalSDKType {
  title: string;
  description: string;
  contract_addresses: string[];
}
/**
 * UnsetGasLessContractsProposal gov proposal content type to unset gassless a set of contract addresses in
 * the wasmvm cache.
 */
export interface UnsetGasLessContractsProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** ContractAddresses references the new WASM addresses */
  contractAddresses: string[];
}
export interface UnsetGasLessContractsProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.UnsetGasLessContractsProposal";
  value: Uint8Array;
}
/**
 * UnsetGasLessContractsProposal gov proposal content type to unset gassless a set of contract addresses in
 * the wasmvm cache.
 */
export interface UnsetGasLessContractsProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** ContractAddresses references the new WASM addresses */
  contract_addresses?: string[];
}
export interface UnsetGasLessContractsProposalAminoMsg {
  type: "wasm/UnsetGasLessContractsProposal";
  value: UnsetGasLessContractsProposalAmino;
}
/**
 * UnsetGasLessContractsProposal gov proposal content type to unset gassless a set of contract addresses in
 * the wasmvm cache.
 */
export interface UnsetGasLessContractsProposalSDKType {
  title: string;
  description: string;
  contract_addresses: string[];
}
/**
 * AccessConfigUpdate contains the code id and the access config to be
 * applied.
 */
export interface AccessConfigUpdate {
  /** CodeID is the reference to the stored WASM code to be updated */
  codeId: bigint;
  /** InstantiatePermission to apply to the set of code ids */
  instantiatePermission: AccessConfig;
}
export interface AccessConfigUpdateProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.AccessConfigUpdate";
  value: Uint8Array;
}
/**
 * AccessConfigUpdate contains the code id and the access config to be
 * applied.
 */
export interface AccessConfigUpdateAmino {
  /** CodeID is the reference to the stored WASM code to be updated */
  code_id?: string;
  /** InstantiatePermission to apply to the set of code ids */
  instantiate_permission?: AccessConfigAmino;
}
export interface AccessConfigUpdateAminoMsg {
  type: "wasm/AccessConfigUpdate";
  value: AccessConfigUpdateAmino;
}
/**
 * AccessConfigUpdate contains the code id and the access config to be
 * applied.
 */
export interface AccessConfigUpdateSDKType {
  code_id: bigint;
  instantiate_permission: AccessConfigSDKType;
}
/**
 * UpdateInstantiateConfigProposal gov proposal content type to update
 * instantiate config to a  set of code ids.
 */
export interface UpdateInstantiateConfigProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /**
   * AccessConfigUpdate contains the list of code ids and the access config
   * to be applied.
   */
  accessConfigUpdates: AccessConfigUpdate[];
}
export interface UpdateInstantiateConfigProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal";
  value: Uint8Array;
}
/**
 * UpdateInstantiateConfigProposal gov proposal content type to update
 * instantiate config to a  set of code ids.
 */
export interface UpdateInstantiateConfigProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /**
   * AccessConfigUpdate contains the list of code ids and the access config
   * to be applied.
   */
  access_config_updates?: AccessConfigUpdateAmino[];
}
export interface UpdateInstantiateConfigProposalAminoMsg {
  type: "wasm/UpdateInstantiateConfigProposal";
  value: UpdateInstantiateConfigProposalAmino;
}
/**
 * UpdateInstantiateConfigProposal gov proposal content type to update
 * instantiate config to a  set of code ids.
 */
export interface UpdateInstantiateConfigProposalSDKType {
  title: string;
  description: string;
  access_config_updates: AccessConfigUpdateSDKType[];
}
/**
 * StoreAndInstantiateContractProposal gov proposal content type to store
 * and instantiate the contract.
 */
export interface StoreAndInstantiateContractProposal {
  /** Title is a short summary */
  title: string;
  /** Description is a human readable text */
  description: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  runAs: string;
  /** WASMByteCode can be raw or gzip compressed */
  wasmByteCode: Uint8Array;
  /** InstantiatePermission to apply on contract creation, optional */
  instantiatePermission?: AccessConfig;
  /** UnpinCode code on upload, optional */
  unpinCode: boolean;
  /** Admin is an optional address that can execute migrations */
  admin: string;
  /** Label is optional metadata to be stored with a constract instance. */
  label: string;
  /** Msg json encoded message to be passed to the contract on instantiation */
  msg: Uint8Array;
  /** Funds coins that are transferred to the contract on instantiation */
  funds: Coin[];
  /** Source is the URL where the code is hosted */
  source: string;
  /**
   * Builder is the docker image used to build the code deterministically, used
   * for smart contract verification
   */
  builder: string;
  /**
   * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
   * contract verification
   */
  codeHash: Uint8Array;
}
export interface StoreAndInstantiateContractProposalProtoMsg {
  typeUrl: "/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal";
  value: Uint8Array;
}
/**
 * StoreAndInstantiateContractProposal gov proposal content type to store
 * and instantiate the contract.
 */
export interface StoreAndInstantiateContractProposalAmino {
  /** Title is a short summary */
  title?: string;
  /** Description is a human readable text */
  description?: string;
  /** RunAs is the address that is passed to the contract's environment as sender */
  run_as?: string;
  /** WASMByteCode can be raw or gzip compressed */
  wasm_byte_code?: string;
  /** InstantiatePermission to apply on contract creation, optional */
  instantiate_permission?: AccessConfigAmino;
  /** UnpinCode code on upload, optional */
  unpin_code?: boolean;
  /** Admin is an optional address that can execute migrations */
  admin?: string;
  /** Label is optional metadata to be stored with a constract instance. */
  label?: string;
  /** Msg json encoded message to be passed to the contract on instantiation */
  msg?: any;
  /** Funds coins that are transferred to the contract on instantiation */
  funds?: CoinAmino[];
  /** Source is the URL where the code is hosted */
  source?: string;
  /**
   * Builder is the docker image used to build the code deterministically, used
   * for smart contract verification
   */
  builder?: string;
  /**
   * CodeHash is the SHA256 sum of the code outputted by builder, used for smart
   * contract verification
   */
  code_hash?: string;
}
export interface StoreAndInstantiateContractProposalAminoMsg {
  type: "wasm/StoreAndInstantiateContractProposal";
  value: StoreAndInstantiateContractProposalAmino;
}
/**
 * StoreAndInstantiateContractProposal gov proposal content type to store
 * and instantiate the contract.
 */
export interface StoreAndInstantiateContractProposalSDKType {
  title: string;
  description: string;
  run_as: string;
  wasm_byte_code: Uint8Array;
  instantiate_permission?: AccessConfigSDKType;
  unpin_code: boolean;
  admin: string;
  label: string;
  msg: Uint8Array;
  funds: CoinSDKType[];
  source: string;
  builder: string;
  code_hash: Uint8Array;
}
function createBaseStoreCodeProposal(): StoreCodeProposal {
  return {
    title: "",
    description: "",
    runAs: "",
    wasmByteCode: new Uint8Array(),
    instantiatePermission: undefined,
    unpinCode: false,
    source: "",
    builder: "",
    codeHash: new Uint8Array()
  };
}
export const StoreCodeProposal = {
  typeUrl: "/cosmwasm.wasm.v1.StoreCodeProposal",
  encode(message: StoreCodeProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.runAs !== "") {
      writer.uint32(26).string(message.runAs);
    }
    if (message.wasmByteCode.length !== 0) {
      writer.uint32(34).bytes(message.wasmByteCode);
    }
    if (message.instantiatePermission !== undefined) {
      AccessConfig.encode(message.instantiatePermission, writer.uint32(58).fork()).ldelim();
    }
    if (message.unpinCode === true) {
      writer.uint32(64).bool(message.unpinCode);
    }
    if (message.source !== "") {
      writer.uint32(74).string(message.source);
    }
    if (message.builder !== "") {
      writer.uint32(82).string(message.builder);
    }
    if (message.codeHash.length !== 0) {
      writer.uint32(90).bytes(message.codeHash);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StoreCodeProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStoreCodeProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.runAs = reader.string();
          break;
        case 4:
          message.wasmByteCode = reader.bytes();
          break;
        case 7:
          message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
          break;
        case 8:
          message.unpinCode = reader.bool();
          break;
        case 9:
          message.source = reader.string();
          break;
        case 10:
          message.builder = reader.string();
          break;
        case 11:
          message.codeHash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StoreCodeProposal>): StoreCodeProposal {
    const message = createBaseStoreCodeProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.runAs = object.runAs ?? "";
    message.wasmByteCode = object.wasmByteCode ?? new Uint8Array();
    message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
    message.unpinCode = object.unpinCode ?? false;
    message.source = object.source ?? "";
    message.builder = object.builder ?? "";
    message.codeHash = object.codeHash ?? new Uint8Array();
    return message;
  },
  fromAmino(object: StoreCodeProposalAmino): StoreCodeProposal {
    const message = createBaseStoreCodeProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.run_as !== undefined && object.run_as !== null) {
      message.runAs = object.run_as;
    }
    if (object.wasm_byte_code !== undefined && object.wasm_byte_code !== null) {
      message.wasmByteCode = fromBase64(object.wasm_byte_code);
    }
    if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
      message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
    }
    if (object.unpin_code !== undefined && object.unpin_code !== null) {
      message.unpinCode = object.unpin_code;
    }
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.builder !== undefined && object.builder !== null) {
      message.builder = object.builder;
    }
    if (object.code_hash !== undefined && object.code_hash !== null) {
      message.codeHash = bytesFromBase64(object.code_hash);
    }
    return message;
  },
  toAmino(message: StoreCodeProposal): StoreCodeProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.run_as = message.runAs === "" ? undefined : message.runAs;
    obj.wasm_byte_code = message.wasmByteCode ? toBase64(message.wasmByteCode) : undefined;
    obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
    obj.unpin_code = message.unpinCode === false ? undefined : message.unpinCode;
    obj.source = message.source === "" ? undefined : message.source;
    obj.builder = message.builder === "" ? undefined : message.builder;
    obj.code_hash = message.codeHash ? base64FromBytes(message.codeHash) : undefined;
    return obj;
  },
  fromAminoMsg(object: StoreCodeProposalAminoMsg): StoreCodeProposal {
    return StoreCodeProposal.fromAmino(object.value);
  },
  toAminoMsg(message: StoreCodeProposal): StoreCodeProposalAminoMsg {
    return {
      type: "wasm/StoreCodeProposal",
      value: StoreCodeProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: StoreCodeProposalProtoMsg): StoreCodeProposal {
    return StoreCodeProposal.decode(message.value);
  },
  toProto(message: StoreCodeProposal): Uint8Array {
    return StoreCodeProposal.encode(message).finish();
  },
  toProtoMsg(message: StoreCodeProposal): StoreCodeProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.StoreCodeProposal",
      value: StoreCodeProposal.encode(message).finish()
    };
  }
};
function createBaseInstantiateContractProposal(): InstantiateContractProposal {
  return {
    title: "",
    description: "",
    runAs: "",
    admin: "",
    codeId: BigInt(0),
    label: "",
    msg: new Uint8Array(),
    funds: []
  };
}
export const InstantiateContractProposal = {
  typeUrl: "/cosmwasm.wasm.v1.InstantiateContractProposal",
  encode(message: InstantiateContractProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.runAs !== "") {
      writer.uint32(26).string(message.runAs);
    }
    if (message.admin !== "") {
      writer.uint32(34).string(message.admin);
    }
    if (message.codeId !== BigInt(0)) {
      writer.uint32(40).uint64(message.codeId);
    }
    if (message.label !== "") {
      writer.uint32(50).string(message.label);
    }
    if (message.msg.length !== 0) {
      writer.uint32(58).bytes(message.msg);
    }
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): InstantiateContractProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstantiateContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.runAs = reader.string();
          break;
        case 4:
          message.admin = reader.string();
          break;
        case 5:
          message.codeId = reader.uint64();
          break;
        case 6:
          message.label = reader.string();
          break;
        case 7:
          message.msg = reader.bytes();
          break;
        case 8:
          message.funds.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<InstantiateContractProposal>): InstantiateContractProposal {
    const message = createBaseInstantiateContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.runAs = object.runAs ?? "";
    message.admin = object.admin ?? "";
    message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
    message.label = object.label ?? "";
    message.msg = object.msg ?? new Uint8Array();
    message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: InstantiateContractProposalAmino): InstantiateContractProposal {
    const message = createBaseInstantiateContractProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.run_as !== undefined && object.run_as !== null) {
      message.runAs = object.run_as;
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    if (object.code_id !== undefined && object.code_id !== null) {
      message.codeId = BigInt(object.code_id);
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: InstantiateContractProposal): InstantiateContractProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.run_as = message.runAs === "" ? undefined : message.runAs;
    obj.admin = message.admin === "" ? undefined : message.admin;
    obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
    obj.label = message.label === "" ? undefined : message.label;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    if (message.funds) {
      obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.funds = message.funds;
    }
    return obj;
  },
  fromAminoMsg(object: InstantiateContractProposalAminoMsg): InstantiateContractProposal {
    return InstantiateContractProposal.fromAmino(object.value);
  },
  toAminoMsg(message: InstantiateContractProposal): InstantiateContractProposalAminoMsg {
    return {
      type: "wasm/InstantiateContractProposal",
      value: InstantiateContractProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: InstantiateContractProposalProtoMsg): InstantiateContractProposal {
    return InstantiateContractProposal.decode(message.value);
  },
  toProto(message: InstantiateContractProposal): Uint8Array {
    return InstantiateContractProposal.encode(message).finish();
  },
  toProtoMsg(message: InstantiateContractProposal): InstantiateContractProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.InstantiateContractProposal",
      value: InstantiateContractProposal.encode(message).finish()
    };
  }
};
function createBaseInstantiateContract2Proposal(): InstantiateContract2Proposal {
  return {
    title: "",
    description: "",
    runAs: "",
    admin: "",
    codeId: BigInt(0),
    label: "",
    msg: new Uint8Array(),
    funds: [],
    salt: new Uint8Array(),
    fixMsg: false
  };
}
export const InstantiateContract2Proposal = {
  typeUrl: "/cosmwasm.wasm.v1.InstantiateContract2Proposal",
  encode(message: InstantiateContract2Proposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.runAs !== "") {
      writer.uint32(26).string(message.runAs);
    }
    if (message.admin !== "") {
      writer.uint32(34).string(message.admin);
    }
    if (message.codeId !== BigInt(0)) {
      writer.uint32(40).uint64(message.codeId);
    }
    if (message.label !== "") {
      writer.uint32(50).string(message.label);
    }
    if (message.msg.length !== 0) {
      writer.uint32(58).bytes(message.msg);
    }
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    if (message.salt.length !== 0) {
      writer.uint32(74).bytes(message.salt);
    }
    if (message.fixMsg === true) {
      writer.uint32(80).bool(message.fixMsg);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): InstantiateContract2Proposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstantiateContract2Proposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.runAs = reader.string();
          break;
        case 4:
          message.admin = reader.string();
          break;
        case 5:
          message.codeId = reader.uint64();
          break;
        case 6:
          message.label = reader.string();
          break;
        case 7:
          message.msg = reader.bytes();
          break;
        case 8:
          message.funds.push(Coin.decode(reader, reader.uint32()));
          break;
        case 9:
          message.salt = reader.bytes();
          break;
        case 10:
          message.fixMsg = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<InstantiateContract2Proposal>): InstantiateContract2Proposal {
    const message = createBaseInstantiateContract2Proposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.runAs = object.runAs ?? "";
    message.admin = object.admin ?? "";
    message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
    message.label = object.label ?? "";
    message.msg = object.msg ?? new Uint8Array();
    message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
    message.salt = object.salt ?? new Uint8Array();
    message.fixMsg = object.fixMsg ?? false;
    return message;
  },
  fromAmino(object: InstantiateContract2ProposalAmino): InstantiateContract2Proposal {
    const message = createBaseInstantiateContract2Proposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.run_as !== undefined && object.run_as !== null) {
      message.runAs = object.run_as;
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    if (object.code_id !== undefined && object.code_id !== null) {
      message.codeId = BigInt(object.code_id);
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
    if (object.salt !== undefined && object.salt !== null) {
      message.salt = bytesFromBase64(object.salt);
    }
    if (object.fix_msg !== undefined && object.fix_msg !== null) {
      message.fixMsg = object.fix_msg;
    }
    return message;
  },
  toAmino(message: InstantiateContract2Proposal): InstantiateContract2ProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.run_as = message.runAs === "" ? undefined : message.runAs;
    obj.admin = message.admin === "" ? undefined : message.admin;
    obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
    obj.label = message.label === "" ? undefined : message.label;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    if (message.funds) {
      obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.funds = message.funds;
    }
    obj.salt = message.salt ? base64FromBytes(message.salt) : undefined;
    obj.fix_msg = message.fixMsg === false ? undefined : message.fixMsg;
    return obj;
  },
  fromAminoMsg(object: InstantiateContract2ProposalAminoMsg): InstantiateContract2Proposal {
    return InstantiateContract2Proposal.fromAmino(object.value);
  },
  toAminoMsg(message: InstantiateContract2Proposal): InstantiateContract2ProposalAminoMsg {
    return {
      type: "wasm/InstantiateContract2Proposal",
      value: InstantiateContract2Proposal.toAmino(message)
    };
  },
  fromProtoMsg(message: InstantiateContract2ProposalProtoMsg): InstantiateContract2Proposal {
    return InstantiateContract2Proposal.decode(message.value);
  },
  toProto(message: InstantiateContract2Proposal): Uint8Array {
    return InstantiateContract2Proposal.encode(message).finish();
  },
  toProtoMsg(message: InstantiateContract2Proposal): InstantiateContract2ProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.InstantiateContract2Proposal",
      value: InstantiateContract2Proposal.encode(message).finish()
    };
  }
};
function createBaseMigrateContractProposal(): MigrateContractProposal {
  return {
    title: "",
    description: "",
    contract: "",
    codeId: BigInt(0),
    msg: new Uint8Array()
  };
}
export const MigrateContractProposal = {
  typeUrl: "/cosmwasm.wasm.v1.MigrateContractProposal",
  encode(message: MigrateContractProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.contract !== "") {
      writer.uint32(34).string(message.contract);
    }
    if (message.codeId !== BigInt(0)) {
      writer.uint32(40).uint64(message.codeId);
    }
    if (message.msg.length !== 0) {
      writer.uint32(50).bytes(message.msg);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MigrateContractProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 4:
          message.contract = reader.string();
          break;
        case 5:
          message.codeId = reader.uint64();
          break;
        case 6:
          message.msg = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<MigrateContractProposal>): MigrateContractProposal {
    const message = createBaseMigrateContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contract = object.contract ?? "";
    message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
    message.msg = object.msg ?? new Uint8Array();
    return message;
  },
  fromAmino(object: MigrateContractProposalAmino): MigrateContractProposal {
    const message = createBaseMigrateContractProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    if (object.code_id !== undefined && object.code_id !== null) {
      message.codeId = BigInt(object.code_id);
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    return message;
  },
  toAmino(message: MigrateContractProposal): MigrateContractProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.contract = message.contract === "" ? undefined : message.contract;
    obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    return obj;
  },
  fromAminoMsg(object: MigrateContractProposalAminoMsg): MigrateContractProposal {
    return MigrateContractProposal.fromAmino(object.value);
  },
  toAminoMsg(message: MigrateContractProposal): MigrateContractProposalAminoMsg {
    return {
      type: "wasm/MigrateContractProposal",
      value: MigrateContractProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: MigrateContractProposalProtoMsg): MigrateContractProposal {
    return MigrateContractProposal.decode(message.value);
  },
  toProto(message: MigrateContractProposal): Uint8Array {
    return MigrateContractProposal.encode(message).finish();
  },
  toProtoMsg(message: MigrateContractProposal): MigrateContractProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MigrateContractProposal",
      value: MigrateContractProposal.encode(message).finish()
    };
  }
};
function createBaseSudoContractProposal(): SudoContractProposal {
  return {
    title: "",
    description: "",
    contract: "",
    msg: new Uint8Array()
  };
}
export const SudoContractProposal = {
  typeUrl: "/cosmwasm.wasm.v1.SudoContractProposal",
  encode(message: SudoContractProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.contract !== "") {
      writer.uint32(26).string(message.contract);
    }
    if (message.msg.length !== 0) {
      writer.uint32(34).bytes(message.msg);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): SudoContractProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSudoContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.contract = reader.string();
          break;
        case 4:
          message.msg = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SudoContractProposal>): SudoContractProposal {
    const message = createBaseSudoContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contract = object.contract ?? "";
    message.msg = object.msg ?? new Uint8Array();
    return message;
  },
  fromAmino(object: SudoContractProposalAmino): SudoContractProposal {
    const message = createBaseSudoContractProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    return message;
  },
  toAmino(message: SudoContractProposal): SudoContractProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.contract = message.contract === "" ? undefined : message.contract;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    return obj;
  },
  fromAminoMsg(object: SudoContractProposalAminoMsg): SudoContractProposal {
    return SudoContractProposal.fromAmino(object.value);
  },
  toAminoMsg(message: SudoContractProposal): SudoContractProposalAminoMsg {
    return {
      type: "wasm/SudoContractProposal",
      value: SudoContractProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: SudoContractProposalProtoMsg): SudoContractProposal {
    return SudoContractProposal.decode(message.value);
  },
  toProto(message: SudoContractProposal): Uint8Array {
    return SudoContractProposal.encode(message).finish();
  },
  toProtoMsg(message: SudoContractProposal): SudoContractProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.SudoContractProposal",
      value: SudoContractProposal.encode(message).finish()
    };
  }
};
function createBaseExecuteContractProposal(): ExecuteContractProposal {
  return {
    title: "",
    description: "",
    runAs: "",
    contract: "",
    msg: new Uint8Array(),
    funds: []
  };
}
export const ExecuteContractProposal = {
  typeUrl: "/cosmwasm.wasm.v1.ExecuteContractProposal",
  encode(message: ExecuteContractProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.runAs !== "") {
      writer.uint32(26).string(message.runAs);
    }
    if (message.contract !== "") {
      writer.uint32(34).string(message.contract);
    }
    if (message.msg.length !== 0) {
      writer.uint32(42).bytes(message.msg);
    }
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ExecuteContractProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.runAs = reader.string();
          break;
        case 4:
          message.contract = reader.string();
          break;
        case 5:
          message.msg = reader.bytes();
          break;
        case 6:
          message.funds.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ExecuteContractProposal>): ExecuteContractProposal {
    const message = createBaseExecuteContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.runAs = object.runAs ?? "";
    message.contract = object.contract ?? "";
    message.msg = object.msg ?? new Uint8Array();
    message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ExecuteContractProposalAmino): ExecuteContractProposal {
    const message = createBaseExecuteContractProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.run_as !== undefined && object.run_as !== null) {
      message.runAs = object.run_as;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: ExecuteContractProposal): ExecuteContractProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.run_as = message.runAs === "" ? undefined : message.runAs;
    obj.contract = message.contract === "" ? undefined : message.contract;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    if (message.funds) {
      obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.funds = message.funds;
    }
    return obj;
  },
  fromAminoMsg(object: ExecuteContractProposalAminoMsg): ExecuteContractProposal {
    return ExecuteContractProposal.fromAmino(object.value);
  },
  toAminoMsg(message: ExecuteContractProposal): ExecuteContractProposalAminoMsg {
    return {
      type: "wasm/ExecuteContractProposal",
      value: ExecuteContractProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: ExecuteContractProposalProtoMsg): ExecuteContractProposal {
    return ExecuteContractProposal.decode(message.value);
  },
  toProto(message: ExecuteContractProposal): Uint8Array {
    return ExecuteContractProposal.encode(message).finish();
  },
  toProtoMsg(message: ExecuteContractProposal): ExecuteContractProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.ExecuteContractProposal",
      value: ExecuteContractProposal.encode(message).finish()
    };
  }
};
function createBaseUpdateAdminProposal(): UpdateAdminProposal {
  return {
    title: "",
    description: "",
    newAdmin: "",
    contract: ""
  };
}
export const UpdateAdminProposal = {
  typeUrl: "/cosmwasm.wasm.v1.UpdateAdminProposal",
  encode(message: UpdateAdminProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.newAdmin !== "") {
      writer.uint32(26).string(message.newAdmin);
    }
    if (message.contract !== "") {
      writer.uint32(34).string(message.contract);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UpdateAdminProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateAdminProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.newAdmin = reader.string();
          break;
        case 4:
          message.contract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UpdateAdminProposal>): UpdateAdminProposal {
    const message = createBaseUpdateAdminProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.newAdmin = object.newAdmin ?? "";
    message.contract = object.contract ?? "";
    return message;
  },
  fromAmino(object: UpdateAdminProposalAmino): UpdateAdminProposal {
    const message = createBaseUpdateAdminProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.new_admin !== undefined && object.new_admin !== null) {
      message.newAdmin = object.new_admin;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    return message;
  },
  toAmino(message: UpdateAdminProposal): UpdateAdminProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.new_admin = message.newAdmin === "" ? undefined : message.newAdmin;
    obj.contract = message.contract === "" ? undefined : message.contract;
    return obj;
  },
  fromAminoMsg(object: UpdateAdminProposalAminoMsg): UpdateAdminProposal {
    return UpdateAdminProposal.fromAmino(object.value);
  },
  toAminoMsg(message: UpdateAdminProposal): UpdateAdminProposalAminoMsg {
    return {
      type: "wasm/UpdateAdminProposal",
      value: UpdateAdminProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: UpdateAdminProposalProtoMsg): UpdateAdminProposal {
    return UpdateAdminProposal.decode(message.value);
  },
  toProto(message: UpdateAdminProposal): Uint8Array {
    return UpdateAdminProposal.encode(message).finish();
  },
  toProtoMsg(message: UpdateAdminProposal): UpdateAdminProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.UpdateAdminProposal",
      value: UpdateAdminProposal.encode(message).finish()
    };
  }
};
function createBaseClearAdminProposal(): ClearAdminProposal {
  return {
    title: "",
    description: "",
    contract: ""
  };
}
export const ClearAdminProposal = {
  typeUrl: "/cosmwasm.wasm.v1.ClearAdminProposal",
  encode(message: ClearAdminProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.contract !== "") {
      writer.uint32(26).string(message.contract);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): ClearAdminProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClearAdminProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.contract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<ClearAdminProposal>): ClearAdminProposal {
    const message = createBaseClearAdminProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contract = object.contract ?? "";
    return message;
  },
  fromAmino(object: ClearAdminProposalAmino): ClearAdminProposal {
    const message = createBaseClearAdminProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    return message;
  },
  toAmino(message: ClearAdminProposal): ClearAdminProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.contract = message.contract === "" ? undefined : message.contract;
    return obj;
  },
  fromAminoMsg(object: ClearAdminProposalAminoMsg): ClearAdminProposal {
    return ClearAdminProposal.fromAmino(object.value);
  },
  toAminoMsg(message: ClearAdminProposal): ClearAdminProposalAminoMsg {
    return {
      type: "wasm/ClearAdminProposal",
      value: ClearAdminProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: ClearAdminProposalProtoMsg): ClearAdminProposal {
    return ClearAdminProposal.decode(message.value);
  },
  toProto(message: ClearAdminProposal): Uint8Array {
    return ClearAdminProposal.encode(message).finish();
  },
  toProtoMsg(message: ClearAdminProposal): ClearAdminProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.ClearAdminProposal",
      value: ClearAdminProposal.encode(message).finish()
    };
  }
};
function createBasePinCodesProposal(): PinCodesProposal {
  return {
    title: "",
    description: "",
    codeIds: []
  };
}
export const PinCodesProposal = {
  typeUrl: "/cosmwasm.wasm.v1.PinCodesProposal",
  encode(message: PinCodesProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    writer.uint32(26).fork();
    for (const v of message.codeIds) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): PinCodesProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePinCodesProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.codeIds.push(reader.uint64());
            }
          } else {
            message.codeIds.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<PinCodesProposal>): PinCodesProposal {
    const message = createBasePinCodesProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.codeIds = object.codeIds?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: PinCodesProposalAmino): PinCodesProposal {
    const message = createBasePinCodesProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.codeIds = object.code_ids?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: PinCodesProposal): PinCodesProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.codeIds) {
      obj.code_ids = message.codeIds.map(e => e.toString());
    } else {
      obj.code_ids = message.codeIds;
    }
    return obj;
  },
  fromAminoMsg(object: PinCodesProposalAminoMsg): PinCodesProposal {
    return PinCodesProposal.fromAmino(object.value);
  },
  toAminoMsg(message: PinCodesProposal): PinCodesProposalAminoMsg {
    return {
      type: "wasm/PinCodesProposal",
      value: PinCodesProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: PinCodesProposalProtoMsg): PinCodesProposal {
    return PinCodesProposal.decode(message.value);
  },
  toProto(message: PinCodesProposal): Uint8Array {
    return PinCodesProposal.encode(message).finish();
  },
  toProtoMsg(message: PinCodesProposal): PinCodesProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.PinCodesProposal",
      value: PinCodesProposal.encode(message).finish()
    };
  }
};
function createBaseUnpinCodesProposal(): UnpinCodesProposal {
  return {
    title: "",
    description: "",
    codeIds: []
  };
}
export const UnpinCodesProposal = {
  typeUrl: "/cosmwasm.wasm.v1.UnpinCodesProposal",
  encode(message: UnpinCodesProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    writer.uint32(26).fork();
    for (const v of message.codeIds) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UnpinCodesProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnpinCodesProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.codeIds.push(reader.uint64());
            }
          } else {
            message.codeIds.push(reader.uint64());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UnpinCodesProposal>): UnpinCodesProposal {
    const message = createBaseUnpinCodesProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.codeIds = object.codeIds?.map(e => BigInt(e.toString())) || [];
    return message;
  },
  fromAmino(object: UnpinCodesProposalAmino): UnpinCodesProposal {
    const message = createBaseUnpinCodesProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.codeIds = object.code_ids?.map(e => BigInt(e)) || [];
    return message;
  },
  toAmino(message: UnpinCodesProposal): UnpinCodesProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.codeIds) {
      obj.code_ids = message.codeIds.map(e => e.toString());
    } else {
      obj.code_ids = message.codeIds;
    }
    return obj;
  },
  fromAminoMsg(object: UnpinCodesProposalAminoMsg): UnpinCodesProposal {
    return UnpinCodesProposal.fromAmino(object.value);
  },
  toAminoMsg(message: UnpinCodesProposal): UnpinCodesProposalAminoMsg {
    return {
      type: "wasm/UnpinCodesProposal",
      value: UnpinCodesProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: UnpinCodesProposalProtoMsg): UnpinCodesProposal {
    return UnpinCodesProposal.decode(message.value);
  },
  toProto(message: UnpinCodesProposal): Uint8Array {
    return UnpinCodesProposal.encode(message).finish();
  },
  toProtoMsg(message: UnpinCodesProposal): UnpinCodesProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.UnpinCodesProposal",
      value: UnpinCodesProposal.encode(message).finish()
    };
  }
};
function createBaseSetGasLessContractsProposal(): SetGasLessContractsProposal {
  return {
    title: "",
    description: "",
    contractAddresses: []
  };
}
export const SetGasLessContractsProposal = {
  typeUrl: "/cosmwasm.wasm.v1.SetGasLessContractsProposal",
  encode(message: SetGasLessContractsProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.contractAddresses) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): SetGasLessContractsProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetGasLessContractsProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.contractAddresses.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<SetGasLessContractsProposal>): SetGasLessContractsProposal {
    const message = createBaseSetGasLessContractsProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contractAddresses = object.contractAddresses?.map(e => e) || [];
    return message;
  },
  fromAmino(object: SetGasLessContractsProposalAmino): SetGasLessContractsProposal {
    const message = createBaseSetGasLessContractsProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.contractAddresses = object.contract_addresses?.map(e => e) || [];
    return message;
  },
  toAmino(message: SetGasLessContractsProposal): SetGasLessContractsProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.contractAddresses) {
      obj.contract_addresses = message.contractAddresses.map(e => e);
    } else {
      obj.contract_addresses = message.contractAddresses;
    }
    return obj;
  },
  fromAminoMsg(object: SetGasLessContractsProposalAminoMsg): SetGasLessContractsProposal {
    return SetGasLessContractsProposal.fromAmino(object.value);
  },
  toAminoMsg(message: SetGasLessContractsProposal): SetGasLessContractsProposalAminoMsg {
    return {
      type: "wasm/SetGasLessContractsProposal",
      value: SetGasLessContractsProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: SetGasLessContractsProposalProtoMsg): SetGasLessContractsProposal {
    return SetGasLessContractsProposal.decode(message.value);
  },
  toProto(message: SetGasLessContractsProposal): Uint8Array {
    return SetGasLessContractsProposal.encode(message).finish();
  },
  toProtoMsg(message: SetGasLessContractsProposal): SetGasLessContractsProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.SetGasLessContractsProposal",
      value: SetGasLessContractsProposal.encode(message).finish()
    };
  }
};
function createBaseUnsetGasLessContractsProposal(): UnsetGasLessContractsProposal {
  return {
    title: "",
    description: "",
    contractAddresses: []
  };
}
export const UnsetGasLessContractsProposal = {
  typeUrl: "/cosmwasm.wasm.v1.UnsetGasLessContractsProposal",
  encode(message: UnsetGasLessContractsProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.contractAddresses) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UnsetGasLessContractsProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsetGasLessContractsProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.contractAddresses.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UnsetGasLessContractsProposal>): UnsetGasLessContractsProposal {
    const message = createBaseUnsetGasLessContractsProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contractAddresses = object.contractAddresses?.map(e => e) || [];
    return message;
  },
  fromAmino(object: UnsetGasLessContractsProposalAmino): UnsetGasLessContractsProposal {
    const message = createBaseUnsetGasLessContractsProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.contractAddresses = object.contract_addresses?.map(e => e) || [];
    return message;
  },
  toAmino(message: UnsetGasLessContractsProposal): UnsetGasLessContractsProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.contractAddresses) {
      obj.contract_addresses = message.contractAddresses.map(e => e);
    } else {
      obj.contract_addresses = message.contractAddresses;
    }
    return obj;
  },
  fromAminoMsg(object: UnsetGasLessContractsProposalAminoMsg): UnsetGasLessContractsProposal {
    return UnsetGasLessContractsProposal.fromAmino(object.value);
  },
  toAminoMsg(message: UnsetGasLessContractsProposal): UnsetGasLessContractsProposalAminoMsg {
    return {
      type: "wasm/UnsetGasLessContractsProposal",
      value: UnsetGasLessContractsProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: UnsetGasLessContractsProposalProtoMsg): UnsetGasLessContractsProposal {
    return UnsetGasLessContractsProposal.decode(message.value);
  },
  toProto(message: UnsetGasLessContractsProposal): Uint8Array {
    return UnsetGasLessContractsProposal.encode(message).finish();
  },
  toProtoMsg(message: UnsetGasLessContractsProposal): UnsetGasLessContractsProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.UnsetGasLessContractsProposal",
      value: UnsetGasLessContractsProposal.encode(message).finish()
    };
  }
};
function createBaseAccessConfigUpdate(): AccessConfigUpdate {
  return {
    codeId: BigInt(0),
    instantiatePermission: AccessConfig.fromPartial({})
  };
}
export const AccessConfigUpdate = {
  typeUrl: "/cosmwasm.wasm.v1.AccessConfigUpdate",
  encode(message: AccessConfigUpdate, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.codeId !== BigInt(0)) {
      writer.uint32(8).uint64(message.codeId);
    }
    if (message.instantiatePermission !== undefined) {
      AccessConfig.encode(message.instantiatePermission, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): AccessConfigUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAccessConfigUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.codeId = reader.uint64();
          break;
        case 2:
          message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<AccessConfigUpdate>): AccessConfigUpdate {
    const message = createBaseAccessConfigUpdate();
    message.codeId = object.codeId !== undefined && object.codeId !== null ? BigInt(object.codeId.toString()) : BigInt(0);
    message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
    return message;
  },
  fromAmino(object: AccessConfigUpdateAmino): AccessConfigUpdate {
    const message = createBaseAccessConfigUpdate();
    if (object.code_id !== undefined && object.code_id !== null) {
      message.codeId = BigInt(object.code_id);
    }
    if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
      message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
    }
    return message;
  },
  toAmino(message: AccessConfigUpdate): AccessConfigUpdateAmino {
    const obj: any = {};
    obj.code_id = message.codeId !== BigInt(0) ? message.codeId.toString() : undefined;
    obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
    return obj;
  },
  fromAminoMsg(object: AccessConfigUpdateAminoMsg): AccessConfigUpdate {
    return AccessConfigUpdate.fromAmino(object.value);
  },
  toAminoMsg(message: AccessConfigUpdate): AccessConfigUpdateAminoMsg {
    return {
      type: "wasm/AccessConfigUpdate",
      value: AccessConfigUpdate.toAmino(message)
    };
  },
  fromProtoMsg(message: AccessConfigUpdateProtoMsg): AccessConfigUpdate {
    return AccessConfigUpdate.decode(message.value);
  },
  toProto(message: AccessConfigUpdate): Uint8Array {
    return AccessConfigUpdate.encode(message).finish();
  },
  toProtoMsg(message: AccessConfigUpdate): AccessConfigUpdateProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.AccessConfigUpdate",
      value: AccessConfigUpdate.encode(message).finish()
    };
  }
};
function createBaseUpdateInstantiateConfigProposal(): UpdateInstantiateConfigProposal {
  return {
    title: "",
    description: "",
    accessConfigUpdates: []
  };
}
export const UpdateInstantiateConfigProposal = {
  typeUrl: "/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal",
  encode(message: UpdateInstantiateConfigProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.accessConfigUpdates) {
      AccessConfigUpdate.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): UpdateInstantiateConfigProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateInstantiateConfigProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.accessConfigUpdates.push(AccessConfigUpdate.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<UpdateInstantiateConfigProposal>): UpdateInstantiateConfigProposal {
    const message = createBaseUpdateInstantiateConfigProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.accessConfigUpdates = object.accessConfigUpdates?.map(e => AccessConfigUpdate.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: UpdateInstantiateConfigProposalAmino): UpdateInstantiateConfigProposal {
    const message = createBaseUpdateInstantiateConfigProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    message.accessConfigUpdates = object.access_config_updates?.map(e => AccessConfigUpdate.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: UpdateInstantiateConfigProposal): UpdateInstantiateConfigProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    if (message.accessConfigUpdates) {
      obj.access_config_updates = message.accessConfigUpdates.map(e => e ? AccessConfigUpdate.toAmino(e) : undefined);
    } else {
      obj.access_config_updates = message.accessConfigUpdates;
    }
    return obj;
  },
  fromAminoMsg(object: UpdateInstantiateConfigProposalAminoMsg): UpdateInstantiateConfigProposal {
    return UpdateInstantiateConfigProposal.fromAmino(object.value);
  },
  toAminoMsg(message: UpdateInstantiateConfigProposal): UpdateInstantiateConfigProposalAminoMsg {
    return {
      type: "wasm/UpdateInstantiateConfigProposal",
      value: UpdateInstantiateConfigProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: UpdateInstantiateConfigProposalProtoMsg): UpdateInstantiateConfigProposal {
    return UpdateInstantiateConfigProposal.decode(message.value);
  },
  toProto(message: UpdateInstantiateConfigProposal): Uint8Array {
    return UpdateInstantiateConfigProposal.encode(message).finish();
  },
  toProtoMsg(message: UpdateInstantiateConfigProposal): UpdateInstantiateConfigProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal",
      value: UpdateInstantiateConfigProposal.encode(message).finish()
    };
  }
};
function createBaseStoreAndInstantiateContractProposal(): StoreAndInstantiateContractProposal {
  return {
    title: "",
    description: "",
    runAs: "",
    wasmByteCode: new Uint8Array(),
    instantiatePermission: undefined,
    unpinCode: false,
    admin: "",
    label: "",
    msg: new Uint8Array(),
    funds: [],
    source: "",
    builder: "",
    codeHash: new Uint8Array()
  };
}
export const StoreAndInstantiateContractProposal = {
  typeUrl: "/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal",
  encode(message: StoreAndInstantiateContractProposal, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.runAs !== "") {
      writer.uint32(26).string(message.runAs);
    }
    if (message.wasmByteCode.length !== 0) {
      writer.uint32(34).bytes(message.wasmByteCode);
    }
    if (message.instantiatePermission !== undefined) {
      AccessConfig.encode(message.instantiatePermission, writer.uint32(42).fork()).ldelim();
    }
    if (message.unpinCode === true) {
      writer.uint32(48).bool(message.unpinCode);
    }
    if (message.admin !== "") {
      writer.uint32(58).string(message.admin);
    }
    if (message.label !== "") {
      writer.uint32(66).string(message.label);
    }
    if (message.msg.length !== 0) {
      writer.uint32(74).bytes(message.msg);
    }
    for (const v of message.funds) {
      Coin.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    if (message.source !== "") {
      writer.uint32(90).string(message.source);
    }
    if (message.builder !== "") {
      writer.uint32(98).string(message.builder);
    }
    if (message.codeHash.length !== 0) {
      writer.uint32(106).bytes(message.codeHash);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): StoreAndInstantiateContractProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStoreAndInstantiateContractProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.runAs = reader.string();
          break;
        case 4:
          message.wasmByteCode = reader.bytes();
          break;
        case 5:
          message.instantiatePermission = AccessConfig.decode(reader, reader.uint32());
          break;
        case 6:
          message.unpinCode = reader.bool();
          break;
        case 7:
          message.admin = reader.string();
          break;
        case 8:
          message.label = reader.string();
          break;
        case 9:
          message.msg = reader.bytes();
          break;
        case 10:
          message.funds.push(Coin.decode(reader, reader.uint32()));
          break;
        case 11:
          message.source = reader.string();
          break;
        case 12:
          message.builder = reader.string();
          break;
        case 13:
          message.codeHash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<StoreAndInstantiateContractProposal>): StoreAndInstantiateContractProposal {
    const message = createBaseStoreAndInstantiateContractProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.runAs = object.runAs ?? "";
    message.wasmByteCode = object.wasmByteCode ?? new Uint8Array();
    message.instantiatePermission = object.instantiatePermission !== undefined && object.instantiatePermission !== null ? AccessConfig.fromPartial(object.instantiatePermission) : undefined;
    message.unpinCode = object.unpinCode ?? false;
    message.admin = object.admin ?? "";
    message.label = object.label ?? "";
    message.msg = object.msg ?? new Uint8Array();
    message.funds = object.funds?.map(e => Coin.fromPartial(e)) || [];
    message.source = object.source ?? "";
    message.builder = object.builder ?? "";
    message.codeHash = object.codeHash ?? new Uint8Array();
    return message;
  },
  fromAmino(object: StoreAndInstantiateContractProposalAmino): StoreAndInstantiateContractProposal {
    const message = createBaseStoreAndInstantiateContractProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.run_as !== undefined && object.run_as !== null) {
      message.runAs = object.run_as;
    }
    if (object.wasm_byte_code !== undefined && object.wasm_byte_code !== null) {
      message.wasmByteCode = fromBase64(object.wasm_byte_code);
    }
    if (object.instantiate_permission !== undefined && object.instantiate_permission !== null) {
      message.instantiatePermission = AccessConfig.fromAmino(object.instantiate_permission);
    }
    if (object.unpin_code !== undefined && object.unpin_code !== null) {
      message.unpinCode = object.unpin_code;
    }
    if (object.admin !== undefined && object.admin !== null) {
      message.admin = object.admin;
    }
    if (object.label !== undefined && object.label !== null) {
      message.label = object.label;
    }
    if (object.msg !== undefined && object.msg !== null) {
      message.msg = toUtf8(JSON.stringify(object.msg));
    }
    message.funds = object.funds?.map(e => Coin.fromAmino(e)) || [];
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.builder !== undefined && object.builder !== null) {
      message.builder = object.builder;
    }
    if (object.code_hash !== undefined && object.code_hash !== null) {
      message.codeHash = bytesFromBase64(object.code_hash);
    }
    return message;
  },
  toAmino(message: StoreAndInstantiateContractProposal): StoreAndInstantiateContractProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.run_as = message.runAs === "" ? undefined : message.runAs;
    obj.wasm_byte_code = message.wasmByteCode ? toBase64(message.wasmByteCode) : undefined;
    obj.instantiate_permission = message.instantiatePermission ? AccessConfig.toAmino(message.instantiatePermission) : undefined;
    obj.unpin_code = message.unpinCode === false ? undefined : message.unpinCode;
    obj.admin = message.admin === "" ? undefined : message.admin;
    obj.label = message.label === "" ? undefined : message.label;
    obj.msg = message.msg ? JSON.parse(fromUtf8(message.msg)) : undefined;
    if (message.funds) {
      obj.funds = message.funds.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.funds = message.funds;
    }
    obj.source = message.source === "" ? undefined : message.source;
    obj.builder = message.builder === "" ? undefined : message.builder;
    obj.code_hash = message.codeHash ? base64FromBytes(message.codeHash) : undefined;
    return obj;
  },
  fromAminoMsg(object: StoreAndInstantiateContractProposalAminoMsg): StoreAndInstantiateContractProposal {
    return StoreAndInstantiateContractProposal.fromAmino(object.value);
  },
  toAminoMsg(message: StoreAndInstantiateContractProposal): StoreAndInstantiateContractProposalAminoMsg {
    return {
      type: "wasm/StoreAndInstantiateContractProposal",
      value: StoreAndInstantiateContractProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: StoreAndInstantiateContractProposalProtoMsg): StoreAndInstantiateContractProposal {
    return StoreAndInstantiateContractProposal.decode(message.value);
  },
  toProto(message: StoreAndInstantiateContractProposal): Uint8Array {
    return StoreAndInstantiateContractProposal.encode(message).finish();
  },
  toProtoMsg(message: StoreAndInstantiateContractProposal): StoreAndInstantiateContractProposalProtoMsg {
    return {
      typeUrl: "/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal",
      value: StoreAndInstantiateContractProposal.encode(message).finish()
    };
  }
};