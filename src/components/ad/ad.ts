import { PersonaAdSDK } from '@personaxyz/ad-sdk';

interface ADConfig {
    apiKey: string;
    environment: string;
}

export const confs: Record<string, ADConfig> = {
    "localhost": {
        apiKey: 'XXXX_api_key_staging_XXXX', // An actual API key is generated once you register an app with us.
        environment: 'staging', // use value 'production' when going live
    },
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
        "banner_mobile": "e6b82a11-6a94-46c0-a9d2-cf730159a5e6",
        "popup": "e6b82a11-6a94-46c0-a9d2-cf730159a5e6"
    },
    "ping.pub": {
        "banner": "6883877a-ccae-4a08-b457-7e30b3465a8c",
        "banner_mobile": "a95c6b55-5e2a-49eb-8993-a488513b2d10",
    },
    "testnet.ping.pub": {
        "banner": "1644951b-5022-4544-8a85-11aef8a8f645",
        "banner_mobile": "81e0527f-475a-42a4-bb9a-ed9967c5d06f",
        "popup": "bd77a47c-30fc-4592-9d37-616d4f66964d",
        "popup_mobile": "bd77a47c-30fc-4592-9d37-616d4f66964d"
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
        return window.innerWidth > 600 ? ads[ad] : ads[`${ad}_mobile`]
    }
}
