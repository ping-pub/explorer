import { BaseAccount, BaseAccountAmino, BaseAccountSDKType } from "../../../../cosmos/auth/v1beta1/auth";
import { BinaryReader, BinaryWriter } from "../../../../binary";
/** An InterchainAccount is defined as a BaseAccount & the address of the account owner on the controller chain */
export interface InterchainAccount {
  baseAccount?: BaseAccount;
  accountOwner: string;
}
export interface InterchainAccountProtoMsg {
  typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccount";
  value: Uint8Array;
}
/** An InterchainAccount is defined as a BaseAccount & the address of the account owner on the controller chain */
export interface InterchainAccountAmino {
  base_account?: BaseAccountAmino;
  account_owner?: string;
}
export interface InterchainAccountAminoMsg {
  type: "cosmos-sdk/InterchainAccount";
  value: InterchainAccountAmino;
}
/** An InterchainAccount is defined as a BaseAccount & the address of the account owner on the controller chain */
export interface InterchainAccountSDKType {
  base_account?: BaseAccountSDKType;
  account_owner: string;
}
function createBaseInterchainAccount(): InterchainAccount {
  return {
    baseAccount: undefined,
    accountOwner: ""
  };
}
export const InterchainAccount = {
  typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccount",
  encode(message: InterchainAccount, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.baseAccount !== undefined) {
      BaseAccount.encode(message.baseAccount, writer.uint32(10).fork()).ldelim();
    }
    if (message.accountOwner !== "") {
      writer.uint32(18).string(message.accountOwner);
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): InterchainAccount {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInterchainAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseAccount = BaseAccount.decode(reader, reader.uint32());
          break;
        case 2:
          message.accountOwner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: Partial<InterchainAccount>): InterchainAccount {
    const message = createBaseInterchainAccount();
    message.baseAccount = object.baseAccount !== undefined && object.baseAccount !== null ? BaseAccount.fromPartial(object.baseAccount) : undefined;
    message.accountOwner = object.accountOwner ?? "";
    return message;
  },
  fromAmino(object: InterchainAccountAmino): InterchainAccount {
    const message = createBaseInterchainAccount();
    if (object.base_account !== undefined && object.base_account !== null) {
      message.baseAccount = BaseAccount.fromAmino(object.base_account);
    }
    if (object.account_owner !== undefined && object.account_owner !== null) {
      message.accountOwner = object.account_owner;
    }
    return message;
  },
  toAmino(message: InterchainAccount): InterchainAccountAmino {
    const obj: any = {};
    obj.base_account = message.baseAccount ? BaseAccount.toAmino(message.baseAccount) : undefined;
    obj.account_owner = message.accountOwner === "" ? undefined : message.accountOwner;
    return obj;
  },
  fromAminoMsg(object: InterchainAccountAminoMsg): InterchainAccount {
    return InterchainAccount.fromAmino(object.value);
  },
  toAminoMsg(message: InterchainAccount): InterchainAccountAminoMsg {
    return {
      type: "cosmos-sdk/InterchainAccount",
      value: InterchainAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: InterchainAccountProtoMsg): InterchainAccount {
    return InterchainAccount.decode(message.value);
  },
  toProto(message: InterchainAccount): Uint8Array {
    return InterchainAccount.encode(message).finish();
  },
  toProtoMsg(message: InterchainAccount): InterchainAccountProtoMsg {
    return {
      typeUrl: "/ibc.applications.interchain_accounts.v1.InterchainAccount",
      value: InterchainAccount.encode(message).finish()
    };
  }
};