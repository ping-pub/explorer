import { type RequestRegistry, type Registry, convert, withCustomAdapter } from "./registry";

const DEFAULT: RequestRegistry = {
    users: { url: "https://jsonplaceholder.typicode.com/users/1", adapter: convert<User> },
    posts: { url: "https://jsonplaceholder.typicode.com/posts/1", adapter: convert<Post> },
  };

const VERSION_REGISTRY: Registry = {
    "0.46.1": DEFAULT
}

const NAME_REGISTRY: Registry = {
    "evmos": withCustomAdapter(DEFAULT, {users: {url: "another url", adapter: (): User => {}}})
}


