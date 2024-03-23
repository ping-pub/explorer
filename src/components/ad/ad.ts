import { PersonaAdSDK } from '@personaxyz/ad-sdk';

interface ADConfig {
    apiKey: string;
    environment: string;
}

export const confs: Record<string, ADConfig> = {
    // "localhost": {
    //     apiKey: 'XXXX_api_key_staging_XXXX', // An actual API key is generated once you register an app with us.
    //     environment: 'staging', // use value 'production' when going live
    // },
    "ping.pub": {
        apiKey: 'persona-pub-0x6ca028de83d9bc438bb3fd7f9620f36b',
        environment: 'production',
    },
    "testnet.ping.pub": {
        apiKey: 'persona-pub-0x14e9ba8ca5a658ba409fc0059ebc3711',
        environment: 'production',
    }
}


export const UNITS: Record<string, Record<string, string>> = {
    "localhost": {
        "banner": "3a094192-4c7b-4761-a50c-bd9b6a67e987",
    },
    "ping.pub": {
        "banner": "6883877a-ccae-4a08-b457-7e30b3465a8c",
    },
    "testnet.ping.pub": {
        "banner": "1644951b-5022-4544-8a85-11aef8a8f645",
    },
}

export function getClient() {
    const conf = confs[location.hostname]
    if(conf) {
        const sdk = new PersonaAdSDK(conf)
        return sdk.getClient()
    }
}

export function getUnit(ad: string): string | undefined {
    const ads =  UNITS[location.hostname]
    if(ads) {
        return ads[ad]
    }
}
