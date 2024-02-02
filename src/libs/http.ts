import fetch from 'cross-fetch';

export async function fetchData<T>(
  url: string,
  adapter: (source: any) => Promise<T>
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
export async function get(url: string) {
  return (await fetch(url, {referrerPolicy: 'origin-when-cross-origin'})).json();
}

export async function getB(url: string) {
  return (await fetch(url, {referrerPolicy: 'origin-when-cross-origin'})).arrayBuffer();
}

export async function post(url: string, data: any) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // credentials: 'same-origin', // redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'origin-when-cross-origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      // 'Accept-Encoding': 'gzip, deflate, br',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  // const response = axios.post((config ? config.api : this.config.api) + url, data)
  return response.json(); // parses JSON response into native JavaScript objects
}
