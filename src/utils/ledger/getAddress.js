// 基于 ledger cosmos 获取地址
const testModeAllowed = false;

function parseLedgerErrors(error) {
  // TODO move this error rewrite into the ledger lib
  /* istanbul ignore next: specific error rewrite */
  if (error.message.trim().startsWith("Device is already open")) {
    throw new Error(
      "Something went wrong connecting to your Ledger. Please refresh your page and try again."
    );
  }
  throw error;
}

export async function getLedgerConnector({ account, index }) {
  const networkId = "cosmos";
  const address_prefix = "cosmos";
  switch (networkId) {
    case "cosmos": {
      const { default: Ledger } = await import("@lunie/cosmos-ledger");

      const HDPATH = [44, 118, account, 0, index];
      const ledger = new Ledger(
        {
          testModeAllowed: false
        },
        HDPATH,
        address_prefix
      );

      return ledger;
    }
    default:
      throw new Error(
        "Doesn't support connecting to the Ledger for this network."
      );
  }
}

export async function showAddressOnLedger() {
  const ledger = await getLedgerConnector();

  try {
    await ledger.confirmLedgerAddress();
  } catch (err) {
    parseLedgerErrors(err);
  } finally {
    // cleanup. if we leave this open, the next connection will brake for HID
    // TODO move this into the leder lib
    if (ledger && ledger.cosmosApp) {
      ledger.cosmosApp.transport.close();
    }
  }
}

export const getAddressFromLedger = async (account) => {
  const ledger = await getLedgerConnector(account);
  try {
    const address = await ledger.getCosmosAddress(); // TODO this should become `getAddress` to also work for not Cosmos networks
    return address;
  } catch (err) {
    parseLedgerErrors(err);
  } finally {
    // cleanup. if we leave this open, the next connection will brake for HID
    // TODO move this into the leder lib
    if (ledger && ledger.cosmosApp) {
      ledger.cosmosApp.transport.close();
    }
  }
};
