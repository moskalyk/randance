/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.9.4
 *
 */
import { FluencePeer } from '@fluencelabs/fluence';
import type { CallParams$$ } from '@fluencelabs/fluence/dist/internal/compilerSupport/v4'
import {
    callFunction$$,
    registerService$$,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v4';


// Services

export interface RandanceDef {
    send: (event: { id: number; time: number; }, callParams: CallParams$$<'event'>) => boolean | Promise<boolean>;
}
export function registerRandance(service: RandanceDef): void;
export function registerRandance(serviceId: string, service: RandanceDef): void;
export function registerRandance(peer: FluencePeer, service: RandanceDef): void;
export function registerRandance(peer: FluencePeer, serviceId: string, service: RandanceDef): void;
       

export function registerRandance(...args: any) {
    registerService$$(
        args,
        {
    "defaultServiceId" : "Randance",
    "functions" : {
        "tag" : "labeledProduct",
        "fields" : {
            "send" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "event" : {
                            "tag" : "struct",
                            "name" : "Event",
                            "fields" : {
                                "id" : {
                                    "tag" : "scalar",
                                    "name" : "i64"
                                },
                                "time" : {
                                    "tag" : "scalar",
                                    "name" : "i32"
                                }
                            }
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "scalar",
                            "name" : "bool"
                        }
                    ]
                }
            }
        }
    }
}
    );
}
      


export interface RegistryDef {
    register: (peer_id: string, callParams: CallParams$$<'peer_id'>) => boolean | Promise<boolean>;
}
export function registerRegistry(service: RegistryDef): void;
export function registerRegistry(serviceId: string, service: RegistryDef): void;
export function registerRegistry(peer: FluencePeer, service: RegistryDef): void;
export function registerRegistry(peer: FluencePeer, serviceId: string, service: RegistryDef): void;
       

export function registerRegistry(...args: any) {
    registerService$$(
        args,
        {
    "defaultServiceId" : "Randance",
    "functions" : {
        "tag" : "labeledProduct",
        "fields" : {
            "register" : {
                "tag" : "arrow",
                "domain" : {
                    "tag" : "labeledProduct",
                    "fields" : {
                        "peer_id" : {
                            "tag" : "scalar",
                            "name" : "string"
                        }
                    }
                },
                "codomain" : {
                    "tag" : "unlabeledProduct",
                    "items" : [
                        {
                            "tag" : "scalar",
                            "name" : "bool"
                        }
                    ]
                }
            }
        }
    }
}
    );
}
      
// Functions
 

export function registerPeer(
    hub_peer_id: string,
    peer_id: string,
    config?: {ttl?: number}
): Promise<boolean>;

export function registerPeer(
    peer: FluencePeer,
    hub_peer_id: string,
    peer_id: string,
    config?: {ttl?: number}
): Promise<boolean>;

export function registerPeer(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                          (call %init_peer_id% ("getDataSrv" "hub_peer_id") [] hub_peer_id)
                         )
                         (call %init_peer_id% ("getDataSrv" "peer_id") [] peer_id)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (call hub_peer_id ("Randance" "register") [peer_id] res)
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (call -relay- ("op" "noop") [])
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction$$(
        args,
        {
    "functionName" : "registerPeer",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "hub_peer_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "peer_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "bool"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}

export type SendEventArgEvent = { id: number; time: number; } 

export function sendEvent(
    relay_id: string,
    peer_id: string,
    event: SendEventArgEvent,
    config?: {ttl?: number}
): Promise<boolean>;

export function sendEvent(
    peer: FluencePeer,
    relay_id: string,
    peer_id: string,
    event: SendEventArgEvent,
    config?: {ttl?: number}
): Promise<boolean>;

export function sendEvent(...args: any) {

    let script = `
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "relay_id") [] relay_id)
                           )
                           (call %init_peer_id% ("getDataSrv" "peer_id") [] peer_id)
                          )
                          (call %init_peer_id% ("getDataSrv" "event") [] event)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (call relay_id ("op" "noop") [])
                       )
                       (xor
                        (seq
                         (seq
                          (call peer_id ("Randance" "send") [event] res)
                          (call relay_id ("op" "noop") [])
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (seq
                         (seq
                          (call relay_id ("op" "noop") [])
                          (call -relay- ("op" "noop") [])
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                       )
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction$$(
        args,
        {
    "functionName" : "sendEvent",
    "arrow" : {
        "tag" : "arrow",
        "domain" : {
            "tag" : "labeledProduct",
            "fields" : {
                "relay_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "peer_id" : {
                    "tag" : "scalar",
                    "name" : "string"
                },
                "event" : {
                    "tag" : "struct",
                    "name" : "Event",
                    "fields" : {
                        "id" : {
                            "tag" : "scalar",
                            "name" : "i64"
                        },
                        "time" : {
                            "tag" : "scalar",
                            "name" : "i32"
                        }
                    }
                }
            }
        },
        "codomain" : {
            "tag" : "unlabeledProduct",
            "items" : [
                {
                    "tag" : "scalar",
                    "name" : "bool"
                }
            ]
        }
    },
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
