/*
 * @Author: your name
 * @Date: 2020-03-01 02:53:24
 * @LastEditTime: 2020-03-01 13:37:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /serverless/look/src/views/wallet-ledger/utils/signer.js
 */
import { getLedgerConnector } from "./getAddress";

export async function getSigner(submitType, account, index) {
  if (submitType === `ledger`) {
    if (!account) account = 0;
    if (!index) index = 0;
    return async signMessage => {
      const ledger = await getLedgerConnector({ account, index });
      let publicKey, signature;
      try {
        publicKey = await ledger.getPubKey();
        signature = await ledger.sign(signMessage);
      } catch (err) {
        /* istanbul ignore next: specific error rewrite */
        if (err.message.trim().startsWith("Device is already open")) {
          throw new Error(
            "Something went wrong connecting to your Ledger. Please refresh your page and try again."
          );
        }
        throw err;
      }

      // cleanup. if we leave this open, the next connection will brake for HID
      ledger.cosmosApp.transport.close();

      return {
        signature,
        publicKey
      };
    };
  }
}
