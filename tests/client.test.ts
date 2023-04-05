import { CosmosRestClient } from '../src/libs/client'

const client = new CosmosRestClient("https://osmosis-rpc.polkachu.com")

describe('cosmos rest client test', () => {
    it('node-info', () => {
        client.getBaseNodeInfo()
    });
  });