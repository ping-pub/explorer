const SESSION_KEY_STORE = 'wallet_encryption_key';

function getSessionKey(): string {
  let key = sessionStorage.getItem(SESSION_KEY_STORE);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY_STORE, key);
  }
  return key;
}

function xorTransform(data: string, key: string): string {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

export function encryptWallet(data: string): string {
  const key = getSessionKey();
  return btoa(xorTransform(data, key));
}

export function decryptWallet(encoded: string): string {
  const key = getSessionKey();
  try {
    return xorTransform(atob(encoded), key);
  } catch {
    return encoded;
  }
}
