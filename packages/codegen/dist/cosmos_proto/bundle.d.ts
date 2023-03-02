import * as _2 from "./cosmos";
export declare const cosmos_proto: {
    scalarTypeFromJSON(object: any): _2.ScalarType;
    scalarTypeToJSON(object: _2.ScalarType): string;
    ScalarType: typeof _2.ScalarType;
    ScalarTypeSDKType: typeof _2.ScalarType;
    InterfaceDescriptor: {
        encode(message: _2.InterfaceDescriptor, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _2.InterfaceDescriptor;
        fromPartial(object: {
            name?: string;
            description?: string;
        }): _2.InterfaceDescriptor;
    };
    ScalarDescriptor: {
        encode(message: _2.ScalarDescriptor, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _2.ScalarDescriptor;
        fromPartial(object: {
            name?: string;
            description?: string;
            fieldType?: _2.ScalarType[];
        }): _2.ScalarDescriptor;
    };
};
