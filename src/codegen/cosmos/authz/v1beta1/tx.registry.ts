import { GeneratedType, Registry } from "@cosmjs/proto-signing";
import { MsgGrant, MsgExec, MsgRevoke } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.authz.v1beta1.MsgGrant", MsgGrant], ["/cosmos.authz.v1beta1.MsgExec", MsgExec], ["/cosmos.authz.v1beta1.MsgRevoke", MsgRevoke]];
export const load = (protoRegistry: Registry) => {
  registry.forEach(([typeUrl, mod]) => {
    protoRegistry.register(typeUrl, mod);
  });
};
export const MessageComposer = {
  encoded: {
    grant(value: MsgGrant) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        value: MsgGrant.encode(value).finish()
      };
    },
    exec(value: MsgExec) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgExec",
        value: MsgExec.encode(value).finish()
      };
    },
    revoke(value: MsgRevoke) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
        value: MsgRevoke.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    grant(value: MsgGrant) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        value
      };
    },
    exec(value: MsgExec) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgExec",
        value
      };
    },
    revoke(value: MsgRevoke) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
        value
      };
    }
  },
  fromPartial: {
    grant(value: MsgGrant) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
        value: MsgGrant.fromPartial(value)
      };
    },
    exec(value: MsgExec) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgExec",
        value: MsgExec.fromPartial(value)
      };
    },
    revoke(value: MsgRevoke) {
      return {
        typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
        value: MsgRevoke.fromPartial(value)
      };
    }
  }
};