import { Header, HeaderSDKType, Data, DataSDKType, Commit, CommitSDKType } from "./types";
import { EvidenceList, EvidenceListSDKType } from "./evidence";
import * as _m0 from "protobufjs/minimal";
import { DeepPartial } from "../../helpers";
export interface Block {
    header?: Header;
    data?: Data;
    evidence?: EvidenceList;
    lastCommit?: Commit;
}
export interface BlockSDKType {
    header?: HeaderSDKType;
    data?: DataSDKType;
    evidence?: EvidenceListSDKType;
    last_commit?: CommitSDKType;
}
export declare const Block: {
    encode(message: Block, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): Block;
    fromPartial(object: DeepPartial<Block>): Block;
};
