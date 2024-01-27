import fetch from 'cross-fetch';

export async function fetchData<T>(
  url: string,
  adapter: (source: any) => T
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return adapter(data);
}

// Usage:
/*
const userAdapter = (source: any): User => {
  return {
    id: source.id,
    name: source.name,
    email: source.email,
  };
};
try {
  const userData = await fetchData<User>("https://jsonplaceholder.typicode.com/users/1", userAdapter);
  console.log(userData); // Output: { id: 1, name: "Leanne Graham", email: "Sincere@april.biz" }
} catch (error) {
  console.error(error.message);
}
// */
const policies = [
  // Referer will never be set.
  // 'no-referrer',

  // Referer will be set to just the origin except when navigating from HTTPS to HTTP,
  // in which case no Referer is sent.
  // 'strict-origin',

  // Full Referer for same-origin requests, and bare origin for cross-origin requests.
  // 'origin-when-cross-origin',

  // Full Referer for same-origin requests, and bare origin for cross-origin requests
  // except when navigating from HTTPS to HTTP, in which case no Referer is sent.
  // 'strict-origin-when-cross-origin',

  // Full Referer for all requests, whether same- or cross-origin.
  'unsafe-url'
];
export async function get(url: string) {
  return (await fetch(url, {referrerPolicy: 'unsafe-url'})).json();
}

export async function post(url: string, data: any) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // credentials: 'same-origin', // redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'unsafe-url', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  // const response = axios.post((config ? config.api : this.config.api) + url, data)
  return response.json(); // parses JSON response into native JavaScript objects
}
