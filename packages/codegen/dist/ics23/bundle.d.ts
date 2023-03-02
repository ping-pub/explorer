import * as _1 from "../confio/proofs";
export declare const ics23: {
    hashOpFromJSON(object: any): _1.HashOp;
    hashOpToJSON(object: _1.HashOp): string;
    lengthOpFromJSON(object: any): _1.LengthOp;
    lengthOpToJSON(object: _1.LengthOp): string;
    HashOp: typeof _1.HashOp;
    HashOpSDKType: typeof _1.HashOp;
    LengthOp: typeof _1.LengthOp;
    LengthOpSDKType: typeof _1.LengthOp;
    ExistenceProof: {
        encode(message: _1.ExistenceProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.ExistenceProof;
        fromPartial(object: {
            key?: Uint8Array;
            value?: Uint8Array;
            leaf?: {
                hash?: _1.HashOp;
                prehashKey?: _1.HashOp;
                prehashValue?: _1.HashOp;
                length?: _1.LengthOp;
                prefix?: Uint8Array;
            };
            path?: {
                hash?: _1.HashOp;
                prefix?: Uint8Array;
                suffix?: Uint8Array;
            }[];
        }): _1.ExistenceProof;
    };
    NonExistenceProof: {
        encode(message: _1.NonExistenceProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.NonExistenceProof;
        fromPartial(object: {
            key?: Uint8Array;
            left?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: {
                    hash?: _1.HashOp;
                    prefix?: Uint8Array;
                    suffix?: Uint8Array;
                }[];
            };
            right?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: {
                    hash?: _1.HashOp;
                    prefix?: Uint8Array;
                    suffix?: Uint8Array;
                }[];
            };
        }): _1.NonExistenceProof;
    };
    CommitmentProof: {
        encode(message: _1.CommitmentProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.CommitmentProof;
        fromPartial(object: {
            exist?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: {
                    hash?: _1.HashOp;
                    prefix?: Uint8Array;
                    suffix?: Uint8Array;
                }[];
            };
            nonexist?: {
                key?: Uint8Array;
                left?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: {
                        hash?: _1.HashOp;
                        prefix?: Uint8Array;
                        suffix?: Uint8Array;
                    }[];
                };
                right?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: {
                        hash?: _1.HashOp;
                        prefix?: Uint8Array;
                        suffix?: Uint8Array;
                    }[];
                };
            };
            batch?: {
                entries?: {
                    exist?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: {
                            hash?: _1.HashOp;
                            prefix?: Uint8Array;
                            suffix?: Uint8Array;
                        }[];
                    };
                    nonexist?: {
                        key?: Uint8Array;
                        left?: {
                            key?: Uint8Array;
                            value?: Uint8Array;
                            leaf?: {
                                hash?: _1.HashOp;
                                prehashKey?: _1.HashOp;
                                prehashValue?: _1.HashOp;
                                length?: _1.LengthOp;
                                prefix?: Uint8Array;
                            };
                            path?: {
                                hash?: _1.HashOp;
                                prefix?: Uint8Array;
                                suffix?: Uint8Array;
                            }[];
                        };
                        right?: {
                            key?: Uint8Array;
                            value?: Uint8Array;
                            leaf?: {
                                hash?: _1.HashOp;
                                prehashKey?: _1.HashOp;
                                prehashValue?: _1.HashOp;
                                length?: _1.LengthOp;
                                prefix?: Uint8Array;
                            };
                            path?: {
                                hash?: _1.HashOp;
                                prefix?: Uint8Array;
                                suffix?: Uint8Array;
                            }[];
                        };
                    };
                }[];
            };
            compressed?: {
                entries?: {
                    exist?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: number[];
                    };
                    nonexist?: {
                        key?: Uint8Array;
                        left?: {
                            key?: Uint8Array;
                            value?: Uint8Array;
                            leaf?: {
                                hash?: _1.HashOp;
                                prehashKey?: _1.HashOp;
                                prehashValue?: _1.HashOp;
                                length?: _1.LengthOp;
                                prefix?: Uint8Array;
                            };
                            path?: number[];
                        };
                        right?: {
                            key?: Uint8Array;
                            value?: Uint8Array;
                            leaf?: {
                                hash?: _1.HashOp;
                                prehashKey?: _1.HashOp;
                                prehashValue?: _1.HashOp;
                                length?: _1.LengthOp;
                                prefix?: Uint8Array;
                            };
                            path?: number[];
                        };
                    };
                }[];
                lookupInners?: {
                    hash?: _1.HashOp;
                    prefix?: Uint8Array;
                    suffix?: Uint8Array;
                }[];
            };
        }): _1.CommitmentProof;
    };
    LeafOp: {
        encode(message: _1.LeafOp, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.LeafOp;
        fromPartial(object: {
            hash?: _1.HashOp;
            prehashKey?: _1.HashOp;
            prehashValue?: _1.HashOp;
            length?: _1.LengthOp;
            prefix?: Uint8Array;
        }): _1.LeafOp;
    };
    InnerOp: {
        encode(message: _1.InnerOp, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.InnerOp;
        fromPartial(object: {
            hash?: _1.HashOp;
            prefix?: Uint8Array;
            suffix?: Uint8Array;
        }): _1.InnerOp;
    };
    ProofSpec: {
        encode(message: _1.ProofSpec, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.ProofSpec;
        fromPartial(object: {
            leafSpec?: {
                hash?: _1.HashOp;
                prehashKey?: _1.HashOp;
                prehashValue?: _1.HashOp;
                length?: _1.LengthOp;
                prefix?: Uint8Array;
            };
            innerSpec?: {
                childOrder?: number[];
                childSize?: number;
                minPrefixLength?: number;
                maxPrefixLength?: number;
                emptyChild?: Uint8Array;
                hash?: _1.HashOp;
            };
            maxDepth?: number;
            minDepth?: number;
        }): _1.ProofSpec;
    };
    InnerSpec: {
        encode(message: _1.InnerSpec, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.InnerSpec;
        fromPartial(object: {
            childOrder?: number[];
            childSize?: number;
            minPrefixLength?: number;
            maxPrefixLength?: number;
            emptyChild?: Uint8Array;
            hash?: _1.HashOp;
        }): _1.InnerSpec;
    };
    BatchProof: {
        encode(message: _1.BatchProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.BatchProof;
        fromPartial(object: {
            entries?: {
                exist?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: {
                        hash?: _1.HashOp;
                        prefix?: Uint8Array;
                        suffix?: Uint8Array;
                    }[];
                };
                nonexist?: {
                    key?: Uint8Array;
                    left?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: {
                            hash?: _1.HashOp;
                            prefix?: Uint8Array;
                            suffix?: Uint8Array;
                        }[];
                    };
                    right?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: {
                            hash?: _1.HashOp;
                            prefix?: Uint8Array;
                            suffix?: Uint8Array;
                        }[];
                    };
                };
            }[];
        }): _1.BatchProof;
    };
    BatchEntry: {
        encode(message: _1.BatchEntry, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.BatchEntry;
        fromPartial(object: {
            exist?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: {
                    hash?: _1.HashOp;
                    prefix?: Uint8Array;
                    suffix?: Uint8Array;
                }[];
            };
            nonexist?: {
                key?: Uint8Array;
                left?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: {
                        hash?: _1.HashOp;
                        prefix?: Uint8Array;
                        suffix?: Uint8Array;
                    }[];
                };
                right?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: {
                        hash?: _1.HashOp;
                        prefix?: Uint8Array;
                        suffix?: Uint8Array;
                    }[];
                };
            };
        }): _1.BatchEntry;
    };
    CompressedBatchProof: {
        encode(message: _1.CompressedBatchProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.CompressedBatchProof;
        fromPartial(object: {
            entries?: {
                exist?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: number[];
                };
                nonexist?: {
                    key?: Uint8Array;
                    left?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: number[];
                    };
                    right?: {
                        key?: Uint8Array;
                        value?: Uint8Array;
                        leaf?: {
                            hash?: _1.HashOp;
                            prehashKey?: _1.HashOp;
                            prehashValue?: _1.HashOp;
                            length?: _1.LengthOp;
                            prefix?: Uint8Array;
                        };
                        path?: number[];
                    };
                };
            }[];
            lookupInners?: {
                hash?: _1.HashOp;
                prefix?: Uint8Array;
                suffix?: Uint8Array;
            }[];
        }): _1.CompressedBatchProof;
    };
    CompressedBatchEntry: {
        encode(message: _1.CompressedBatchEntry, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.CompressedBatchEntry;
        fromPartial(object: {
            exist?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: number[];
            };
            nonexist?: {
                key?: Uint8Array;
                left?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: number[];
                };
                right?: {
                    key?: Uint8Array;
                    value?: Uint8Array;
                    leaf?: {
                        hash?: _1.HashOp;
                        prehashKey?: _1.HashOp;
                        prehashValue?: _1.HashOp;
                        length?: _1.LengthOp;
                        prefix?: Uint8Array;
                    };
                    path?: number[];
                };
            };
        }): _1.CompressedBatchEntry;
    };
    CompressedExistenceProof: {
        encode(message: _1.CompressedExistenceProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.CompressedExistenceProof;
        fromPartial(object: {
            key?: Uint8Array;
            value?: Uint8Array;
            leaf?: {
                hash?: _1.HashOp;
                prehashKey?: _1.HashOp;
                prehashValue?: _1.HashOp;
                length?: _1.LengthOp;
                prefix?: Uint8Array;
            };
            path?: number[];
        }): _1.CompressedExistenceProof;
    };
    CompressedNonExistenceProof: {
        encode(message: _1.CompressedNonExistenceProof, writer?: import("protobufjs").Writer): import("protobufjs").Writer;
        decode(input: Uint8Array | import("protobufjs").Reader, length?: number): _1.CompressedNonExistenceProof;
        fromPartial(object: {
            key?: Uint8Array;
            left?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: number[];
            };
            right?: {
                key?: Uint8Array;
                value?: Uint8Array;
                leaf?: {
                    hash?: _1.HashOp;
                    prehashKey?: _1.HashOp;
                    prehashValue?: _1.HashOp;
                    length?: _1.LengthOp;
                    prefix?: Uint8Array;
                };
                path?: number[];
            };
        }): _1.CompressedNonExistenceProof;
    };
};
